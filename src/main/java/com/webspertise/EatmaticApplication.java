package com.webspertise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import(value = {SpringConfig.class})
public class EatmaticApplication {

	public static void main(String[] args) {
		SpringApplication.run(EatmaticApplication.class, args);
	}
}
