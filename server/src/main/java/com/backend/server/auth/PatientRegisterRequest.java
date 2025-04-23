package com.backend.server.auth;

import lombok.*;

@Setter
@Getter
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientRegisterRequest {

        private String firstName;

        private String lastName;

        private String email;

        private String password;

}
