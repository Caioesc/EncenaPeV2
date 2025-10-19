package com.encenape.repository;

import com.encenape.model.FAQ;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
    
    @Query("SELECT f FROM FAQ f WHERE f.ativo = true ORDER BY f.ordem ASC, f.id ASC")
    List<FAQ> findAtivosOrderByOrdem();
    
    @Query("SELECT f FROM FAQ f WHERE f.ativo = true AND " +
           "(:categoria IS NULL OR f.categoria = :categoria) " +
           "ORDER BY f.ordem ASC, f.id ASC")
    List<FAQ> findAtivosByCategoria(@Param("categoria") String categoria);
    
    @Query("SELECT f FROM FAQ f WHERE f.ativo = true AND " +
           "(LOWER(f.pergunta) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.resposta) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.tags) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY f.ordem ASC, f.id ASC")
    List<FAQ> searchByQuery(@Param("query") String query);
    
    @Query("SELECT f FROM FAQ f WHERE f.ativo = true AND " +
           "(LOWER(f.pergunta) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.resposta) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(f.tags) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY f.ordem ASC, f.id ASC")
    Page<FAQ> searchByQueryPaginado(@Param("query") String query, Pageable pageable);
    
    @Query("SELECT DISTINCT f.categoria FROM FAQ f WHERE f.ativo = true AND f.categoria IS NOT NULL ORDER BY f.categoria")
    List<String> findCategoriasDistintas();
    
    @Query("SELECT f FROM FAQ f WHERE f.ativo = true ORDER BY f.ordem ASC, f.id ASC")
    Page<FAQ> findAtivosPaginado(Pageable pageable);
}
