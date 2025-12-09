package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Orden;
import com.huertohogar.backend.service.OrdenService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Órdenes", description = "API para gestión de órdenes de compra")
public class OrdenController {

    private static final Logger logger = LoggerFactory.getLogger(OrdenController.class);

    @Autowired
    private OrdenService ordenService;

    /**
     * Crea una nueva orden de compra
     * POST /api/ordenes
     */
    @PostMapping
    public ResponseEntity<?> crearOrden(@RequestBody Map<String, Object> request) {
        try {
            logger.info("=== CREAR ORDEN ===");
            logger.info("Request: {}", request);

            // Validar campos requeridos
            Long usuarioId = null;
            if (request.containsKey("usuarioId")) {
                usuarioId = Long.valueOf(request.get("usuarioId").toString());
            } else if (request.containsKey("usuario_id")) {
                usuarioId = Long.valueOf(request.get("usuario_id").toString());
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Falta el campo 'usuarioId'");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            String direccion = (String) request.get("direccion");
            String region = (String) request.get("region");
            String comuna = (String) request.get("comuna");
            String indicacion = request.containsKey("indicacion") ? (String) request.get("indicacion") : null;

            if (direccion == null || direccion.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "La dirección es obligatoria");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (region == null || region.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "La región es obligatoria");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (comuna == null || comuna.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "La comuna es obligatoria");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Crear la orden
            Orden orden = ordenService.crearOrden(usuarioId, direccion, region, comuna, indicacion);

            logger.info("Orden creada exitosamente. ID: {}", orden.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Orden creada exitosamente");
            response.put("orden", orden);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            logger.error("Error al crear orden: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Error inesperado al crear orden: {}", e.getMessage(), e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al crear la orden: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Obtiene todas las órdenes de un usuario
     * GET /api/ordenes/usuario/{usuarioId}
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> obtenerOrdenesPorUsuario(@PathVariable Long usuarioId) {
        try {
            List<Orden> ordenes = ordenService.obtenerOrdenesPorUsuario(usuarioId);
            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            logger.error("Error al obtener órdenes del usuario {}: {}", usuarioId, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al obtener las órdenes");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Obtiene una orden por su ID
     * GET /api/ordenes/{ordenId}
     */
    @GetMapping("/{ordenId}")
    public ResponseEntity<?> obtenerOrdenPorId(@PathVariable Long ordenId) {
        try {
            Optional<Orden> orden = ordenService.obtenerOrdenPorId(ordenId);
            if (orden.isPresent()) {
                return ResponseEntity.ok(orden.get());
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "Orden no encontrada");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            logger.error("Error al obtener orden {}: {}", ordenId, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al obtener la orden");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Obtiene todas las órdenes (para administradores)
     * GET /api/ordenes
     */
    @GetMapping
    public ResponseEntity<?> obtenerTodasLasOrdenes() {
        try {
            List<Orden> ordenes = ordenService.obtenerTodasLasOrdenes();
            return ResponseEntity.ok(ordenes);
        } catch (Exception e) {
            logger.error("Error al obtener todas las órdenes: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al obtener las órdenes");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Actualiza el estado de una orden
     * PUT /api/ordenes/{ordenId}/estado
     */
    @PutMapping("/{ordenId}/estado")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long ordenId,
            @RequestBody Map<String, String> request) {
        try {
            String nuevoEstado = request.get("estado");
            if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "El campo 'estado' es obligatorio");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Orden orden = ordenService.actualizarEstado(ordenId, nuevoEstado);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Estado actualizado exitosamente");
            response.put("orden", orden);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error al actualizar estado de orden {}: {}", ordenId, e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            logger.error("Error inesperado al actualizar estado: {}", e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", "Error al actualizar el estado");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}

