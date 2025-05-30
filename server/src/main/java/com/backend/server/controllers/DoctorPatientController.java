package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.DoctorPatient;
import com.backend.server.services.DoctorPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static com.backend.server.DTO.ToDTOMaps.mapToPatientDTO;

@RestController
@RequestMapping("/api/v1/doctor-patients")
@RequiredArgsConstructor
public class DoctorPatientController {

    private final DoctorPatientService doctorPatientService;

    @GetMapping("/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> searchPatientsByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Page<DoctorPatient> doctorPatients = doctorPatientService.searchPatientsByDoctor(doctorId, search, page, size);
            Page<UserDTO.PatientGetProfileDTO> dtoPage = doctorPatients.map(dp -> mapToPatientDTO(dp.getPatient()));
            return ResponseEntity.ok(dtoPage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve doctor-patient list: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> deleteDoctorPatient(
            @RequestParam Long doctorId,
            @RequestParam Long patientId
    ) {
        try {
            doctorPatientService.deleteDoctorPatient(doctorId, patientId);
            return ResponseEntity.ok("Doctor-Patient relationship deleted successfully.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Relationship not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete relationship: " + e.getMessage());
        }
    }
}
