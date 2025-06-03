package com.backend.server.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Getter
public class S3Properties {

    @Value("${CLOUD_S3_BUCKET_URL}")
    private String bucketUrl;
}
