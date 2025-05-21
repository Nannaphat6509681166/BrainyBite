package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.model.articles;
import com.cs333.brainy_bite.payload.request.PendingRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcS3Service implements S3Repository{

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public int insertPendingArticle(PendingRequest pendingRequest, String pdfUrl, String imageUrl) {
        try {
            return jdbcTemplate.update("INSERT INTO pending_articles (submitted_at, author, category, title, " +
                            "description, content_url, thumbnail_url, status)\n" +
                            "VALUES (CURRENT_DATE(), ?, ?, ?, ?, ?, ?, ?)",
                    new Object[] {pendingRequest.getAuthor(), pendingRequest.getCategory(), pendingRequest.getTitle(),
                            pendingRequest.getDescription(), pdfUrl, imageUrl, pendingRequest.getStatus()});
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Database insert failed", e);  // หรือจัดการอย่างเหมาะสม
        }
    }

    public int insertArticle(articles articles, String mk_url, String thumbnail_url) {
        try {
            return jdbcTemplate.update("INSERT INTO articles (published, author, category, title, description, " +
                    "article_url, thumbnail_url)\n" +
                    "VALUE (CURRENT_DATE(), ?, ?, ?, ?, ?, ?)",
                    new Object[] {articles.getAuthor(), articles.getCategory(), articles.getTitle(), articles.getDescription(),
                    articles.getArticle_url(), articles.getThumbnail_url()});
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Database insert failed", e);
        }
    }
}
