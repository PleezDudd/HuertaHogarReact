# Guía de Pruebas - Backend HuertoHogar

Esta guía te ayudará a verificar que todo esté funcionando correctamente después de crear la base de datos.

## 📋 Checklist de Verificación

### Paso 1: Verificar Base de Datos en Laragon

1. Abre **Laragon** y asegúrate de que MySQL esté ejecutándose (botón verde)
2. Abre **HeidiSQL** o **MySQL Workbench** (incluido en Laragon)
3. Conéctate a MySQL:
   - Host: `localhost` o `127.0.0.1`
   - Usuario: `root`
   - Contraseña: (vacía)
   - Puerto: `3306`

4. Verifica que la base de datos existe:
   ```sql
   SHOW DATABASES;
   ```
   Deberías ver `huertohogar` en la lista.

5. Selecciona la base de datos y verifica los datos:
   ```sql
   USE huertohogar;
   
   -- Ver productos
   SELECT * FROM productos;
   
   -- Ver usuarios
   SELECT * FROM usuarios;
   
   -- Contar registros
   SELECT 
       (SELECT COUNT(*) FROM productos) AS total_productos,
       (SELECT COUNT(*) FROM usuarios) AS total_usuarios;
   ```
   
   **Resultado esperado:**
   - 7 productos
   - 6 usuarios (1 admin + 5 usuarios)

---

### Paso 2: Compilar y Ejecutar el Backend

1. Abre una terminal en la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Compila el proyecto (primera vez):
   ```bash
   mvn clean install
   ```
   
   ⚠️ **Nota:** Si es la primera vez, Maven descargará las dependencias. Esto puede tardar varios minutos.

3. Inicia el backend:
   ```bash
   mvn spring-boot:run
   ```

4. **Verifica que inicie correctamente:**
   - Busca en la consola: `Started BackendApplication`
   - No debe haber errores de conexión a MySQL
   - Deberías ver logs SQL como: `Hibernate: select producto0_.id...`

5. Si hay errores, verifica:
   - ✅ MySQL está ejecutándose en Laragon
   - ✅ La base de datos `huertohogar` existe
   - ✅ El usuario `root` no tiene contraseña (o ajusta `application.properties`)
   - ✅ El puerto 8080 no está ocupado

---

### Paso 3: Probar Endpoints REST

#### Opción A: Usando el Navegador (GET requests)

Abre tu navegador y visita:

1. **Listar todos los productos:**
   ```
   http://localhost:8080/api/productos
   ```
   Deberías ver un JSON con 7 productos.

2. **Listar solo productos activos:**
   ```
   http://localhost:8080/api/productos?activos=true
   ```

3. **Obtener un producto por ID:**
   ```
   http://localhost:8080/api/productos/1
   ```

4. **Listar usuarios:**
   ```
   http://localhost:8080/api/usuarios
   ```
   Deberías ver 6 usuarios.

5. **Obtener usuario por email:**
   ```
   http://localhost:8080/api/usuarios/email/admin@huertohogar.cl
   ```

#### Opción B: Usando Postman o Thunder Client

1. **GET - Listar productos:**
   - Método: `GET`
   - URL: `http://localhost:8080/api/productos`
   - Headers: (ninguno necesario)

2. **POST - Crear producto:**
   - Método: `POST`
   - URL: `http://localhost:8080/api/productos`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
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

3. **PUT - Actualizar producto:**
   - Método: `PUT`
   - URL: `http://localhost:8080/api/productos/1`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "nombre": "Manzanas Fuji Premium",
       "descripcion": "Manzanas crujientes y dulces del Valle del Maule.",
       "precio": 1300.00,
       "categoria": "Frutas Frescas",
       "imagen": "/img/Manzanas.png",
       "stock": 150,
       "activo": true
     }
     ```

4. **DELETE - Eliminar producto (soft delete):**
   - Método: `DELETE`
   - URL: `http://localhost:8080/api/productos/1`

5. **GET - Obtener carrito de usuario:**
   - Método: `GET`
   - URL: `http://localhost:8080/api/carrito/usuario/2`
   - (Reemplaza `2` con el ID de un usuario existente)

6. **POST - Agregar producto al carrito:**
   - Método: `POST`
   - URL: `http://localhost:8080/api/carrito/usuario/2/agregar`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "productoId": 1,
       "cantidad": 2
     }
     ```

#### Opción C: Usando curl (Terminal)

```bash
# Listar productos
curl http://localhost:8080/api/productos

