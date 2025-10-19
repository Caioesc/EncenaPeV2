package com.encenape.service;

import com.encenape.dto.EventoResponse;
import com.encenape.model.Evento;
import com.encenape.repository.EventoRepository;
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
}
