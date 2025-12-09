package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Carrito;
import com.huertohogar.backend.model.ItemCarrito;
import com.huertohogar.backend.service.CarritoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/carrito")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Carrito", description = "API para gestión de carritos de compra")
public class CarritoController {

    private static final Logger logger = LoggerFactory.getLogger(CarritoController.class);

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

    @PostMapping(value = "/usuario/{usuarioId}/agregar", consumes = {"application/json", "application/x-www-form-urlencoded", "*/*"})
    public ResponseEntity<?> agregarProducto(
            @PathVariable Long usuarioId,
            @RequestBody(required = false) Map<String, Object> request,
            @RequestParam(required = false) Long productoId,
            @RequestParam(required = false) Integer cantidad) {
        try {
            logger.info("=== INICIO AGREGAR PRODUCTO ===");
            logger.info("UsuarioId: {}", usuarioId);
            logger.info("Request Body: {}", request);
            logger.info("Query Params - productoId: {}, cantidad: {}", productoId, cantidad);
            if (request != null) {
                logger.info("Request keys: {}", request.keySet());
                logger.info("Request values: {}", request.values());
                for (Map.Entry<String, Object> entry : request.entrySet()) {
                    logger.info("  {} = {} (type: {})", entry.getKey(), entry.getValue(), 
                            entry.getValue() != null ? entry.getValue().getClass().getName() : "null");
                }
            }
            
            // Prioridad: Query params > Request body
            Long productoIdFinal = null;
            Integer cantidadFinal = null;
            
            // Primero intentar obtener de query params
            if (productoId != null && cantidad != null) {
                logger.info("Usando query parameters: productoId={}, cantidad={}", productoId, cantidad);
                productoIdFinal = productoId;
                cantidadFinal = cantidad;
            } else if (request != null && !request.isEmpty()) {
                // Si no hay query params, intentar obtener del request body
                logger.debug("Intentando obtener datos del request body. Campos: {}", request.keySet());
                
                // Buscar productoId con diferentes nombres posibles
                Object productoIdObj = null;
                if (request.containsKey("productoId")) {
                    productoIdObj = request.get("productoId");
                } else if (request.containsKey("producto_id")) {
                    productoIdObj = request.get("producto_id");
                } else if (request.containsKey("id")) {
                    productoIdObj = request.get("id");
                } else if (request.containsKey("productId")) {
                    productoIdObj = request.get("productId");
                } else if (request.containsKey("producto")) {
                    Object productoObj = request.get("producto");
                    if (productoObj instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> productoMap = (Map<String, Object>) productoObj;
                        if (productoMap.containsKey("id")) {
                            productoIdObj = productoMap.get("id");
                        }
                    }
                }
                
                // Buscar cantidad con diferentes nombres posibles
                Object cantidadObj = null;
                if (request.containsKey("cantidad")) {
                    cantidadObj = request.get("cantidad");
                } else if (request.containsKey("quantity")) {
                    cantidadObj = request.get("quantity");
                } else if (request.containsKey("qty")) {
                    cantidadObj = request.get("qty");
                }
                
                // Convertir productoId
                if (productoIdObj != null) {
                    try {
                        if (productoIdObj instanceof Number) {
                            productoIdFinal = ((Number) productoIdObj).longValue();
                        } else {
                            productoIdFinal = Long.valueOf(productoIdObj.toString());
                        }
                    } catch (NumberFormatException e) {
                        logger.error("Error al convertir productoId: {}", productoIdObj);
                        Map<String, Object> error = new HashMap<>();
                        error.put("success", false);
                        error.put("error", "El 'productoId' debe ser un número válido. Recibido: " + productoIdObj);
                        error.put("receivedFields", request.keySet().toString());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                    }
                }
                
                // Convertir cantidad
                if (cantidadObj != null) {
                    try {
                        if (cantidadObj instanceof Number) {
                            cantidadFinal = ((Number) cantidadObj).intValue();
                        } else {
                            cantidadFinal = Integer.valueOf(cantidadObj.toString());
                        }
                        if (cantidadFinal <= 0) {
                            Map<String, Object> error = new HashMap<>();
                            error.put("success", false);
                            error.put("error", "La cantidad debe ser mayor a 0. Recibido: " + cantidadFinal);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                        }
                    } catch (NumberFormatException e) {
                        logger.error("Error al convertir cantidad: {}", cantidadObj);
                        Map<String, Object> error = new HashMap<>();
                        error.put("success", false);
                        error.put("error", "La 'cantidad' debe ser un número válido. Recibido: " + cantidadObj);
                        error.put("receivedFields", request.keySet().toString());
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
                    }
                }
            }
            
            // Validar que tengamos ambos valores
            if (productoIdFinal == null) {
                logger.warn("Falta productoId. Request: {}, QueryParams - productoId: {}", request, productoId);
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Falta el campo 'productoId' (o 'producto_id', 'id', 'productId')");
                if (request != null) {
                    error.put("receivedFields", request.keySet().toString());
                    error.put("requestBody", request.toString());
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            if (cantidadFinal == null) {
                logger.warn("Falta cantidad. Request: {}, QueryParams - cantidad: {}", request, cantidad);
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Falta el campo 'cantidad' (o 'quantity', 'qty')");
                if (request != null) {
                    error.put("receivedFields", request.keySet().toString());
                    error.put("requestBody", request.toString());
                }
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }
            
            logger.info("Procesando agregar producto - UsuarioId: {}, ProductoId: {}, Cantidad: {}", 
                    usuarioId, productoIdFinal, cantidadFinal);
            
            Carrito carrito = carritoService.agregarProducto(usuarioId, productoIdFinal, cantidadFinal);
            
            logger.info("=== PRODUCTO AGREGADO EXITOSAMENTE ===");
            
            // Crear respuesta exitosa
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Producto agregado al carrito exitosamente");
            response.put("carrito", carrito);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            error.put("usuarioId", usuarioId.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al agregar producto al carrito: " + e.getMessage());
            error.put("usuarioId", usuarioId.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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

    @GetMapping("/usuario/{usuarioId}/boleta")
    public ResponseEntity<?> getBoletaCompra(@PathVariable Long usuarioId) {
        try {
            logger.info("Solicitando boleta para usuarioId: {}", usuarioId);
            Carrito carrito = carritoService.getBoletaCompra(usuarioId);
            
            logger.info("Carrito encontrado. ID: {}, Items: {}", carrito.getId(), carrito.getItems().size());
            
            // Crear respuesta estructurada para la boleta
            Map<String, Object> boleta = new HashMap<>();
            boleta.put("success", true);
            boleta.put("id", carrito.getId());
            boleta.put("fecha", carrito.getFechaCreacion());
            
            // Información del usuario (sin contraseña)
            Map<String, Object> usuarioInfo = new HashMap<>();
            usuarioInfo.put("id", carrito.getUsuario().getId());
            usuarioInfo.put("username", carrito.getUsuario().getUsername());
            usuarioInfo.put("email", carrito.getUsuario().getEmail());
            usuarioInfo.put("direccion", carrito.getUsuario().getDireccion());
            usuarioInfo.put("telefono", carrito.getUsuario().getTelefono());
            boleta.put("usuario", usuarioInfo);
            
            // Detalle de items con subtotales
            List<Map<String, Object>> itemsDetalle = new ArrayList<>();
            double total = 0.0;
            
            for (ItemCarrito item : carrito.getItems()) {
                if (item.getProducto() == null) {
                    logger.error("Item sin producto: {}", item.getId());
                    continue;
                }
                
                Map<String, Object> itemDetalle = new HashMap<>();
                itemDetalle.put("id", item.getId());
                
                // Información del producto
                Map<String, Object> productoInfo = new HashMap<>();
                productoInfo.put("id", item.getProducto().getId());
                productoInfo.put("nombre", item.getProducto().getNombre());
                productoInfo.put("descripcion", item.getProducto().getDescripcion());
                productoInfo.put("precio", item.getProducto().getPrecio());
                productoInfo.put("categoria", item.getProducto().getCategoria());
                productoInfo.put("imagen", item.getProducto().getImagen());
                itemDetalle.put("producto", productoInfo);
                
                itemDetalle.put("cantidad", item.getCantidad());
                itemDetalle.put("precioUnitario", item.getProducto().getPrecio());
                itemDetalle.put("subtotal", item.getSubtotal());
                itemsDetalle.add(itemDetalle);
                total += item.getSubtotal();
            }
            
            boleta.put("items", itemsDetalle);
            boleta.put("total", total);
            boleta.put("totalItems", itemsDetalle.size());
            boleta.put("cantidadTotalProductos", carrito.getItems().stream()
                    .mapToInt(ItemCarrito::getCantidad)
                    .sum());
            
            logger.info("Boleta generada exitosamente. Total: {}, Items: {}", total, itemsDetalle.size());
            
            return ResponseEntity.ok(boleta);
        } catch (RuntimeException e) {
            logger.error("Error al generar boleta: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Error inesperado al generar boleta: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al generar la boleta: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

