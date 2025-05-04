package com.portal;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobPortalApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("DATASOURCE_URL", dotenv.get("DATASOURCE_URL"));
		System.setProperty("DATASOURCE_DATABASE", dotenv.get("DATASOURCE_DATABASE"));
		System.setProperty("BREVO_API",dotenv.get("BREVO_API"));
		SpringApplication.run(JobPortalApplication.class, args);

	}


}
