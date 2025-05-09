package com.backend.server.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "medical_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    private String fileUrl; // Path or public URL to access the file

    private LocalDate uploadedAt;

    @ToString.Exclude
    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    @JsonBackReference
    private Patient patient;
}
