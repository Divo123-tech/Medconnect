package com.backend.server.controllers;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.entities.User;
import com.backend.server.services.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReviewControllerTest {

    private ReviewController reviewController;
    private ReviewService reviewService;
    private Authentication authentication;
    private User mockUser;

    @BeforeEach
    void setUp() {
        reviewService = mock(ReviewService.class);
        reviewController = new ReviewController(reviewService);
        authentication = mock(Authentication.class);
        mockUser = new User();
        mockUser.setId(1);
        when(authentication.getPrincipal()).thenReturn(mockUser);
    }

    @Test
    void createReview_ShouldReturnOk() {
        ReviewDTO dto = new ReviewDTO();
        when(reviewService.createReview(dto, mockUser.getId())).thenReturn(dto);

        ResponseEntity<?> response = reviewController.createReview(dto, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void createReview_ShouldReturnBadRequest_OnIllegalArgument() {
        ReviewDTO dto = new ReviewDTO();
        when(reviewService.createReview(dto, mockUser.getId()))
                .thenThrow(new IllegalArgumentException("Invalid input"));

        ResponseEntity<?> response = reviewController.createReview(dto, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid input", response.getBody());
    }

    @Test
    void createReview_ShouldReturn500_OnException() {
        ReviewDTO dto = new ReviewDTO();
        when(reviewService.createReview(dto, mockUser.getId()))
                .thenThrow(new RuntimeException("Unexpected"));

        ResponseEntity<?> response = reviewController.createReview(dto, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Unexpected"));
    }

    @Test
    void updateReview_ShouldReturnOk() {
        ReviewDTO dto = new ReviewDTO();
        when(reviewService.updateReview(1L, dto, mockUser.getId())).thenReturn(dto);

        ResponseEntity<?> response = reviewController.updateReview(1L, dto, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void deleteReview_ShouldReturnOk() {
        doNothing().when(reviewService).deleteReview(1L, mockUser.getId());

        ResponseEntity<?> response = reviewController.deleteReview(1L, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Review deleted successfully", response.getBody());
    }

    @Test
    void deleteReview_ShouldReturnBadRequest_OnIllegalArgument() {
        doThrow(new IllegalArgumentException("Invalid ID")).when(reviewService).deleteReview(1L, mockUser.getId());

        ResponseEntity<?> response = reviewController.deleteReview(1L, authentication);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Invalid ID", response.getBody());
    }

    @Test
    void deleteReview_ShouldReturn500_OnException() {
        doThrow(new RuntimeException("Unexpected error")).when(reviewService).deleteReview(1L, mockUser.getId());

        ResponseEntity<?> response = reviewController.deleteReview(1L, authentication);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Unexpected error"));
    }
}
