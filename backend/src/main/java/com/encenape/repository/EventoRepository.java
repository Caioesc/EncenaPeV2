package com.encenape.repository;

import com.encenape.model.Evento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, Long> {
    
    @Query("SELECT e FROM Evento e WHERE e.ativo = true AND e.dataHora > :now ORDER BY e.dataHora ASC")
    List<Evento> findProximosEventos(@Param("now") LocalDateTime now);
    
    @Query("SELECT e FROM Evento e WHERE e.ativo = true AND e.dataHora > :now ORDER BY e.dataHora ASC")
    Page<Evento> findProximosEventosPaginados(@Param("now") LocalDateTime now, Pageable pageable);
    
    @Query("SELECT e FROM Evento e WHERE e.ativo = true AND " +
           "(:categoria IS NULL OR e.categoria = :categoria) AND " +
           "(:cidade IS NULL OR e.cidade = :cidade) AND " +
           "(:dataInicio IS NULL OR e.dataHora >= :dataInicio) AND " +
           "(:dataFim IS NULL OR e.dataHora <= :dataFim) AND " +
           "(:search IS NULL OR LOWER(e.titulo) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.descricao) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.dataHora ASC")
    Page<Evento> findEventosComFiltros(@Param("categoria") String categoria,
                                      @Param("cidade") String cidade,
                                      @Param("dataInicio") LocalDateTime dataInicio,
                                      @Param("dataFim") LocalDateTime dataFim,
                                      @Param("search") String search,
                                      Pageable pageable);
    
    @Query("SELECT DISTINCT e.categoria FROM Evento e WHERE e.ativo = true AND e.categoria IS NOT NULL ORDER BY e.categoria")
    List<String> findCategoriasDistintas();
    
    @Query("SELECT DISTINCT e.cidade FROM Evento e WHERE e.ativo = true AND e.cidade IS NOT NULL ORDER BY e.cidade")
    List<String> findCidadesDistintas();
    
    @Query("SELECT e FROM Evento e WHERE e.ativo = true AND e.ticketsAvailable > 0 AND e.dataHora > :now ORDER BY e.dataHora ASC")
    List<Evento> findEventosDisponiveis(@Param("now") LocalDateTime now);
}
