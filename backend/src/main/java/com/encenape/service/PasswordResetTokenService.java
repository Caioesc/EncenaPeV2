package com.encenape.service;

import com.encenape.model.PasswordResetToken;
import com.encenape.model.Usuario;
import com.encenape.repository.PasswordResetTokenRepository;
import com.encenape.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PasswordResetTokenService {
    
    private final PasswordResetTokenRepository tokenRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int TOKEN_LENGTH = 32;
    
    @Transactional
    public void createPasswordResetToken(Usuario usuario) {
        // Invalidar tokens existentes
        tokenRepository.invalidateTokensByUsuario(usuario);
        
        // Gerar novo token
        String token = generateSecureToken();
        String tokenHash = passwordEncoder.encode(token);
        
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUsuario(usuario);
        resetToken.setTokenHash(tokenHash);
        resetToken.setExpiresAt(LocalDateTime.now().plusHours(1)); // Token válido por 1 hora
        resetToken.setUsed(false);
        
        tokenRepository.save(resetToken);
        
        // Enviar email com o token
        emailService.sendPasswordResetEmail(usuario.getEmail(), usuario.getNome(), token);
    }
    
    @Transactional
    public void resetPassword(String email, String token, String newPassword) {
        Usuario usuario = usuarioRepository.findByEmailAndAtivoTrue(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        PasswordResetToken resetToken = tokenRepository.findByTokenHash(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));
        
        if (!resetToken.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Token inválido para este usuário");
        }
        
        if (!resetToken.isValid()) {
            throw new RuntimeException("Token expirado ou já utilizado");
        }
        
        // Atualizar senha
        usuario.setSenha(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
        
        // Marcar token como usado
        resetToken.markAsUsed();
        tokenRepository.save(resetToken);
    }
    
    private String generateSecureToken() {
        byte[] randomBytes = new byte[TOKEN_LENGTH];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
    
    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
    }
}
