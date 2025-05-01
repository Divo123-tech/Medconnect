package com.backend.server.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Patient extends User {

    private String phoneNumber;
    private Double height;
    private Double weight;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private String conditions;
    @OneToMany(mappedBy = "patient")
    private List<Appointment> appointments;

    public enum BloodType {
        A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG
    }
}
