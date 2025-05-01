package com.backend.server.repositories;

import com.backend.server.entities.Appointment;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find all appointments for a doctor on a specific date
    Page<Appointment> findByDoctorAndDate(Doctor doctor, LocalDate date, Pageable pageable);

    // Find a specific appointment for conflict checking
    Optional<Appointment> findByDoctorAndDateAndTime(Doctor doctor, LocalDate date, LocalTime time);

    // Find all appointments of a patient with a specific status
    Page<Appointment> findByPatientAndStatus(Patient patient, Appointment.Status status, Pageable pageable);

    // Optional: Find all appointments of a doctor (not limited by date)
    Page<Appointment> findByDoctorAndStatus(Doctor doctor, Appointment.Status status, Pageable pageable);

}
