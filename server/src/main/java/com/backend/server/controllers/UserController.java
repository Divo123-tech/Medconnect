package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.User;
import com.backend.server.services.AuthService;
import com.backend.server.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-profile")
public class UserController {
    private final AuthService authService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<UserDTO.UserGetProfileDTO> getMyProfile(Authentication auth){
        User user = (User) auth.getPrincipal(); // if your User implements UserDetails
        UserDTO.UserGetProfileDTO userDto = new UserDTO.UserGetProfileDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
        return ResponseEntity.ok(userDto);
    }

}
