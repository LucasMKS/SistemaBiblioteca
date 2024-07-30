package com.lucasm.sistemabibliotecaspring.model;


import jakarta.persistence.*;
import lombok.Data;

import java.sql.Date;

@Entity
@Table(name = "emprestimos")
@Data
public class LoanModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int idLivro;

    @Column(name = "aluno_matricula", nullable = true)
    private String alunoMatricula;
    
    private String isbn;

    @Column(name = "data_emprestimo", nullable = true)
    private Date dataEmprestimo;

    @Column(name = "data_devolucao", nullable = true)
    private Date dataDevolucao;

    private Boolean status;

}
