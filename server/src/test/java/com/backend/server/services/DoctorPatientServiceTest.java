package com.backend.server.services;

import com.backend.server.entities.Doctor;
import com.backend.server.entities.DoctorPatient;
import com.backend.server.entities.Patient;
import com.backend.server.repositories.DoctorPatientRepository;
import com.backend.server.repositories.DoctorRepository;
import com.backend.server.repositories.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class DoctorPatientServiceTest {

    @Mock
    private DoctorPatientRepository doctorPatientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private DoctorPatientService doctorPatientService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldAddDoctorPatientSuccessfully() {
        Doctor doctor = Doctor.builder().id(1).build();
        Patient patient = Patient.builder().id(2).build();

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(patientRepository.findById(2)).thenReturn(Optional.of(patient));

        doctorPatientService.addDoctorPatient(1, 2);

        verify(doctorPatientRepository, times(1)).save(any(DoctorPatient.class));
    }

    @Test
    void shouldSearchPatientsByDoctorSuccessfully() {
        Doctor doctor = Doctor.builder().id(1).build();
        DoctorPatient doctorPatient = DoctorPatient.builder()
                .doctor(doctor)
                .patient(Patient.builder().firstName("Jane").lastName("Doe").build())
                .build();

        PageRequest pageRequest = PageRequest.of(0, 10);
        Page<DoctorPatient> page = new PageImpl<>(Collections.singletonList(doctorPatient));

        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));
        when(doctorPatientRepository
                .findByDoctorAndPatient_FirstNameContainingIgnoreCaseOrDoctorAndPatient_LastNameContainingIgnoreCase(
                        doctor, "Jane", doctor, "Jane", pageRequest))
                .thenReturn(page);

        Page<DoctorPatient> result = doctorPatientService.searchPatientsByDoctor(1, "Jane", 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getPatient().getFirstName()).isEqualTo("Jane");
    }

    @Test
    void shouldDeleteDoctorPatientSuccessfully() {
        doctorPatientService.deleteDoctorPatient(1L, 2L);
        verify(doctorPatientRepository, times(1)).deleteByDoctor_IdAndPatient_Id(1L, 2L);
    }
}
