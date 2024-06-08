package com.social.site.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Entity
@Getter
@Setter
@Table( name = "user_data")
public class User
{
    @Id
    @GeneratedValue( strategy = GenerationType.AUTO )
    private int id;

    @NotEmpty( message = "Email field is mandatory.")
    @Email( message = "Email format is invalid." )
    private String email;

    @NotEmpty( message = "First name field is mandatory.")
    private String firstName;

    @NotEmpty( message = "Last name field is mandatory." )
    private String lastName;

    @NotEmpty( message = "Password field is mandatory." )
    @Length( min = 10, message = "Password should have at least 10 characters.")
    private String password;

    private boolean isVerified;
    private String profileUrl;
    private String createdAt;
    private String updatedAt;
}
