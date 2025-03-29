package com.social.site.backend;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication( scanBasePackages = {"com.social.site.backend",
"com.social.site.backend.common.annotation"})
@EnableJpaAuditing
public class SpringApplication
{

	public static void main(String[] args)
	{
		org.springframework.boot.SpringApplication.run(SpringApplication.class, args);
	}
}
