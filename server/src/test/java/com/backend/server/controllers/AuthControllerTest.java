package com.backend.server.controllers;

import com.backend.server.auth.AuthenticationRequest;
import com.backend.server.auth.AuthenticationResponse;
import com.backend.server.services.AuthService;
import com.backend.server.controllers.AuthController;
import com.backend.server.auth.PatientRegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void shouldRegisterPatientSuccessfully() throws Exception {
        PatientRegisterRequest request = PatientRegisterRequest.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .password("password123")
                .build();

        AuthenticationResponse response = AuthenticationResponse.builder()
                .token("fake-jwt-token")
                .build();

        when(authService.register(any(PatientRegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));

        verify(authService, times(1)).register(any(PatientRegisterRequest.class));
    }

    @Test
    void shouldLoginSuccessfully() throws Exception {
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("password")
                .build();

        AuthenticationResponse response = AuthenticationResponse.builder()
                .token("login-token")
                .build();

        when(authService.authenticate(any(AuthenticationRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("login-token"));

        verify(authService, times(1)).authenticate(any(AuthenticationRequest.class));
    }
}
