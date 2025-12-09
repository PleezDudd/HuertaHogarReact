# Scripts SQL para Base de Datos HuertoHogar

## Archivos disponibles

- `init_database.sql` - Script completo para crear la base de datos y poblar con datos iniciales
- `insert_data_only.sql` - Script simplificado solo con INSERTs (usar si las tablas ya existen)
- `fix_foreign_keys.sql` - Script para corregir incompatibilidades de tipos en foreign keys (ver sección de solución de problemas)

## Instrucciones de uso

### Opción 1: Usando MySQL Workbench o HeidiSQL

1. Abre MySQL Workbench o HeidiSQL
2. Conéctate a tu servidor MySQL (Laragon)
3. Abre el archivo `init_database.sql`
4. Ejecuta todo el script (Ctrl+Shift+Enter en Workbench)

### Opción 2: Usando la línea de comandos

```bash
# Desde la carpeta backend/database
mysql -u root -p < init_database.sql
```

O si no tienes contraseña:
```bash
mysql -u root < init_database.sql
```

### Opción 3: Solo insertar datos (si las tablas ya existen)

Si Spring Boot ya creó las tablas automáticamente, usa el script simplificado:

```bash
mysql -u root < insert_data_only.sql
```

O desde MySQL Workbench, abre y ejecuta `insert_data_only.sql`

## Contenido del script

El script incluye:

1. **Creación de base de datos** (si no existe)
2. **Productos iniciales** (7 productos):
   - Manzanas Fuji
   - Naranjas Valencia
   - Plátanos Cavendish
   - Zanahorias Orgánicas
   - Espinacas Frescas
   - Pimientos Tricolores
   - Miel Orgánica

3. **Usuarios de ejemplo**:
   - Admin: `admin@huertohogar.cl` / `admin123`
   - Usuario: `usuario@huertohogar.cl` / `usuario123`
   - 4 usuarios adicionales de ejemplo

4. **Carritos de ejemplo** (opcional):
   - Carritos con items para algunos usuarios

## Notas importantes

- Las tablas se crean automáticamente cuando Spring Boot inicia (gracias a `spring.jpa.hibernate.ddl-auto=update`)
- Este script está diseñado para **poblar datos iniciales**, no para crear las tablas
- Si ejecutas el script antes de iniciar Spring Boot, las tablas se crearán automáticamente al iniciar
- Los IDs se generan automáticamente, así que los carritos de ejemplo pueden necesitar ajustes si los IDs de productos/usuarios son diferentes

## Solución de problemas

### Error: "Referencing column and referenced column in foreign key constraint are incompatible"

Si encuentras este error al iniciar Spring Boot, significa que hay una incompatibilidad de tipos entre las columnas de foreign keys y las columnas referenciadas. Esto puede ocurrir si las tablas se crearon con tipos diferentes (INT vs BIGINT).

**Solución:**

Ejecuta el script `fix_foreign_keys.sql` para corregir los tipos de datos:

```bash
mysql -u root < fix_foreign_keys.sql
```

O desde MySQL Workbench, abre y ejecuta `fix_foreign_keys.sql`

Este script:
1. Elimina temporalmente las foreign keys
2. Convierte todas las columnas ID y foreign keys a BIGINT
3. Recrea las foreign keys con los tipos correctos

## Verificar datos insertados

Después de ejecutar el script, puedes verificar los datos con:

```sql
USE huertohogar;

-- Ver productos
SELECT * FROM productos;

-- Ver usuarios
SELECT * FROM usuarios;

-- Ver carritos
SELECT * FROM carritos;

-- Ver items de carrito
SELECT * FROM items_carrito;
```

