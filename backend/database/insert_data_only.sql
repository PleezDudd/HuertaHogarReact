-- ============================================
-- Script SQL - Solo INSERT de datos
-- Usar este script si las tablas ya existen
-- (creadas automáticamente por Spring Boot)
-- ============================================

USE huertohogar;

-- ============================================
-- LIMPIAR DATOS EXISTENTES (Opcional)
-- Descomentar si quieres resetear los datos
-- ============================================
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE items_carrito;
-- TRUNCATE TABLE carritos;
-- TRUNCATE TABLE productos;
-- TRUNCATE TABLE usuarios;
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- INSERTAR PRODUCTOS
-- ============================================

INSERT INTO productos (nombre, descripcion, precio, categoria, imagen, stock, activo) VALUES
('Manzanas Fuji', 'Manzanas crujientes y dulces del Valle del Maule.', 1200.00, 'Frutas Frescas', '/img/Manzanas.png', 150, TRUE),
('Naranjas Valencia', 'Jugosas y ricas en vitamina C, ideales para zumos frescos.', 1000.00, 'Frutas Frescas', '/img/Naranjas.png', 200, TRUE),
('Plátanos Cavendish', 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.', 800.00, 'Frutas Frescas', '/img/Platanos.png', 250, TRUE),
('Zanahorias Orgánicas', 'Zanahorias crujientes cultivadas sin pesticidas en la Región de O''Higgins.', 900.00, 'Verduras Orgánicas', '/img/Zanahorias.png', 100, TRUE),
('Espinacas Frescas', 'Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.', 700.00, 'Verduras Orgánicas', '/img/Espinacas.png', 80, TRUE),
('Pimientos Tricolores', 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.', 1500.00, 'Verduras Orgánicas', '/img/Pimientos.png', 120, TRUE),
('Miel Orgánica', 'Miel pura y orgánica producida por apicultores locales.', 5000.00, 'Productos Orgánicos', '/img/Miel.png', 50, TRUE)
ON DUPLICATE KEY UPDATE nombre=nombre; -- Evita errores si ya existen

-- ============================================
-- INSERTAR USUARIOS
-- ============================================

-- Usuario Administrador
INSERT INTO usuarios (username, email, password, direccion, telefono, rol, activo, fecha_creacion, fecha_actualizacion) VALUES
('admin', 'admin@huertohogar.cl', 'admin123', 'Oficina Central, Santiago', '+56912345678', 'Admin', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- Usuarios de ejemplo
INSERT INTO usuarios (username, email, password, direccion, telefono, rol, activo, fecha_creacion, fecha_actualizacion) VALUES
('usuario', 'usuario@huertohogar.cl', 'usuario123', 'Av. Providencia 123, Santiago', '+56987654321', 'Usuario', TRUE, NOW(), NOW()),
('maria_gonzalez', 'maria.gonzalez@email.com', 'password123', 'Calle Los Aromos 456, Valparaíso', '+56911223344', 'Usuario', TRUE, NOW(), NOW()),
('juan_perez', 'juan.perez@email.com', 'password123', 'Av. Libertador 789, Concepción', '+56955667788', 'Usuario', TRUE, NOW(), NOW()),
('carla_rodriguez', 'carla.rodriguez@email.com', 'password123', 'Pasaje Las Flores 321, La Serena', '+56999887766', 'Usuario', TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- ============================================
-- NOTA SOBRE CARRITOS
-- ============================================
-- Los carritos se crean automáticamente cuando un usuario
-- agrega productos desde la aplicación.
-- Si quieres datos de ejemplo, descomenta la sección siguiente
-- y ajusta los IDs según los IDs generados de usuarios y productos

/*
-- Carritos de ejemplo (ajustar IDs según los generados)
INSERT INTO carritos (usuario_id, activo, fecha_creacion, fecha_actualizacion) VALUES
(2, TRUE, NOW(), NOW()),
(3, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE usuario_id=usuario_id;

-- Items de ejemplo (ajustar IDs según los generados)
INSERT INTO items_carrito (carrito_id, producto_id, cantidad) VALUES
(1, 1, 2),  -- 2 kg de Manzanas Fuji
(1, 3, 1),  -- 1 kg de Plátanos Cavendish
(2, 2, 3),  -- 3 kg de Naranjas Valencia
(2, 4, 2),  -- 2 kg de Zanahorias Orgánicas
(2, 7, 1)   -- 1 frasco de Miel Orgánica
ON DUPLICATE KEY UPDATE cantidad=cantidad;
*/

-- ============================================
-- VERIFICACIÓN
-- ============================================

SELECT 'Productos:' AS tipo, COUNT(*) AS cantidad FROM productos
UNION ALL
SELECT 'Usuarios:', COUNT(*) FROM usuarios;

