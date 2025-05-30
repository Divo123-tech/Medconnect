package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Patient;
import com.backend.server.services.PatientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PatientControllerTest {

    private PatientService patientService;
    private PatientController patientController;

    @BeforeEach
    void setUp() {
        patientService = mock(PatientService.class);
        patientController = new PatientController(patientService);
    }

    @Test
    void getPatientById_shouldReturn200_whenPatientExists() {
        // Arrange
        int patientId = 1;
        Patient mockPatient = new Patient();
        mockPatient.setId(patientId);
        mockPatient.setFirstName("John");
        mockPatient.setLastName("Doe");
        mockPatient.setEmail("john@example.com");

        when(patientService.getPatientById(patientId)).thenReturn(mockPatient);

        // Act
        ResponseEntity<?> response = patientController.getPatientById(patientId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(UserDTO.PatientGetProfileDTO.class, response.getBody());
        UserDTO.PatientGetProfileDTO dto = (UserDTO.PatientGetProfileDTO) response.getBody();
        assertEquals("John", dto.getFirstName());
        assertEquals("Doe", dto.getLastName());
        assertEquals("john@example.com", dto.getEmail());
    }

    @Test
    void getPatientById_shouldReturn404_whenPatientNotFound() {
        // Arrange
        int patientId = 999;
        when(patientService.getPatientById(patientId)).thenReturn(null);

        // Act
        ResponseEntity<?> response = patientController.getPatientById(patientId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Patient not found", response.getBody());
    }

    @Test
    void getPatientById_shouldReturn500_whenServiceThrowsException() {
        // Arrange
        int patientId = 123;
        when(patientService.getPatientById(patientId)).thenThrow(new RuntimeException("DB error"));

        // Act
        ResponseEntity<?> response = patientController.getPatientById(patientId);

        // Assert
        assertEquals( HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("An error occurred"));
    }
}
