package com.example.demo.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    private String provider; // "GOOGLE" or "FACEBOOK"
    private String token;    // id_token from firebase
    private String email;    // Bypass fields
    private String name;     // Bypass fields
}

