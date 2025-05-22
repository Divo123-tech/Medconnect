package com.backend.server.controllers;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.entities.Review;
import com.backend.server.entities.User;
import com.backend.server.services.ReviewService;
import lombok.RequiredArgsConstructor;
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
        User userRequesting = (User) auth.getPrincipal(); // this is safe
        return ResponseEntity.ok(reviewService.createReview(reviewDTO, userRequesting.getId()));
    }

    @PatchMapping("/{reviewId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @RequestBody ReviewDTO reviewDTO, Authentication auth) {
        User userRequesting = (User) auth.getPrincipal(); // this is safe
        return ResponseEntity.ok(reviewService.updateReview(reviewId, reviewDTO, userRequesting.getId()));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, Authentication auth) {
        User userRequesting = (User) auth.getPrincipal(); // this is safe) {
        reviewService.deleteReview(reviewId, userRequesting.getId());
        return ResponseEntity.ok("Review deleted successfully");
    }
}
