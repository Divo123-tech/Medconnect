package com.backend.server.controllers;


import com.backend.server.auth.AuthenticationResponse;
import com.backend.server.auth.DoctorRegisterRequest;
import com.backend.server.auth.PatientRegisterRequest;
import com.backend.server.entities.Doctor;
import com.backend.server.services.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;

    @PostMapping("/register-doctor")
    public ResponseEntity<Doctor> register(
            @RequestBody DoctorRegisterRequest request
    ){
        return ResponseEntity.ok(doctorService.registerDoctor(request));
    }
}
