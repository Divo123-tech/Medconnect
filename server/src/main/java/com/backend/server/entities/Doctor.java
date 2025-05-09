package com.backend.server.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Doctor extends User {

    private String specialization;

    @Column(name = "started_practicing_at")
    private LocalDate startedPracticingAt;

    private String education;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;


}
