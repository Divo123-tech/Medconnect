package com.backend.server.services;

import com.backend.server.entities.Patient;
import com.backend.server.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public Patient getPatientById(int id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Patient with id " + id + " not found"));
    }
}
