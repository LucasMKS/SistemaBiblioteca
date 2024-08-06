package com.lucasm.sistemabibliotecaspring.service;

import com.lucasm.sistemabibliotecaspring.dto.BookDTO;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import com.lucasm.sistemabibliotecaspring.repository.BookRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepo bookRepo;

    private BookDTO reqRes = new BookDTO();

    public BookDTO registerBook(BookDTO registrationRequest){
        try {
            BookModel ourBook = new BookModel();
            ourBook.setTitulo(registrationRequest.getTitulo());
            ourBook.setAutor(registrationRequest.getAutor());
            ourBook.setIsbn(registrationRequest.getIsbn());
            ourBook.setQuantidade(registrationRequest.getQuantidade());
            ourBook.setAno(registrationRequest.getAno());
            ourBook.setPaginas(registrationRequest.getPaginas());
            ourBook.setIdioma(registrationRequest.getIdioma());
            ourBook.setEditora(registrationRequest.getEditora());
            ourBook.setRating(registrationRequest.getRating());
            ourBook.setDescricao(registrationRequest.getDescricao());
            ourBook.setGenero(registrationRequest.getGenero());
            BookModel savedBook = bookRepo.save(ourBook);
            if (savedBook.getId()>0) {
                reqRes.setBook((savedBook));
                reqRes.setMensagem("Livro cadastrado com sucesso");
                reqRes.setStatusCode(200);
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMensagem(e.getMessage());
        }
        return reqRes;
    }

    public BookDTO getAllBooks() {
        try {
            List<BookModel> result = bookRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurBookList(result);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Sucesso");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Nenhum livro encontrado");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }

    public BookDTO getBookByIsbn(String isbn) {
        try {
            BookModel bookByIsbn = bookRepo.findByIsbn(isbn).orElseThrow(() -> new RuntimeException("ISBN não encontrado"));
            reqRes.setBook(bookByIsbn);
            reqRes.setStatusCode(200);
            reqRes.setMensagem("Livro '" + bookByIsbn.getTitulo() + "' encontrado com sucesso");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Ocorreu um erro: " + e.getMessage());
        }
        return reqRes;
    }

    public BookDTO updateBook(String bookIsbn, BookModel updatedBook) {
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(bookIsbn);
            if (bookOptional.isPresent()) {
                BookModel existingBook = bookOptional.get();
                existingBook.setTitulo(updatedBook.getTitulo());
                existingBook.setAutor(updatedBook.getAutor());
                existingBook.setIsbn(updatedBook.getIsbn());
                existingBook.setQuantidade(updatedBook.getQuantidade());
                existingBook.setAno(updatedBook.getAno());
                existingBook.setPaginas(updatedBook.getPaginas());
                existingBook.setIdioma(updatedBook.getIdioma());
                existingBook.setEditora(updatedBook.getEditora());
                existingBook.setRating(updatedBook.getRating());
                existingBook.setDescricao(updatedBook.getDescricao());
                existingBook.setGenero(updatedBook.getGenero());
                BookModel savedBook = bookRepo.save(existingBook);
                reqRes.setBook(savedBook);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Livro atualizado");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Livro não encontrado para atualizar");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }

    public BookDTO updateBookQuantity(String isbn, int newQuantity) {
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(isbn);
            if (bookOptional.isPresent()) {
                BookModel existingBook = bookOptional.get();
                if (newQuantity < 0) {
                    newQuantity = 0; // Garantir que a quantidade não seja negativa
                }
                existingBook.setQuantidade(String.valueOf(newQuantity));

                BookModel savedBook = bookRepo.save(existingBook);
                reqRes.setBook(savedBook);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Quantidade do livro atualizada");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Livro não encontrado para atualizar a quantidade");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while updating book quantity: " + e.getMessage());
        }
        return reqRes;
    }

    public BookDTO deleteBook(String isbn) {
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(isbn);
            if (bookOptional.isPresent()) {
                bookRepo.deleteByIsbn(isbn);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Livro deletado");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Livro não encontrado para deletar");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public BookDTO getRandomBook() {
        try {
            Optional<BookModel> result = bookRepo.findRandomLivro();
            if (result.isPresent()) {
                reqRes.setBook(result.get());
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Sucesso");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Nenhum livro encontrado");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

}
