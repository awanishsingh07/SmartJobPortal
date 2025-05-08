package com.portal;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class JobPortalApplication {

	public static void main(String[] args) {
		Logger logger = LoggerFactory.getLogger(JobPortalApplication.class);
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("DATASOURCE_URL", dotenv.get("DATASOURCE_URL"));
		System.setProperty("DATASOURCE_DATABASE", dotenv.get("DATASOURCE_DATABASE"));
		System.setProperty("BREVO_API",dotenv.get("BREVO_API"));
		SpringApplication.run(JobPortalApplication.class, args);
		String Ip = getPublicIP();
		logger.info(Ip);
	}
	public static String getPublicIP() {
		try {
			return new RestTemplate().getForObject("https://api64.ipify.org", String.class);
		} catch (Exception e) {
			return "Can't fetch IP";
		}
	}

}
