package com.portal.appliedJobs.service;

import com.portal.jobs.entities.Job;
import org.springframework.http.ResponseEntity;

public interface EmailService {

    ResponseEntity<String> sendHrEmail(String applicantEmail, Job job, String resumeUrl, String applcantName);
    ResponseEntity<String> sendRejectionEmail(String applicantEmail, Job job, String resumeUrl, String applicantName);
}
