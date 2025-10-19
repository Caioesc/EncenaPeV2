package com.encenape.service;

import com.encenape.dto.FAQResponse;
import com.encenape.model.FAQ;
import com.encenape.repository.FAQRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FAQService {
    
    private final FAQRepository faqRepository;
    
    public List<FAQResponse> getAllFAQs() {
        return faqRepository.findAtivosOrderByOrdem()
                .stream()
                .map(this::mapToFAQResponse)
                .collect(Collectors.toList());
    }
    
    public Page<FAQResponse> getAllFAQsPaginado(Pageable pageable) {
        return faqRepository.findAtivosPaginado(pageable)
                .map(this::mapToFAQResponse);
    }
    
    public List<FAQResponse> getFAQsByCategoria(String categoria) {
        return faqRepository.findAtivosByCategoria(categoria)
                .stream()
                .map(this::mapToFAQResponse)
                .collect(Collectors.toList());
    }
    
    public List<FAQResponse> searchFAQs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllFAQs();
        }
        
        return faqRepository.searchByQuery(query.trim())
                .stream()
                .map(this::mapToFAQResponse)
                .collect(Collectors.toList());
    }
    
    public Page<FAQResponse> searchFAQsPaginado(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return getAllFAQsPaginado(pageable);
        }
        
        return faqRepository.searchByQueryPaginado(query.trim(), pageable)
                .map(this::mapToFAQResponse);
    }
    
    public List<String> getCategorias() {
        return faqRepository.findCategoriasDistintas();
    }
    
    private FAQResponse mapToFAQResponse(FAQ faq) {
        FAQResponse response = new FAQResponse();
        response.setId(faq.getId());
        response.setPergunta(faq.getPergunta());
        response.setResposta(faq.getResposta());
        response.setTags(faq.getTags());
        response.setCategoria(faq.getCategoria());
        response.setOrdem(faq.getOrdem());
        response.setAtivo(faq.getAtivo());
        response.setCreatedAt(faq.getCreatedAt());
        response.setUpdatedAt(faq.getUpdatedAt());
        return response;
    }
}
