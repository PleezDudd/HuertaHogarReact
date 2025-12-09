@echo off
echo ========================================
echo   INICIANDO FRONTEND - HuertoHogar
echo ========================================
echo.

cd mi-app\primer-react

echo Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no encontrado. Por favor instala Node.js.
    pause
    exit /b 1
)

echo.
echo Verificando npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm no encontrado. Por favor instala Node.js.
    pause
    exit /b 1
)

echo.
echo Instalando dependencias (si es necesario)...
if not exist "node_modules" (
    echo Instalando dependencias por primera vez...
    call npm install
    if errorlevel 1 (
        echo ERROR: Error al instalar dependencias.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   Iniciando servidor de desarrollo...
echo   Puerto: 3000
echo ========================================
echo.
echo El navegador se abrirá automáticamente
echo Presiona Ctrl+C para detener el servidor
echo.

call npm start

pause

