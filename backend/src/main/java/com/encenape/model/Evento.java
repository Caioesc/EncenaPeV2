package com.encenape.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "eventos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evento {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Título é obrigatório")
    @Size(max = 500, message = "Título deve ter no máximo 500 caracteres")
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    @Size(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    private String categoria;
    
    @Size(max = 150, message = "Cidade deve ter no máximo 150 caracteres")
    private String cidade;
    
    @Size(max = 255, message = "Local deve ter no máximo 255 caracteres")
    private String local;
    
    @Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
    private String endereco;
    
    @NotNull(message = "Data e hora são obrigatórias")
    @Future(message = "Data deve ser futura")
    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;
    
    @Min(value = 1, message = "Duração deve ser pelo menos 1 minuto")
    @Column(name = "duracao_min")
    private Integer duracaoMin = 120;
    
    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser positivo")
    @Digits(integer = 8, fraction = 2, message = "Preço deve ter no máximo 8 dígitos inteiros e 2 decimais")
    @Column(nullable = false)
    private BigDecimal preco;
    
    @Min(value = 0, message = "Total de tickets não pode ser negativo")
    @Column(name = "total_tickets")
    private Integer totalTickets = 0;
    
    @Min(value = 0, message = "Tickets disponíveis não pode ser negativo")
    @Column(name = "tickets_available")
    private Integer ticketsAvailable = 0;
    
    @Size(max = 1024, message = "URL da imagem deve ter no máximo 1024 caracteres")
    @Column(name = "imagem_url")
    private String imagemUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "espaco_id")
    private Espaco espaco;
    
    @Column(nullable = false)
    private Boolean ativo = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    public boolean isDisponivel() {
        return ativo && ticketsAvailable > 0 && dataHora.isAfter(LocalDateTime.now());
    }
    
    public boolean podeCancelar() {
        return dataHora.isAfter(LocalDateTime.now().plusHours(24));
    }
}
