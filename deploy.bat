@echo off
echo ===================================
echo KAEL UI Deployment Script
echo ===================================
echo.

echo Building KAEL UI...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error: Build failed!
    pause
    exit /b 1
)
echo Build successful!
echo.

echo Starting KAEL Standalone Server...
python standalone_server.py
if %ERRORLEVEL% NEQ 0 (
    echo Error: Server failed to start!
    pause
    exit /b 1
)

pause