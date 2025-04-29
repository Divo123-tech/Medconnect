package com.backend.server.repositories;

import com.backend.server.entities.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    // Already existing:
    Page<Doctor> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName, Pageable pageable);

    // Already existing:
    Page<Doctor> findBySpecializationContainingIgnoreCase(String specialization, Pageable pageable);

    @Query("SELECT d FROM Doctor d " +
            "WHERE LOWER(d.specialization) LIKE LOWER(CONCAT('%', :specialization, '%')) " +
            "AND (LOWER(d.firstName) LIKE LOWER(CONCAT('%', :name, '%')) " +
            "OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :name, '%')))")
    Page<Doctor> findBySpecializationAndName(@Param("specialization") String specialization, @Param("name") String name, Pageable pageable);


}
