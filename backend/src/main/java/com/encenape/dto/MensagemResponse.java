package com.encenape.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MensagemResponse {
    
    private Long id;
    private String remetente;
    private String texto;
    private String emailContato;
    private String status;
    private String resposta;
    private String adminRespondeu;
    private LocalDateTime createdAt;
    private LocalDateTime respondidoAt;
}
