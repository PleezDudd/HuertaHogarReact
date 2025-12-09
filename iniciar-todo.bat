@echo off
echo ========================================
echo   INICIANDO PROYECTO COMPLETO
echo   HuertoHogar - Backend + Frontend
echo ========================================
echo.
echo Este script abrirá DOS ventanas:
echo   1. Backend (Spring Boot) - Puerto 8080
echo   2. Frontend (React) - Puerto 3000
echo.
echo IMPORTANTE: Asegúrate de que MySQL esté ejecutándose
echo.
pause

echo.
echo Abriendo Backend...
start "Backend - HuertoHogar" cmd /k "iniciar-backend.bat"

timeout /t 5 /nobreak >nul

echo.
echo Abriendo Frontend...
start "Frontend - HuertoHogar" cmd /k "iniciar-frontend.bat"

echo.
echo ========================================
echo   Proyecto iniciado!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo Swagger: http://localhost:8080/swagger-ui.html
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

