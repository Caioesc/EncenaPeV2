package com.encenape.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensagens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Mensagem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Size(max = 255, message = "Remetente deve ter no máximo 255 caracteres")
    private String remetente;
    
    @NotBlank(message = "Texto é obrigatório")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;
    
    @Size(max = 255, message = "Email de contato deve ter no máximo 255 caracteres")
    @Column(name = "email_contato")
    private String emailContato;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusMensagem status = StatusMensagem.OPEN;
    
    @Column(columnDefinition = "TEXT")
    private String resposta;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_respondeu_id")
    private Usuario adminRespondeu;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "respondido_at")
    private LocalDateTime respondidoAt;
    
    public void responder(String resposta, Usuario admin) {
        this.resposta = resposta;
        this.adminRespondeu = admin;
        this.status = StatusMensagem.RESPONDED;
        this.respondidoAt = LocalDateTime.now();
    }
    
    public boolean isAberta() {
        return status == StatusMensagem.OPEN;
    }
    
    public enum StatusMensagem {
        OPEN, RESPONDED, CLOSED
    }
}
