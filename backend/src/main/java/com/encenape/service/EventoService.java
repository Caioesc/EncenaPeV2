package com.encenape.service;

import com.encenape.dto.EventoResponse;
import com.encenape.dto.CreateEventoRequest;
import com.encenape.dto.UpdateEventoRequest;
import com.encenape.model.Evento;
import com.encenape.model.Espaco;
import com.encenape.repository.EventoRepository;
import com.encenape.repository.EspacoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventoService {
    
    private final EventoRepository eventoRepository;
    private final EspacoRepository espacoRepository;
    
    public List<EventoResponse> getProximosEventos() {
        return eventoRepository.findProximosEventos(LocalDateTime.now())
                .stream()
                .map(this::mapToEventoResponse)
                .collect(Collectors.toList());
    }
    
    public Page<EventoResponse> getProximosEventosPaginados(Pageable pageable) {
        return eventoRepository.findProximosEventosPaginados(LocalDateTime.now(), pageable)
                .map(this::mapToEventoResponse);
    }
    
    public Page<EventoResponse> getEventosComFiltros(String categoria, String cidade, 
                                                     LocalDateTime dataInicio, LocalDateTime dataFim, 
                                                     String search, Pageable pageable) {
        return eventoRepository.findEventosComFiltros(categoria, cidade, dataInicio, dataFim, search, pageable)
                .map(this::mapToEventoResponse);
    }
    
    public List<String> getCategorias() {
        return eventoRepository.findCategoriasDistintas();
    }
    
    public List<String> getCidades() {
        return eventoRepository.findCidadesDistintas();
    }
    
    public EventoResponse getEventoById(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        return mapToEventoResponse(evento);
    }
    
    public List<EventoResponse> getEventosDisponiveis() {
        return eventoRepository.findEventosDisponiveis(LocalDateTime.now())
                .stream()
                .map(this::mapToEventoResponse)
                .collect(Collectors.toList());
    }
    
    private EventoResponse mapToEventoResponse(Evento evento) {
        EventoResponse response = new EventoResponse();
        response.setId(evento.getId());
        response.setTitulo(evento.getTitulo());
        response.setDescricao(evento.getDescricao());
        response.setCategoria(evento.getCategoria());
        response.setCidade(evento.getCidade());
        response.setLocal(evento.getLocal());
        response.setEndereco(evento.getEndereco());
        response.setDataHora(evento.getDataHora());
        response.setDuracaoMin(evento.getDuracaoMin());
        response.setPreco(evento.getPreco());
        response.setTotalTickets(evento.getTotalTickets());
        response.setTicketsAvailable(evento.getTicketsAvailable());
        response.setImagemUrl(evento.getImagemUrl());
        response.setAtivo(evento.getAtivo());
        response.setCreatedAt(evento.getCreatedAt());
        response.setUpdatedAt(evento.getUpdatedAt());
        
        if (evento.getEspaco() != null) {
            EventoResponse.EspacoResponse espacoResponse = new EventoResponse.EspacoResponse();
            espacoResponse.setId(evento.getEspaco().getId());
            espacoResponse.setNome(evento.getEspaco().getNome());
            espacoResponse.setDescricao(evento.getEspaco().getDescricao());
            espacoResponse.setEndereco(evento.getEspaco().getEndereco());
            espacoResponse.setCidade(evento.getEspaco().getCidade());
            espacoResponse.setCapacidade(evento.getEspaco().getCapacidade());
            espacoResponse.setDisponivel(evento.getEspaco().getDisponivel());
            response.setEspaco(espacoResponse);
        }
        
        return response;
    }
    
    // Métodos de administração
    @Transactional
    public EventoResponse criarEvento(CreateEventoRequest request) {
        Evento evento = new Evento();
        evento.setTitulo(request.getTitulo());
        evento.setDescricao(request.getDescricao());
        evento.setCategoria(request.getCategoria());
        evento.setCidade(request.getCidade());
        evento.setLocal(request.getLocal());
        evento.setEndereco(request.getEndereco());
        evento.setDataHora(request.getDataHora());
        evento.setDuracaoMin(request.getDuracaoMin());
        evento.setPreco(request.getPreco());
        evento.setTotalTickets(request.getTotalTickets());
        evento.setTicketsAvailable(request.getTotalTickets());
        evento.setImagemUrl(request.getImagemUrl());
        evento.setAtivo(true);
        
        if (request.getEspacoId() != null) {
            Espaco espaco = espacoRepository.findById(request.getEspacoId())
                    .orElseThrow(() -> new RuntimeException("Espaço não encontrado"));
            evento.setEspaco(espaco);
        }
        
        Evento savedEvento = eventoRepository.save(evento);
        return mapToEventoResponse(savedEvento);
    }
    
    @Transactional
    public EventoResponse atualizarEvento(Long id, UpdateEventoRequest request) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        if (request.getTitulo() != null) {
            evento.setTitulo(request.getTitulo());
        }
        if (request.getDescricao() != null) {
            evento.setDescricao(request.getDescricao());
        }
        if (request.getCategoria() != null) {
            evento.setCategoria(request.getCategoria());
        }
        if (request.getCidade() != null) {
            evento.setCidade(request.getCidade());
        }
        if (request.getLocal() != null) {
            evento.setLocal(request.getLocal());
        }
        if (request.getEndereco() != null) {
            evento.setEndereco(request.getEndereco());
        }
        if (request.getDataHora() != null) {
            evento.setDataHora(request.getDataHora());
        }
        if (request.getDuracaoMin() != null) {
            evento.setDuracaoMin(request.getDuracaoMin());
        }
        if (request.getPreco() != null) {
            evento.setPreco(request.getPreco());
        }
        if (request.getTotalTickets() != null) {
            evento.setTotalTickets(request.getTotalTickets());
        }
        if (request.getImagemUrl() != null) {
            evento.setImagemUrl(request.getImagemUrl());
        }
        if (request.getAtivo() != null) {
            evento.setAtivo(request.getAtivo());
        }
        if (request.getEspacoId() != null) {
            Espaco espaco = espacoRepository.findById(request.getEspacoId())
                    .orElseThrow(() -> new RuntimeException("Espaço não encontrado"));
            evento.setEspaco(espaco);
        }
        
        Evento savedEvento = eventoRepository.save(evento);
        return mapToEventoResponse(savedEvento);
    }
    
    @Transactional
    public void excluirEvento(Long id) {
        Evento evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        eventoRepository.delete(evento);
    }
    
    public Page<EventoResponse> getAllEventosAdmin(Pageable pageable) {
        return eventoRepository.findAll(pageable)
                .map(this::mapToEventoResponse);
    }
}
