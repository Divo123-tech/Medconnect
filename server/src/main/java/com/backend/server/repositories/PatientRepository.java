package com.backend.server.repositories;

import com.backend.server.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
}
