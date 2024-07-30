package com.lucasm.sistemabibliotecaspring.service;

import com.lucasm.sistemabibliotecaspring.dto.ResponseDTO;
import com.lucasm.sistemabibliotecaspring.model.UserModel;
import com.lucasm.sistemabibliotecaspring.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;


    public ResponseDTO register(ResponseDTO registrationRequest){
        ResponseDTO resp = new ResponseDTO();

        try {

            // Verifica se o e-mail já está cadastrado
            if (usersRepo.findByEmail(registrationRequest.getEmail()).isPresent()) {
                resp.setStatusCode(400); // Bad Request
                resp.setMensagem("E-mail já cadastrado.");
                return resp;
            }

            // Gera a nova matrícula
            String newMatricula = generateNewMatricula();

            // Cria um novo usuário
            UserModel ourUser = new UserModel();
            ourUser.setName(registrationRequest.getName());
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setMatricula(newMatricula);
            if(registrationRequest.getRole() == null){
                ourUser.setRole("USER");
            }else{
                ourUser.setRole(registrationRequest.getRole());
            }
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            UserModel ourUsersResult = usersRepo.save(ourUser);
            if (ourUsersResult.getId()>0) {
                resp.setOurUsers((ourUsersResult));
                resp.setMensagem("Usuario cadastrado com sucesso");
                resp.setStatusCode(200);
            }

        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    private String generateNewMatricula() {
        UserModel lastUser = usersRepo.findTopByOrderByMatriculaDesc();
        if (lastUser != null && lastUser.getMatricula() != null) {
            int lastMatricula = Integer.parseInt(lastUser.getMatricula());
            return String.valueOf(lastMatricula + 1);
        }
        return "1"; // Se não houver matrícula anterior, inicia com "1"
    }

    public ResponseDTO login(ResponseDTO loginRequest) {
        ResponseDTO response = new ResponseDTO();
        try {
            // Autentica o usuário
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // Recupera o usuário do banco de dados
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

            // Preenche a resposta com os dados do usuário e tokens
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMensagem(user.getName() + " Logado com sucesso");

        } catch (UsernameNotFoundException e) {
            response.setStatusCode(404); // Not Found
            response.setMensagem("Usuário não encontrado.");
        } catch (BadCredentialsException e) {
            response.setStatusCode(401); // Unauthorized
            response.setMensagem("Credenciais inválidas.");
        } catch (Exception e) {
            response.setStatusCode(500); // Internal Server Error
            response.setMensagem("Credenciais inválidas.");
        }
        return response;
    }


    public ResponseDTO refreshToken(ResponseDTO refreshTokenReqiest){
        ResponseDTO response = new ResponseDTO();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            UserModel users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMensagem("Token recarregado com sucesso");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMensagem(e.getMessage());
            return response;
        }
    }


    public ResponseDTO getAllUsers() {
        ResponseDTO reqRes = new ResponseDTO();

        try {
            List<UserModel> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Sucesso");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Nenhum usuario encontrado");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ResponseDTO getUsersById(Integer id) {
        ResponseDTO reqRes = new ResponseDTO();
        try {
            UserModel usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("Usuario não encontrado"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMensagem("Usuario com o id '" + id + "' encontrado com sucesso");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ResponseDTO deleteUser(Integer userId) {
        ResponseDTO reqRes = new ResponseDTO();
        try {
            Optional<UserModel> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Usuario deletado");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Usuario não encontrado para deletar");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ResponseDTO updateUser(Integer userId, UserModel updatedUser) {
        ResponseDTO reqRes = new ResponseDTO();
        try {
            Optional<UserModel> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                UserModel existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setMatricula(updatedUser.getMatricula());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                UserModel savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMensagem("Usuario atualizado");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("Usuario não encontrado para atualizar");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ResponseDTO getMyInfo(String email){
        ResponseDTO reqRes = new ResponseDTO();
        try {
            Optional<UserModel> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMensagem("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMensagem("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMensagem("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }
}
