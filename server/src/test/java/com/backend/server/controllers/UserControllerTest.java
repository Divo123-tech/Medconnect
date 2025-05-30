package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.services.DoctorService;
import com.backend.server.services.PatientService;
import com.backend.server.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.security.Principal;
import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private PatientService patientService;

    @Mock
    private DoctorService doctorService;

    @Mock
    private Authentication authentication;

    @Mock
    private Principal principal;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private User testUser;
    private Patient testPatient;
    private Doctor testDoctor;
    private UserDTO.UserUpdateProfileDTO updateRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();

        // Setup test data
        testUser = new User();
        testUser.setId(1);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setRole(User.Role.PATIENT);

        testPatient = new Patient();
        testPatient.setId(1);
        testPatient.setFirstName("John");
        testPatient.setLastName("Doe");
        testPatient.setEmail("john.doe@example.com");
        testPatient.setRole(User.Role.PATIENT);
        testPatient.setDateOfBirth(LocalDate.of(1990, 1, 1));
        testPatient.setPhoneNumber("1234567890");

        testDoctor = new Doctor();
        testDoctor.setId(2);
        testDoctor.setFirstName("Jane");
        testDoctor.setLastName("Smith");
        testDoctor.setEmail("jane.smith@example.com");
        testDoctor.setRole(User.Role.DOCTOR);
        testDoctor.setSpecialization("Cardiology");

        updateRequest = new UserDTO.UserUpdateProfileDTO();
        updateRequest.setFirstName("Updated John");
        updateRequest.setLastName("Updated Doe");
    }

    @Test
    void getMyProfile_ShouldReturnPatientDTO_WhenUserIsPatient() throws Exception {
        // Given
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(patientService.getPatientById(1)).thenReturn(testPatient);

        // When & Then
        mockMvc.perform(get("/api/v1/my-profile")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.role").value("PATIENT"));

        verify(patientService).getPatientById(1);
        verify(doctorService, never()).getDoctorById((int) anyLong());
    }

    @Test
    void getMyProfile_ShouldReturnDoctorDTO_WhenUserIsDoctor() throws Exception {
        // Given
        testUser.setRole(User.Role.DOCTOR);
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(doctorService.getDoctorById(1)).thenReturn(testDoctor);

        // When & Then
        mockMvc.perform(get("/api/v1/my-profile")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.lastName").value("Smith"))
                .andExpect(jsonPath("$.email").value("jane.smith@example.com"))
                .andExpect(jsonPath("$.role").value("DOCTOR"));

        verify(doctorService).getDoctorById(1);
        verify(patientService, never()).getPatientById((int) anyLong());
    }

    @Test
    void getMyProfile_ShouldReturnUserDTO_WhenUserIsAdmin() throws Exception {
        // Given
        testUser.setRole(User.Role.ADMIN);
        when(authentication.getPrincipal()).thenReturn(testUser);

        // When & Then
        mockMvc.perform(get("/api/v1/my-profile")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"));

        verify(patientService, never()).getPatientById((int) anyLong());
        verify(doctorService, never()).getDoctorById((int) anyLong());
    }

    @Test
    void updateUser_ShouldReturnPatientDTO_WhenUpdatedUserIsPatient() throws Exception {
        // Given
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any()))
                .thenReturn(testPatient);

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );
        MockMultipartFile imagePart = new MockMultipartFile(
                "profilePicture", "profile.jpg", "image/jpeg", "image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .file(imagePart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.role").value("PATIENT"));

        verify(userService).updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any());
    }

    @Test
    void updateUser_ShouldReturnDoctorDTO_WhenUpdatedUserIsDoctor() throws Exception {
        // Given
        when(principal.getName()).thenReturn("jane.smith@example.com");
        when(userService.updateUser(eq("jane.smith@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any()))
                .thenReturn(testDoctor);

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2))
                .andExpect(jsonPath("$.firstName").value("Jane"))
                .andExpect(jsonPath("$.role").value("DOCTOR"));

        verify(userService).updateUser(eq("jane.smith@example.com"), any(UserDTO.UserUpdateProfileDTO.class), isNull());
    }

    @Test
    void updateUser_ShouldReturnUserDTO_WhenUpdatedUserIsRegularUser() throws Exception {
        // Given
        User updatedUser = new User();
        updatedUser.setId(3);
        updatedUser.setFirstName("Updated John");
        updatedUser.setLastName("Updated Doe");
        updatedUser.setEmail("john.doe@example.com");

        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any()))
                .thenReturn(updatedUser);

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.firstName").value("Updated John"))
                .andExpect(jsonPath("$.lastName").value("Updated Doe"));

        verify(userService).updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), isNull());
    }

    @Test
    void updateUser_ShouldHandleIOException() throws Exception {
        // Given
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any()))
                .thenThrow(new RuntimeException("IO Exception occurred"));

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteUser_ShouldReturnTrue_WhenUserDeletedSuccessfully() throws Exception {
        // Given
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.deleteUser("john.doe@example.com")).thenReturn(true);

        // When & Then
        mockMvc.perform(delete("/api/v1/my-profile")
                        .principal(principal))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        verify(userService).deleteUser("john.doe@example.com");
    }

    @Test
    void deleteUser_ShouldReturnNotFound_WhenUserNotFound() throws Exception {
        // Given
        when(principal.getName()).thenReturn("nonexistent@example.com");
        when(userService.deleteUser("nonexistent@example.com")).thenReturn(false);

        // When & Then
        mockMvc.perform(delete("/api/v1/my-profile")
                        .principal(principal))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User with email nonexistent@example.com not found."));

        verify(userService).deleteUser("nonexistent@example.com");
    }

    @Test
    void updateUser_ShouldWorkWithoutProfilePicture() throws Exception {
        // Given
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), isNull()))
                .thenReturn(testPatient);

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));

        verify(userService).updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), isNull());
    }

    @Test
    void getMyProfile_ShouldHandleNullPrincipal() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/v1/my-profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateUser_ShouldHandleInvalidJSON() throws Exception {
        // Given
        MockMultipartFile invalidUserPart = new MockMultipartFile(
                "user", "", "application/json",
                "invalid json".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(invalidUserPart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateUser_ShouldHandleLargeProfilePicture() throws Exception {
        // Given
        when(principal.getName()).thenReturn("john.doe@example.com");
        when(userService.updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any()))
                .thenReturn(testPatient);

        MockMultipartFile userPart = new MockMultipartFile(
                "user", "", "application/json",
                objectMapper.writeValueAsBytes(updateRequest)
        );

        // Create a large file (simulate large image)
        byte[] largeImageContent = new byte[5 * 1024 * 1024]; // 5MB
        MockMultipartFile largeImagePart = new MockMultipartFile(
                "profilePicture", "large-profile.jpg", "image/jpeg", largeImageContent
        );

        // When & Then
        mockMvc.perform(multipart("/api/v1/my-profile")
                        .file(userPart)
                        .file(largeImagePart)
                        .with(request -> {
                            request.setMethod("PATCH");
                            return request;
                        })
                        .principal(principal))
                .andExpect(status().isOk());

        verify(userService).updateUser(eq("john.doe@example.com"), any(UserDTO.UserUpdateProfileDTO.class), any());
    }
}