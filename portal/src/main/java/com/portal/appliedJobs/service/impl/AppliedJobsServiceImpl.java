package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.Status;
import com.portal.appliedJobs.models.AppliedJobs;
import com.portal.appliedJobs.repository.AppliedJobRepository;
import com.portal.appliedJobs.service.EmailService;
import com.portal.appliedJobs.service.ResumeService;
import com.portal.jobs.entities.Job;
import com.portal.jobs.service.JobService;

import com.portal.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AppliedJobsServiceImpl {

    private final AppliedJobRepository appliedJobsRepository;
    private final ResumeService resumeService;
    private final EmailService emailService;
    private final JobService jobService;
    private final UserService userService;

    public AppliedJobsServiceImpl(AppliedJobRepository appliedJobsRepository, ResumeService resumeService, EmailService emailService, JobService jobService, UserService userService) {
        this.appliedJobsRepository = appliedJobsRepository;
        this.resumeService = resumeService;
        this.emailService = emailService;
        this.jobService = jobService;
        this.userService = userService;
    }

    public ResponseEntity<String> applyForJob(String applicantEmail, String resumeUrl, String jobId) {
        try {
            Job job = jobService.getJobById(jobId).getBody();
            if (job == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Job not found");

            // Step 1: Check job expiry
            if (LocalDateTime.now().isAfter(job.getDeadline())) {
                jobService.deleteJob(jobId, job.getEmail()); // Optional cleanup
                return ResponseEntity.badRequest().body("Job has already expired.");
            }

            // Step 2: Check existing application
            Optional<AppliedJobs> existingApplication = appliedJobsRepository.findByApplicantEmailAndJobId(applicantEmail, jobId);
            if (existingApplication.isPresent()) {
                AppliedJobs appliedJobs = existingApplication.get();
                System.out.println(appliedJobs.toString());
                if (appliedJobs.getStatus() == Status.REJECTED) {
                    LocalDateTime banExpiry = appliedJobs.getBanExpiryDate();
                    if (banExpiry != null && LocalDateTime.now().isBefore(banExpiry)) {
                        return ResponseEntity.badRequest().body("Application rejected previously. You can reapply after " + banExpiry.toLocalDate());
                    }
                }
                if (appliedJobs.getStatus() == Status.PENDING) {
                    return ResponseEntity.badRequest().body("Already applied. Status is pending.");
                }
            }

            // Step 3: Process resume and score
            String resumeText = resumeService.extractResumeText(resumeUrl);
            double score = resumeService.calculateMatchScore(resumeText, job.getDescription());

            // Step 4: Prepare and save new application
            AppliedJobs applied = new AppliedJobs();
            applied.setApplicantEmail(applicantEmail);
            applied.setResumeUrl(resumeUrl);
            applied.setJobId(jobId);
            applied.setAppliedOn(LocalDateTime.now());
            String applicantName = Objects.requireNonNull(userService.getUser(applicantEmail).getBody()).getName();
            if(applicantName == null){
                ResponseEntity.badRequest().body("No User Exist");
            }
            if (score <= 0.80) {
                emailService.sendHrEmail(applicantEmail, job, resumeUrl,applicantName);
                applied.setStatus(Status.REVIEWING);
            } else {
                emailService.sendRejectionEmail(applicantEmail, job, resumeUrl,applicantName);
                applied.setStatus(Status.REJECTED);
                applied.setBanExpiryDate(LocalDateTime.now().plusMonths(6));
            }

            appliedJobsRepository.save(applied);
            return ResponseEntity.ok("Application processed successfully.");
        } catch (Exception e) {
            AppliedJobs failed = new AppliedJobs();
            failed.setApplicantEmail(applicantEmail);
            failed.setResumeUrl(resumeUrl);
            failed.setJobId(jobId);
            failed.setAppliedOn(LocalDateTime.now());
            failed.setStatus(Status.PENDING);
            appliedJobsRepository.save(failed);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while applying. Status set to Pending.");
        }
    }

    public ResponseEntity<String> updateApplicationStatus(String applicantEmail, String jobId, Status newStatus) {
        AppliedJobs existing = appliedJobsRepository.findByApplicantEmailAndJobId(applicantEmail, jobId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        existing.setStatus(newStatus);

        // Handle REJECTED case: store for 6 months
        if (newStatus == Status.REJECTED) {
            existing.setBanExpiryDate(LocalDateTime.now().plusMonths(6));
        }

        appliedJobsRepository.save(existing);
        return ResponseEntity.ok("Application status updated to " + newStatus);
    }

    public List<AppliedJobs> getAcceptedApplicantsByJobId(String jobId) {
        return appliedJobsRepository.findByJobIdAndStatus(jobId, Status.ACCEPTED);
    }
    public List<AppliedJobs> getAppliedJobsByApplicantEmail(String email) {
        return appliedJobsRepository.findByApplicantEmail(email);
    }
}
