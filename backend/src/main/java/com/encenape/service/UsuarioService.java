package com.encenape.service;

import com.encenape.dto.*;
import com.encenape.model.Usuario;
import com.encenape.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UserDetailsService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetTokenService passwordResetTokenService;
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmailAndAtivoTrue(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));
    }
    
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNome(request.getNome());
        usuario.setEmail(request.getEmail());
        usuario.setSenha(passwordEncoder.encode(request.getSenha()));
        usuario.setRoles("ROLE_USER");
        usuario.setAtivo(true);
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return mapToUserResponse(savedUsuario);
    }
    
    public LoginResponse login(LoginRequest request, com.encenape.security.JwtUtil jwtUtil) {
        Usuario usuario = (Usuario) loadUserByUsername(request.getEmail());
        
        if (!passwordEncoder.matches(request.getSenha(), usuario.getPassword())) {
            throw new RuntimeException("Credenciais inválidas");
        }
        
        String token = jwtUtil.generateToken(usuario);
        
        LoginResponse.UserResponse userResponse = new LoginResponse.UserResponse();
        userResponse.setId(usuario.getId());
        userResponse.setNome(usuario.getNome());
        userResponse.setEmail(usuario.getEmail());
        userResponse.setTelefone(usuario.getTelefone());
        userResponse.setAvatarUrl(usuario.getAvatarUrl());
        userResponse.setBio(usuario.getBio());
        userResponse.setRoles(Arrays.asList(usuario.getRoles().split(",")));
        
        return new LoginResponse(token, jwtUtil.getExpirationTime(), userResponse);
    }
    
    public UserResponse getCurrentUser(Usuario usuario) {
        return mapToUserResponse(usuario);
    }
    
    @Transactional
    public UserResponse updateProfile(Usuario usuario, UpdateProfileRequest request) {
        if (request.getNome() != null) {
            usuario.setNome(request.getNome());
        }
        if (request.getEmail() != null && !request.getEmail().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email já está em uso");
            }
            usuario.setEmail(request.getEmail());
        }
        if (request.getTelefone() != null) {
            usuario.setTelefone(request.getTelefone());
        }
        if (request.getAvatarUrl() != null) {
            usuario.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getBio() != null) {
            usuario.setBio(request.getBio());
        }
        
        Usuario savedUsuario = usuarioRepository.save(usuario);
        return mapToUserResponse(savedUsuario);
    }
    
    @Transactional
    public void changePassword(Usuario usuario, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), usuario.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        usuario.setSenha(passwordEncoder.encode(request.getNewPassword()));
        usuarioRepository.save(usuario);
    }
    
    public void forgotPassword(ForgotPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email não encontrado"));
        
        passwordResetTokenService.createPasswordResetToken(usuario);
    }
    
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        passwordResetTokenService.resetPassword(request.getEmail(), request.getToken(), request.getNewPassword());
    }
    
    private UserResponse mapToUserResponse(Usuario usuario) {
        UserResponse response = new UserResponse();
        response.setId(usuario.getId());
        response.setNome(usuario.getNome());
        response.setEmail(usuario.getEmail());
        response.setTelefone(usuario.getTelefone());
        response.setAvatarUrl(usuario.getAvatarUrl());
        response.setBio(usuario.getBio());
        response.setRoles(Arrays.asList(usuario.getRoles().split(",")));
        response.setAtivo(usuario.getAtivo());
        response.setCreatedAt(usuario.getCreatedAt());
        response.setUpdatedAt(usuario.getUpdatedAt());
        return response;
    }
}
