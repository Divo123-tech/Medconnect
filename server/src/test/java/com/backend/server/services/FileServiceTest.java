package com.backend.server.services;

import com.backend.server.entities.MedicalDocument;
import com.backend.server.entities.Patient;
import com.backend.server.repositories.MedicalDocumentRepository;
import com.backend.server.repositories.PatientRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class FileServiceTest {

    @Mock
    private MedicalDocumentRepository documentRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private FileService fileService;

    private AutoCloseable closeable;

    @TempDir
    Path tempDir;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
        System.setProperty("file.upload-dir", tempDir.toString());
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

//    @Test
//    void saveProfilePicture_shouldSaveFileAndReturnPath() throws IOException {
//        MockMultipartFile file = new MockMultipartFile("file", "test.jpg", "image/jpeg", "test content".getBytes());
//
//        String path = fileService.saveProfilePicture(file);
//
//        Path expectedPath = tempDir.resolve("profile-pictures");
//        assertThat(Files.exists(expectedPath)).isTrue();
//
//        Path savedFile = expectedPath.resolve(path.substring(path.lastIndexOf("/") + 1));
//        assertThat(Files.exists(savedFile)).isTrue();
//    }

    @Test
    void uploadDocument_shouldSaveDocumentAndReturnEntity() throws IOException {
        Patient patient = new Patient();
        patient.setId(1);

        MockMultipartFile file = new MockMultipartFile("file", "report.pdf", "application/pdf", "PDF content".getBytes());

        when(patientRepository.findById(1)).thenReturn(Optional.of(patient));
        when(documentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        MedicalDocument saved = fileService.uploadDocument(file, 1);

        assertThat(saved.getFileName()).contains("report.pdf");
        assertThat(saved.getFileUrl()).contains("/uploads/documents/");
        assertThat(saved.getPatient()).isEqualTo(patient);
        assertThat(saved.getUploadedAt()).isEqualTo(LocalDate.now());
    }

    @Test
    void getDocumentsByPatientId_shouldReturnList() {
        List<MedicalDocument> documents = List.of(new MedicalDocument(), new MedicalDocument());

        when(documentRepository.findByPatientId(42)).thenReturn(documents);

        List<MedicalDocument> result = fileService.getDocumentsByPatientId(42);
        assertThat(result).hasSize(2);
    }


    @Test
    void deleteDocument_shouldThrowWhenNotFound() {
        when(documentRepository.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> fileService.deleteDocument(999));
        assertThat(ex.getMessage()).isEqualTo("Document not found");
    }
}
