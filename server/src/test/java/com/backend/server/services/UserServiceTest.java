package com.backend.server.services;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import com.backend.server.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private FileService fileService;

    @Mock
    private MultipartFile profilePicture;

    @InjectMocks
    private UserService userService;

    private User baseUser;
    private Patient patient;
    private Doctor doctor;
    private UserDTO.UserUpdateProfileDTO updateRequest;

    @BeforeEach
    void setUp() {
        // Setup base user
        baseUser = new User();
        baseUser.setId(1);
        baseUser.setEmail("test@example.com");
        baseUser.setFirstName("John");
        baseUser.setLastName("Doe");

        // Setup patient
        patient = new Patient();
        patient.setId(2);
        patient.setEmail("patient@example.com");
        patient.setFirstName("Jane");
        patient.setLastName("Smith");
        patient.setPhoneNumber("123-456-7890");
        patient.setHeight(170.0);
        patient.setWeight(70.0);
        patient.setBloodType(Patient.BloodType.A_POS);

        // Setup doctor
        doctor = new Doctor();
        doctor.setId(3);
        doctor.setEmail("doctor@example.com");
        doctor.setFirstName("Dr. Sarah");
        doctor.setLastName("Johnson");
        doctor.setSpecialization("Cardiology");
        doctor.setEducation("MD from Harvard");
        doctor.setBio("Experienced cardiologist");

        // Setup update request
        updateRequest = new UserDTO.UserUpdateProfileDTO();
    }

    // Tests for getUserById
    @Test
    void getUserById_ShouldReturnUser_WhenUserExists() {
        // Given
        when(userRepository.findById(1)).thenReturn(Optional.of(baseUser));

        // When
        User result = userService.getUserById(1);

        // Then
        assertNotNull(result);
        assertEquals(baseUser.getId(), result.getId());
        assertEquals(baseUser.getEmail(), result.getEmail());
        verify(userRepository).findById(1);
    }

    @Test
    void getUserById_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userService.getUserById(999)
        );
        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findById(999);
    }

    // Tests for updateUser - Base User
    @Test
    void updateUser_ShouldUpdateBasicFields_ForBaseUser() throws IOException {
        // Given
        updateRequest.setFirstName("UpdatedFirstName");
        updateRequest.setLastName("UpdatedLastName");
        updateRequest.setEmail("updated@example.com");
        updateRequest.setDateOfBirth(LocalDate.of(1990, 1, 1));
        updateRequest.setSex("Male");
        updateRequest.setPassword("newPassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));
        when(userRepository.save(any(User.class))).thenReturn(baseUser);

        // When
        User result = userService.updateUser("test@example.com", updateRequest, null);

        // Then
        assertNotNull(result);
        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).save(baseUser);

        // Verify fields were updated
        assertEquals("UpdatedFirstName", baseUser.getFirstName());
        assertEquals("UpdatedLastName", baseUser.getLastName());
        assertEquals("updated@example.com", baseUser.getEmail());
        assertEquals(LocalDate.of(1990, 1, 1), baseUser.getDateOfBirth());
        assertEquals("Male", baseUser.getSex());
        assertEquals("newPassword", baseUser.getPassword());
    }

    @Test
    void updateUser_ShouldUpdateProfilePicture_WhenFileProvided() throws IOException {
        // Given
        String expectedUrl = "https://example.com/profile.jpg";
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));
        when(userRepository.save(any(User.class))).thenReturn(baseUser);
        when(profilePicture.isEmpty()).thenReturn(false);
        when(fileService.saveProfilePicture(profilePicture)).thenReturn(expectedUrl);

        // When
        User result = userService.updateUser("test@example.com", updateRequest, profilePicture);

        // Then
        assertNotNull(result);
        verify(fileService).saveProfilePicture(profilePicture);
        assertEquals(expectedUrl, baseUser.getProfilePictureUrl());
    }

    @Test
    void updateUser_ShouldNotUpdateProfilePicture_WhenFileIsEmpty() throws IOException {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));
        when(userRepository.save(any(User.class))).thenReturn(baseUser);
        when(profilePicture.isEmpty()).thenReturn(true);

        // When
        User result = userService.updateUser("test@example.com", updateRequest, profilePicture);

        // Then
        assertNotNull(result);
        verify(fileService, never()).saveProfilePicture(any());
    }

    // Tests for updateUser - Patient
    @Test
    void updateUser_ShouldUpdatePatientSpecificFields_ForPatient() throws IOException {
        // Given
        updateRequest.setFirstName("UpdatedPatient");
        updateRequest.setPhoneNumber("987-654-3210");
        updateRequest.setHeight(175.0);
        updateRequest.setWeight(75.0);
        updateRequest.setBloodType(Patient.BloodType.B_POS);
        updateRequest.setConditions("Diabetes");

        when(userRepository.findByEmail("patient@example.com")).thenReturn(Optional.of(patient));
        when(patientRepository.save(any(Patient.class))).thenReturn(patient);

        // When
        User result = userService.updateUser("patient@example.com", updateRequest, null);

        // Then
        assertNotNull(result);
        verify(patientRepository).save(patient);
        verify(userRepository, never()).save(any()); // Should not save to user repository

        // Verify patient-specific fields were updated
        assertEquals("UpdatedPatient", patient.getFirstName());
        assertEquals("987-654-3210", patient.getPhoneNumber());
        assertEquals(175.0, patient.getHeight());
        assertEquals(75.0, patient.getWeight());
        assertEquals(Patient.BloodType.B_POS, patient.getBloodType());
        assertEquals("Diabetes", patient.getConditions());
    }

    // Tests for updateUser - Doctor
    @Test
    void updateUser_ShouldUpdateDoctorSpecificFields_ForDoctor() throws IOException {
        // Given
        updateRequest.setFirstName("UpdatedDoctor");
        updateRequest.setSpecialization("Neurology");
        updateRequest.setStartedPracticingAt(LocalDate.of(2010, 5, 1));
        updateRequest.setEducation("MD from Stanford");
        updateRequest.setBio("Expert in neurosurgery");

        when(userRepository.findByEmail("doctor@example.com")).thenReturn(Optional.of(doctor));
        when(doctorRepository.save(any(Doctor.class))).thenReturn(doctor);

        // When
        User result = userService.updateUser("doctor@example.com", updateRequest, null);

        // Then
        assertNotNull(result);
        verify(doctorRepository).save(doctor);
        verify(userRepository, never()).save(any()); // Should not save to user repository

        // Verify doctor-specific fields were updated
        assertEquals("UpdatedDoctor", doctor.getFirstName());
        assertEquals("Neurology", doctor.getSpecialization());
        assertEquals(LocalDate.of(2010, 5, 1), doctor.getStartedPracticingAt());
        assertEquals("MD from Stanford", doctor.getEducation());
        assertEquals("Expert in neurosurgery", doctor.getBio());
    }

    @Test
    void updateUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userService.updateUser("nonexistent@example.com", updateRequest, null)
        );
        assertEquals("User not found", exception.getMessage());
        verify(userRepository).findByEmail("nonexistent@example.com");
    }

    @Test
    void updateUser_ShouldOnlyUpdateNonNullFields() throws IOException {
        // Given - only set firstName, leave others null
        updateRequest.setFirstName("OnlyFirstName");
        // All other fields remain null

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));
        when(userRepository.save(any(User.class))).thenReturn(baseUser);

        String originalEmail = baseUser.getEmail();
        String originalLastName = baseUser.getLastName();

        // When
        User result = userService.updateUser("test@example.com", updateRequest, null);

        // Then
        assertNotNull(result);
        assertEquals("OnlyFirstName", baseUser.getFirstName());
        assertEquals(originalEmail, baseUser.getEmail()); // Should remain unchanged
        assertEquals(originalLastName, baseUser.getLastName()); // Should remain unchanged
    }

    @Test
    void updateUser_ShouldHandleIOException_WhenFileServiceFails() throws IOException {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));
        when(profilePicture.isEmpty()).thenReturn(false);
        when(fileService.saveProfilePicture(profilePicture)).thenThrow(new IOException("File save failed"));

        // When & Then
        IOException exception = assertThrows(
                IOException.class,
                () -> userService.updateUser("test@example.com", updateRequest, profilePicture)
        );
        assertEquals("File save failed", exception.getMessage());
    }

    // Tests for deleteUser
    @Test
    void deleteUser_ShouldReturnTrue_WhenDeletingBaseUser() {
        // Given
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(baseUser));

        // When
        Boolean result = userService.deleteUser("test@example.com");

        // Then
        assertTrue(result);
        verify(userRepository).findByEmail("test@example.com");
        verify(userRepository).deleteById(baseUser.getId());
        verify(patientRepository, never()).deleteById(any());
        verify(doctorRepository, never()).deleteById(any());
    }

    @Test
    void deleteUser_ShouldReturnTrue_WhenDeletingPatient() {
        // Given
        when(userRepository.findByEmail("patient@example.com")).thenReturn(Optional.of(patient));

        // When
        Boolean result = userService.deleteUser("patient@example.com");

        // Then
        assertTrue(result);
        verify(userRepository).findByEmail("patient@example.com");
        verify(patientRepository).deleteById(patient.getId());
        verify(userRepository).deleteById(patient.getId());
        verify(doctorRepository, never()).deleteById(any());
    }

    @Test
    void deleteUser_ShouldReturnTrue_WhenDeletingDoctor() {
        // Given
        when(userRepository.findByEmail("doctor@example.com")).thenReturn(Optional.of(doctor));

        // When
        Boolean result = userService.deleteUser("doctor@example.com");

        // Then
        assertTrue(result);
        verify(userRepository).findByEmail("doctor@example.com");
        verify(doctorRepository).deleteById(doctor.getId());
        verify(userRepository).deleteById(doctor.getId());
        verify(patientRepository, never()).deleteById(any());
    }

    @Test
    void deleteUser_ShouldReturnFalse_WhenUserNotFound() {
        // Given
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        // When
        Boolean result = userService.deleteUser("nonexistent@example.com");

        // Then
        assertFalse(result);
        verify(userRepository).findByEmail("nonexistent@example.com");
        verify(userRepository, never()).deleteById(any());
        verify(patientRepository, never()).deleteById(any());
        verify(doctorRepository, never()).deleteById(any());
    }
}