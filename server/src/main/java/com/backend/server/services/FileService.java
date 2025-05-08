package com.backend.server.services;

import com.backend.server.entities.MedicalDocument;
import com.backend.server.entities.Patient;
import com.backend.server.repositories.MedicalDocumentRepository;
import com.backend.server.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {
    private final MedicalDocumentRepository documentRepository;
    private final PatientRepository patientRepository; // If needed
    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveProfilePicture(MultipartFile file) throws IOException {
        // Ensure the folder exists
        String uploadDir = "uploads/profile-pictures/";
        Path uploadPath = Paths.get(uploadDir);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID() + (extension != null ? "." + extension : "");

        // Save the file
        Path filepath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);

        // Return the relative URL to be saved in DB
        return "/uploads/profile-pictures/" + filename;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return null;
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }



    public MedicalDocument uploadDocument(MultipartFile file, Integer patientId) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Save file to filesystem or cloud here
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get("uploads/documents/" + fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, file.getBytes());

        MedicalDocument document = MedicalDocument.builder()
                .fileName(fileName)
                .fileUrl("/uploads/documents/" + fileName)
                .uploadedAt(LocalDate.now())
                .patient(patient)
                .build();

        return documentRepository.save(document);
    }

    public List<MedicalDocument> getDocumentsByPatientId(Integer patientId) {
        return documentRepository.findByPatientId(patientId);
    }
    public void deleteDocument(Integer documentId) {
        MedicalDocument doc = documentRepository.findById(Long.valueOf(documentId))
                .orElseThrow(() -> new RuntimeException("Document not found"));

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        File file = new File(uploadPath.toFile(), doc.getFileName());

        if (file.exists()) {
            boolean deleted = file.delete();
            if (!deleted) {
                throw new RuntimeException("Failed to delete file: " + file.getPath());
            }
        }

        documentRepository.deleteById(Long.valueOf(documentId));
    }




}
