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
    public ResponseEntity<String> sendHrEmail(String applicantEmail, Job job, String resumeUrl, String applicantName) {

        sendEmail(
                job.getEmail(),
                1,
                applicantEmail,
                job.getTitle(),
                resumeUrl,
                job.getDescription(),
                job.getCategory(),
                applicantName
        );
        return ResponseEntity.ok("Mail sent Successfully");
    }
    public static String getPublicIP() {
        try {
            return new RestTemplate().getForObject("https://api64.ipify.org", String.class);
        } catch (Exception e) {
            return "Can't fetch IP";
        }
    }


    @Override
    public ResponseEntity<String> sendRejectionEmail(String applicantEmail, Job job, String resumeUrl, String applicantName) {

        sendEmail(
                applicantEmail,
                2,
                applicantEmail,
                job.getTitle(), 
                resumeUrl,
                job.getDescription(),
                job.getCategory(),
                applicantName
        );
        return ResponseEntity.ok("Mail sent successfully");
    }

    private void sendEmail(String toEmail,int templateId, String applicantEmail, String jobTitle, String resumeUrl, String jobDescription, String category, String applicantName) {
        String Ip = getPublicIP();
        System.out.println(Ip);
        String url = "https://api.brevo.com/v3/smtp/email";
        HttpHeaders headers = new HttpHeaders();

        System.out.println(BREVO_API);
        headers.set("api-key", BREVO_API);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("sender", Map.of("name", "Job Portal", "email", "maheshwari.keshav2090@gmail.com"));
        body.put("to", List.of(Map.of("email", toEmail)));
        body.put("templateId", templateId);

        Map<String, Object> params = new HashMap<>();
        params.put("JobTitle", jobTitle);
        params.put("applicantEmail", applicantEmail);
        params.put("resumeUrl", resumeUrl);
        params.put("jobDescription", jobDescription);
        params.put("title", jobTitle);
        params.put("role", category);
        params.put("name", applicantName);


        body.put("params", params);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> exchange = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            System.out.println("BREVO RESPONSE: " + exchange.getBody());
        } catch (Exception e) {
            System.out.println("BREVO ERROR: " + e.getMessage());
            e.printStackTrace(); // Print full stack trace
        }

    }
}
