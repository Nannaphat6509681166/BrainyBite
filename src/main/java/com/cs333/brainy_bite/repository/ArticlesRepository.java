package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.model.AppUser;
import com.cs333.brainy_bite.model.articles;
import com.cs333.brainy_bite.model.bookmarks;
import com.cs333.brainy_bite.model.user_bookmarks;

import java.util.List;

public interface ArticlesRepository {

    List<articles> allArticles();
    List<articles> findArticles(String search);
    List<articles> findByCategory(String category);
    articles infoArticles(String article_id);
    AppUser userInfo(String user_sub);
    void addBookmark(bookmarks bookmark);
    int deleteBookmarks(String bookmark);
    List<user_bookmarks> showBookmarks(String user_sub);
    bookmarks findBookmarkBySubAndArticleId(String user_sub, String articles_id);
}
