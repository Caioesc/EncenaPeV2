package com.encenape.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendPasswordResetEmail(String to, String nome, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Recuperação de Senha - EncenaPe");
            
            Context context = new Context();
            context.setVariable("nome", nome);
            context.setVariable("resetUrl", frontendUrl + "/reset-password?token=" + token + "&email=" + to);
            
            String htmlContent = templateEngine.process("password-reset", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Email de recuperação de senha enviado para: {}", to);
            
        } catch (MessagingException e) {
            log.error("Erro ao enviar email de recuperação de senha para: {}", to, e);
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }
    
    public void sendPurchaseConfirmationEmail(String to, String nome, String evento, String codigo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Confirmação de Compra - EncenaPe");
            
            Context context = new Context();
            context.setVariable("nome", nome);
            context.setVariable("evento", evento);
            context.setVariable("codigo", codigo);
            
            String htmlContent = templateEngine.process("purchase-confirmation", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("Email de confirmação de compra enviado para: {}", to);
            
        } catch (MessagingException e) {
            log.error("Erro ao enviar email de confirmação de compra para: {}", to, e);
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }
    
    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            log.info("Email simples enviado para: {}", to);
            
        } catch (Exception e) {
            log.error("Erro ao enviar email simples para: {}", to, e);
            throw new RuntimeException("Erro ao enviar email", e);
        }
    }
}
