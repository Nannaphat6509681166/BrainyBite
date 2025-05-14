package com.cs333.brainy_bite.model;

public class bookmarks {
    private String bookmark_id;
    private String sub;
    private String article_id;
    private String created_at;

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getArticle_id() {
        return article_id;
    }

    public void setArticle_id(String article_id) {
        this.article_id = article_id;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getBookmark_id() {
        return bookmark_id;
    }

    public void setBookmark_id(String bookmark_id) {
        this.bookmark_id = bookmark_id;
    }

    public bookmarks(String bookmark_id, String user_id, String article_id, String created_at) {
        this.bookmark_id = bookmark_id;
        this.sub = user_id;
        this.article_id = article_id;
        this.created_at = created_at;
    }

    public bookmarks(String user_id, String article_id, String created_at) {
        this.sub = user_id;
        this.article_id = article_id;
        this.created_at = created_at;
    }

    public bookmarks(){};
}
