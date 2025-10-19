package com.encenape.repository;

import com.encenape.model.Ingresso;
import com.encenape.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IngressoRepository extends JpaRepository<Ingresso, Long> {
    
    List<Ingresso> findByUsuarioOrderByCreatedAtDesc(Usuario usuario);
    
    Page<Ingresso> findByUsuarioOrderByCreatedAtDesc(Usuario usuario, Pageable pageable);
    
    @Query("SELECT i FROM Ingresso i WHERE i.usuario = :usuario AND i.status = 'ACTIVE' ORDER BY i.createdAt DESC")
    List<Ingresso> findAtivosByUsuario(@Param("usuario") Usuario usuario);
    
    @Query("SELECT i FROM Ingresso i WHERE i.usuario = :usuario AND i.status = 'CANCELED' ORDER BY i.createdAt DESC")
    List<Ingresso> findCanceladosByUsuario(@Param("usuario") Usuario usuario);
    
    Optional<Ingresso> findByCodigo(String codigo);
    
    @Query("SELECT COUNT(i) FROM Ingresso i WHERE i.evento.id = :eventoId AND i.status = 'ACTIVE'")
    Long countIngressosAtivosByEvento(@Param("eventoId") Long eventoId);
    
    @Query("SELECT i FROM Ingresso i WHERE i.evento.id = :eventoId AND i.status = 'ACTIVE'")
    List<Ingresso> findAtivosByEvento(@Param("eventoId") Long eventoId);
    
    @Modifying
    @Query("UPDATE Ingresso i SET i.status = 'CANCELED', i.canceledAt = :now, i.cancelReason = :motivo WHERE i.id = :id")
    int cancelarIngresso(@Param("id") Long id, @Param("now") LocalDateTime now, @Param("motivo") String motivo);
    
    @Query("SELECT i FROM Ingresso i WHERE i.usuario = :usuario AND i.evento.dataHora > :now ORDER BY i.createdAt DESC")
    List<Ingresso> findFuturosByUsuario(@Param("usuario") Usuario usuario, @Param("now") LocalDateTime now);
}
