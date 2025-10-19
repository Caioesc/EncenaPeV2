package com.encenape.controller;

import com.encenape.dto.EventoResponse;
import com.encenape.service.EventoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
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
}
