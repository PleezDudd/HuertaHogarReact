package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Producto;
import com.huertohogar.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    public List<Producto> getAllActivos() {
        return productoRepository.findByActivoTrue();
    }

    public Optional<Producto> getById(Long id) {
        return productoRepository.findById(id);
    }

    public Optional<Producto> getByIdActivo(Long id) {
        return productoRepository.findByIdAndActivoTrue(id);
    }

    public List<Producto> getByCategoria(String categoria) {
        return productoRepository.findByCategoriaAndActivoTrue(categoria);
    }

    public List<Producto> searchByNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public Producto save(Producto producto) {
        if (producto.getActivo() == null) {
            producto.setActivo(true);
        }
        return productoRepository.save(producto);
    }

    public Producto update(Long id, Producto productoActualizado) {
        return productoRepository.findById(id)
                .map(producto -> {
                    producto.setNombre(productoActualizado.getNombre());
                    producto.setDescripcion(productoActualizado.getDescripcion());
                    producto.setPrecio(productoActualizado.getPrecio());
                    producto.setCategoria(productoActualizado.getCategoria());
                    producto.setImagen(productoActualizado.getImagen());
                    producto.setStock(productoActualizado.getStock());
                    if (productoActualizado.getActivo() != null) {
                        producto.setActivo(productoActualizado.getActivo());
                    }
                    return productoRepository.save(producto);
                })
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    public void delete(Long id) {
        productoRepository.findById(id)
                .ifPresentOrElse(
                        producto -> {
                            producto.setActivo(false);
                            productoRepository.save(producto);
                        },
                        () -> {
                            throw new RuntimeException("Producto no encontrado con id: " + id);
                        }
                );
    }

    public void deletePermanente(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con id: " + id);
        }
        productoRepository.deleteById(id);
    }
}

