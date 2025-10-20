package com.encenape.controller;

import com.encenape.dto.CompraIngressoRequest;
import com.encenape.dto.IngressoResponse;
import com.encenape.model.Usuario;
import com.encenape.service.IngressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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
@RequestMapping("/ingressos")
@RequiredArgsConstructor
@Tag(name = "Ingressos", description = "Endpoints relacionados aos ingressos")
@SecurityRequirement(name = "bearerAuth")
public class IngressoController {
    
    private final IngressoService ingressoService;
    
    @PostMapping
    @Operation(summary = "Comprar ingresso", description = "Realiza a compra de ingressos para um evento")
    public ResponseEntity<IngressoResponse> comprarIngresso(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CompraIngressoRequest request) {
        IngressoResponse response = ingressoService.comprarIngresso(usuario, request);
        return ResponseEntity.status(201).body(response);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Listar meus ingressos", description = "Lista todos os ingressos do usuário autenticado")
    public ResponseEntity<List<IngressoResponse>> getMeusIngressos(@AuthenticationPrincipal Usuario usuario) {
        List<IngressoResponse> ingressos = ingressoService.getIngressosByUsuario(usuario);
        return ResponseEntity.ok(ingressos);
    }
    
    @GetMapping("/me/paginado")
    @Operation(summary = "Listar meus ingressos paginado", description = "Lista os ingressos do usuário com paginação")
    public ResponseEntity<Page<IngressoResponse>> getMeusIngressosPaginado(
            @AuthenticationPrincipal Usuario usuario, 
            Pageable pageable) {
        Page<IngressoResponse> ingressos = ingressoService.getIngressosByUsuarioPaginado(usuario, pageable);
        return ResponseEntity.ok(ingressos);
    }
    
    @GetMapping("/me/ativos")
    @Operation(summary = "Listar ingressos ativos", description = "Lista apenas os ingressos ativos do usuário")
    public ResponseEntity<List<IngressoResponse>> getIngressosAtivos(@AuthenticationPrincipal Usuario usuario) {
        List<IngressoResponse> ingressos = ingressoService.getIngressosAtivosByUsuario(usuario);
        return ResponseEntity.ok(ingressos);
    }
    
    @GetMapping("/codigo/{codigo}")
    @Operation(summary = "Obter ingresso por código", description = "Retorna os detalhes de um ingresso pelo código")
    public ResponseEntity<IngressoResponse> getIngressoByCodigo(@PathVariable String codigo) {
        IngressoResponse ingresso = ingressoService.getIngressoByCodigo(codigo);
        return ResponseEntity.ok(ingresso);
    }
    
    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancelar ingresso", description = "Cancela um ingresso do usuário autenticado")
    public ResponseEntity<String> cancelarIngresso(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @Parameter(description = "Motivo do cancelamento") @RequestParam(required = false) String motivo) {
        
        ingressoService.cancelarIngresso(id, usuario, motivo != null ? motivo : "Cancelamento solicitado pelo usuário");
        return ResponseEntity.ok("Ingresso cancelado com sucesso");
    }
}
