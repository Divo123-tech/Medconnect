package com.backend.server.controllers;

import com.backend.server.DTO.MedicalDocumentDTO;
import com.backend.server.entities.MedicalDocument;
import com.backend.server.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class MedicalDocumentController {

    private final FileService documentService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('DOCTOR') or #patientId == authentication.principal.id")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("patientId") Integer patientId
    ) {
        try {
            MedicalDocument doc = documentService.uploadDocument(file, patientId);

            return ResponseEntity.ok(mapToDTO(doc));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed");
        }
    }

    @GetMapping("/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or #patientId == authentication.principal.id")
    public ResponseEntity<List<MedicalDocumentDTO>> getDocuments(@PathVariable Integer patientId) {
        List<MedicalDocument> documents = documentService.getDocumentsByPatientId(patientId);
        List<MedicalDocumentDTO> dtoList = documents.stream()
                .map(this::mapToDTO)
                .toList();

        return ResponseEntity.ok(dtoList);
    }
    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasRole('DOCTOR') or @authUtil.isOwnerOfDocument(authentication, #documentId)")
    public ResponseEntity<?> deleteDocument(@PathVariable Integer documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok("Document deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed");
        }
    }
    private MedicalDocumentDTO mapToDTO(MedicalDocument doc) {
        String fileName = doc.getFileName();
        String originalFileName = fileName.contains("_")
                ? fileName.substring(fileName.indexOf("_") + 1)
                : fileName;

        return new MedicalDocumentDTO(
                doc.getId(),
                originalFileName,           // clean name shown to users
                doc.getFileUrl(),
                doc.getUploadedAt()
        );
    }

}

