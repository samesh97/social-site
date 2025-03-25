package com.social.site.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jwt_token")
public class Token
{
    @Id
    @Column(name = "token")
    private String token;


}
