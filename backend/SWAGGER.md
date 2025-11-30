# Swagger UI - Documentación de API

## 🚀 Acceso a Swagger UI

Una vez que el backend esté ejecutándose, puedes acceder a Swagger UI en:

### URL Principal:
```
http://localhost:8080/swagger-ui.html
```

### URLs Alternativas:
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- API Docs (JSON): `http://localhost:8080/api-docs`
- API Docs (YAML): `http://localhost:8080/api-docs.yaml`

## 📋 Pasos para Usar Swagger

### 1. Iniciar el Backend

```bash
cd backend
mvn spring-boot:run
```

Espera a ver: `Started BackendApplication`

### 2. Abrir Swagger UI

Abre tu navegador y ve a:
```
http://localhost:8080/swagger-ui.html
```

### 3. Explorar los Endpoints

Swagger UI mostrará todos los endpoints organizados por categorías:

- **Productos** - Gestión de productos
- **Usuarios** - Gestión de usuarios
- **Carrito** - Gestión de carritos de compra

### 4. Probar un Endpoint

1. **Expandir un endpoint** - Haz clic en el endpoint que quieras probar
2. **Hacer clic en "Try it out"** - Esto habilita la edición de parámetros
3. **Completar parámetros** (si aplica):
   - Para GET con parámetros: completa los campos
   - Para POST/PUT: completa el body JSON
4. **Hacer clic en "Execute"** - Ejecuta la petición
5. **Ver la respuesta** - Swagger mostrará:
   - Código de estado HTTP
   - Headers de respuesta
   - Body de respuesta (JSON)

## 📝 Ejemplos de Uso

### Ejemplo 1: Listar Productos

1. Expande **GET** `/api/productos`
2. Haz clic en **"Try it out"**
3. (Opcional) Completa el parámetro `activos` con `true` o `false`
4. Haz clic en **"Execute"**
5. Verás la lista de productos en la respuesta

### Ejemplo 2: Crear un Producto

1. Expande **POST** `/api/productos`
2. Haz clic en **"Try it out"**
3. En el campo **"Request body"**, completa el JSON:
   ```json
   {
     "nombre": "Tomates Orgánicos",
     "descripcion": "Tomates frescos y jugosos",
     "precio": 1500.00,
     "categoria": "Verduras Orgánicas",
     "imagen": "/img/Tomates.png",
     "stock": 75,
     "activo": true
   }
   ```
4. Haz clic en **"Execute"**
5. Verás el producto creado en la respuesta (con ID asignado)

### Ejemplo 3: Agregar Producto al Carrito

1. Expande **POST** `/api/carrito/usuario/{usuarioId}/agregar`
2. Haz clic en **"Try it out"**
3. Completa:
   - `usuarioId`: `2` (ID de un usuario existente)
   - `Request body`:
     ```json
     {
       "productoId": 1,
       "cantidad": 2
     }
     ```
4. Haz clic en **"Execute"**
5. Verás el carrito actualizado con el nuevo item

### Ejemplo 4: Obtener Usuario por Email

1. Expande **GET** `/api/usuarios/email/{email}`
2. Haz clic en **"Try it out"**
3. Completa el parámetro `email` con: `admin@huertohogar.cl`
4. Haz clic en **"Execute"**
5. Verás los datos del usuario

## 🔍 Características de Swagger UI

- **Documentación Interactiva**: Todos los endpoints están documentados
- **Pruebas en Tiempo Real**: Puedes probar endpoints directamente desde el navegador
- **Esquemas de Modelos**: Ve la estructura de las entidades (Producto, Usuario, Carrito, etc.)
- **Códigos de Respuesta**: Ve qué códigos HTTP puede devolver cada endpoint
- **Validación**: Swagger valida los datos antes de enviarlos

## 🎯 Endpoints Disponibles

### Productos
- `GET /api/productos` - Listar productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/categoria/{categoria}` - Filtrar por categoría
- `GET /api/productos/buscar?nombre={nombre}` - Buscar por nombre
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `DELETE /api/productos/{id}` - Eliminar producto

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/email/{email}` - Obtener usuario por email
- `GET /api/usuarios/rol/{rol}` - Filtrar por rol
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

### Carrito
- `GET /api/carrito/usuario/{usuarioId}` - Obtener carrito
- `GET /api/carrito/usuario/{usuarioId}/items` - Obtener items del carrito
- `POST /api/carrito/usuario/{usuarioId}/agregar` - Agregar producto
- `PUT /api/carrito/usuario/{usuarioId}/item/{itemId}` - Actualizar cantidad
- `DELETE /api/carrito/usuario/{usuarioId}/item/{itemId}` - Eliminar item
- `DELETE /api/carrito/usuario/{usuarioId}/limpiar` - Limpiar carrito

## 🐛 Solución de Problemas

### Swagger UI no carga

1. Verifica que el backend esté ejecutándose
2. Verifica que no haya errores en la consola
3. Intenta acceder directamente a: `http://localhost:8080/swagger-ui/index.html`

### Los endpoints no aparecen

1. Verifica que los controladores estén correctamente anotados
2. Reinicia el backend
3. Verifica los logs para ver si hay errores de compilación

### Error 404 al acceder a Swagger

1. Verifica que la dependencia esté en `pom.xml`
2. Ejecuta `mvn clean install` y reinicia
3. Verifica que el puerto 8080 esté disponible

## 📚 Recursos Adicionales

- [Documentación SpringDoc OpenAPI](https://springdoc.org/)
- [OpenAPI Specification](https://swagger.io/specification/)

---

**¡Listo!** Ahora puedes probar todos los endpoints desde Swagger UI de forma visual e interactiva.

