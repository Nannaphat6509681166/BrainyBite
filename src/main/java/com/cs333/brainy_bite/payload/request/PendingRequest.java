package com.cs333.brainy_bite.payload.request;

import java.sql.Date;

public class PendingRequest {
    private Date submitted_at;
    private Long pending_id;
    private String author;
    private String category;
    private String title;
    private String description;
    private String status;

    public PendingRequest() {}

    public PendingRequest(Date submitted_at, Long pending_id, String author, String category, String title, String description, String status) {
        this.submitted_at = submitted_at;
        this.pending_id = pending_id;
        this.author = author;
        this.category = category;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public PendingRequest(String author, String category, String title, String description, String status) {
        this.author = author;
        this.category = category;
        this.title = title;
        this.description = description;
        this.status = status;
    }

    public Date getSubmitted_at() {
        return submitted_at;
    }

    public void setSubmitted_at(Date submitted_at) {
        this.submitted_at = submitted_at;
    }

    public Long getPending_id() {
        return pending_id;
    }

    public void setPending_id(Long pending_id) {
        this.pending_id = pending_id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
