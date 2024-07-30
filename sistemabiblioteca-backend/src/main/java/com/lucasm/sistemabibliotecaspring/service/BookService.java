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

    public BookDTO registerBook(BookDTO registrationRequest){
        BookDTO resp = new BookDTO();

        try {
            BookModel ourBook = new BookModel();
            ourBook.setTitulo(registrationRequest.getTitulo());
            ourBook.setAutor(registrationRequest.getAutor());
            ourBook.setIsbn(registrationRequest.getIsbn());
            ourBook.setCategoria(registrationRequest.getCategoria());
            ourBook.setQuantidade(registrationRequest.getQuantidade());
            BookModel savedBook = bookRepo.save(ourBook);
            if (savedBook.getId()>0) {
                resp.setBook((savedBook));
                resp.setMensagem("Livro cadastrado com sucesso");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public BookDTO getAllBooks() {
        BookDTO reqRes = new BookDTO();

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
        BookDTO reqRes = new BookDTO();
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
        BookDTO bookRes = new BookDTO();
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(bookIsbn);
            if (bookOptional.isPresent()) {
                BookModel existingBook = bookOptional.get();
                existingBook.setTitulo(updatedBook.getTitulo());
                existingBook.setAutor(updatedBook.getAutor());
                existingBook.setIsbn(updatedBook.getIsbn());
                existingBook.setCategoria(updatedBook.getCategoria());
                existingBook.setQuantidade(updatedBook.getQuantidade());

                BookModel savedBook = bookRepo.save(existingBook);
                bookRes.setBook(savedBook);
                bookRes.setStatusCode(200);
                bookRes.setMensagem("Livro atualizado");
            } else {
                bookRes.setStatusCode(404);
                bookRes.setMensagem("Livro não encontrado para atualizar");
            }
        } catch (Exception e) {
            bookRes.setStatusCode(500);
            bookRes.setMensagem("Error occurred while updating user: " + e.getMessage());
        }
        return bookRes;
    }

    public BookDTO updateBookQuantity(String isbn, int newQuantity) {
        BookDTO bookRes = new BookDTO();
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(isbn);
            if (bookOptional.isPresent()) {
                BookModel existingBook = bookOptional.get();
                if (newQuantity < 0) {
                    newQuantity = 0; // Garantir que a quantidade não seja negativa
                }
                existingBook.setQuantidade(String.valueOf(newQuantity));

                BookModel savedBook = bookRepo.save(existingBook);
                bookRes.setBook(savedBook);
                bookRes.setStatusCode(200);
                bookRes.setMensagem("Quantidade do livro atualizada");
            } else {
                bookRes.setStatusCode(404);
                bookRes.setMensagem("Livro não encontrado para atualizar a quantidade");
            }
        } catch (Exception e) {
            bookRes.setStatusCode(500);
            bookRes.setMensagem("Error occurred while updating book quantity: " + e.getMessage());
        }
        return bookRes;
    }

    public BookDTO deleteBook(String isbn) {
        BookDTO bookRes = new BookDTO();
        try {
            Optional<BookModel> bookOptional = bookRepo.findByIsbn(isbn);
            if (bookOptional.isPresent()) {
                bookRepo.deleteByIsbn(isbn);
                bookRes.setStatusCode(200);
                bookRes.setMensagem("Livro deletado");
            } else {
                bookRes.setStatusCode(404);
                bookRes.setMensagem("Livro não encontrado para deletar");
            }
        } catch (Exception e) {
            bookRes.setStatusCode(500);
            bookRes.setMensagem("Error occurred while deleting user: " + e.getMessage());
        }
        return bookRes;
    }


}
