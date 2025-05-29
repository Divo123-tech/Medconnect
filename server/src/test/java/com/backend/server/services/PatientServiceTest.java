package com.backend.server.services;

import com.backend.server.entities.Patient;
import com.backend.server.repositories.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    private Patient testPatient;

    @BeforeEach
    void setUp() {
        // Setup test patient
        testPatient = new Patient();
        testPatient.setId(1);
        testPatient.setEmail("patient@example.com");
        testPatient.setFirstName("John");
        testPatient.setLastName("Doe");
        testPatient.setDateOfBirth(LocalDate.of(1990, 5, 15));
        testPatient.setSex("Male");
        testPatient.setPhoneNumber("123-456-7890");
        testPatient.setHeight(175.0);
        testPatient.setWeight(70.0);
        testPatient.setBloodType(Patient.BloodType.A_POS);
        testPatient.setConditions("None");
        testPatient.setProfilePictureUrl("https://example.com/profile.jpg");
    }

    @Test
    void getPatientById_ShouldReturnPatient_WhenPatientExists() {
        // Given
        when(patientRepository.findById(1)).thenReturn(Optional.of(testPatient));

        // When
        Patient result = patientService.getPatientById(1);

        // Then
        assertNotNull(result);
        assertEquals(testPatient.getId(), result.getId());
        assertEquals(testPatient.getEmail(), result.getEmail());
        assertEquals(testPatient.getFirstName(), result.getFirstName());
        assertEquals(testPatient.getLastName(), result.getLastName());
        assertEquals(testPatient.getDateOfBirth(), result.getDateOfBirth());
        assertEquals(testPatient.getSex(), result.getSex());
        assertEquals(testPatient.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(testPatient.getHeight(), result.getHeight());
        assertEquals(testPatient.getWeight(), result.getWeight());
        assertEquals(testPatient.getBloodType(), result.getBloodType());
        assertEquals(testPatient.getConditions(), result.getConditions());
        assertEquals(testPatient.getProfilePictureUrl(), result.getProfilePictureUrl());

        verify(patientRepository).findById(1);
    }

    @Test
    void getPatientById_ShouldReturnSamePatientInstance_WhenPatientExists() {
        // Given
        when(patientRepository.findById(1)).thenReturn(Optional.of(testPatient));

        // When
        Patient result = patientService.getPatientById(1);

        // Then
        assertSame(testPatient, result);
        verify(patientRepository).findById(1);
    }

    @Test
    void getPatientById_ShouldThrowException_WhenPatientNotFound() {
        // Given
        int nonExistentId = 999;
        when(patientRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> patientService.getPatientById(nonExistentId)
        );

        assertEquals("Patient with id " + nonExistentId + " not found", exception.getMessage());
        verify(patientRepository).findById(nonExistentId);
    }

    @Test
    void getPatientById_ShouldThrowException_WithCorrectMessage_ForDifferentIds() {
        // Test with different IDs to ensure message is dynamic
        int[] testIds = {0, -1, 42, 12345};

        for (int testId : testIds) {
            // Given
            when(patientRepository.findById(testId)).thenReturn(Optional.empty());

            // When & Then
            UsernameNotFoundException exception = assertThrows(
                    UsernameNotFoundException.class,
                    () -> patientService.getPatientById(testId)
            );

            assertEquals("Patient with id " + testId + " not found", exception.getMessage());
            verify(patientRepository).findById(testId);
        }
    }

    @Test
    void getPatientById_ShouldCallRepositoryOnlyOnce() {
        // Given
        when(patientRepository.findById(1)).thenReturn(Optional.of(testPatient));

        // When
        patientService.getPatientById(1);

        // Then
        verify(patientRepository, times(1)).findById(1);
        verifyNoMoreInteractions(patientRepository);
    }

    @Test
    void getPatientById_ShouldHandlePatientWithNullFields() {
        // Given - patient with some null fields
        Patient patientWithNulls = new Patient();
        patientWithNulls.setId(2);
        patientWithNulls.setEmail("patient2@example.com");
        patientWithNulls.setFirstName("Jane");
        patientWithNulls.setLastName("Smith");
        // Other fields remain null

        when(patientRepository.findById(2)).thenReturn(Optional.of(patientWithNulls));

        // When
        Patient result = patientService.getPatientById(2);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getId());
        assertEquals("patient2@example.com", result.getEmail());
        assertEquals("Jane", result.getFirstName());
        assertEquals("Smith", result.getLastName());
        assertNull(result.getDateOfBirth());
        assertNull(result.getSex());
        assertNull(result.getPhoneNumber());
        assertNull(result.getHeight());
        assertNull(result.getWeight());
        assertNull(result.getBloodType());
        assertNull(result.getConditions());
        assertNull(result.getProfilePictureUrl());

        verify(patientRepository).findById(2);
    }

    @Test
    void getPatientById_ShouldHandleRepositoryException() {
        // Given
        RuntimeException repositoryException = new RuntimeException("Database connection error");
        when(patientRepository.findById(1)).thenThrow(repositoryException);

        // When & Then
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> patientService.getPatientById(1)
        );

        assertEquals("Database connection error", exception.getMessage());
        verify(patientRepository).findById(1);
    }

    @Test
    void getPatientById_ShouldWorkWithZeroId() {
        // Given
        Patient patientWithZeroId = new Patient();
        patientWithZeroId.setId(0);
        patientWithZeroId.setEmail("zero@example.com");

        when(patientRepository.findById(0)).thenReturn(Optional.of(patientWithZeroId));

        // When
        Patient result = patientService.getPatientById(0);

        // Then
        assertNotNull(result);
        assertEquals(0, result.getId());
        assertEquals("zero@example.com", result.getEmail());
        verify(patientRepository).findById(0);
    }

    @Test
    void getPatientById_ShouldWorkWithNegativeId() {
        // Given
        int negativeId = -5;
        when(patientRepository.findById(negativeId)).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> patientService.getPatientById(negativeId)
        );

        assertEquals("Patient with id " + negativeId + " not found", exception.getMessage());
        verify(patientRepository).findById(negativeId);
    }
}