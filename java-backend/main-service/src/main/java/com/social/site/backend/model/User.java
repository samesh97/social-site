package com.social.site.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Table( name = "user_data")
public class User
{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int id;

    @Column( unique = true )
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private boolean isVerified = false;
    private String profileUrl;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
