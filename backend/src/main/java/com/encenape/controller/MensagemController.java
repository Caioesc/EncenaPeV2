package com.encenape.controller;

import com.encenape.dto.MensagemRequest;
import com.encenape.dto.MensagemResponse;
import com.encenape.model.Usuario;
import com.encenape.service.MensagemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mensagens")
@RequiredArgsConstructor
@Tag(name = "Mensagens", description = "Endpoints relacionados às mensagens de suporte")
public class MensagemController {
    
    private final MensagemService mensagemService;
    
    @PostMapping
    @Operation(summary = "Criar mensagem", description = "Cria uma nova mensagem de suporte")
    public ResponseEntity<MensagemResponse> criarMensagem(@Valid @RequestBody MensagemRequest request) {
        MensagemResponse response = mensagemService.criarMensagem(request);
        return ResponseEntity.status(201).body(response);
    }
    
    @GetMapping
    @Operation(summary = "Listar todas as mensagens", description = "Lista todas as mensagens (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<MensagemResponse>> getAllMensagens(@AuthenticationPrincipal Usuario usuario) {
        // Verificar se é admin
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        
        List<MensagemResponse> mensagens = mensagemService.getAllMensagens();
        return ResponseEntity.ok(mensagens);
    }
    
    @GetMapping("/paginado")
    @Operation(summary = "Listar mensagens paginado", description = "Lista mensagens com paginação (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<MensagemResponse>> getAllMensagensPaginado(
            @AuthenticationPrincipal Usuario usuario,
            Pageable pageable) {
        // Verificar se é admin
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        
        Page<MensagemResponse> mensagens = mensagemService.getAllMensagensPaginado(pageable);
        return ResponseEntity.ok(mensagens);
    }
    
    @GetMapping("/abertas")
    @Operation(summary = "Listar mensagens abertas", description = "Lista apenas mensagens não respondidas (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<MensagemResponse>> getMensagensAbertas(@AuthenticationPrincipal Usuario usuario) {
        // Verificar se é admin
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        
        List<MensagemResponse> mensagens = mensagemService.getMensagensAbertas();
        return ResponseEntity.ok(mensagens);
    }
    
    @PostMapping("/{id}/responder")
    @Operation(summary = "Responder mensagem", description = "Responde uma mensagem de suporte (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<MensagemResponse> responderMensagem(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody String resposta) {
        // Verificar se é admin
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        
        MensagemResponse response = mensagemService.responderMensagem(id, resposta, usuario);
        return ResponseEntity.ok(response);
    }
}
