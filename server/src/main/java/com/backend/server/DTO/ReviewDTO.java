package com.backend.server.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {

    private Long id;
    private Integer doctorId;
    private Integer patientId;

    private Integer rating;         // 1 to 5
    private String title;
    private String body;
    private LocalDateTime createdAt;
    private String patientFirstName;
    private String patientLastName;
    private String patientEmail;
    private String patientProfilePicture;
    }
