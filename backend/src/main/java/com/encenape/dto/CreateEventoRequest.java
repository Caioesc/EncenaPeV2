package com.encenape.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateEventoRequest {
    
    @NotBlank(message = "Título é obrigatório")
    @Size(max = 500, message = "Título deve ter no máximo 500 caracteres")
    private String titulo;
    
    @Size(max = 2000, message = "Descrição deve ter no máximo 2000 caracteres")
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
    private LocalDateTime dataHora;
    
    @Min(value = 1, message = "Duração deve ser pelo menos 1 minuto")
    private Integer duracaoMin = 120;
    
    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.0", inclusive = false, message = "Preço deve ser positivo")
    @Digits(integer = 8, fraction = 2, message = "Preço deve ter no máximo 8 dígitos inteiros e 2 decimais")
    private BigDecimal preco;
    
    @Min(value = 1, message = "Total de tickets deve ser pelo menos 1")
    private Integer totalTickets = 100;
    
    @Size(max = 1024, message = "URL da imagem deve ter no máximo 1024 caracteres")
    private String imagemUrl;
    
    private Long espacoId;
}

