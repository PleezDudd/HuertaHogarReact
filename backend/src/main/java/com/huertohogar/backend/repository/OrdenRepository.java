package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Orden;
import com.huertohogar.backend.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {
    
    @EntityGraph(attributePaths = {"items", "items.producto", "usuario"})
    @Query("SELECT o FROM Orden o WHERE o.usuario = :usuario ORDER BY o.fechaCreacion DESC")
    List<Orden> findByUsuario(@Param("usuario") Usuario usuario);
    
    @EntityGraph(attributePaths = {"items", "items.producto", "usuario"})
    @Query("SELECT o FROM Orden o WHERE o.usuario.id = :usuarioId ORDER BY o.fechaCreacion DESC")
    List<Orden> findByUsuarioId(@Param("usuarioId") Long usuarioId);
    
    @EntityGraph(attributePaths = {"items", "items.producto", "usuario"})
    @Query("SELECT o FROM Orden o WHERE o.id = :id")
    Optional<Orden> findByIdWithItems(@Param("id") Long id);
    
    @EntityGraph(attributePaths = {"items", "items.producto", "usuario"})
    @Query("SELECT o FROM Orden o ORDER BY o.fechaCreacion DESC")
    List<Orden> findAllWithItems();
}

