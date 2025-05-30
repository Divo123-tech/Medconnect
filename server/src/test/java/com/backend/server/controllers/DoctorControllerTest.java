package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DoctorControllerTest {

    private DoctorService doctorService;
    private DoctorController doctorController;

    @BeforeEach
    void setUp() {
        doctorService = mock(DoctorService.class);
        doctorController = new DoctorController(doctorService);
    }

    @Test
    void getDoctors_shouldReturn200_withValidData() {
        Doctor doctor = new Doctor();
        doctor.setFirstName("Jane");
        doctor.setLastName("Doe");
        Page<Doctor> mockPage = new PageImpl<>(List.of(doctor));
        when(doctorService.findAllDoctors(null, null, 0, 10, "firstName")).thenReturn(mockPage);

        ResponseEntity<?> response = doctorController.getDoctors(null, null, 0, 10, "firstName");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(Page.class, response.getBody());
    }

    @Test
    void getDoctors_shouldReturn500_whenServiceFails() {
        when(doctorService.findAllDoctors(null, null, 0, 10, "firstName"))
                .thenThrow(new RuntimeException("Database failure"));

        ResponseEntity<?> response = doctorController.getDoctors(null, null, 0, 10, "firstName");

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("An error occurred"));
    }

    @Test
    void getDoctorById_shouldReturn200_whenDoctorExists() {
        Doctor doctor = new Doctor();
        doctor.setId(1);
        doctor.setFirstName("Alice");
        doctor.setLastName("Smith");
        when(doctorService.getDoctorById(1)).thenReturn(doctor);

        ResponseEntity<?> response = doctorController.getDoctorById(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(UserDTO.DoctorGetProfileDTO.class, response.getBody());
        UserDTO.DoctorGetProfileDTO dto = (UserDTO.DoctorGetProfileDTO) response.getBody();
        assertEquals("Alice", dto.getFirstName());
    }

    @Test
    void getDoctorById_shouldReturn404_whenNotFound() {
        when(doctorService.getDoctorById(42)).thenReturn(null);

        ResponseEntity<?> response = doctorController.getDoctorById(42);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Doctor not found", response.getBody());
    }

    @Test
    void getDoctorById_shouldReturn500_whenExceptionThrown() {
        when(doctorService.getDoctorById(1)).thenThrow(new RuntimeException("Something went wrong"));

        ResponseEntity<?> response = doctorController.getDoctorById(1);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("An error occurred"));
    }
}
