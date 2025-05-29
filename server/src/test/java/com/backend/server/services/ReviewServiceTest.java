package com.backend.server.services;

import com.backend.server.DTO.ReviewDTO;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import com.backend.server.repositories.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldCreateReviewSuccessfully() {
        Doctor doctor = Doctor.builder().id(1).build();
        Patient patient = Patient.builder()
                .id(2)
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .profilePictureUrl("jane.jpg")
                .build();

        ReviewDTO dto = ReviewDTO.builder()
                .doctorId(1)
                .rating(4)
                .title("Great Experience")
                .body("Very professional and helpful.")
                .build();

        Review savedReview = Review.builder()
                .id(1L)
                .doctor(doctor)
                .patient(patient)
                .createdAt(LocalDateTime.now())
                .rating(4)
                .title("Great Experience")
                .body("Very professional and helpful.")
                .build();

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(patientRepository.findById(2)).thenReturn(Optional.of(patient));
        when(reviewRepository.save(any())).thenReturn(savedReview);

        ReviewDTO result = reviewService.createReview(dto, 2);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getDoctorId()).isEqualTo(1);
        assertThat(result.getPatientId()).isEqualTo(2);
        assertThat(result.getRating()).isEqualTo(4);
        assertThat(result.getTitle()).isEqualTo("Great Experience");
        assertThat(result.getBody()).isEqualTo("Very professional and helpful.");
        assertThat(result.getPatientEmail()).isEqualTo("jane@example.com");
    }

    @Test
    void shouldUpdateReviewSuccessfully() {
        Patient patient = Patient.builder()
                .id(2)
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .profilePictureUrl("jane.jpg")
                .build();

        Doctor doctor = Doctor.builder().id(1).build();

        Review existing = Review.builder()
                .id(1L)
                .doctor(doctor)
                .patient(patient)
                .createdAt(LocalDateTime.now())
                .rating(3)
                .title("Okay")
                .body("It was fine.")
                .build();

        ReviewDTO updateDto = ReviewDTO.builder()
                .rating(5)
                .title("Excellent!")
                .body("Amazing doctor, highly recommend.")
                .build();

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(reviewRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        ReviewDTO result = reviewService.updateReview(1L, updateDto, 2);

        assertThat(result.getRating()).isEqualTo(5);
        assertThat(result.getTitle()).isEqualTo("Excellent!");
        assertThat(result.getBody()).isEqualTo("Amazing doctor, highly recommend.");
        assertThat(result.getPatientFirstName()).isEqualTo("Jane");
    }

    @Test
    void shouldDeleteReviewSuccessfully() {
        Patient patient = Patient.builder().id(2).build();
        Doctor doctor = Doctor.builder().id(1).build();
        Review review = Review.builder()
                .id(1L)
                .doctor(doctor)
                .patient(patient)
                .build();

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));

        reviewService.deleteReview(1L, 2);

        verify(reviewRepository).deleteById(1L);
    }
}
