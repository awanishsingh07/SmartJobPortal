package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.service.EmailService;
import com.portal.jobs.entities.Job;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    @Value("${BREVO_API}")
    private String BREVO_API;

    private final RestTemplate restTemplate;

    public EmailServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    @Override
    public ResponseEntity<String> sendHrEmail(String applicantEmail, Job job, String resumeUrl) {
        sendEmail(
                job.getEmail(),
                applicantEmail,
                job.getTitle(),
                resumeUrl,
                job.getDescription()
        );
        return ResponseEntity.ok("Mail sent Successfully");
    }

    @Override
    public ResponseEntity<String> sendRejectionEmail(String applicantEmail, Job job) {
        sendEmail(
                applicantEmail,
                applicantEmail,
                job.getTitle(),
                "",
                job.getDescription()
        );
        return ResponseEntity.ok("Mail sent successfully");
    }

    private void sendEmail(String toEmail, String applicantEmail, String jobTitle, String resumeUrl, String jobDescription) {
        String url = "https://api.brevo.com/v3/smtp/email";
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", BREVO_API);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", "Job Portal", "email", "no-reply@jobportal.com"));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("templateId", 1);

        Map<String, Object> params = new HashMap<>();
        params.put("JobTitle", jobTitle);
        params.put("applicantEmail", applicantEmail);
        params.put("resumeUrl", resumeUrl);
        params.put("jobDescription", jobDescription);

        body.put("params", params);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        restTemplate.exchange(url, HttpMethod.POST, request, String.class);
    }
}
