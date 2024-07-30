package com.lucasm.sistemabibliotecaspring.repository;

import com.lucasm.sistemabibliotecaspring.model.LoanModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface LoanRepo extends JpaRepository<LoanModel, Integer> {

    Optional<LoanModel> findByAlunoMatricula(String alunoMatricula);

    List<LoanModel> findAllByAlunoMatricula(String alunoMatricula);

    Optional<LoanModel> findByIsbn(String isbn);

    Optional<LoanModel> findByAlunoMatriculaAndIsbnAndStatus(String matricula, String isbn, Boolean status);

    boolean existsByAlunoMatriculaAndIsbnAndStatus(String alunoMatricula, String isbn, Boolean status);

    boolean existsByAlunoMatriculaAndIsbn(String alunoMatricula, String isbn);

    // Novo método para contar empréstimos ativos
    int countByAlunoMatriculaAndStatus(String alunoMatricula, Boolean status);

    @Modifying
    @Transactional
    @Query("DELETE FROM LoanModel b WHERE b.isbn = :isbn AND b.alunoMatricula = :matricula")
    void deleteByMatriculaIsbn(String matricula, String isbn);
}
