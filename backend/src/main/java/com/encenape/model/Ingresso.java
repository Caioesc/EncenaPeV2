package com.encenape.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ingressos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingresso {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evento_id", nullable = false)
    private Evento evento;
    
    @NotNull(message = "Quantidade é obrigatória")
    @Min(value = 1, message = "Quantidade deve ser pelo menos 1")
    @Column(nullable = false)
    private Integer quantidade = 1;
    
    @NotBlank(message = "Código é obrigatório")
    @Size(max = 200, message = "Código deve ter no máximo 200 caracteres")
    @Column(unique = true, nullable = false)
    private String codigo;
    
    @Size(max = 1024, message = "URL do QR Code deve ter no máximo 1024 caracteres")
    @Column(name = "qr_code_url")
    private String qrCodeUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusIngresso status = StatusIngresso.ACTIVE;
    
    @NotNull(message = "Valor total é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Valor total deve ser positivo")
    @Digits(integer = 8, fraction = 2, message = "Valor total deve ter no máximo 8 dígitos inteiros e 2 decimais")
    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal;
    
    @Size(max = 50, message = "Método de pagamento deve ter no máximo 50 caracteres")
    @Column(name = "metodo_pagamento")
    private String metodoPagamento;
    
    @Column(name = "cancel_reason", columnDefinition = "TEXT")
    private String cancelReason;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;
    
    @PrePersist
    public void prePersist() {
        if (codigo == null) {
            this.codigo = UUID.randomUUID().toString();
        }
    }
    
    public void cancelar(String motivo) {
        this.status = StatusIngresso.CANCELED;
        this.canceledAt = LocalDateTime.now();
        this.cancelReason = motivo;
    }
    
    public boolean isAtivo() {
        return status == StatusIngresso.ACTIVE;
    }
    
    public boolean podeCancelar() {
        return isAtivo() && evento.podeCancelar();
    }
    
    public enum StatusIngresso {
        ACTIVE, CANCELED
    }
}
