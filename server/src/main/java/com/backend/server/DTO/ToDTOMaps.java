package com.backend.server.DTO;

import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;

public class ToDTOMaps {
    public static UserDTO.PatientGetProfileDTO mapToPatientDTO(Patient patient){
        return new UserDTO.PatientGetProfileDTO(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getRole(),
                patient.getPhoneNumber(),
                patient.getHeight(),
                patient.getWeight(),
                patient.getBloodType(),
                patient.getConditions(),
                patient.getProfilePictureUrl(),
                patient.getMedicalDocuments(),
                patient.getDateOfBirth(),
                patient.getSex()
        );
    }
    public static UserDTO.DoctorGetProfileDTO mapToDoctorDTO(Doctor doctor){
        return new UserDTO.DoctorGetProfileDTO(
                doctor.getId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getRole(),
                doctor.getSpecialization(),
                doctor.getStartedPracticingAt(),
                doctor.getEducation(),
                doctor.getBio(),
                doctor.getProfilePictureUrl(),
                doctor.getReviews().stream().map(ToDTOMaps::mapToReviewDTO).toList(),
                doctor.getDateOfBirth(),
                doctor.getSex()

        );
    }
    public static ReviewDTO mapToReviewDTO(Review review) {
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
