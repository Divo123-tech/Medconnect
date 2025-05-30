package com.backend.server.controllers;

import com.backend.server.entities.DoctorPatient;
import com.backend.server.entities.Patient;
import com.backend.server.services.DoctorPatientService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class DoctorPatientControllerTest {

    @Mock
    private DoctorPatientService doctorPatientService;

    @InjectMocks
    private DoctorPatientController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // --- Test: searchPatientsByDoctor (Success) ---
    @Test
    void searchPatientsByDoctor_ShouldReturnOk() {
        DoctorPatient dp = new DoctorPatient();
        Patient patient = new Patient();
        patient.setId(1);
        patient.setFirstName("John");
        dp.setPatient(patient);

        Page<DoctorPatient> page = new PageImpl<>(List.of(dp));
        when(doctorPatientService.searchPatientsByDoctor(1, "", 0, 10)).thenReturn(page);

        ResponseEntity<?> response = controller.searchPatientsByDoctor(1, "", 0, 10);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(doctorPatientService, times(1)).searchPatientsByDoctor(1, "", 0, 10);
    }

    // --- Test: searchPatientsByDoctor (Exception) ---
    @Test
    void searchPatientsByDoctor_ShouldReturnInternalServerError() {
        when(doctorPatientService.searchPatientsByDoctor(anyInt(), anyString(), anyInt(), anyInt()))
                .thenThrow(new RuntimeException("Database failure"));

        ResponseEntity<?> response = controller.searchPatientsByDoctor(1, "", 0, 10);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Database failure"));
    }

    // --- Test: deleteDoctorPatient (Success) ---
    @Test
    void deleteDoctorPatient_ShouldReturnOk() {
        doNothing().when(doctorPatientService).deleteDoctorPatient(1L, 2L);

        ResponseEntity<?> response = controller.deleteDoctorPatient(1L, 2L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Doctor-Patient relationship deleted successfully.", response.getBody());
    }

    // --- Test: deleteDoctorPatient (Not Found) ---
    @Test
    void deleteDoctorPatient_ShouldReturnNotFound() {
        doThrow(new IllegalArgumentException("Not found")).when(doctorPatientService).deleteDoctorPatient(1L, 2L);

        ResponseEntity<?> response = controller.deleteDoctorPatient(1L, 2L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Not found"));
    }

    // --- Test: deleteDoctorPatient (Other Exception) ---
    @Test
    void deleteDoctorPatient_ShouldReturnInternalServerError() {
        doThrow(new RuntimeException("Unexpected error")).when(doctorPatientService).deleteDoctorPatient(1L, 2L);

        ResponseEntity<?> response = controller.deleteDoctorPatient(1L, 2L);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Unexpected error"));
    }
}
