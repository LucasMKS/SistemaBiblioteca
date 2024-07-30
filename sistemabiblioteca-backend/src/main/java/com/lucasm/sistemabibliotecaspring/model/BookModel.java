package com.lucasm.sistemabibliotecaspring.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "livros")
@Data
public class BookModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_livro")
    private Long id;
    private String titulo;
    private String autor;
    private String isbn;
    private String categoria;
    private String quantidade;

}