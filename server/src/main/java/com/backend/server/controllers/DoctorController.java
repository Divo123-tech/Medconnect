package com.backend.server.controllers;

import com.backend.server.DTO.ToDTOMaps;
import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.backend.server.DTO.ToDTOMaps.mapToDoctorDTO;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<?> getDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String specialization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy
    ) {
        try {
            Page<Doctor> doctorsPage = doctorService.findAllDoctors(name, specialization, page, size, sortBy);
            Page<UserDTO.DoctorGetProfileDTO> dtoPage = doctorsPage.map(ToDTOMaps::mapToDoctorDTO);
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching doctors: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable int id) {
        try {
            Doctor doctor = doctorService.getDoctorById(id);
            if (doctor == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Doctor not found");
            }
            return ResponseEntity.ok(mapToDoctorDTO(doctor));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching the doctor: " + e.getMessage());
        }
    }
}
