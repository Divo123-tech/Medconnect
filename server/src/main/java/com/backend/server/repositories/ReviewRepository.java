package com.backend.server.repositories;

import com.backend.server.entities.Review;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctor(Doctor doctor);
    List<Review> findByPatient(Patient patient);
}
