package com.encenape.repository;

import com.encenape.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.email = :email AND u.ativo = true")
    Optional<Usuario> findByEmailAndAtivoTrue(@Param("email") String email);
    
    @Query("SELECT u FROM Usuario u WHERE u.roles LIKE %:role%")
    java.util.List<Usuario> findByRolesContaining(@Param("role") String role);
}
