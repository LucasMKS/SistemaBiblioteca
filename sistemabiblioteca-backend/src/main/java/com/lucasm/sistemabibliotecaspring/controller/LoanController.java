package com.lucasm.sistemabibliotecaspring.controller;

import com.lucasm.sistemabibliotecaspring.dto.LoanDTO;
import com.lucasm.sistemabibliotecaspring.model.LoanModel;
import com.lucasm.sistemabibliotecaspring.service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/book/register-loan")
    public ResponseEntity<LoanDTO> registerBook(@RequestBody LoanDTO reg){
        return ResponseEntity.ok(loanService.registerLoan(reg));
    }

    @PutMapping("/admin/update-loan/{matricula}/{bookIsbn}")
    public ResponseEntity<LoanDTO> updateBook(@PathVariable String matricula, @PathVariable String bookIsbn, @RequestBody LoanModel loanRes){
        return ResponseEntity.ok(loanService.updateLoan(matricula, bookIsbn, loanRes));
    }

    @GetMapping("/book/getLoan/{matricula}")
    public ResponseEntity<LoanDTO> getLoanByMatricula(@PathVariable String matricula){
        return ResponseEntity.ok(loanService.getLoanByMatricula(matricula));
    }
    
    
    @DeleteMapping("/admin/delete-loan/{matricula}/{bookIsbn}")
    public ResponseEntity<LoanDTO> deleteUSer(@PathVariable String matricula, @PathVariable String bookIsbn){
        return ResponseEntity.ok(loanService.deleteLoan(matricula, bookIsbn));
    }
}