# Crear producto
curl -X POST http://localhost:8080/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Tomates Orgánicos","descripcion":"Tomates frescos","precio":1500.00,"categoria":"Verduras Orgánicas","imagen":"/img/Tomates.png","stock":75,"activo":true}'

# Obtener producto por ID
curl http://localhost:8080/api/productos/1

# Actualizar producto
curl -X PUT http://localhost:8080/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Manzanas Fuji Premium","descripcion":"Manzanas crujientes","precio":1300.00,"categoria":"Frutas Frescas","imagen":"/img/Manzanas.png","stock":150,"activo":true}'

# Eliminar producto
curl -X DELETE http://localhost:8080/api/productos/1

# Listar usuarios
curl http://localhost:8080/api/usuarios

# Agregar al carrito
curl -X POST http://localhost:8080/api/carrito/usuario/2/agregar \
  -H "Content-Type: application/json" \
  -d '{"productoId":1,"cantidad":2}'
```

---

### Paso 4: Verificar en MySQL que los cambios se reflejen

1. Después de crear/actualizar/eliminar desde la API, verifica en MySQL:

   ```sql
   USE huertohogar;
   
   -- Ver productos actualizados
   SELECT id, nombre, precio, stock, activo FROM productos;
   
   -- Ver carritos creados
   SELECT * FROM carritos;
   
   -- Ver items en carritos
   SELECT * FROM items_carrito;
   ```

2. Si creaste un producto nuevo, debería aparecer en la tabla `productos`.
3. Si agregaste items al carrito, deberían aparecer en `carritos` e `items_carrito`.

---

### Paso 5: Verificar CORS (Preparación para Frontend)

1. Abre la consola del navegador (F12)
2. Ejecuta en la consola:
   ```javascript
   fetch('http://localhost:8080/api/productos')
     .then(res => res.json())
     .then(data => console.log('✅ CORS funcionando:', data))
     .catch(err => console.error('❌ Error CORS:', err));
   ```

   Si ves los productos en la consola, CORS está configurado correctamente.

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot connect to MySQL"

**Solución:**
1. Verifica que MySQL esté ejecutándose en Laragon
2. Verifica la configuración en `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/huertohogar?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=
   ```

### Error: "Table doesn't exist"

**Solución:**
- Las tablas se crean automáticamente al iniciar Spring Boot
- Si no se crean, verifica que `spring.jpa.hibernate.ddl-auto=update` esté en `application.properties`
- Reinicia el backend

### Error: "Port 8080 already in use"

**Solución:**
1. Cambia el puerto en `application.properties`:
   ```properties
   server.port=8081
   ```
2. O cierra el proceso que está usando el puerto 8080

### Error: "Access denied for user 'root'@'localhost'"

**Solución:**
- Verifica que el usuario `root` no tenga contraseña en Laragon
- O actualiza la contraseña en `application.properties`

### Los datos no aparecen en la API

**Solución:**
1. Verifica que los datos estén en MySQL:
   ```sql
   SELECT * FROM productos;
   ```
2. Verifica que los productos tengan `activo = 1` (TRUE)
3. Prueba con: `http://localhost:8080/api/productos?activos=false` para ver todos

---

## ✅ Checklist Final

- [ ] Base de datos `huertohogar` existe en MySQL
- [ ] Hay 7 productos en la tabla `productos`
- [ ] Hay 6 usuarios en la tabla `usuarios`
- [ ] Backend inicia sin errores
- [ ] GET `/api/productos` devuelve JSON con productos
- [ ] GET `/api/usuarios` devuelve JSON con usuarios
- [ ] POST `/api/productos` crea un nuevo producto
- [ ] PUT `/api/productos/{id}` actualiza un producto
- [ ] DELETE `/api/productos/{id}` marca producto como inactivo
- [ ] Los cambios se reflejan en MySQL
- [ ] CORS funciona (prueba desde navegador)

---

## 🚀 Siguiente Paso

Una vez que todo funcione, puedes:
1. Integrar el frontend React con estos endpoints
2. Crear servicios en React para consumir la API
3. Reemplazar localStorage con llamadas al backend

¿Necesitas ayuda con la integración del frontend? ¡Avísame!

