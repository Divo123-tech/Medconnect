package com.backend.server.services;

import com.backend.server.DTO.AppointmentDTO;
import com.backend.server.entities.Appointment;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.AppointmentRepository;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    /**
     * Get doctor's appointments for a specific date
     */
    public Page<AppointmentDTO.GetAppointmentDTO> getDoctorAppointmentsByDate(Doctor doctor, LocalDate date, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return appointmentRepository.findByDoctorAndDate(doctor, date, pageable)
                .map(this::mapToDTO);
    }

    /**
     * Check for appointment conflicts
     */
    public boolean isAppointmentAvailable(Doctor doctor, LocalDate date, LocalTime time) {
        Optional<Appointment> existingAppointment =
                appointmentRepository.findByDoctorAndDateAndTime(doctor, date, time);
        return existingAppointment.isEmpty(); // If empty, the slot is available
    }

    /**
     * Get all appointments for a patient with the specified status
     */
    public Page<AppointmentDTO.GetAppointmentDTO> getPatientAppointmentsByStatus(Patient patient, Appointment.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return appointmentRepository.findByPatientAndStatus(patient, status, pageable)
                .map(this::mapToDTO);
    }
    /**
     * Get all appointments for a doctor
     */
    public Page<AppointmentDTO.GetAppointmentDTO> getDoctorAppointments(Doctor doctor,  Appointment.Status status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return appointmentRepository.findByDoctorAndStatus(doctor, status, pageable)
                .map(this::mapToDTO);

    }


    public AppointmentDTO.GetAppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return mapToDTO(appointment);
    }

    public AppointmentDTO.GetAppointmentDTO createAppointment(AppointmentDTO.GetAppointmentDTO dto, int patientId) {
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .date(dto.getDate())
                .time(dto.getTime())
                .reason(dto.getReason())
                .status(Appointment.Status.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapToDTO(saved);
    }

    public AppointmentDTO.GetAppointmentDTO updateAppointment(Long id, AppointmentDTO.GetAppointmentDTO dto, User user) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
//        if(user.getRole() == User.Role.DOCTOR){
//
//
//        }
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        if (doctor != null) {
            appointment.setDoctor(doctor);
        }

        if (dto.getDate() != null) {
            appointment.setDate(dto.getDate());
        }

        if (dto.getTime() != null) {
            appointment.setTime(dto.getTime());
        }

        if (dto.getReason() != null && !dto.getReason().isEmpty()) {
            appointment.setReason(dto.getReason());
        }

        if (dto.getStatus() != null) {
            if(user.getRole() == User.Role.DOCTOR){
                appointment.setStatus(dto.getStatus());
            }
            else if(dto.getStatus() == Appointment.Status.CANCELLED){
                appointment.setStatus(dto.getStatus());
            }
        }
        Appointment updated = appointmentRepository.save(appointment);
        return mapToDTO(updated);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    private AppointmentDTO.GetAppointmentDTO mapToDTO(Appointment appointment) {
        return new AppointmentDTO.GetAppointmentDTO(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getPatient().getId(),
                appointment.getDoctor().getFirstName(),
                appointment.getDoctor().getLastName(),
                appointment.getDoctor().getProfilePictureUrl(),
                appointment.getPatient().getFirstName(),
                appointment.getPatient().getLastName(),
                appointment.getPatient().getProfilePictureUrl(),
                appointment.getDate(),  
                appointment.getTime(),
                appointment.getReason(),
                appointment.getStatus()
        );

    }
}
