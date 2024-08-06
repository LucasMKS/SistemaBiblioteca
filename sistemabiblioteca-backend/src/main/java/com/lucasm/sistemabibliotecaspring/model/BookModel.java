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
    private String isbn_10;
    private String quantidade;
    private String ano;
    private String paginas;
    private String idioma;
    private String editora;
    private String rating;
    private String descricao;
    private String genero;

}