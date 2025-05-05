package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<Page<UserDTO.DoctorGetProfileDTO>> getDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String specialization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy
    ) {
        Page<Doctor> doctorsPage = doctorService.findAllDoctors(name, specialization, page, size, sortBy);

        Page<UserDTO.DoctorGetProfileDTO> dtoPage = doctorsPage.map(doctor -> new UserDTO.DoctorGetProfileDTO(
                doctor.getId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getRole(),
                doctor.getSpecialization(),
                doctor.getStartedPracticingAt(),
                doctor.getEducation(),
                doctor.getBio(),
                doctor.getProfilePictureUrl()
        ));

        return ResponseEntity.ok(dtoPage);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO.DoctorGetProfileDTO> getDoctorById(@PathVariable int id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(new UserDTO.DoctorGetProfileDTO(
                doctor.getId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getRole(),
                doctor.getSpecialization(),
                doctor.getStartedPracticingAt(),
                doctor.getEducation(),
                doctor.getBio(),
                doctor.getProfilePictureUrl()
        ));
    }
}
