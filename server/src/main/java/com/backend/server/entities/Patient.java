package com.backend.server.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
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

    @ToString.Exclude
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MedicalDocument> medicalDocuments = new ArrayList<>();
    public enum BloodType {
        A_POS, A_NEG, B_POS, B_NEG, AB_POS, AB_NEG, O_POS, O_NEG
    }
}
