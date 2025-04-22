package com.backend.server.services;

import com.backend.server.DTO.UserDTO;
import com.backend.server.entities.User;
import com.backend.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateUser(String email, UserDTO.UserUpdateProfileDTO request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getPassword() != null) {
            user.setPassword(request.getPassword());
        }

        return userRepository.save(user);
    }

    @Transactional
    public Boolean deleteUser(String email) {
        //deleteByEmail returns a concise numeric value as a success/fail flag
        long deletedCount = userRepository.deleteByEmail(email);
        //if deletedCount is greater than 0 then an account was deleted
        return deletedCount > 0;
    }


}
