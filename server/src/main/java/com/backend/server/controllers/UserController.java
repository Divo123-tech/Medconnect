package com.backend.server.controllers;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.DTO.ToDTOMaps;
import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;
import com.backend.server.entities.User;
import com.backend.server.services.DoctorService;
import com.backend.server.services.PatientService;
import com.backend.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

import static com.backend.server.DTO.ToDTOMaps.mapToDoctorDTO;
import static com.backend.server.DTO.ToDTOMaps.mapToPatientDTO;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-profile")
public class UserController {
    private final UserService userService;
    private final PatientService patientService;
    private final DoctorService doctorService;
    @GetMapping
    public ResponseEntity<?> getMyProfile(Authentication auth) {
        User user = (User) auth.getPrincipal(); // this is safe

        if (user.getRole() == User.Role.PATIENT) {
            Patient patient = patientService.getPatientById(user.getId());

            return ResponseEntity.ok(mapToPatientDTO(patient));
        }
        else if(user.getRole() == User.Role.DOCTOR){
            Doctor doctor = doctorService.getDoctorById(user.getId());
            return ResponseEntity.ok(mapToDoctorDTO(doctor));
        }

        return ResponseEntity.ok(new UserDTO.UserGetProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @PatchMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //use Principal here instead of Authentication object because its more lightweight
    public ResponseEntity<?> updateUser( Principal principal,
                                         @RequestPart("user") UserDTO.UserUpdateProfileDTO request,
                                         @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws IOException {
        User updatedUser = userService.updateUser(principal.getName(), request, profilePicture);
        if (updatedUser instanceof Patient patient) {
            return ResponseEntity.ok(mapToPatientDTO(patient));
        }
        else if (updatedUser instanceof Doctor doctor){
            return ResponseEntity.ok(mapToDoctorDTO(doctor));
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
    private ReviewDTO mapToReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .doctorId(review.getDoctor().getId())
                .patientId(review.getPatient().getId())
                .patientFirstName(review.getPatient().getFirstName())
                .patientLastName(review.getPatient().getLastName())
                .patientEmail(review.getPatient().getEmail())
                .patientProfilePicture(review.getPatient().getProfilePictureUrl())
                .createdAt(review.getCreatedAt())
                .rating(review.getRating())
                .title(review.getTitle())
                .body(review.getBody())
                .build();
    }

}
