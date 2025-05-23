package com.backend.server.controllers;

import com.backend.server.DTO.ToDTOMaps;
import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Page<UserDTO.DoctorGetProfileDTO>> getDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String specialization,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "firstName") String sortBy
    ) {
        Page<Doctor> doctorsPage = doctorService.findAllDoctors(name, specialization, page, size, sortBy);

        Page<UserDTO.DoctorGetProfileDTO> dtoPage = doctorsPage.map(ToDTOMaps::mapToDoctorDTO);

        return ResponseEntity.ok(dtoPage);
    }
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO.DoctorGetProfileDTO> getDoctorById(@PathVariable int id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(mapToDoctorDTO(doctor));
    }
}
