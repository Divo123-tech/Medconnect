package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Patient;
import com.backend.server.services.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO.PatientGetProfileDTO> getPatientById(@PathVariable int id) {
        //when the doctor is added make sure that this is only possible if the person checking is a doctor
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(new UserDTO.PatientGetProfileDTO(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getRole(),
                patient.getPhoneNumber(),
                patient.getHeight(),
                patient.getWeight(),
                patient.getBloodType(),
                patient.getConditions()
        ));
    }
}

