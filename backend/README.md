# Backend HuertoHogar - Spring Boot + MySQL

Backend REST API desarrollado con Spring Boot y MySQL para la aplicación HuertoHogar.

## Requisitos Previos

- Java 17 o superior
- Maven 3.6+
- MySQL (Laragon/XAMPP) ejecutándose
- Base de datos `huertohogar` creada en MySQL

## Configuración

### 1. Crear la base de datos en MySQL

Abre MySQL Workbench o la consola de MySQL y ejecuta:

```sql
CREATE DATABASE huertohogar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Verificar configuración de conexión

El archivo `src/main/resources/application.properties` está configurado con:

- **URL**: `jdbc:mysql://localhost:3306/huertohogar`
- **Usuario**: `root`
- **Contraseña**: (vacía)
- **Puerto**: `8080`

Si tu configuración de MySQL es diferente, modifica el archivo `application.properties`.

### 3. Compilar y ejecutar

```bash
# Desde la carpeta backend
mvn clean install
mvn spring-boot:run
```

O desde tu IDE (IntelliJ, Eclipse, VS Code) ejecuta la clase `BackendApplication.java`.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/huertohogar/backend/
│   │   │   ├── model/          # Entidades JPA
│   │   │   │   ├── Producto.java
│   │   │   │   ├── Usuario.java
│   │   │   │   ├── Carrito.java
│   │   │   │   └── ItemCarrito.java
│   │   │   ├── repository/    # Interfaces JpaRepository
│   │   │   ├── service/       # Lógica de negocio
│   │   │   ├── controller/    # Controladores REST
│   │   │   ├── config/        # Configuración (CORS, etc.)
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Endpoints Disponibles

### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos?activos=true` - Listar solo productos activos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria/{categoria}` - Filtrar por categoría
- `GET /api/productos/buscar?nombre={nombre}` - Buscar por nombre
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto (soft delete)

### Usuarios
- `GET /api/usuarios` - Listar todos los usuarios
- `GET /api/usuarios?activos=true` - Listar solo usuarios activos
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/email/{email}` - Obtener usuario por email
- `GET /api/usuarios/rol/{rol}` - Filtrar por rol
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario (soft delete)

### Carrito
- `GET /api/carrito/usuario/{usuarioId}` - Obtener carrito del usuario
- `GET /api/carrito/usuario/{usuarioId}/items` - Obtener items del carrito
- `POST /api/carrito/usuario/{usuarioId}/agregar` - Agregar producto al carrito
  ```json
  {
    "productoId": 1,
    "cantidad": 2
  }
  ```
- `PUT /api/carrito/usuario/{usuarioId}/item/{itemId}` - Actualizar cantidad
  ```json
  {
    "cantidad": 3
  }
  ```
- `DELETE /api/carrito/usuario/{usuarioId}/item/{itemId}` - Eliminar item del carrito
- `DELETE /api/carrito/usuario/{usuarioId}/limpiar` - Limpiar todo el carrito

## CORS

El backend está configurado para aceptar peticiones desde `http://localhost:3000` (React frontend).

## Notas

- Las tablas se crean automáticamente al iniciar la aplicación (`spring.jpa.hibernate.ddl-auto=update`)
- Los logs SQL están habilitados para debugging
- El puerto del servidor es `8080` por defecto

## Swagger UI - Documentación Interactiva

El proyecto incluye Swagger UI para probar los endpoints de forma visual.

### Acceso a Swagger:

Una vez que el backend esté ejecutándose, accede a:

```
http://localhost:8080/swagger-ui.html
```

O también:
- `http://localhost:8080/swagger-ui/index.html`
- `http://localhost:8080/api-docs` (JSON)

Para más información, consulta [SWAGGER.md](SWAGGER.md)

## Próximos Pasos

1. Asegúrate de que MySQL esté ejecutándose
2. Crea la base de datos `huertohogar`
3. Ejecuta el backend
4. Verifica que las tablas se hayan creado en MySQL
5. Accede a Swagger UI en `http://localhost:8080/swagger-ui.html` para probar los endpoints
6. Prueba los endpoints con Postman o desde el frontend React

