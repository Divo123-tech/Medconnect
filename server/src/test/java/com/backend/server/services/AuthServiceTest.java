package com.backend.server.services;

import com.backend.server.auth.AuthenticationRequest;
import com.backend.server.auth.AuthenticationResponse;
import com.backend.server.auth.PatientRegisterRequest;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.PatientRepository;
import com.backend.server.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterPatientAndReturnJwtToken() {
        // Given
        PatientRegisterRequest request = PatientRegisterRequest.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email("alice@example.com")
                .password("secret")
                .build();

        when(passwordEncoder.encode("secret")).thenReturn("encoded-secret");
        when(jwtService.generateToken(any(Patient.class))).thenReturn("jwt-token");

        ArgumentCaptor<Patient> patientCaptor = ArgumentCaptor.forClass(Patient.class);

        // When
        AuthenticationResponse response = authService.register(request);

        // Then
        verify(patientRepository).save(patientCaptor.capture());
        Patient savedPatient = patientCaptor.getValue();

        assertThat(savedPatient.getEmail()).isEqualTo("alice@example.com");
        assertThat(savedPatient.getPassword()).isEqualTo("encoded-secret");
        assertThat(savedPatient.getRole()).isEqualTo(User.Role.PATIENT);
        assertThat(response.getToken()).isEqualTo("jwt-token");
    }

    @Test
    void shouldAuthenticateUserAndReturnJwtToken() {
        // Given
        AuthenticationRequest request = AuthenticationRequest.builder()
                .email("john@example.com")
                .password("pass123")
                .build();

        User user = User.builder()
                .id(1)
                .email("john@example.com")
                .password("hashed")
                .role(User.Role.PATIENT)
                .build();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-auth-token");

        // When
        AuthenticationResponse response = authService.authenticate(request);

        // Then
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("john@example.com", "pass123"));
        verify(userRepository).findByEmail("john@example.com");
        verify(jwtService).generateToken(user);

        assertThat(response.getToken()).isEqualTo("jwt-auth-token");
    }
}
