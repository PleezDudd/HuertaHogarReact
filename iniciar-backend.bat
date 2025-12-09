@echo off
echo ========================================
echo   INICIANDO BACKEND - HuertoHogar
echo ========================================
echo.

cd backend

echo Verificando Maven...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Maven no encontrado. Por favor instala Maven.
    pause
    exit /b 1
)

echo.
echo Compilando proyecto...
call mvn clean install -DskipTests

if errorlevel 1 (
    echo ERROR: Error al compilar el proyecto.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Iniciando servidor Spring Boot...
echo   Puerto: 8080
echo ========================================
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call mvn spring-boot:run

pause

