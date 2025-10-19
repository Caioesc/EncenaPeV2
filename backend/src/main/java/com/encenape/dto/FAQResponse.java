package com.encenape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FAQResponse {
    
    private Long id;
    private String pergunta;
    private String resposta;
    private String tags;
    private String categoria;
    private Integer ordem;
    private Boolean ativo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
