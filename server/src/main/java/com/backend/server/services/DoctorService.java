package com.backend.server.services;

import com.backend.server.auth.AuthenticationResponse;
import com.backend.server.auth.DoctorRegisterRequest;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.User;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class DoctorService {
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public Doctor registerDoctor(DoctorRegisterRequest request) {
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

    public Page<Doctor> findAllDoctors(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (search != null && !search.trim().isEmpty()) {
            return doctorRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, pageable);
        } else {
            return doctorRepository.findAll(pageable);
        }
    }

}
