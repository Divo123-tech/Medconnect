package com.backend.server.controllers;

import com.backend.server.DTO.MedicalDocumentDTO;
import com.backend.server.DTO.ToDTOMaps;
import com.backend.server.entities.MedicalDocument;
import com.backend.server.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import static com.backend.server.DTO.ToDTOMaps.mapToMedDocDTO;

import java.io.FileNotFoundException;
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
            return ResponseEntity.ok(mapToMedDocDTO(doc));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/{patientId}")
    @PreAuthorize("hasRole('DOCTOR') or #patientId == authentication.principal.id")
    public ResponseEntity<?> getDocuments(@PathVariable Integer patientId) {
        try {
            List<MedicalDocument> documents = documentService.getDocumentsByPatientId(patientId);
            List<MedicalDocumentDTO> dtoList = documents.stream()
                    .map(ToDTOMaps::mapToMedDocDTO)
                    .toList();
            return ResponseEntity.ok(dtoList);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch documents: " + e.getMessage());
        }
    }

    @DeleteMapping("/{documentId}")
    @PreAuthorize("hasRole('DOCTOR') or @authUtil.isOwnerOfDocument(authentication, #documentId)")
    public ResponseEntity<?> deleteDocument(@PathVariable Integer documentId) {
        try {
            documentService.deleteDocument(documentId);
            return ResponseEntity.ok("Document deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed: " + e.getMessage());
        }
    }

}
