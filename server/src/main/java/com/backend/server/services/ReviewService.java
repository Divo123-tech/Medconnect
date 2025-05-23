package com.backend.server.services;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import com.backend.server.repositories.ReviewRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public ReviewDTO createReview(ReviewDTO dto, Integer patientId) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        Review review = Review.builder()
                .doctor(doctor)
                .patient(patient)
                .createdAt(LocalDateTime.now())
                .rating(dto.getRating())
                .title(dto.getTitle())
                .body(dto.getBody())
                .build();

        Review saved = reviewRepository.save(review);
        return mapToDTO(saved);
    }

    public ReviewDTO updateReview(Long reviewId, ReviewDTO dto, Integer patientId) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        if (Objects.equals(existing.getPatient().getId(), patientId)){
            throw new EntityNotFoundException("Only the author can edit their reviews!");
        }
        if(dto.getRating() != null){
            existing.setRating(dto.getRating());
        }
        if(dto.getTitle() != null){
            existing.setTitle(dto.getTitle());
        }
        if(dto.getBody() != null){
            existing.setBody(dto.getBody());
        }

        // Keep date as original or update to now based on your preference

        Review updated = reviewRepository.save(existing);
        return mapToDTO(updated);
    }

    public void deleteReview(Long reviewId, Integer patientId) {
        Review existing = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));
        if (Objects.equals(existing.getPatient().getId(), patientId)){
            throw new EntityNotFoundException("Only the author can edit their reviews!");
        }
        reviewRepository.deleteById(reviewId);
    }

    private ReviewDTO mapToDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .doctorId(review.getDoctor().getId())
                .patientId(review.getPatient().getId())
                .patientFirstName(review.getPatient().getFirstName())
                .patientLastName(review.getPatient().getLastName())
                .patientEmail(review.getPatient().getEmail())
                .patientProfilePicture(review.getPatient().getProfilePictureUrl())
                .createdAt(review.getCreatedAt())
                .rating(review.getRating())
                .title(review.getTitle())
                .body(review.getBody())
                .build();
    }
}
