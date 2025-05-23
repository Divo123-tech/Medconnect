package com.backend.server.DTO;

import com.backend.server.entities.MedicalDocument;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;
import com.backend.server.entities.User.Role;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

public class UserDTO {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserGetProfileDTO{
        private Integer id;
        private String firstName;
        private String lastName;
        private String email;
        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientGetProfileDTO{
        private Integer id;
        private String firstName;
        private String lastName;
        private String email;
        private Role role;
        private String phoneNumber;
        private Double height;
        private Double weight;
        private Patient.BloodType bloodType;
        private String conditions;
        private String profilePictureURL;
        private List<MedicalDocument> medicalDocuments;
        private LocalDate dateOfBirth;
        private String sex;

    }

    @Data
    public static class UserUpdateProfileDTO {
        private String firstName;
        private String lastName;
        private String password;
        private String email;
        private String phoneNumber;
        private Double height;
        private Double weight;
        private Patient.BloodType bloodType;
        private String conditions;
        private String specialization;
        private LocalDate startedPracticingAt;
        private String education;
        private String bio;
        private String profilePictureURL;
        private LocalDate dateOfBirth;
        private String sex;

    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorGetProfileDTO{
        private Integer id;
        private String firstName;
        private String lastName;
        private String email;
        private Role role;
        private String specialization;
        private LocalDate startedPracticingAt;
        private String education;
        private String bio;
        private String profilePictureURL;
        private List<ReviewDTO> reviews;
        private LocalDate dateOfBirth;
        private String sex;
    }

}
