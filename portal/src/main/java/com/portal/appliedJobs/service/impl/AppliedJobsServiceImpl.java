package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.Status;
import com.portal.appliedJobs.models.AppliedJobs;
import com.portal.appliedJobs.repository.AppliedJobRepository;
import com.portal.appliedJobs.service.EmailService;
import com.portal.appliedJobs.service.ResumeService;
import com.portal.jobs.entities.Job;
import com.portal.jobs.service.JobService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppliedJobsServiceImpl {

    private final AppliedJobRepository appliedJobsRepository;
    private final ResumeService resumeService;
    private final EmailService emailService;
    private final JobService jobService;

    public AppliedJobsServiceImpl(AppliedJobRepository appliedJobsRepository, ResumeService resumeService, EmailService emailService, JobService jobService) {
        this.appliedJobsRepository = appliedJobsRepository;
        this.resumeService = resumeService;
        this.emailService = emailService;
        this.jobService = jobService;
    }

    public ResponseEntity<String> applyForJob(String applicantEmail, String resumeUrl, String jobId) {
        try {
            Job job = jobService.getJobById(jobId).getBody();

            // Step 1: Check expiry
            assert job != null;
            if (LocalDateTime.now().isAfter(job.getDeadline())) {
                jobService.deleteJob(jobId,job.getEmail()); // Optional: delete if expired
                return ResponseEntity.badRequest().body("Job has already expired.");
            }

            // Step 2: Extract and calculate match
            String resumeText = resumeService.extractResumeText(resumeUrl);
            double score = resumeService.calculateMatchScore(resumeText, job.getDescription());

            // Step 3: Prepare AppliedJobs entity
            AppliedJobs applied = new AppliedJobs();
            applied.setApplicantEmail(applicantEmail);
            applied.setResumeUrl(resumeUrl);
            applied.setJobId(jobId);
            applied.setAppliedOn(LocalDateTime.now());

            if (score >= 0.80) {
                // Match high → send HR mail and mark Reviewing
                emailService.sendHrEmail(applicantEmail, job, resumeUrl);
                applied.setStatus(Status.REVIEWING);
            } else {
                // Low match → send rejection and ban for 6 months
                emailService.sendRejectionEmail(applicantEmail, job);
                applied.setStatus(Status.REJECTED);
                applied.setBanExpiryDate(LocalDateTime.now().plusMonths(6));
            }

            appliedJobsRepository.save(applied);
            return ResponseEntity.ok("Application processed successfully.");

        } catch (Exception e) {
            // Step 4: On any failure, save with PENDING status
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
