package com.backend.server.services;

import com.backend.server.auth.DoctorRegisterRequest;
import com.backend.server.entities.Doctor;
import com.backend.server.entities.User;
import com.backend.server.repositories.DoctorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class DoctorServiceTest {

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private DoctorService doctorService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void shouldRegisterDoctorSuccessfully() {
        // Given
        DoctorRegisterRequest request = DoctorRegisterRequest.builder()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane@example.com")
                .password("password")
                .bio("Bio")
                .education("Med School")
                .specialization("Cardiology")
                .startedPracticingAt(LocalDate.of(2015, 1, 1))
                .build();

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

        ArgumentCaptor<Doctor> captor = ArgumentCaptor.forClass(Doctor.class);
        when(doctorRepository.save(any(Doctor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Doctor doctor = doctorService.registerDoctor(request);

        // Then
        verify(passwordEncoder).encode("password");
        verify(doctorRepository).save(captor.capture());

        Doctor savedDoctor = captor.getValue();
        assertThat(savedDoctor.getEmail()).isEqualTo("jane@example.com");
        assertThat(savedDoctor.getPassword()).isEqualTo("encodedPassword");
        assertThat(savedDoctor.getRole()).isEqualTo(User.Role.DOCTOR);
    }

    @Test
    void shouldGetDoctorByIdWhenExists() {
        Doctor doctor = Doctor.builder().id(1).firstName("Alice").build();
        when(doctorRepository.findById(1)).thenReturn(Optional.of(doctor));

        Doctor result = doctorService.getDoctorById(1);

        assertThat(result).isEqualTo(doctor);
    }

    @Test
    void shouldThrowWhenDoctorByIdNotFound() {
        when(doctorRepository.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> doctorService.getDoctorById(1))
                .isInstanceOf(org.springframework.security.core.userdetails.UsernameNotFoundException.class)
                .hasMessageContaining("Doctor with id 1 not found");
    }

    @Test
    void shouldFindAllDoctorsWithoutFilters() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());
        Page<Doctor> page = new PageImpl<>(List.of());
        when(doctorRepository.findAll(pageable)).thenReturn(page);

        Page result = doctorService.findAllDoctors(null, null, 0, 10, "firstName");

        assertThat(result).isEqualTo(page);
    }

    @Test
    void shouldFindDoctorsByNameOnly() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());
        Page<Doctor> page = new PageImpl<>(List.of());
        when(doctorRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase("john", "john", pageable))
                .thenReturn(page);

        Page result = doctorService.findAllDoctors("john", null, 0, 10, "firstName");

        assertThat(result).isEqualTo(page);
    }

    @Test
    void shouldFindDoctorsBySpecializationOnly() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());
        Page<Doctor> page = new PageImpl<>(List.of());
        when(doctorRepository.findBySpecializationContainingIgnoreCase("cardio", pageable))
                .thenReturn(page);

        Page result = doctorService.findAllDoctors(null, "cardio", 0, 10, "firstName");

        assertThat(result).isEqualTo(page);
    }

    @Test
    void shouldFindDoctorsBySpecializationAndName() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("firstName").ascending());
        Page<Doctor> page = new PageImpl<>(List.of());
        when(doctorRepository.findBySpecializationAndName("cardio", "john", pageable))
                .thenReturn(page);

        Page<Doctor> result = doctorService.findAllDoctors("john", "cardio", 0, 10, "firstName");

        assertThat(result).isEqualTo(page);
    }
}
