package com.backend.server.controllers;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.entities.User;
import com.backend.server.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> createReview(@RequestBody ReviewDTO reviewDTO, Authentication auth) {
        try {
            User userRequesting = (User) auth.getPrincipal(); // safe cast
            return ResponseEntity.ok(reviewService.createReview(reviewDTO, userRequesting.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating review: " + e.getMessage());
        }
    }

    @PatchMapping("/{reviewId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewDTO reviewDTO, Authentication auth) {
        try {
            User userRequesting = (User) auth.getPrincipal();
            return ResponseEntity.ok(reviewService.updateReview(reviewId, reviewDTO, userRequesting.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating review: " + e.getMessage());
        }
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, Authentication auth) {
        try {
            User userRequesting = (User) auth.getPrincipal();
            reviewService.deleteReview(reviewId, userRequesting.getId());
            return ResponseEntity.ok("Review deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting review: " + e.getMessage());
        }
    }
}
