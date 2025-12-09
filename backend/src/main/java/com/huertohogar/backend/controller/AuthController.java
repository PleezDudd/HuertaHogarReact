package com.huertohogar.backend.controller;

import com.huertohogar.backend.model.Usuario;
import com.huertohogar.backend.service.JwtService;
import com.huertohogar.backend.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Autenticación", description = "API para autenticación de usuarios")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario con email y contraseña, y retorna un token JWT para acceder a los recursos protegidos")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso, token JWT generado"),
            @ApiResponse(responseCode = "401", description = "Credenciales incorrectas o usuario inactivo"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Buscar usuario por email
            Optional<Usuario> usuarioOpt = usuarioService.getByEmail(loginRequest.getEmail());
            
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Email o contraseña incorrectos"));
            }

            Usuario usuario = usuarioOpt.get();

            // Verificar si el usuario está activo
            if (!usuario.getActivo()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Usuario inactivo"));
            }

            // Verificar contraseña (comparación simple - en producción usar BCrypt)
            if (!usuario.getPassword().equals(loginRequest.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Email o contraseña incorrectos"));
            }

            // Generar token JWT
            String token = jwtService.generateToken(
                usuario.getId(),
                usuario.getEmail(),
                usuario.getRol()
            );

            // Crear respuesta exitosa
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login exitoso");
            response.put("token", token);
            response.put("usuario", createUsuarioResponse(usuario));
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Error al procesar el login: " + e.getMessage()));
        }
    }

    private Map<String, Object> createUsuarioResponse(Usuario usuario) {
        Map<String, Object> usuarioResponse = new HashMap<>();
        usuarioResponse.put("id", usuario.getId());
        usuarioResponse.put("username", usuario.getUsername());
        usuarioResponse.put("email", usuario.getEmail());
        usuarioResponse.put("rol", usuario.getRol());
        usuarioResponse.put("direccion", usuario.getDireccion());
        usuarioResponse.put("telefono", usuario.getTelefono());
        usuarioResponse.put("activo", usuario.getActivo());
        // No incluir la contraseña en la respuesta
        return usuarioResponse;
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        return error;
    }

    // Clase interna para el request
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

