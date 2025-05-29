package com.backend.server.services;

import com.backend.server.DTO.AppointmentDTO;
import com.backend.server.entities.Appointment;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.repositories.AppointmentRepository;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AppointmentServiceTest {

    @Mock private AppointmentRepository appointmentRepository;
    @Mock private DoctorRepository doctorRepository;
    @Mock private PatientRepository patientRepository;
    @Mock private DoctorPatientService doctorPatientService;

    @InjectMocks private AppointmentService appointmentService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldReturnDoctorAppointmentTimesByDate() {
        Doctor doctor = new Doctor();
        LocalDate date = LocalDate.now();
        Appointment a1 = Appointment.builder().time(LocalTime.of(10, 0)).build();
        Appointment a2 = Appointment.builder().time(LocalTime.of(11, 0)).build();
        when(appointmentRepository.findByDoctorAndDate(doctor, date)).thenReturn(List.of(a1, a2));

        List<LocalTime> times = appointmentService.getDoctorAppointmentTimesByDate(doctor, date);

        assertThat(times).containsExactly(LocalTime.of(10, 0), LocalTime.of(11, 0));
    }

    @Test
    void shouldReturnTrueWhenAppointmentSlotIsAvailable() {
        Doctor doctor = new Doctor();
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.of(14, 0);

        when(appointmentRepository.findByDoctorAndDateAndTime(doctor, date, time)).thenReturn(Optional.empty());

        assertTrue(appointmentService.isAppointmentAvailable(doctor, date, time));
    }

    @Test
    void shouldReturnFalseWhenAppointmentSlotIsTaken() {
        Doctor doctor = new Doctor();
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.of(14, 0);

        when(appointmentRepository.findByDoctorAndDateAndTime(doctor, date, time)).thenReturn(Optional.of(new Appointment()));

        assertFalse(appointmentService.isAppointmentAvailable(doctor, date, time));
    }

    @Test
    void shouldCreateAppointmentSuccessfully() {
        // Setup mock doctor and patient
        Doctor doctor = Doctor.builder()
                .id(1)
                .firstName("Alice")
                .lastName("Wong")
                .email("alice@example.com")
                .profilePictureUrl("alice.jpg")
                .build();

        Patient patient = Patient.builder()
                .id(2)
                .firstName("Bob")
                .lastName("Smith")
                .email("bob@example.com")
                .profilePictureUrl("bob.jpg")
                .build();

        // Create input DTO
        AppointmentDTO.GetAppointmentDTO inputDto = new AppointmentDTO.GetAppointmentDTO();
        inputDto.setDoctorId(1);
        inputDto.setDate(LocalDate.now());
        inputDto.setTime(LocalTime.NOON);
        inputDto.setReason("Checkup");
        inputDto.setStatus(Appointment.Status.PENDING);

        // Stub doctor/patient lookup
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(patientRepository.findById(2)).thenReturn(Optional.of(patient));

        // Stub save to simulate assigning ID
        when(appointmentRepository.save(any())).thenAnswer(invocation -> {
            Appointment appointment = invocation.getArgument(0);
            appointment.setId(10);
            return appointment;
        });

        // Call service
        AppointmentDTO.GetAppointmentDTO result = appointmentService.createAppointment(inputDto, 2);

        // Verify
        assertThat(result.getId()).isEqualTo(10);
        assertThat(result.getReason()).isEqualTo("Checkup");
        assertThat(result.getDoctorFirstName()).isEqualTo("Alice");
        assertThat(result.getPatientEmail()).isEqualTo("bob@example.com");
    }

    @Test
    void shouldUpdateAppointmentSuccessfully() {
        // Create mock doctor and patient with complete info
        Doctor doctor = Doctor.builder()
                .id(1)
                .firstName("Alice")
                .lastName("Wong")
                .email("alice@example.com")
                .profilePictureUrl("alice.jpg")
                .build();

        Patient patient = Patient.builder()
                .id(2)
                .firstName("Bob")
                .lastName("Smith")
                .email("bob@example.com")
                .profilePictureUrl("bob.jpg")
                .build();

        // Existing appointment before update
        Appointment appointment = Appointment.builder()
                .id(1)
                .doctor(doctor)
                .patient(patient)
                .date(LocalDate.now())
                .time(LocalTime.of(10, 0))
                .reason("Old Reason")
                .status(Appointment.Status.PENDING)
                .build();

        // DTO with updated details
        AppointmentDTO.GetAppointmentDTO dto = new AppointmentDTO.GetAppointmentDTO();
        dto.setDoctorId(1);
        dto.setDate(LocalDate.now().plusDays(1));
        dto.setTime(LocalTime.of(12, 0));
        dto.setReason("New Reason");
        dto.setStatus(Appointment.Status.CONFIRMED);

        // Doctor user doing the update
        User doctorUser = User.builder().id(1).role(User.Role.DOCTOR).build();

        // Mocking
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.save(any())).thenAnswer(invocation -> {
            Appointment updated = invocation.getArgument(0);
            updated.setId(1);
            return updated;
        });

        // Execute
        AppointmentDTO.GetAppointmentDTO result = appointmentService.updateAppointment(1L, dto, doctorUser);

        // Validate
        verify(doctorPatientService).addDoctorPatient(1, 2);
        assertThat(result.getReason()).isEqualTo("New Reason");
        assertThat(result.getStatus()).isEqualTo(Appointment.Status.CONFIRMED);
        assertThat(result.getDate()).isEqualTo(dto.getDate());
        assertThat(result.getTime()).isEqualTo(dto.getTime());
        assertThat(result.getDoctorFirstName()).isEqualTo("Alice");
        assertThat(result.getPatientEmail()).isEqualTo("bob@example.com");
    }


    @Test
    void shouldThrowExceptionWhenAppointmentNotFound() {
        when(appointmentRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> appointmentService.getAppointmentById(1L));
    }

    @Test
    void shouldDeleteAppointment() {
        appointmentService.deleteAppointment(1L);
        verify(appointmentRepository).deleteById(1L);
    }

    @Test
    void shouldReturnAppointmentsForPatientByStatus() {
        Patient patient = Patient.builder()
                .id(1)
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .profilePictureUrl("pic.jpg")
                .build();

        Doctor doctor = Doctor.builder()
                .id(10)
                .firstName("Dr")
                .lastName("Smith")
                .email("drsmith@example.com")
                .profilePictureUrl("docpic.jpg")
                .build();

        Appointment appointment = Appointment.builder()
                .id(100)
                .doctor(doctor)
                .patient(patient)
                .date(LocalDate.of(2025, 6, 1))
                .time(LocalTime.of(14, 0))
                .reason("Routine Checkup")
                .status(Appointment.Status.CONFIRMED)
                .build();

        when(appointmentRepository.findByPatientAndStatus(patient, Appointment.Status.CONFIRMED))
                .thenReturn(List.of(appointment));

        var result = appointmentService.getPatientAppointmentsByStatus(patient, Appointment.Status.CONFIRMED);

        assertThat(result).hasSize(1);
        AppointmentDTO.GetAppointmentDTO dto = result.getFirst();
        assertThat(dto.getDoctorFirstName()).isEqualTo("Dr");
        assertThat(dto.getPatientEmail()).isEqualTo("jane@example.com");
        assertThat(dto.getStatus()).isEqualTo(Appointment.Status.CONFIRMED);
    }

    @Test
    void shouldReturnAppointmentsForDoctorByStatus() {
        Patient patient = Patient.builder()
                .id(2)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .profilePictureUrl("johnpic.jpg")
                .build();

        Doctor doctor = Doctor.builder()
                .id(20)
                .firstName("Alice")
                .lastName("Wong")
                .email("alice@example.com")
                .profilePictureUrl("doc.jpg")
                .build();

        Appointment appointment = Appointment.builder()
                .id(101)
                .doctor(doctor)
                .patient(patient)
                .date(LocalDate.of(2025, 6, 2))
                .time(LocalTime.of(9, 30))
                .reason("Flu Symptoms")
                .status(Appointment.Status.PENDING)
                .build();

        when(appointmentRepository.findByDoctorAndStatus(doctor, Appointment.Status.PENDING))
                .thenReturn(List.of(appointment));

        var result = appointmentService.getDoctorAppointments(doctor, Appointment.Status.PENDING);

        assertThat(result).hasSize(1);
        AppointmentDTO.GetAppointmentDTO dto = result.getFirst();
        assertThat(dto.getPatientFirstName()).isEqualTo("John");
        assertThat(dto.getReason()).isEqualTo("Flu Symptoms");
        assertThat(dto.getDate()).isEqualTo(LocalDate.of(2025, 6, 2));
    }

}
