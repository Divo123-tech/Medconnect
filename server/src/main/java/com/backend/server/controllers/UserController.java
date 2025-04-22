package com.backend.server.controllers;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.User;
import com.backend.server.services.AuthService;
import com.backend.server.services.JwtService;
import com.backend.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/my-profile")
public class UserController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserDTO.UserGetProfileDTO> getMyProfile(Authentication auth){
        User user = (User) auth.getPrincipal(); // if your User implements UserDetails
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
    public ResponseEntity<UserDTO.UserGetProfileDTO> updateUser(@RequestBody UserDTO.UserUpdateProfileDTO request, Principal principal) {
        User updatedUser = userService.updateUser(principal.getName(), request);
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
