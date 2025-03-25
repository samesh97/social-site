package com.social.site.backend;

import com.social.site.backend.common.annotation.APIExceptionHandler;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication( scanBasePackages = {"com.social.site.backend",
"com.social.site.backend.common.annotation"})
@Import(APIExceptionHandler.class)
public class SpringApplication
{

	public static void main(String[] args)
	{
		org.springframework.boot.SpringApplication.run(SpringApplication.class, args);
	}
}
