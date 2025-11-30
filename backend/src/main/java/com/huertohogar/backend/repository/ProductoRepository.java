package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByActivoTrue();
    
    List<Producto> findByCategoria(String categoria);
    
    List<Producto> findByCategoriaAndActivoTrue(String categoria);
    
    Optional<Producto> findByIdAndActivoTrue(Long id);
    
    List<Producto> findByNombreContainingIgnoreCase(String nombre);
}

