package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.DoctorPatient;
import com.backend.server.entities.Patient;
import com.backend.server.services.DoctorPatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctor-patients")
@RequiredArgsConstructor
public class DoctorPatientController {

    private final DoctorPatientService doctorPatientService;

    @GetMapping("/{doctorId}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Page<UserDTO.PatientGetProfileDTO>> searchPatientsByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<DoctorPatient> doctorPatients = doctorPatientService.searchPatientsByDoctor(doctorId, search, page, size);

        Page<UserDTO.PatientGetProfileDTO> dtoPage = doctorPatients.map(dp -> mapToPatientDTO(dp.getPatient()));

        return ResponseEntity.ok(dtoPage);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteDoctorPatient(
            @RequestParam Long doctorId,
            @RequestParam Long patientId
    ) {
        doctorPatientService.deleteDoctorPatient(doctorId, patientId);
        return ResponseEntity.ok("Doctor-Patient relationship deleted successfully.");
    }
    private UserDTO.PatientGetProfileDTO mapToPatientDTO(Patient patient) {
        return new UserDTO.PatientGetProfileDTO(
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
                patient.getProfilePictureUrl(),
                patient.getMedicalDocuments()
        );
    }

}
