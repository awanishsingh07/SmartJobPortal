package com.portal.appliedJobs.service.impl;

import com.portal.appliedJobs.service.ResumeService;
import org.apache.commons.text.similarity.JaroWinklerSimilarity;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

@Service
public class ResumeServiceImpl implements ResumeService {

    private final JaroWinklerSimilarity similarity = new JaroWinklerSimilarity();

    @Override
    public String extractResumeText(String resumeUrl) throws IOException {
        try (InputStream inputStream = URI.create(resumeUrl).toURL().openStream();
             PDDocument document = PDDocument.load(inputStream)) {
            return new PDFTextStripper().getText(document);
        }
    }


    @Override
    public double calculateMatchScore(String resumeText, String jobDescription) {
        return similarity.apply(resumeText.toLowerCase(), jobDescription.toLowerCase());
    }
}
