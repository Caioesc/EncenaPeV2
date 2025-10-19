package com.encenape.controller;

import com.encenape.dto.*;
import com.encenape.model.Usuario;
import com.encenape.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Endpoints relacionados aos usuários")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    
    private final UsuarioService usuarioService;
    
    @GetMapping("/me")
    @Operation(summary = "Obter perfil atual", description = "Retorna os dados do usuário autenticado")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal Usuario usuario) {
        UserResponse response = usuarioService.getCurrentUser(usuario);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me")
    @Operation(summary = "Atualizar perfil", description = "Atualiza os dados do perfil do usuário")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = usuarioService.updateProfile(usuario, request);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/me/password")
    @Operation(summary = "Alterar senha", description = "Altera a senha do usuário autenticado")
    public ResponseEntity<String> changePassword(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody ChangePasswordRequest request) {
        usuarioService.changePassword(usuario, request);
        return ResponseEntity.ok("Senha alterada com sucesso");
    }
}
