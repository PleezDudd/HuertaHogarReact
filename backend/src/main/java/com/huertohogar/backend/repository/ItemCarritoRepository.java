package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.ItemCarrito;
import com.huertohogar.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    
    @EntityGraph(attributePaths = {"producto"})
    @Query("SELECT i FROM ItemCarrito i WHERE i.carrito = :carrito")
    List<ItemCarrito> findByCarrito(@Param("carrito") Carrito carrito);
    
    Optional<ItemCarrito> findByCarritoAndProducto(Carrito carrito, Producto producto);
    
    void deleteByCarrito(Carrito carrito);
}

