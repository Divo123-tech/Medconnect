package com.backend.server.services;

import com.backend.server.auth.AuthenticationResponse;
import com.backend.server.auth.DoctorRegisterRequest;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.print.Doc;


@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Doctor registerDoctor(DoctorRegisterRequest.DoctorInfo request) {
        Doctor doctor = Doctor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .bio(request.getBio())
                .education(request.getEducation())
                .specialization(request.getSpecialization())
                .startedPracticingAt(request.getStartedPracticingAt())
                .role(User.Role.DOCTOR)
                .build();

        doctorRepository.save(doctor);
        return doctor;
    }

    public Page<Doctor> findAllDoctors(String name, String specialization, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());

        if (specialization != null && !specialization.isBlank()) {
            // First filter by specialization
            if (name != null && !name.isBlank()) {
                // Filter by specialization AND THEN name
                return doctorRepository.findBySpecializationAndName(specialization, name, pageable);
            } else {
                // Only specialization filter
                return doctorRepository.findBySpecializationContainingIgnoreCase(specialization, pageable);
            }
        } else {
            if (name != null && !name.isBlank()) {
                // No specialization, only name search
                return doctorRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name, pageable);
            } else {
                // No filters at all
                return doctorRepository.findAll(pageable);
            }
        }
    }


    public Doctor getDoctorById(int id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Doctor with id " + id + " not found"));
    }

}
