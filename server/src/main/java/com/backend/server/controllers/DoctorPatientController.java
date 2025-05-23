package com.backend.server.controllers;

import com.backend.server.entities.DoctorPatient;
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
    public ResponseEntity<Page<DoctorPatient>> searchPatientsByDoctor(
            @PathVariable Integer doctorId,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                doctorPatientService.searchPatientsByDoctor(doctorId, search, page, size)
        );
    }
    @PreAuthorize("hasRole('DOCTOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        doctorPatientService.deleteDoctorPatient(id);
        return ResponseEntity.ok("Assignment deleted successfully");
    }
}
