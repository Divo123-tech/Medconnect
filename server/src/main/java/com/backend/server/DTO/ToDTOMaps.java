package com.backend.server.DTO;

import com.backend.server.config.S3Properties;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.MedicalDocument;
import com.backend.server.entities.Patient;
import com.backend.server.entities.Review;
import org.springframework.beans.factory.annotation.Value;

public class ToDTOMaps {
    public static String bucketUrl = "https://medconnect-server-static.s3.ap-southeast-1.amazonaws.com";

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
                bucketUrl + "/" + patient.getProfilePictureUrl(),
                patient.getMedicalDocuments().stream().map(ToDTOMaps::mapToMedDocDTO).toList(),
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
                bucketUrl + "/" + doctor.getProfilePictureUrl(),
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
                .patientProfilePicture(bucketUrl + "/" + review.getPatient().getProfilePictureUrl())
                .createdAt(review.getCreatedAt())
                .rating(review.getRating())
                .title(review.getTitle())
                .body(review.getBody())
                .build();
    }

    public static MedicalDocumentDTO mapToMedDocDTO(MedicalDocument doc) {
        String fileName = doc.getFileName();
        String originalFileName = fileName.contains("_")
                ? fileName.substring(fileName.indexOf("_") + 1)
                : fileName;

        return new MedicalDocumentDTO(
                doc.getId(),
                originalFileName,
                bucketUrl + "/" + doc.getFileUrl(),
                doc.getUploadedAt()
        );
    }
}
