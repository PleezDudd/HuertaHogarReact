package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByUsername(String username);
    
    Optional<Usuario> findByEmailAndActivoTrue(String email);
    
    List<Usuario> findByActivoTrue();
    
    List<Usuario> findByRol(String rol);
    
    boolean existsByEmail(String email);
    
    boolean existsByUsername(String username);
}

