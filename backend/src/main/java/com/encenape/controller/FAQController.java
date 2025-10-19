package com.encenape.controller;

import com.encenape.dto.FAQResponse;
import com.encenape.service.FAQService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/faq")
@RequiredArgsConstructor
@Tag(name = "FAQ", description = "Endpoints relacionados às perguntas frequentes")
public class FAQController {
    
    private final FAQService faqService;
    
    @GetMapping
    @Operation(summary = "Listar FAQs", description = "Lista todas as perguntas frequentes")
    public ResponseEntity<List<FAQResponse>> getAllFAQs() {
        List<FAQResponse> faqs = faqService.getAllFAQs();
        return ResponseEntity.ok(faqs);
    }
    
    @GetMapping("/paginado")
    @Operation(summary = "Listar FAQs paginado", description = "Lista as perguntas frequentes com paginação")
    public ResponseEntity<Page<FAQResponse>> getAllFAQsPaginado(Pageable pageable) {
        Page<FAQResponse> faqs = faqService.getAllFAQsPaginado(pageable);
        return ResponseEntity.ok(faqs);
    }
    
    @GetMapping("/categoria/{categoria}")
    @Operation(summary = "Listar FAQs por categoria", description = "Lista FAQs filtradas por categoria")
    public ResponseEntity<List<FAQResponse>> getFAQsByCategoria(@PathVariable String categoria) {
        List<FAQResponse> faqs = faqService.getFAQsByCategoria(categoria);
        return ResponseEntity.ok(faqs);
    }
    
    @GetMapping("/search")
    @Operation(summary = "Buscar FAQs", description = "Busca FAQs por termo de pesquisa")
    public ResponseEntity<List<FAQResponse>> searchFAQs(
            @Parameter(description = "Termo de busca") @RequestParam(required = false) String query) {
        List<FAQResponse> faqs = faqService.searchFAQs(query);
        return ResponseEntity.ok(faqs);
    }
    
    @GetMapping("/search/paginado")
    @Operation(summary = "Buscar FAQs paginado", description = "Busca FAQs com paginação")
    public ResponseEntity<Page<FAQResponse>> searchFAQsPaginado(
            @Parameter(description = "Termo de busca") @RequestParam(required = false) String query,
            Pageable pageable) {
        Page<FAQResponse> faqs = faqService.searchFAQsPaginado(query, pageable);
        return ResponseEntity.ok(faqs);
    }
    
    @GetMapping("/categorias")
    @Operation(summary = "Listar categorias de FAQ", description = "Lista todas as categorias de FAQ disponíveis")
    public ResponseEntity<List<String>> getCategorias() {
        List<String> categorias = faqService.getCategorias();
        return ResponseEntity.ok(categorias);
    }
}
