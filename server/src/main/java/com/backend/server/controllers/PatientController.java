package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.services.PatientService;
import com.backend.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable int id, Authentication auth) {
        User currentUser = userService.getUserById(id);
        User userRequesting = (User) auth.getPrincipal(); // this is safe
        // Ensure only doctors can access patient profiles
        if (userRequesting.getRole() != User.Role.DOCTOR && userRequesting.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied. Only doctors can view patient profiles.");
        }

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
                patient.getConditions(),
                patient.getProfilePictureUrl()
        ));
    }
}

