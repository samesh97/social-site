package com.social.site.backend.dto.payload;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserPayload
{
    @NotNull( message = "Email cannot be null.")
    @NotEmpty( message = "Email field is empty.")
    @Email( message = "Email format is invalid." )
    private String email;

    @NotNull( message = "First name cannot be null.")
    @NotEmpty( message = "First name is empty.")
    private String firstName;

    @NotNull( message = "Last name cannot be null.")
    @NotEmpty( message = "Last name is empty." )
    private String lastName;

    @NotNull( message = "Password cannot be null.")
    @NotEmpty( message = "Password is empty." )
    @Length( min = 10, message = "Password should have at least 10 characters.")
    private String password;

    @NotNull(message = "Profile picture cannot be null.")
    private MultipartFile profilePic;
}
