package com.lucasm.sistemabibliotecaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface BookRepo extends JpaRepository<BookModel, Integer> {

    Optional<BookModel> findByIsbn(String isbn);

    @Modifying
    @Transactional
    @Query("DELETE FROM BookModel b WHERE b.isbn = :isbn")
    void deleteByIsbn(String isbn);
}
