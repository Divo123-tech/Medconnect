package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.services.PatientService;
import com.backend.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import static com.backend.server.DTO.ToDTOMaps.mapToPatientDTO;


@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {
    private final PatientService patientService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<UserDTO.PatientGetProfileDTO> getPatientById(@PathVariable int id) {
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(mapToPatientDTO(patient));
    }
}

