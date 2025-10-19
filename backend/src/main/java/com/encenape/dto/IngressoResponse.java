package com.encenape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IngressoResponse {
    
    private Long id;
    private Long usuarioId;
    private Long eventoId;
    private Integer quantidade;
    private String codigo;
    private String qrCodeUrl;
    private String status;
    private BigDecimal valorTotal;
    private String metodoPagamento;
    private String cancelReason;
    private LocalDateTime createdAt;
    private LocalDateTime canceledAt;
    private EventoResponse evento;
    private UserResponse usuario;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventoResponse {
        private Long id;
        private String titulo;
        private String categoria;
        private String cidade;
        private String local;
        private LocalDateTime dataHora;
        private BigDecimal preco;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String nome;
        private String email;
    }
}
