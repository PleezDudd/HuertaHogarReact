package com.huertohogar.backend.service;

import com.huertohogar.backend.model.*;
import com.huertohogar.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrdenService {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private ItemOrdenRepository itemOrdenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarritoService carritoService;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Crea una nueva orden de compra a partir del carrito del usuario
     * @param usuarioId ID del usuario
     * @param direccion Dirección de envío
     * @param region Región de envío
     * @param comuna Comuna de envío
     * @param indicacion Indicaciones adicionales (opcional)
     * @return Orden creada
     */
    public Orden crearOrden(Long usuarioId, String direccion, String region, String comuna, String indicacion) {
        // Obtener el usuario
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + usuarioId));

        // Obtener el carrito del usuario
        Carrito carrito = carritoService.getBoletaCompra(usuarioId);
        
        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new RuntimeException("El carrito está vacío. No se puede crear la orden.");
        }

        // Calcular el total
        BigDecimal total = BigDecimal.ZERO;
        for (ItemCarrito item : carrito.getItems()) {
            if (item.getProducto() == null) {
                throw new RuntimeException("Error: item sin producto asociado");
            }
            BigDecimal precio = item.getProducto().getPrecio();
            BigDecimal cantidad = BigDecimal.valueOf(item.getCantidad());
            total = total.add(precio.multiply(cantidad));
        }

        // Crear la orden
        Orden orden = new Orden(usuario, direccion, region, comuna, indicacion, total);
        orden = ordenRepository.save(orden);

        // Crear los items de la orden y actualizar stock
        for (ItemCarrito itemCarrito : carrito.getItems()) {
            Producto producto = itemCarrito.getProducto();
            Integer cantidad = itemCarrito.getCantidad();

            // Verificar stock disponible
            if (producto.getStock() < cantidad) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre() + 
                        ". Disponible: " + producto.getStock() + ", Solicitado: " + cantidad);
            }

            // Crear item de orden
            ItemOrden itemOrden = new ItemOrden(
                    orden,
                    producto,
                    cantidad,
                    producto.getPrecio()
            );
            itemOrdenRepository.save(itemOrden);
            orden.getItems().add(itemOrden);

            // Actualizar stock del producto
            producto.setStock(producto.getStock() - cantidad);
            productoRepository.save(producto);
        }

        // Limpiar el carrito después de crear la orden
        carritoService.limpiarCarrito(usuarioId);

        // Refrescar la orden para asegurar que los items estén cargados
        return ordenRepository.findByIdWithItems(orden.getId())
                .orElseThrow(() -> new RuntimeException("Error al refrescar la orden después de crearla"));
    }

    /**
     * Obtiene todas las órdenes de un usuario
     * @param usuarioId ID del usuario
     * @return Lista de órdenes
     */
    public List<Orden> obtenerOrdenesPorUsuario(Long usuarioId) {
        return ordenRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Obtiene una orden por su ID
     * @param ordenId ID de la orden
     * @return Orden encontrada
     */
    public Optional<Orden> obtenerOrdenPorId(Long ordenId) {
        return ordenRepository.findByIdWithItems(ordenId);
    }

    /**
     * Obtiene todas las órdenes (para administradores)
     * @return Lista de todas las órdenes
     */
    public List<Orden> obtenerTodasLasOrdenes() {
        return ordenRepository.findAllWithItems();
    }

    /**
     * Actualiza el estado de una orden
     * @param ordenId ID de la orden
     * @param nuevoEstado Nuevo estado
     * @return Orden actualizada
     */
    public Orden actualizarEstado(Long ordenId, String nuevoEstado) {
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con id: " + ordenId));
        
        orden.setEstado(nuevoEstado);
        return ordenRepository.save(orden);
    }
}

