package com.backend.server.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void shouldGenerateAndValidateTokenSuccessfully() {
        User userDetails = new User("testuser", "password", Collections.emptyList());

        String token = jwtService.generateToken(userDetails);
        assertThat(token).isNotNull();

        String username = jwtService.extractUserName(token);
        assertThat(username).isEqualTo("testuser");

        boolean isValid = jwtService.isTokenValid(token, userDetails);
        assertThat(isValid).isTrue();
    }

    @Test
    void shouldExtractClaimSuccessfully() {
        User userDetails = new User("claimuser", "password", Collections.emptyList());
        String token = jwtService.generateToken(Map.of("role", "doctor"), userDetails);

        String extracted = jwtService.extractClaim(token, Claims::getSubject);
        assertThat(extracted).isEqualTo("claimuser");
    }

//    @Test
//    void shouldReturnFalseForExpiredToken() {
//        String SECRET_KEY = "AbnKH5JNyL3LGqinUzHWnUmvYZzCcbsxyBxDvrtOJPlm+W8B+ymyAiLiXzC257LB";
//        Key key = Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(SECRET_KEY));
//
//        // Generate expired token
//        String expiredToken = Jwts.builder()
//                .setSubject("expireduser")
//                .setIssuedAt(new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 2)) // 2 hours ago
//                .setExpiration(new Date(System.currentTimeMillis() - 1000 * 60)) // 1 minute ago
//                .signWith(key)
//                .compact();
//
//        User userDetails = new User("expireduser", "password", Collections.emptyList());
//
//        boolean isValid = jwtService.isTokenValid(expiredToken, userDetails);
//        assertThat(isValid).isFalse();
//    }
}
