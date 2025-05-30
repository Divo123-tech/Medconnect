package com.backend.server.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorRegisterRequest {

    private DoctorInfo doctorInfo;
    private String secretKey;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DoctorInfo {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String specialization;
        private LocalDate startedPracticingAt;
        private String education;
        private String bio;
    }
}
