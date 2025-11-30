package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    Optional<Carrito> findByUsuarioAndActivoTrue(Usuario usuario);
    
    Optional<Carrito> findByUsuarioIdAndActivoTrue(Long usuarioId);
}

