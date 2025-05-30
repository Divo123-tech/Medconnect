package com.backend.server.controllers;

import com.backend.server.DTO.MedicalDocumentDTO;
import com.backend.server.entities.MedicalDocument;
import com.backend.server.services.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class MedicalDocumentControllerTest {

    @Mock
    private FileService fileService;

    @InjectMocks
    private MedicalDocumentController documentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void uploadDocument_ShouldReturnOk() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Test content".getBytes());
        MedicalDocument mockDoc = new MedicalDocument(1L, "doc_test.txt", "url.com/doc", LocalDate.now(), null);

        when(fileService.uploadDocument(file, 1)).thenReturn(mockDoc);

        ResponseEntity<?> response = documentController.uploadDocument(file, 1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(MedicalDocumentDTO.class, response.getBody());
    }

    @Test
    void uploadDocument_ShouldReturnInternalServerError() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "test.txt", "text/plain", "Test content".getBytes());

        when(fileService.uploadDocument(file, 1)).thenThrow(new RuntimeException("Upload failed"));

        ResponseEntity<?> response = documentController.uploadDocument(file, 1);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void getDocuments_ShouldReturnOk() {
        MedicalDocument mockDoc = new MedicalDocument(1L, "doc_test.txt", "url.com/doc", LocalDate.now(), null);

        when(fileService.getDocumentsByPatientId(1)).thenReturn(List.of(mockDoc));

        ResponseEntity<?> response = documentController.getDocuments(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(List.class, response.getBody());
    }

    @Test
    void getDocuments_ShouldReturnInternalServerError() {
        when(fileService.getDocumentsByPatientId(1)).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = documentController.getDocuments(1);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void deleteDocument_ShouldReturnOk() throws Exception {
        doNothing().when(fileService).deleteDocument(1);

        ResponseEntity<?> response = documentController.deleteDocument(1);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Document deleted successfully", response.getBody());
    }



    @Test
    void deleteDocument_ShouldReturnInternalServerError() throws Exception {
        doThrow(new RuntimeException("Unexpected error")).when(fileService).deleteDocument(1);

        ResponseEntity<?> response = documentController.deleteDocument(1);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(Objects.requireNonNull(response.getBody()).toString().contains("Deletion failed"));
    }
}
