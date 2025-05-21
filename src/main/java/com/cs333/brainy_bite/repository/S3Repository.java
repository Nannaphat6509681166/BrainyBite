package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.model.articles;
import com.cs333.brainy_bite.payload.request.PendingRequest;

public interface S3Repository {
    int insertPendingArticle(PendingRequest pendingRequest, String pdfUrl, String imageUrl);
    int insertArticle(articles articles, String mk_url, String thumbnail_url);
}
