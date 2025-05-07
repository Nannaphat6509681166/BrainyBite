package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.payload.request.PendingRequest;

public interface S3Repository {
    int insertPendingArticle(PendingRequest pendingRequest, String pdfUrl, String imageUrl);
}
