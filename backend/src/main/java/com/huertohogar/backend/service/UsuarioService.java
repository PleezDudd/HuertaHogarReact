package com.huertohogar.backend.service;

import com.huertohogar.backend.model.Usuario;
import com.huertohogar.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> getAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> getAllActivos() {
        return usuarioRepository.findByActivoTrue();
    }

    public Optional<Usuario> getById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> getByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public Optional<Usuario> getByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public List<Usuario> getByRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    public Usuario save(Usuario usuario) {
        // Validar que el email no exista
        if (usuario.getId() == null && usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // Validar que el username no exista
        if (usuario.getId() == null && usuarioRepository.existsByUsername(usuario.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está registrado");
        }
        
        if (usuario.getRol() == null || usuario.getRol().isEmpty()) {
            usuario.setRol("Usuario");
        }
        
        if (usuario.getActivo() == null) {
            usuario.setActivo(true);
        }
        
        return usuarioRepository.save(usuario);
    }

    public Usuario update(Long id, Usuario usuarioActualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Validar email único (si cambió)
                    if (!usuario.getEmail().equals(usuarioActualizado.getEmail()) &&
                        usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
                        throw new RuntimeException("El email ya está registrado");
                    }
                    
                    // Validar username único (si cambió)
                    if (!usuario.getUsername().equals(usuarioActualizado.getUsername()) &&
                        usuarioRepository.existsByUsername(usuarioActualizado.getUsername())) {
                        throw new RuntimeException("El nombre de usuario ya está registrado");
                    }
                    
                    usuario.setUsername(usuarioActualizado.getUsername());
                    usuario.setEmail(usuarioActualizado.getEmail());
                    if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                        usuario.setPassword(usuarioActualizado.getPassword());
                    }
                    usuario.setDireccion(usuarioActualizado.getDireccion());
                    usuario.setTelefono(usuarioActualizado.getTelefono());
                    usuario.setRol(usuarioActualizado.getRol());
                    if (usuarioActualizado.getActivo() != null) {
                        usuario.setActivo(usuarioActualizado.getActivo());
                    }
                    return usuarioRepository.save(usuario);
                })
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public void delete(Long id) {
        usuarioRepository.findById(id)
                .ifPresentOrElse(
                        usuario -> {
                            usuario.setActivo(false);
                            usuarioRepository.save(usuario);
                        },
                        () -> {
                            throw new RuntimeException("Usuario no encontrado con id: " + id);
                        }
                );
    }

    public void deletePermanente(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    public boolean existsByUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }
}

