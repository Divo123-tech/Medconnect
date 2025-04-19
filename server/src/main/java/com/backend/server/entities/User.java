package com.backend.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data //getter and setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    public enum Role {
        PATIENT,
        DOCTOR
    }
    @Id
    @GeneratedValue
    private Integer id;

    private String firstName;

    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

}
