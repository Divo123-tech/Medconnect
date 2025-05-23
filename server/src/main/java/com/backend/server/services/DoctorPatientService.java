package com.backend.server.services;

import com.backend.server.entities.Doctor;
import com.backend.server.entities.DoctorPatient;
import com.backend.server.entities.Patient;
import com.backend.server.repositories.DoctorPatientRepository;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DoctorPatientService {

    private final DoctorPatientRepository doctorPatientRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public void addDoctorPatient(Integer doctorId, Integer patientId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DoctorPatient doctorPatient = new DoctorPatient();
        doctorPatient.setDoctor(doctor);
        doctorPatient.setPatient(patient);

        doctorPatientRepository.save(doctorPatient);
    }

    public Page<DoctorPatient> searchPatientsByDoctor(Integer doctorId, String search, int page, int size) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return doctorPatientRepository
                .findByDoctorAndPatient_FirstNameContainingIgnoreCaseOrDoctorAndPatient_LastNameContainingIgnoreCase(
                        doctor, search, doctor, search, PageRequest.of(page, size));
    }
    @Transactional
    public void deleteDoctorPatient(Long doctorId, Long patientId) {
        doctorPatientRepository.deleteByDoctor_IdAndPatient_Id(doctorId, patientId);
    }

}
