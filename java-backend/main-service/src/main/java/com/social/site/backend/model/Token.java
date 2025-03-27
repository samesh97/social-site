package com.social.site.backend.model;

import com.social.site.backend.enums.TokenType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "jwt_token")
@Getter
@Setter
public class Token
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String token;
    private String sessionId;

    private TokenType tokenType;
}
