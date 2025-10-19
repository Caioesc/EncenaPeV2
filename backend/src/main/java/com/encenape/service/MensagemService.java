package com.encenape.service;

import com.encenape.dto.MensagemRequest;
import com.encenape.dto.MensagemResponse;
import com.encenape.model.Mensagem;
import com.encenape.model.Usuario;
import com.encenape.repository.MensagemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MensagemService {
    
    private final MensagemRepository mensagemRepository;
    private final EmailService emailService;
    
    @Transactional
    public MensagemResponse criarMensagem(MensagemRequest request) {
        Mensagem mensagem = new Mensagem();
        mensagem.setRemetente(request.getRemetente());
        mensagem.setTexto(request.getTexto());
        mensagem.setEmailContato(request.getEmailContato());
        mensagem.setStatus(Mensagem.StatusMensagem.OPEN);
        
        Mensagem savedMensagem = mensagemRepository.save(mensagem);
        
        // Notificar administradores por email (opcional)
        try {
            emailService.sendSimpleEmail(
                "admin@encenape.com",
                "Nova mensagem de suporte - EncenaPe",
                "Nova mensagem recebida:\n\n" +
                "Remetente: " + (request.getRemetente() != null ? request.getRemetente() : "Anônimo") + "\n" +
                "Email: " + (request.getEmailContato() != null ? request.getEmailContato() : "Não informado") + "\n" +
                "Mensagem: " + request.getTexto()
            );
        } catch (Exception e) {
            // Log do erro mas não falha a operação
            System.err.println("Erro ao enviar notificação por email: " + e.getMessage());
        }
        
        return mapToMensagemResponse(savedMensagem);
    }
    
    public List<MensagemResponse> getAllMensagens() {
        return mensagemRepository.findAll()
                .stream()
                .map(this::mapToMensagemResponse)
                .collect(Collectors.toList());
    }
    
    public Page<MensagemResponse> getAllMensagensPaginado(Pageable pageable) {
        return mensagemRepository.findAll(pageable)
                .map(this::mapToMensagemResponse);
    }
    
    public List<MensagemResponse> getMensagensAbertas() {
        return mensagemRepository.findAll()
                .stream()
                .filter(m -> m.getStatus() == Mensagem.StatusMensagem.OPEN)
                .map(this::mapToMensagemResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public MensagemResponse responderMensagem(Long mensagemId, String resposta, Usuario admin) {
        Mensagem mensagem = mensagemRepository.findById(mensagemId)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada"));
        
        mensagem.responder(resposta, admin);
        Mensagem savedMensagem = mensagemRepository.save(mensagem);
        
        // Enviar resposta por email se houver email de contato
        if (mensagem.getEmailContato() != null && !mensagem.getEmailContato().trim().isEmpty()) {
            try {
                emailService.sendSimpleEmail(
                    mensagem.getEmailContato(),
                    "Resposta - Suporte EncenaPe",
                    "Olá " + (mensagem.getRemetente() != null ? mensagem.getRemetente() : "") + ",\n\n" +
                    "Obrigado por entrar em contato conosco. Aqui está nossa resposta:\n\n" +
                    resposta + "\n\n" +
                    "Se você tiver mais dúvidas, não hesite em nos contatar novamente.\n\n" +
                    "Atenciosamente,\nEquipe EncenaPe"
                );
            } catch (Exception e) {
                System.err.println("Erro ao enviar resposta por email: " + e.getMessage());
            }
        }
        
        return mapToMensagemResponse(savedMensagem);
    }
    
    private MensagemResponse mapToMensagemResponse(Mensagem mensagem) {
        MensagemResponse response = new MensagemResponse();
        response.setId(mensagem.getId());
        response.setRemetente(mensagem.getRemetente());
        response.setTexto(mensagem.getTexto());
        response.setEmailContato(mensagem.getEmailContato());
        response.setStatus(mensagem.getStatus().name());
        response.setResposta(mensagem.getResposta());
        response.setAdminRespondeu(mensagem.getAdminRespondeu() != null ? mensagem.getAdminRespondeu().getNome() : null);
        response.setCreatedAt(mensagem.getCreatedAt());
        response.setRespondidoAt(mensagem.getRespondidoAt());
        return response;
    }
}
