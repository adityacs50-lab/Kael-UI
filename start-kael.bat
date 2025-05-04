@echo off
echo Starting KAEL UI System...
echo.
echo Starting backend server...
start cmd /k "cd /d %~dp0 && python server.py"
echo.
echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul
echo.
echo Starting frontend...
start cmd /k "cd /d %~dp0 && npm start"
echo.
echo KAEL UI System is starting up!
echo Access the UI at http://localhost:3000 or http://localhost:3001
echo.
echo Press any key to exit this window...
pause > nul