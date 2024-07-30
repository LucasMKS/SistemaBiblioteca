package com.lucasm.sistemabibliotecaspring.controller;

import com.lucasm.sistemabibliotecaspring.dto.BookDTO;
import com.lucasm.sistemabibliotecaspring.model.BookModel;
import com.lucasm.sistemabibliotecaspring.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping("/book/get-all-books")
    public ResponseEntity<BookDTO> getAllBooks(){
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/book/getBook/{bookIsbn}")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable String bookIsbn){
        return ResponseEntity.ok(bookService.getBookByIsbn(bookIsbn));
    }

    @PostMapping("/admin/register-book")
    public ResponseEntity<BookDTO> registerBook(@RequestBody BookDTO reg){
        return ResponseEntity.ok(bookService.registerBook(reg));
    }

    @PutMapping("/admin/update-book/{bookIsbn}")
    public ResponseEntity<BookDTO> updateBook(@PathVariable String bookIsbn, @RequestBody BookModel bookRes){
        return ResponseEntity.ok(bookService.updateBook(bookIsbn, bookRes));
    }

    @DeleteMapping("/admin/delete-book/{bookIsbn}")
    public ResponseEntity<BookDTO> deleteUSer(@PathVariable String bookIsbn){
        return ResponseEntity.ok(bookService.deleteBook(bookIsbn));
    }

}
