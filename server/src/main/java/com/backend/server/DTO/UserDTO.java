package com.backend.server.DTO;

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
    public static class UserUpdateProfileDTO {
        private String firstName;
        private String lastName;
        private String password;
        private String email;
    }

}
