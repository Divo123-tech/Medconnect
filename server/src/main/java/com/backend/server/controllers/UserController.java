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
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-profile")
public class UserController {
    private final UserService userService;
    private final PatientService patientService;
    @GetMapping
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        User user = (User) auth.getPrincipal(); // this is safe

        if (user.getRole() == User.Role.PATIENT) {
            Patient patient = patientService.getPatientById(user.getId());

            return ResponseEntity.ok(new UserDTO.PatientGetProfileDTO(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getRole(),
                    patient.getPhoneNumber(),
                    patient.getHeight(),
                    patient.getWeight(),
                    patient.getBloodType(),
                    patient.getConditions()
            ));
        }

        return ResponseEntity.ok(new UserDTO.UserGetProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @PatchMapping
    //use Principal here instead of Authentication object because its more lightweight
    public ResponseEntity<?> updateUser(@RequestBody UserDTO.UserUpdateProfileDTO request, Principal principal) {
        User updatedUser = userService.updateUser(principal.getName(), request);
        if (updatedUser instanceof Patient patient) {
            return ResponseEntity.ok(new UserDTO.PatientGetProfileDTO(
                    updatedUser.getId(),
                    updatedUser.getFirstName(),
                    updatedUser.getLastName(),
                    updatedUser.getEmail(),
                    updatedUser.getRole(),
                    patient.getPhoneNumber(),
                    patient.getHeight(),
                    patient.getWeight(),
                    patient.getBloodType(),
                    patient.getConditions()
            ));
        }
        return ResponseEntity.ok(new UserDTO.UserGetProfileDTO(
                updatedUser.getId(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getEmail(),
                updatedUser.getRole()
        ));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUser(Principal principal) {
        boolean deleted = userService.deleteUser(principal.getName());

        if (deleted) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User with email " + principal.getName() + " not found.");
        }
    }


}
