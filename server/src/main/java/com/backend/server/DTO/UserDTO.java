package com.backend.server.DTO;

import com.backend.server.entities.Patient;
import com.backend.server.entities.User.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    }

}
