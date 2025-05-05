package com.backend.server.DTO;

import com.backend.server.entities.Appointment;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;


public class AppointmentDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GetAppointmentDTO {
        private Integer id;

        private Integer doctorId;
        private Integer patientId;
        private String doctorFirstName;
        private String doctorLastName;
        private String doctorProfilePicture;
        private String patientFirstName;
        private String patientLastName;
        private String patientProfilePicture;

        private LocalDate date;
        private LocalTime time;

        private String reason;

        private Appointment.Status status;
    }
}
