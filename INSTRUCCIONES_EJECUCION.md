# 🚀 Guía para Ejecutar el Proyecto HuertoHogar

Esta guía te ayudará a ejecutar el proyecto completo (Backend + Frontend) en ventanas separadas.

## 📋 Requisitos Previos

1. **Java 17 o superior** - Verificar con: `java -version`
2. **Maven 3.6+** - Verificar con: `mvn -version`
3. **Node.js y npm** - Verificar con: `node -v` y `npm -v`
4. **MySQL ejecutándose** (Laragon/XAMPP/WAMP)
5. **Base de datos `huertohogar` creada**

---

## 🔧 Paso 1: Preparar la Base de Datos

### 1.1. Iniciar MySQL
- Abre **Laragon** o **XAMPP** y asegúrate de que MySQL esté ejecutándose (botón verde)

### 1.2. Crear la base de datos (si no existe)
Abre **MySQL Workbench** o **HeidiSQL** y ejecuta:

```sql
CREATE DATABASE IF NOT EXISTS huertohogar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huertohogar;
```

### 1.3. Ejecutar scripts SQL (en orden)
1. **Script inicial** (si es primera vez):
   ```sql
   -- Ejecutar: backend/database/init_database.sql
   ```

2. **Script de corrección de foreign keys** (si es necesario):
   ```sql
   -- Ejecutar: backend/database/fix_foreign_keys.sql
   ```

3. **Script de tablas de órdenes** (NUEVO - IMPORTANTE):
   ```sql
   -- Ejecutar: backend/database/create_ordenes_table.sql
   ```

---

## 🖥️ Paso 2: Ejecutar el Backend (Spring Boot)

### Opción A: Desde la Terminal/PowerShell

1. **Abrir una terminal** (PowerShell o CMD)

2. **Navegar a la carpeta backend**:
   ```powershell
   cd backend
   ```

3. **Compilar el proyecto** (solo la primera vez o después de cambios):
   ```powershell
   mvn clean install
   ```

4. **Ejecutar el backend**:
   ```powershell
   mvn spring-boot:run
   ```

5. **Esperar a que inicie** - Deberías ver:
   ```
   Started BackendApplication in X.XXX seconds
   ```

6. **Verificar que funciona**:
   - Abre tu navegador en: `http://localhost:8080/swagger-ui.html`
   - O prueba: `http://localhost:8080/api/productos`

### Opción B: Desde un IDE (IntelliJ IDEA, Eclipse, VS Code)

1. Abre el proyecto en tu IDE
2. Navega a: `backend/src/main/java/com/huertohogar/backend/BackendApplication.java`
3. Haz clic derecho → **Run 'BackendApplication'**

---

## ⚛️ Paso 3: Ejecutar el Frontend (React)

### Abrir una NUEVA terminal (mantén el backend corriendo)

1. **Abrir una nueva terminal** (PowerShell o CMD)

2. **Navegar a la carpeta del frontend**:
   ```powershell
   cd mi-app\primer-react
   ```

3. **Instalar dependencias** (solo la primera vez):
   ```powershell
   npm install
   ```

4. **Ejecutar el frontend**:
   ```powershell
   npm start
   ```

5. **Esperar a que inicie** - Deberías ver:
   ```
   Compiled successfully!
   You can now view primer-react in the browser.
   Local:            http://localhost:3000
   ```

6. **El navegador se abrirá automáticamente** en `http://localhost:3000`

---

## ✅ Verificación Final

### Backend funcionando:
- ✅ Terminal muestra: `Started BackendApplication`
- ✅ Swagger UI accesible en: `http://localhost:8080/swagger-ui.html`
- ✅ API responde en: `http://localhost:8080/api/productos`

### Frontend funcionando:
- ✅ Navegador abierto en: `http://localhost:3000`
- ✅ No hay errores en la consola del navegador
- ✅ La página carga correctamente

---

## 🎯 Resumen de Puertos

- **Backend (Spring Boot)**: `http://localhost:8080`
- **Frontend (React)**: `http://localhost:3000`
- **MySQL**: `localhost:3306`

---

## 🐛 Solución de Problemas

### Error: "Puerto 8080 ya está en uso"
```powershell
# Encontrar el proceso que usa el puerto
netstat -ano | findstr :8080

# Matar el proceso (reemplaza PID con el número que aparezca)
taskkill /PID <PID> /F
```

### Error: "Puerto 3000 ya está en uso"
```powershell
# Encontrar el proceso que usa el puerto
netstat -ano | findstr :3000

# Matar el proceso
taskkill /PID <PID> /F
```

### Error: "No se puede conectar a MySQL"
- Verifica que MySQL esté ejecutándose en Laragon/XAMPP
- Verifica las credenciales en `backend/src/main/resources/application.properties`
- Verifica que la base de datos `huertohogar` exista

### Error: "Maven no encontrado"
- Descarga Maven desde: https://maven.apache.org/download.cgi
- Agrega Maven al PATH del sistema

### Error: "Node.js no encontrado"
- Descarga Node.js desde: https://nodejs.org/
- Instala la versión LTS

---

## 📝 Notas Importantes

1. **Mantén ambas terminales abiertas** mientras trabajas en el proyecto
2. **El backend debe estar corriendo** antes de usar el frontend
3. **Si cambias código del backend**, reinicia el backend
4. **Si cambias código del frontend**, React se recarga automáticamente (hot reload)

---

## 🎉 ¡Listo!

Ahora deberías tener:
- ✅ Backend ejecutándose en `http://localhost:8080`
- ✅ Frontend ejecutándose en `http://localhost:3000`
- ✅ Base de datos configurada y lista

¡Puedes empezar a usar la aplicación!

