package com.backend.server.repositories;

import com.backend.server.entities.Doctor;
import com.backend.server.entities.DoctorPatient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorPatientRepository extends JpaRepository<DoctorPatient, Long> {

    Page<DoctorPatient> findByDoctorAndPatient_FirstNameContainingIgnoreCaseOrDoctorAndPatient_LastNameContainingIgnoreCase(
            Doctor doctor1, String firstName,
            Doctor doctor2, String lastName,
            Pageable pageable
    );
    void deleteByDoctor_IdAndPatient_Id(Long doctorId, Long patientId);
}
