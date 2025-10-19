package com.encenape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventoResponse {
    
    private Long id;
    private String titulo;
    private String descricao;
    private String categoria;
    private String cidade;
    private String local;
    private String endereco;
    private LocalDateTime dataHora;
    private Integer duracaoMin;
    private BigDecimal preco;
    private Integer totalTickets;
    private Integer ticketsAvailable;
    private String imagemUrl;
    private EspacoResponse espaco;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EspacoResponse {
        private Long id;
        private String nome;
        private String descricao;
        private String endereco;
        private String cidade;
        private Integer capacidade;
        private Boolean disponivel;
    }
}
