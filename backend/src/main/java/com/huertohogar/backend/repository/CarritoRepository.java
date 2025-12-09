package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    
    @EntityGraph(attributePaths = {"items", "items.producto"})
    @Query("SELECT c FROM Carrito c WHERE c.usuario = :usuario AND c.activo = true")
    Optional<Carrito> findByUsuarioAndActivoTrue(@Param("usuario") Usuario usuario);
    
    @EntityGraph(attributePaths = {"items", "items.producto"})
    @Query("SELECT c FROM Carrito c WHERE c.usuario.id = :usuarioId AND c.activo = true")
    Optional<Carrito> findByUsuarioIdAndActivoTrue(@Param("usuarioId") Long usuarioId);
}

