package com.backend.server.controllers;

import com.backend.server.auth.DoctorRegisterRequest;
import com.backend.server.auth.DoctorRegisterRequest.DoctorInfo;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class AdminControllerTest {

    @Mock
    private DoctorService doctorService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void register_WithValidSecretKey_ShouldRegisterDoctor() {
        // Arrange
        DoctorInfo doctorInfo = DoctorInfo.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .password("password")
                .specialization("Cardiology")
                .startedPracticingAt(java.time.LocalDate.now())
                .education("Harvard")
                .bio("Experienced doctor")
                .build();

        DoctorRegisterRequest request = DoctorRegisterRequest.builder()
                .secretKey("secretAdminKey")
                .doctorInfo(doctorInfo)
                .build();

        Doctor mockDoctor = new Doctor();
        when(doctorService.registerDoctor(doctorInfo)).thenReturn(mockDoctor);

        // Act
        ResponseEntity<?> response = adminController.register(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockDoctor, response.getBody());
    }

    @Test
    public void register_WithInvalidSecretKey_ShouldReturnForbidden() {
        // Arrange
        DoctorInfo doctorInfo = DoctorInfo.builder()
                .firstName("Jane")
                .lastName("Smith")
                .email("jane.smith@example.com")
                .password("password123")
                .specialization("Dermatology")
                .startedPracticingAt(java.time.LocalDate.now())
                .education("Stanford")
                .bio("Specialist in skin diseases")
                .build();

        DoctorRegisterRequest request = DoctorRegisterRequest.builder()
                .secretKey("wrongKey")
                .doctorInfo(doctorInfo)
                .build();

        // Act
        ResponseEntity<?> response = adminController.register(request);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Invalid secret key", response.getBody());
        verify(doctorService, never()).registerDoctor(any());
    }
}
