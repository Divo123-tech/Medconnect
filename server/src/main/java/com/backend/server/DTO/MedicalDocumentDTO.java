package com.backend.server.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalDocumentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private LocalDate uploadedAt;
}
