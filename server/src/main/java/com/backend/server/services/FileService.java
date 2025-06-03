package com.backend.server.services;

import com.backend.server.entities.MedicalDocument;
import com.backend.server.entities.Patient;
import com.backend.server.repositories.MedicalDocumentRepository;
import com.backend.server.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.core.sync.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final S3Client s3Client;
    private final MedicalDocumentRepository documentRepository;
    private final PatientRepository patientRepository;

    private final String bucketName = "medconnect-server-static";



    // Inside your FileService class
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    public String saveProfilePicture(MultipartFile file) throws IOException {
        String fileName = "profile-pictures/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(fileName)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );
            return fileName;
        } catch (S3Exception e) {
            logger.error("S3 error while uploading profile picture: {}", e.awsErrorDetails().errorMessage(), e);
            throw new IOException("Failed to upload profile picture to S3", e);
        } catch (SdkClientException e) {
            logger.error("AWS SDK client error while uploading profile picture", e);
            throw new IOException("AWS SDK error while uploading profile picture", e);
        } catch (IOException e) {
            logger.error("IO error while reading profile picture file", e);
            throw e; // Already IOException, no need to wrap
        } catch (Exception e) {
            logger.error("Unexpected error while uploading profile picture", e);
            throw new IOException("Unexpected error during upload", e);
        }
    }


    public MedicalDocument uploadDocument(MultipartFile file, Integer patientId) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        String fileName = "documents/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        s3Client.putObject(PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(fileName)
                        .contentType(file.getContentType())
                        .build(),
                RequestBody.fromBytes(file.getBytes()));

        MedicalDocument document = MedicalDocument.builder()
                .fileName(fileName)
                .fileUrl(fileName) // or build pre-signed URL if private
                .uploadedAt(LocalDate.now())
                .patient(patient)
                .build();

        return documentRepository.save(document);
    }

    public void deleteDocument(Integer documentId) {
        MedicalDocument doc = documentRepository.findById(Long.valueOf(documentId))
                .orElseThrow(() -> new RuntimeException("Document not found"));

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(doc.getFileName())
                .build());

        documentRepository.deleteById(Long.valueOf(documentId));
    }

    public List<MedicalDocument> getDocumentsByPatientId(Integer patientId) {
        return documentRepository.findByPatientId(patientId);
    }
}
