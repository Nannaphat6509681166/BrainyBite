package com.cs333.brainy_bite.model;

public class user_bookmarks {
    private String user_id;
    private String published;
    private String article_id;
    private String author;
    private String category;
    private String title;
    private String description;
    private String article_url;
    private String thumbnail_url;

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getPublished() {
        return published;
    }

    public void setPublished(String published) {
        this.published = published;
    }

    public String getArticle_id() {
        return article_id;
    }

    public void setArticle_id(String article_id) {
        this.article_id = article_id;
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

    public String getArticle_url() {
        return article_url;
    }

    public void setArticle_url(String article_url) {
        this.article_url = article_url;
    }

    public String getThumbnail_url() {
        return thumbnail_url;
    }

    public void setThumbnail_url(String thumbnail_url) {
        this.thumbnail_url = thumbnail_url;
    }

    public user_bookmarks(String user_id, String published, String article_id, String author, String category, String title, String description, String article_url, String thumbnail_url) {
        this.user_id = user_id;
        this.published = published;
        this.article_id = article_id;
        this.author = author;
        this.category = category;
        this.title = title;
        this.description = description;
        this.article_url = article_url;
        this.thumbnail_url = thumbnail_url;
    }

    public user_bookmarks(){};
}
