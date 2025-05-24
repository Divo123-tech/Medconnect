package com.backend.server.auth;

import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.PatientRepository;
import com.backend.server.repositories.UserRepository;
import com.backend.server.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        String firstName;
        String lastName;

        if (name != null && !name.isEmpty()) {
            String[] parts = name.split("\\s+");  // splits by any whitespace
            firstName = parts[0]; // first word as first name
            if (parts.length > 1) {
                lastName = parts[parts.length - 1]; // last word as last name
            } else {
                lastName = "";
            }
        } else {
            lastName = "";
            firstName = "";
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            Patient patient = Patient.builder()
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(email)
                    .password(passwordEncoder.encode("Nigger"))
                    .role(User.Role.PATIENT)
                    .build();

            return patientRepository.save(patient);
        });

        var jwtToken = jwtService.generateToken(user);

        // Redirect to frontend with token
        response.sendRedirect("http://localhost:5173/oauth-success?token="+ jwtToken);

    }
}
