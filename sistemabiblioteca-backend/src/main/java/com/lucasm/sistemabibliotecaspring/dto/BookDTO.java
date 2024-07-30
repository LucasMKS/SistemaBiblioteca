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
    private String categoria;
    private String isbn;
    private String quantidade;
    private BookModel book;
    private List<BookModel> ourBookList;

}