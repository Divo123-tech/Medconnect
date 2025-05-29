package com.backend.server.controllers;

import com.backend.server.DTO.AppointmentDTO;
import com.backend.server.entities.Appointment;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.Patient;
import com.backend.server.entities.User;
import com.backend.server.services.AppointmentService;
import com.backend.server.services.DoctorService;
import com.backend.server.services.PatientService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AppointmentControllerTest {

    @Mock
    private AppointmentService appointmentService;

    @Mock
    private DoctorService doctorService;

    @Mock
    private PatientService patientService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AppointmentController appointmentController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private Doctor testDoctor;
    private Patient testPatient;
    private User testUser;
    private AppointmentDTO.GetAppointmentDTO testAppointmentDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(appointmentController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        // Initialize test data
        testDoctor = new Doctor();
        testDoctor.setId(1);

        testPatient = new Patient();
        testPatient.setId(1);

        testUser = new User();
        testUser.setId(1);

        testAppointmentDTO = new AppointmentDTO.GetAppointmentDTO();
        testAppointmentDTO.setId(1);
        testAppointmentDTO.setDoctorId(1);
        testAppointmentDTO.setDate(LocalDate.of(2024, 6, 15));
        testAppointmentDTO.setTime(LocalTime.of(10, 0));
    }

    @Test
    void getDoctorAppointmentsByDate_ShouldReturnAppointmentTimes() throws Exception {
        // Given
        int doctorId = 1;
        LocalDate date = LocalDate.of(2024, 6, 15);
        List<LocalTime> expectedTimes = Arrays.asList(
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                LocalTime.of(11, 0)
        );

        when(doctorService.getDoctorById(doctorId)).thenReturn(testDoctor);
        when(appointmentService.getDoctorAppointmentTimesByDate(testDoctor, date))
                .thenReturn(expectedTimes);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/doctor/{doctorId}/date/{date}", doctorId, date))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3));

        verify(doctorService).getDoctorById(doctorId);
        verify(appointmentService).getDoctorAppointmentTimesByDate(testDoctor, date);
    }

    @Test
    void getDoctorAppointmentsByDate_WithEmptyResult_ShouldReturnEmptyList() throws Exception {
        // Given
        int doctorId = 1;
        LocalDate date = LocalDate.of(2024, 6, 15);
        List<LocalTime> emptyTimes = Arrays.asList();

        when(doctorService.getDoctorById(doctorId)).thenReturn(testDoctor);
        when(appointmentService.getDoctorAppointmentTimesByDate(testDoctor, date))
                .thenReturn(emptyTimes);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/doctor/{doctorId}/date/{date}", doctorId, date))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void checkAppointmentAvailability_WhenAvailable_ShouldReturnTrue() throws Exception {
        // Given
        int doctorId = 1;
        LocalDate date = LocalDate.of(2024, 6, 15);
        LocalTime time = LocalTime.of(10, 0);

        when(doctorService.getDoctorById(doctorId)).thenReturn(testDoctor);
        when(appointmentService.isAppointmentAvailable(testDoctor, date, time)).thenReturn(true);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/availability")
                        .param("doctorId", String.valueOf(doctorId))
                        .param("date", date.toString())
                        .param("time", time.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("true"));

        verify(doctorService).getDoctorById(doctorId);
        verify(appointmentService).isAppointmentAvailable(testDoctor, date, time);
    }

    @Test
    void checkAppointmentAvailability_WhenNotAvailable_ShouldReturnFalse() throws Exception {
        // Given
        int doctorId = 1;
        LocalDate date = LocalDate.of(2024, 6, 15);
        LocalTime time = LocalTime.of(10, 0);

        when(doctorService.getDoctorById(doctorId)).thenReturn(testDoctor);
        when(appointmentService.isAppointmentAvailable(testDoctor, date, time)).thenReturn(false);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/availability")
                        .param("doctorId", String.valueOf(doctorId))
                        .param("date", date.toString())
                        .param("time", time.toString()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().string("false"));
    }

    @Test
    void getPatientAppointmentsByStatus_WithDefaultStatus_ShouldReturnAppointments() throws Exception {
        // Given
        List<AppointmentDTO.GetAppointmentDTO> expectedAppointments = Arrays.asList(testAppointmentDTO);

        when(authentication.getPrincipal()).thenReturn(testUser);
        when(patientService.getPatientById(testUser.getId())).thenReturn(testPatient);
        when(appointmentService.getPatientAppointmentsByStatus(testPatient, Appointment.Status.CONFIRMED))
                .thenReturn(expectedAppointments);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].doctorId").value(1));

        verify(patientService).getPatientById(testUser.getId());
        verify(appointmentService).getPatientAppointmentsByStatus(testPatient, Appointment.Status.CONFIRMED);
    }

    @Test
    void getPatientAppointmentsByStatus_WithCustomStatus_ShouldReturnAppointments() throws Exception {
        // Given
        String status = "PENDING";
        List<AppointmentDTO.GetAppointmentDTO> expectedAppointments = Arrays.asList(testAppointmentDTO);

        when(authentication.getPrincipal()).thenReturn(testUser);
        when(patientService.getPatientById(testUser.getId())).thenReturn(testPatient);
        when(appointmentService.getPatientAppointmentsByStatus(testPatient, Appointment.Status.PENDING))
                .thenReturn(expectedAppointments);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments")
                        .param("status", status)
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(appointmentService).getPatientAppointmentsByStatus(testPatient, Appointment.Status.PENDING);
    }

    @Test
    void getDoctorAppointments_WithDefaultStatus_ShouldReturnAppointments() throws Exception {
        // Given
        List<AppointmentDTO.GetAppointmentDTO> expectedAppointments = Arrays.asList(testAppointmentDTO);

        when(authentication.getPrincipal()).thenReturn(testUser);
        when(doctorService.getDoctorById(testUser.getId())).thenReturn(testDoctor);
        when(appointmentService.getDoctorAppointments(testDoctor, Appointment.Status.CONFIRMED))
                .thenReturn(expectedAppointments);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/doctor")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(1));

        verify(doctorService).getDoctorById(testUser.getId());
        verify(appointmentService).getDoctorAppointments(testDoctor, Appointment.Status.CONFIRMED);
    }

    @Test
    void getAppointmentById_ShouldReturnAppointment() throws Exception {
        // Given
        Long appointmentId = 1L;
        when(appointmentService.getAppointmentById(appointmentId)).thenReturn(testAppointmentDTO);

        // When & Then
        mockMvc.perform(get("/api/v1/appointments/{id}", appointmentId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.doctorId").value(1));

        verify(appointmentService).getAppointmentById(appointmentId);
    }

    @Test
    void createAppointment_WhenTimeAvailable_ShouldCreateAppointment() throws Exception {
        // Given
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(doctorService.getDoctorById(1)).thenReturn(testDoctor);
        when(appointmentService.isAppointmentAvailable(testDoctor, testAppointmentDTO.getDate(), testAppointmentDTO.getTime()))
                .thenReturn(true);
        when(appointmentService.createAppointment(any(AppointmentDTO.GetAppointmentDTO.class), eq(testUser.getId())))
                .thenReturn(testAppointmentDTO);

        // When & Then
        mockMvc.perform(post("/api/v1/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAppointmentDTO))
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.doctorId").value(1));

        verify(doctorService).getDoctorById(1);
        verify(appointmentService).isAppointmentAvailable(testDoctor, testAppointmentDTO.getDate(), testAppointmentDTO.getTime());
        verify(appointmentService).createAppointment(any(AppointmentDTO.GetAppointmentDTO.class), eq(testUser.getId()));
    }

    @Test
    void createAppointment_WhenTimeNotAvailable_ShouldThrowConflictException() throws Exception {
        // Given
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(doctorService.getDoctorById(1)).thenReturn(testDoctor);
        when(appointmentService.isAppointmentAvailable(testDoctor, testAppointmentDTO.getDate(), testAppointmentDTO.getTime()))
                .thenReturn(false);

        // When & Then
        mockMvc.perform(post("/api/v1/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAppointmentDTO))
                        .principal(authentication))
                .andExpect(status().isConflict());

        verify(doctorService).getDoctorById(1);
        verify(appointmentService).isAppointmentAvailable(testDoctor, testAppointmentDTO.getDate(), testAppointmentDTO.getTime());
        verify(appointmentService, never()).createAppointment(any(AppointmentDTO.GetAppointmentDTO.class), (int) anyLong());
    }

    @Test
    void updateAppointment_ShouldUpdateAndReturnAppointment() throws Exception {
        // Given
        Long appointmentId = 1L;
        AppointmentDTO.GetAppointmentDTO updatedAppointment = new AppointmentDTO.GetAppointmentDTO();
        updatedAppointment.setId(Math.toIntExact(appointmentId));
        updatedAppointment.setDoctorId(2);

        when(authentication.getPrincipal()).thenReturn(testUser);
        when(appointmentService.updateAppointment(eq(appointmentId), any(AppointmentDTO.GetAppointmentDTO.class), eq(testUser)))
                .thenReturn(updatedAppointment);

        // When & Then
        mockMvc.perform(patch("/api/v1/appointments/{id}", appointmentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAppointmentDTO))
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").value(appointmentId))
                .andExpect(jsonPath("$.doctorId").value(2));

        verify(appointmentService).updateAppointment(eq(appointmentId), any(AppointmentDTO.GetAppointmentDTO.class), eq(testUser));
    }

    @Test
    void deleteAppointment_ShouldDeleteAndReturnNoContent() throws Exception {
        // Given
        Long appointmentId = 1L;
        doNothing().when(appointmentService).deleteAppointment(appointmentId);

        // When & Then
        mockMvc.perform(delete("/api/v1/appointments/{id}", appointmentId))
                .andExpect(status().isNoContent());

        verify(appointmentService).deleteAppointment(appointmentId);
    }

    @Test
    void createAppointment_WithInvalidJson_ShouldReturnBadRequest() throws Exception {
        // Given
        String invalidJson = "{ invalid json }";

        // When & Then
        mockMvc.perform(post("/api/v1/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson)
                        .principal(authentication))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getDoctorAppointmentsByDate_WithInvalidDate_ShouldReturnBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/v1/appointments/doctor/1/date/invalid-date"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void checkAppointmentAvailability_WithMissingParameters_ShouldReturnBadRequest() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/v1/appointments/availability")
                        .param("doctorId", "1"))
                .andExpect(status().isBadRequest());
    }

}