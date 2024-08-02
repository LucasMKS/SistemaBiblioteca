package com.lucasm.sistemabibliotecaspring.controller;

import com.lucasm.sistemabibliotecaspring.dto.ResponseDTO;
import com.lucasm.sistemabibliotecaspring.model.UserModel;
import com.lucasm.sistemabibliotecaspring.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<ResponseDTO> regeister(@RequestBody ResponseDTO reg){
        return ResponseEntity.ok(userService.register(reg));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody ResponseDTO req){
        return ResponseEntity.ok(userService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ResponseDTO> refreshToken(@RequestBody ResponseDTO req){
        return ResponseEntity.ok(userService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ResponseDTO> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ResponseDTO> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(userService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ResponseDTO> updateUser(@PathVariable Integer userId, @RequestBody UserModel reqres){
        return ResponseEntity.ok(userService.updateUser(userId, reqres));
    }

    @PutMapping("/adminuser/update/{userId}")
    public ResponseEntity<ResponseDTO> userUpdateEmail(@PathVariable Integer userId, @RequestBody UserModel reqres){
        return ResponseEntity.ok(userService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ResponseDTO> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ResponseDTO response = userService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ResponseDTO> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(userService.deleteUser(userId));
    }


}