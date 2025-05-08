package com.backend.server.component;

import com.backend.server.repositories.MedicalDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("authUtil")
public class AuthUtil {

    private final MedicalDocumentRepository documentRepository;

    @Autowired
    public AuthUtil(MedicalDocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    public boolean isOwnerOfDocument(Authentication authentication, Integer documentId) {
        String userEmail = authentication.getName();
        return documentRepository.findById(Long.valueOf(documentId))
                .map(doc -> doc.getPatient().getEmail().equals(userEmail))
                .orElse(false);
    }
}

