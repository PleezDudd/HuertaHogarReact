package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Producto;
import com.huertohogar.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/api/productos")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Productos", description = "API para gestión de productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Listar productos", description = "Obtiene la lista de todos los productos, opcionalmente filtrados por estado activo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de productos obtenida exitosamente")
    })
    @GetMapping
    public ResponseEntity<List<Producto>> getAll(@Parameter(description = "Filtrar solo productos activos") @RequestParam(required = false) Boolean activos) {
        List<Producto> productos;
        if (activos != null && activos) {
            productos = productoService.getAllActivos();
        } else {
            productos = productoService.getAll();
        }
        return ResponseEntity.ok(productos);
    }

    @Operation(summary = "Obtener producto por ID", description = "Obtiene un producto específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getById(@Parameter(description = "ID del producto") @PathVariable Long id) {
        Optional<Producto> producto = productoService.getById(id);
        return producto.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> getByCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.getByCategoria(categoria);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> searchByNombre(@RequestParam String nombre) {
        List<Producto> productos = productoService.searchByNombre(nombre);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/ids")
    public ResponseEntity<Map<String, Object>> getProductosIds() {
        List<Producto> productos = productoService.getAll();
        Map<String, Object> response = new HashMap<>();
        Map<Long, String> productosMap = new HashMap<>();
        for (Producto p : productos) {
            productosMap.put(p.getId(), p.getNombre());
        }
        response.put("productos", productosMap);
        response.put("total", productos.size());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Crear producto", description = "Crea un nuevo producto en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Producto creado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PostMapping
    public ResponseEntity<Producto> create(@RequestBody Producto producto) {
        try {
            Producto nuevoProducto = productoService.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> update(@PathVariable Long id, @RequestBody Producto producto) {
        try {
            Producto productoActualizado = productoService.update(id, producto);
            return ResponseEntity.ok(productoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            productoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

