package com.backend.server.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {

    private Long id;

    private Integer doctorId;
    private Integer patientId;

    private String doctorFirstName;
    private String doctorLastName;

    private String patientFirstName;
    private String patientLastName;

    private LocalDate date;
    private LocalTime time;

    private String reason;
}
