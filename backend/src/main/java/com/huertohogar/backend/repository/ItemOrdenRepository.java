package com.huertohogar.backend.repository;

import com.huertohogar.backend.model.ItemOrden;
import com.huertohogar.backend.model.Orden;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemOrdenRepository extends JpaRepository<ItemOrden, Long> {
    
    @EntityGraph(attributePaths = {"producto"})
    @Query("SELECT i FROM ItemOrden i WHERE i.orden = :orden")
    List<ItemOrden> findByOrden(@Param("orden") Orden orden);
    
    void deleteByOrden(Orden orden);
}

