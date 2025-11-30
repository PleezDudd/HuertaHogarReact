package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.ItemCarrito;
import com.huertohogar.backend.service.CarritoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Carrito", description = "API para gestión de carritos de compra")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<Carrito> getCarrito(@PathVariable Long usuarioId) {
        Optional<Carrito> carrito = carritoService.getCarritoByUsuario(usuarioId);
        return carrito.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}/items")
    public ResponseEntity<List<ItemCarrito>> getItems(@PathVariable Long usuarioId) {
        try {
            List<ItemCarrito> items = carritoService.getItemsCarrito(usuarioId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PostMapping("/usuario/{usuarioId}/agregar")
    public ResponseEntity<?> agregarProducto(
            @PathVariable Long usuarioId,
            @RequestBody Map<String, Object> request) {
        try {
            Long productoId = Long.valueOf(request.get("productoId").toString());
            Integer cantidad = Integer.valueOf(request.get("cantidad").toString());
            
            Carrito carrito = carritoService.agregarProducto(usuarioId, productoId, cantidad);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al agregar producto al carrito");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping("/usuario/{usuarioId}/item/{itemId}")
    public ResponseEntity<?> actualizarCantidad(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> request) {
        try {
            Integer nuevaCantidad = request.get("cantidad");
            Carrito carrito = carritoService.actualizarCantidad(usuarioId, itemId, nuevaCantidad);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar cantidad");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/usuario/{usuarioId}/item/{itemId}")
    public ResponseEntity<?> eliminarProducto(
            @PathVariable Long usuarioId,
            @PathVariable Long itemId) {
        try {
            Carrito carrito = carritoService.eliminarProducto(usuarioId, itemId);
            return ResponseEntity.ok(carrito);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar producto del carrito");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @DeleteMapping("/usuario/{usuarioId}/limpiar")
    public ResponseEntity<Void> limpiarCarrito(@PathVariable Long usuarioId) {
        try {
            carritoService.limpiarCarrito(usuarioId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

