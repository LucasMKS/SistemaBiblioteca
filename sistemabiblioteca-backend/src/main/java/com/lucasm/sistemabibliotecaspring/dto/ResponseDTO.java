package com.lucasm.sistemabibliotecaspring.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.lucasm.sistemabibliotecaspring.model.UserModel;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponseDTO {

    private int statusCode;
    private String error;
    private String mensagem;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String name;
    private String matricula;
    private String role;
    private String email;
    private String password;
    private UserModel ourUsers;
    private List<UserModel> ourUsersList;

}