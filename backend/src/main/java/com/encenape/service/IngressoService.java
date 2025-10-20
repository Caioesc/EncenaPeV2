package com.encenape.service;

import com.encenape.dto.CompraIngressoRequest;
import com.encenape.dto.IngressoResponse;
import com.encenape.model.*;
import com.encenape.repository.EventoRepository;
import com.encenape.repository.IngressoRepository;
import com.encenape.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngressoService {
    
    private final IngressoRepository ingressoRepository;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private final QRCodeService qrCodeService;
    
    @Transactional
    public IngressoResponse comprarIngresso(Usuario usuario, CompraIngressoRequest request) {
        
        Evento evento = eventoRepository.findById(request.getEventoId())
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));
        
        // Verificar disponibilidade
        if (evento.getTicketsAvailable() < request.getQuantidade()) {
            throw new RuntimeException("Ingressos insuficientes. Disponível: " + evento.getTicketsAvailable());
        }
        
        // Verificar se o evento ainda está ativo e no futuro
        if (!evento.isDisponivel()) {
            throw new RuntimeException("Evento não está mais disponível");
        }
        
        // Calcular valor total
        BigDecimal valorTotal = evento.getPreco().multiply(BigDecimal.valueOf(request.getQuantidade()));
        
        // Processar pagamento (mock)
        processarPagamento(request.getPaymentMethod(), valorTotal);
        
        // Criar ingresso
        Ingresso ingresso = new Ingresso();
        ingresso.setUsuario(usuario);
        ingresso.setEvento(evento);
        ingresso.setQuantidade(request.getQuantidade());
        ingresso.setValorTotal(valorTotal);
        ingresso.setMetodoPagamento(request.getPaymentMethod());
        ingresso.setStatus(Ingresso.StatusIngresso.ACTIVE);
        
        Ingresso savedIngresso = ingressoRepository.save(ingresso);
        
        // Decrementar tickets disponíveis
        evento.setTicketsAvailable(evento.getTicketsAvailable() - request.getQuantidade());
        eventoRepository.save(evento);
        
        // Gerar QR Code
        String qrCodeUrl = qrCodeService.generateQRCode(savedIngresso.getCodigo());
        savedIngresso.setQrCodeUrl(qrCodeUrl);
        ingressoRepository.save(savedIngresso);
        
        // Enviar email de confirmação
        emailService.sendPurchaseConfirmationEmail(
            usuario.getEmail(),
            usuario.getNome(),
            evento.getTitulo(),
            savedIngresso.getCodigo()
        );
        
        return mapToIngressoResponse(savedIngresso);
    }
    
    public List<IngressoResponse> getIngressosByUsuario(Usuario usuario) {
        return ingressoRepository.findByUsuarioOrderByCreatedAtDesc(usuario)
                .stream()
                .map(this::mapToIngressoResponse)
                .collect(Collectors.toList());
    }
    
    public Page<IngressoResponse> getIngressosByUsuarioPaginado(Usuario usuario, Pageable pageable) {
        return ingressoRepository.findByUsuarioOrderByCreatedAtDesc(usuario, pageable)
                .map(this::mapToIngressoResponse);
    }
    
    public List<IngressoResponse> getIngressosAtivosByUsuario(Usuario usuario) {
        return ingressoRepository.findAtivosByUsuario(usuario)
                .stream()
                .map(this::mapToIngressoResponse)
                .collect(Collectors.toList());
    }
    
    public IngressoResponse getIngressoByCodigo(String codigo) {
        Ingresso ingresso = ingressoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado"));
        return mapToIngressoResponse(ingresso);
    }
    
    @Transactional
    public void cancelarIngresso(Long ingressoId, Usuario usuario, String motivo) {
        Ingresso ingresso = ingressoRepository.findById(ingressoId)
                .orElseThrow(() -> new RuntimeException("Ingresso não encontrado"));
        
        // Verificar se o ingresso pertence ao usuário
        if (!ingresso.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Ingresso não pertence ao usuário");
        }
        
        // Verificar se pode cancelar
        if (!ingresso.podeCancelar()) {
            throw new RuntimeException("Não é possível cancelar este ingresso. Prazo limite: 24h antes do evento");
        }
        
        // Verificar se já está cancelado
        if (ingresso.getStatus() == Ingresso.StatusIngresso.CANCELED) {
            throw new RuntimeException("Ingresso já está cancelado");
        }
        
        // Cancelar ingresso
        ingresso.cancelar(motivo);
        ingressoRepository.save(ingresso);
        
        // Devolver tickets ao evento
        Evento evento = ingresso.getEvento();
        evento.setTicketsAvailable(evento.getTicketsAvailable() + ingresso.getQuantidade());
        eventoRepository.save(evento);
        
        // Processar reembolso (mock)
        processarReembolso(ingresso.getValorTotal());
    }
    
    private void processarPagamento(String paymentMethod, BigDecimal valor) {
        // Mock de processamento de pagamento
        if ("mock".equals(paymentMethod)) {
            // Simular processamento bem-sucedido
            return;
        }
        // Aqui seria a integração real com gateway de pagamento (Stripe, PagSeguro, etc.)
        throw new RuntimeException("Método de pagamento não suportado: " + paymentMethod);
    }
    
    private void processarReembolso(BigDecimal valor) {
        // Mock de processamento de reembolso
        // Aqui seria a integração real com gateway de pagamento para reembolso
    }
    
    private IngressoResponse mapToIngressoResponse(Ingresso ingresso) {
        IngressoResponse response = new IngressoResponse();
        response.setId(ingresso.getId());
        response.setUsuarioId(ingresso.getUsuario().getId());
        response.setEventoId(ingresso.getEvento().getId());
        response.setQuantidade(ingresso.getQuantidade());
        response.setCodigo(ingresso.getCodigo());
        response.setQrCodeUrl(ingresso.getQrCodeUrl());
        response.setStatus(ingresso.getStatus().name());
        response.setValorTotal(ingresso.getValorTotal());
        response.setMetodoPagamento(ingresso.getMetodoPagamento());
        response.setCancelReason(ingresso.getCancelReason());
        response.setCreatedAt(ingresso.getCreatedAt());
        response.setCanceledAt(ingresso.getCanceledAt());
        
        // Mapear evento
        IngressoResponse.EventoResponse eventoResponse = new IngressoResponse.EventoResponse();
        eventoResponse.setId(ingresso.getEvento().getId());
        eventoResponse.setTitulo(ingresso.getEvento().getTitulo());
        eventoResponse.setCategoria(ingresso.getEvento().getCategoria());
        eventoResponse.setCidade(ingresso.getEvento().getCidade());
        eventoResponse.setLocal(ingresso.getEvento().getLocal());
        eventoResponse.setDataHora(ingresso.getEvento().getDataHora());
        eventoResponse.setPreco(ingresso.getEvento().getPreco());
        response.setEvento(eventoResponse);
        
        // Mapear usuário
        IngressoResponse.UserResponse userResponse = new IngressoResponse.UserResponse();
        userResponse.setId(ingresso.getUsuario().getId());
        userResponse.setNome(ingresso.getUsuario().getNome());
        userResponse.setEmail(ingresso.getUsuario().getEmail());
        response.setUsuario(userResponse);
        
        return response;
    }
}
