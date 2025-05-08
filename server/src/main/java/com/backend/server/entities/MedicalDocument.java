package com.backend.server.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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

    private LocalDateTime uploadedAt;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;
}
