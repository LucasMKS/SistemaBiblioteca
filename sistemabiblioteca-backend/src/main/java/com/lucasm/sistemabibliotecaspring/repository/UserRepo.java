package com.lucasm.sistemabibliotecaspring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucasm.sistemabibliotecaspring.model.UserModel;

import java.util.List;
import java.util.Optional;

@Repository
@SuppressWarnings("null")
public interface UserRepo extends JpaRepository<UserModel, Integer> {

    Optional<UserModel> findByEmail(String email);
    Optional<UserModel> findById(Integer id);
    
    List<UserModel> findAll();
    UserModel findTopByOrderByMatriculaDesc();
}

