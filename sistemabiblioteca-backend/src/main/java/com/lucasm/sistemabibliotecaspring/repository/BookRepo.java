package com.lucasm.sistemabibliotecaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface BookRepo extends JpaRepository<BookModel, Integer> {

    Optional<BookModel> findByIsbn(String isbn);

    @Modifying
    @Transactional
    @Query("DELETE FROM BookModel b WHERE b.isbn = :isbn")
    void deleteByIsbn(String isbn);

    @Query(value = "SELECT * FROM livros ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<BookModel> findRandomLivro();
}
