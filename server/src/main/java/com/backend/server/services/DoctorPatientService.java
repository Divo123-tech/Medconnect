package com.backend.server.services;

import com.backend.server.entities.Doctor;
import com.backend.server.entities.DoctorPatient;
import com.backend.server.repositories.DoctorPatientRepository;
import com.backend.server.repositories.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorPatientService {

    private final DoctorPatientRepository doctorPatientRepository;
    private final DoctorRepository doctorRepository;

    public Page<DoctorPatient> searchPatientsByDoctor(Integer doctorId, String search, int page, int size) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return doctorPatientRepository
                .findByDoctorAndPatient_FirstNameContainingIgnoreCaseOrDoctorAndPatient_LastNameContainingIgnoreCase(
                        doctor, search, doctor, search, PageRequest.of(page, size));
    }

    public void deleteDoctorPatient(Long id) {
        doctorPatientRepository.deleteById(id);
    }
}
