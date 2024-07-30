package com.lucasm.sistemabibliotecaspring.service;

import com.lucasm.sistemabibliotecaspring.dto.LoanDTO;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import com.lucasm.sistemabibliotecaspring.model.LoanModel;
import com.lucasm.sistemabibliotecaspring.repository.BookRepo;
import com.lucasm.sistemabibliotecaspring.repository.LoanRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {

    @Autowired
    private LoanRepo loanRepo;

    @Autowired
    private BookRepo bookRepo;

    @Autowired
    private BookService bookService;

    public LoanDTO registerLoan(LoanDTO registrationRequest) {
        LoanDTO resp = new LoanDTO();

        LocalDate now = LocalDate.now();
        Date dataEmprestimo = Date.valueOf(now);

        // Calcular data de devolução
        LocalDate dataDev = now.plusDays(7);
        Date dataDevolucao = Date.valueOf(dataDev);


        try {
            // Verificar a quantidade disponível do livro
            int quantidadeDisponivel = verificarQuantidadeDisponivel(registrationRequest.getIsbn());
            if (quantidadeDisponivel <= 0) {
                resp.setStatusCode(400); // Indica um erro de requisição
                resp.setMensagem("Erro ao registrar empréstimo: Nenhum exemplar disponível.");
                return resp;
            }

            // Verificar se o aluno já possui um exemplar com o mesmo ISBN emprestado
            if (alunoPossuiEmprestimoAtivo(registrationRequest.getAlunoMatricula(), registrationRequest.getIsbn(),
                    registrationRequest.getStatus())) {
                resp.setStatusCode(400); // Indica um erro de requisição
                resp.setMensagem(
                        "Erro ao registrar empréstimo: O aluno já possui um exemplar com o mesmo ISBN emprestado.");
                return resp;
            }

            if (alunoPossuiEmprestimoAtivo(registrationRequest.getAlunoMatricula(), registrationRequest.getIsbn(),
                    !registrationRequest.getStatus())) {
                resp.setStatusCode(400); // Indica um erro de requisição
                resp.setMensagem(
                        "Erro ao registrar empréstimo: O aluno já possui um exemplar com o mesmo ISBN emprestado.");
                return resp;
            }
            // Inserir um novo empréstimo
            LoanModel ourLoan = new LoanModel();
            ourLoan.setAlunoMatricula(registrationRequest.getAlunoMatricula());
            ourLoan.setIsbn(registrationRequest.getIsbn());
            ourLoan.setDataEmprestimo(dataEmprestimo);
            ourLoan.setDataDevolucao(dataDevolucao);
            ourLoan.setStatus(true);
            LoanModel savedLoan = loanRepo.save(ourLoan);

            // Atualizar a quantidade do livro
            int novaQuantidade = quantidadeDisponivel - 1;
            bookService.updateBookQuantity(registrationRequest.getIsbn(), novaQuantidade);

            resp.setLoan(savedLoan);
            resp.setStatusCode(200);
            // Buscar o livro pelo ISBN para obter o título
            BookModel book = bookRepo.findByIsbn(ourLoan.getIsbn()).orElse(null);
            if (book != null) {
                resp.setMensagem("Empréstimo do livro '" + book.getTitulo() + "' cadastrado com sucesso");
            } else {
                resp.setMensagem("Empréstimo cadastrado com sucesso");
            }

        } catch (Exception e) {
            resp.setStatusCode(500); // Indica um erro interno no servidor
            resp.setError(e.getMessage());
        }
        return resp;
    }

    private int verificarQuantidadeDisponivel(String isbn) {
        BookModel bookModel = bookRepo.findByIsbn(isbn).orElse(null);
        if (bookModel != null) {
            int quantidade = Integer.parseInt(bookModel.getQuantidade());
            return quantidade;
        } else {
            return 0;
        }
    }

    private boolean alunoPossuiEmprestimoAtivo(String matricula, String isbn, Boolean status) {
        return loanRepo.existsByAlunoMatriculaAndIsbnAndStatus(matricula, isbn, true);
    }

    public LoanDTO updateLoan(String matricula, String isbn, LoanModel updatedLoan) {
        LoanDTO loanRes = new LoanDTO();
        try {
            // Verifica se o empréstimo existe
            boolean loanExisting = loanRepo.existsByAlunoMatriculaAndIsbnAndStatus(matricula, isbn, true);

            if (loanExisting) {
                // Busca o empréstimo específico para atualização
                Optional<LoanModel> loanOptionalM = loanRepo.findByAlunoMatriculaAndIsbnAndStatus(matricula, isbn,
                        true);

                if (loanOptionalM.isPresent()) {
                    LoanModel existingLoan = loanOptionalM.get();
                    existingLoan.setAlunoMatricula(updatedLoan.getAlunoMatricula());
                    existingLoan.setIsbn(updatedLoan.getIsbn());
                    existingLoan.setStatus(updatedLoan.getStatus());

                    LoanModel savedLoan = loanRepo.save(existingLoan);
                    loanRes.setLoan(savedLoan);
                    loanRes.setStatusCode(200);
                    loanRes.setMensagem("Empréstimo atualizado com sucesso");
                } else {
                    loanRes.setStatusCode(404);
                    loanRes.setMensagem("Empréstimo não encontrado para atualizar");
                }
            } else {
                loanRes.setStatusCode(404);
                loanRes.setMensagem("Empréstimo não encontrado para atualizar");
            }
        } catch (Exception e) {
            loanRes.setStatusCode(500);
            loanRes.setMensagem("Ocorreu um erro ao atualizar o empréstimo: " + e.getMessage());
        }
        return loanRes;
    }

    public LoanDTO getLoanByMatricula(String matricula) {
        LoanDTO reqRes = new LoanDTO();
        try {
            List<LoanModel> loanByMatricula = loanRepo.findAllByAlunoMatricula(matricula);
            if (!loanByMatricula.isEmpty()) {
                reqRes.setOurLoanList(loanByMatricula);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Empréstimos encontrados com sucesso");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Nenhum empréstimo encontrado");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Ocorreu um erro: " + e.getMessage());
        }
        return reqRes;
    }
    
    public LoanDTO deleteLoan(String matricula, String isbn) {
        LoanDTO resp = new LoanDTO();

        // Verificar a quantidade disponível do livro
        int quantidadeDisponivel = verificarQuantidadeDisponivel(isbn);
        int novaQuantidade = quantidadeDisponivel + 1;
            bookService.updateBookQuantity(isbn, novaQuantidade);

        try {
            Boolean status = true;
            Optional<LoanModel> loanOptional = loanRepo.findByAlunoMatriculaAndIsbnAndStatus(matricula, isbn, status);
            if (loanOptional.isPresent()) {
                loanRepo.deleteByMatriculaIsbn(matricula, isbn);
                resp.setStatusCode(200);
                resp.setMensagem("Livro deletado");
            } else {
                resp.setStatusCode(404);
                resp.setMensagem("Livro não encontrado para deletar");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMensagem("Error occurred while deleting user: " + e.getMessage());
        }
        return resp;
    }

    
}
