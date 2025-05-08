package com.backend.server.DTO;

import java.time.LocalDateTime;

public class MedicalDocumentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private LocalDateTime uploadedAt;
}
