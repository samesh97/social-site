package com.social.site.backend.payload;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginPayload
{
    @NotNull( message = "Email should not be null.")
    @NotEmpty( message = "Email should not be empty.")
    @Email( message = "Invalid Email Address.")
    private String email;

    @NotNull( message = "Password should not be null." )
    @NotEmpty( message = "Password should not be empty.")
    private String password;
}
