package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.model.AppUser;
import com.cs333.brainy_bite.model.articles;
import com.cs333.brainy_bite.model.bookmarks;
import com.cs333.brainy_bite.model.user_bookmarks;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.jdbc.IncorrectResultSetColumnCountException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class JDBCArticleRepository implements ArticlesRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public List<articles> allArticles() {
        String q = "SELECT * FROM articles ";
        return jdbcTemplate.query(q, BeanPropertyRowMapper.newInstance(articles.class));
    }

    @Override
    public List<articles> findArticles(String search) {
        String q = "SELECT * from articles WHERE title LIKE '%"+ search +"%'";
        return jdbcTemplate.query(q,BeanPropertyRowMapper.newInstance(articles.class));
    }

    @Override
    public List<articles> findByCategory(String category) {
        String q = "SELECT * FROM articles WHERE category = ?";
        return jdbcTemplate.query(q, BeanPropertyRowMapper.newInstance(articles.class), category);
    }

    @Override
    public articles infoArticles(String article_id) {
        try {
            return jdbcTemplate.queryForObject("SELECT * FROM articles WHERE article_id = ?",
                    new BeanPropertyRowMapper<>(articles.class), article_id);
        } catch (DataAccessException e) {
            return null; // handle exception appropriately
        }
    }

    @Override
    public AppUser userInfo(String user_sub) {
        return null;
    }

    @Override
    public void addBookmark(bookmarks bookmark) {
        String sql = "INSERT INTO bookmarks (user_sub, article_id, created_at) " +
                "VALUES (?, ?, CURRENT_DATE())";

        try {
            jdbcTemplate.update(sql,
                    bookmark.getUser_sub(),      // User ID
                    bookmark.getArticle_id()    // Article ID
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to add bookmark: " + e.getMessage());
        }

    }

    @Override
    public int deleteBookmarks(String bookmark) {
        String query = "DELETE FROM bookmarks WHERE bookmark_id = ?";
        return jdbcTemplate.update(query, bookmark);
    }

    @Override
    public List<user_bookmarks> showBookmarks(String user_sub) {
        try{
            List<user_bookmarks> user_bookmarks = jdbcTemplate.query("SELECT bookmarks.user_id, articles.*\n" +
                            "FROM bookmarks\n" +
                            "JOIN articles ON bookmarks.article_id = articles.article_id\n" +
                            "WHERE bookmarks.user_id = ?;",
                    BeanPropertyRowMapper.newInstance(user_bookmarks.class),user_sub);

            return user_bookmarks;
        }catch(IncorrectResultSetColumnCountException e){
            return null;
        }
    }

    @Override
    public bookmarks findBookmarkBySubAndArticleId(String user_sub, String articles_id) {
        try {
            bookmarks _bookmarks = jdbcTemplate.queryForObject("SELECT * FROM bookmarks where user_id = ? " +
                            "and article_id = ?;",
                    BeanPropertyRowMapper.newInstance(bookmarks.class), user_sub, articles_id);
            return _bookmarks;
        } catch (IncorrectResultSizeDataAccessException e) {
            return null;
        }
    }
}
