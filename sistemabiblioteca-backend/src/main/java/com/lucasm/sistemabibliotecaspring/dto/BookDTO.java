package com.lucasm.sistemabibliotecaspring.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class BookDTO {

    private int statusCode;
    private String error;
    private String mensagem;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String titulo;
    private String autor;
    private String isbn_10;
    private String isbn;
    private String quantidade;
    private String ano;
    private String paginas;
    private String idioma;
    private String editora;
    private String rating;
    private String descricao;
    private String genero;
    private BookModel book;
    private List<BookModel> ourBookList;

}