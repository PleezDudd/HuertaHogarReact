package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.ItemCarrito;
import com.huertohogar.backend.model.Producto;
import com.huertohogar.backend.model.Usuario;
import com.huertohogar.backend.repository.CarritoRepository;
import com.huertohogar.backend.repository.ItemCarritoRepository;
import com.huertohogar.backend.repository.ProductoRepository;
import com.huertohogar.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public Carrito getOrCreateCarrito(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        return carritoRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseGet(() -> {
                    Carrito nuevoCarrito = new Carrito(usuario);
                    return carritoRepository.save(nuevoCarrito);
                });
    }

    public Optional<Carrito> getCarritoByUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioIdAndActivoTrue(usuarioId);
    }

    public Carrito agregarProducto(Long usuarioId, Long productoId, Integer cantidad) {
        Carrito carrito = getOrCreateCarrito(usuarioId);
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productoId));

        if (!producto.getActivo()) {
            throw new RuntimeException("El producto no está disponible");
        }

        if (producto.getStock() < cantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStock());
        }

        // Buscar si el producto ya está en el carrito
        Optional<ItemCarrito> itemExistente = itemCarritoRepository.findByCarritoAndProducto(carrito, producto);

        if (itemExistente.isPresent()) {
            // Actualizar cantidad
            ItemCarrito item = itemExistente.get();
            int nuevaCantidad = item.getCantidad() + cantidad;
            if (producto.getStock() < nuevaCantidad) {
                throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStock());
            }
            item.setCantidad(nuevaCantidad);
            itemCarritoRepository.save(item);
        } else {
            // Crear nuevo item
            ItemCarrito nuevoItem = new ItemCarrito(carrito, producto, cantidad);
            itemCarritoRepository.save(nuevoItem);
            carrito.getItems().add(nuevoItem);
        }

        return carritoRepository.save(carrito);
    }

    public Carrito actualizarCantidad(Long usuarioId, Long itemId, Integer nuevaCantidad) {
        Carrito carrito = getOrCreateCarrito(usuarioId);
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con id: " + itemId));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new RuntimeException("El item no pertenece al carrito del usuario");
        }

        Producto producto = item.getProducto();
        if (producto.getStock() < nuevaCantidad) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + producto.getStock());
        }

        item.setCantidad(nuevaCantidad);
        itemCarritoRepository.save(item);
        return carritoRepository.save(carrito);
    }

    public Carrito eliminarProducto(Long usuarioId, Long itemId) {
        Carrito carrito = getOrCreateCarrito(usuarioId);
        ItemCarrito item = itemCarritoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item no encontrado con id: " + itemId));

        if (!item.getCarrito().getId().equals(carrito.getId())) {
            throw new RuntimeException("El item no pertenece al carrito del usuario");
        }

        itemCarritoRepository.delete(item);
        carrito.getItems().remove(item);
        return carritoRepository.save(carrito);
    }

    public void limpiarCarrito(Long usuarioId) {
        Carrito carrito = getOrCreateCarrito(usuarioId);
        itemCarritoRepository.deleteByCarrito(carrito);
        carrito.getItems().clear();
        carritoRepository.save(carrito);
    }

    public List<ItemCarrito> getItemsCarrito(Long usuarioId) {
        Carrito carrito = getOrCreateCarrito(usuarioId);
        return itemCarritoRepository.findByCarrito(carrito);
    }
}

