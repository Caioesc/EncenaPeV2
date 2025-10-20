package com.encenape.controller;

import com.encenape.dto.EventoResponse;
import com.encenape.dto.CreateEventoRequest;
import com.encenape.dto.UpdateEventoRequest;
import com.encenape.model.Usuario;
import com.encenape.service.EventoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/eventos")
@RequiredArgsConstructor
@Tag(name = "Eventos", description = "Endpoints relacionados aos eventos")
public class EventoController {
    
    private final EventoService eventoService;
    
    @GetMapping
    @Operation(summary = "Listar eventos", description = "Lista eventos com filtros opcionais")
    public ResponseEntity<Page<EventoResponse>> getEventos(
            @Parameter(description = "Categoria do evento") @RequestParam(required = false) String categoria,
            @Parameter(description = "Cidade do evento") @RequestParam(required = false) String cidade,
            @Parameter(description = "Data de início (formato: yyyy-MM-ddTHH:mm:ss)") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataInicio,
            @Parameter(description = "Data de fim (formato: yyyy-MM-ddTHH:mm:ss)") 
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dataFim,
            @Parameter(description = "Termo de busca") @RequestParam(required = false) String search,
            Pageable pageable) {
        
        Page<EventoResponse> eventos = eventoService.getEventosComFiltros(categoria, cidade, dataInicio, dataFim, search, pageable);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/proximos")
    @Operation(summary = "Listar próximos eventos", description = "Lista os próximos eventos disponíveis")
    public ResponseEntity<List<EventoResponse>> getProximosEventos() {
        List<EventoResponse> eventos = eventoService.getProximosEventos();
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/proximos/paginado")
    @Operation(summary = "Listar próximos eventos paginado", description = "Lista os próximos eventos com paginação")
    public ResponseEntity<Page<EventoResponse>> getProximosEventosPaginado(Pageable pageable) {
        Page<EventoResponse> eventos = eventoService.getProximosEventosPaginados(pageable);
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/disponiveis")
    @Operation(summary = "Listar eventos disponíveis", description = "Lista eventos com ingressos disponíveis")
    public ResponseEntity<List<EventoResponse>> getEventosDisponiveis() {
        List<EventoResponse> eventos = eventoService.getEventosDisponiveis();
        return ResponseEntity.ok(eventos);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obter evento por ID", description = "Retorna os detalhes de um evento específico")
    public ResponseEntity<EventoResponse> getEventoById(@PathVariable Long id) {
        EventoResponse evento = eventoService.getEventoById(id);
        return ResponseEntity.ok(evento);
    }
    
    @GetMapping("/categorias")
    @Operation(summary = "Listar categorias", description = "Lista todas as categorias de eventos")
    public ResponseEntity<List<String>> getCategorias() {
        List<String> categorias = eventoService.getCategorias();
        return ResponseEntity.ok(categorias);
    }
    
    @GetMapping("/cidades")
    @Operation(summary = "Listar cidades", description = "Lista todas as cidades com eventos")
    public ResponseEntity<List<String>> getCidades() {
        List<String> cidades = eventoService.getCidades();
        return ResponseEntity.ok(cidades);
    }
    
    // Endpoints de administração
    @PostMapping("/admin")
    @Operation(summary = "Criar evento", description = "Cria um novo evento (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EventoResponse> criarEvento(
            @AuthenticationPrincipal Usuario usuario,
            @Valid @RequestBody CreateEventoRequest request) {
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        EventoResponse response = eventoService.criarEvento(request);
        return ResponseEntity.status(201).body(response);
    }
    
    @PutMapping("/admin/{id}")
    @Operation(summary = "Atualizar evento", description = "Atualiza um evento existente (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EventoResponse> atualizarEvento(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long id,
            @Valid @RequestBody UpdateEventoRequest request) {
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        EventoResponse response = eventoService.atualizarEvento(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/admin/{id}")
    @Operation(summary = "Excluir evento", description = "Exclui um evento (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<String> excluirEvento(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long id) {
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        eventoService.excluirEvento(id);
        return ResponseEntity.ok("Evento excluído com sucesso");
    }
    
    @GetMapping("/admin")
    @Operation(summary = "Listar todos os eventos (admin)", description = "Lista todos os eventos incluindo inativos (apenas para administradores)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<EventoResponse>> getAllEventosAdmin(
            @AuthenticationPrincipal Usuario usuario,
            Pageable pageable) {
        if (!usuario.isAdmin()) {
            return ResponseEntity.status(403).build();
        }
        Page<EventoResponse> eventos = eventoService.getAllEventosAdmin(pageable);
        return ResponseEntity.ok(eventos);
    }
}
