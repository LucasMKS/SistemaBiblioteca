package com.lucasm.sistemabibliotecaspring.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.sistemabibliotecaspring.model.LoanModel;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class LoanDTO {

    private int statusCode;
    private String error;
    private String mensagem;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String alunoMatricula;
    private String isbn;
    private Boolean status;
    private LoanModel loan;
    private List<LoanModel> ourLoanList;

}