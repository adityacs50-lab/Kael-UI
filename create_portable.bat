@echo off
echo ===================================
echo KAEL UI Portable Package Creator
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

echo Creating portable directory...
if not exist "portable" mkdir portable
if not exist "portable\dist" mkdir portable\dist

echo Copying files...
xcopy /E /Y dist portable\dist\
copy standalone_server.py portable\
copy DEPLOYMENT.md portable\README.md

echo Creating launcher...
(
echo @echo off
echo echo Starting KAEL Standalone Server...
echo python standalone_server.py
echo pause
) > portable\start_kael.bat

echo Creating requirements file...
(
echo flask
echo flask-cors
echo requests
echo pyttsx3
) > portable\requirements.txt

echo Creating setup script...
(
echo @echo off
echo echo Installing required packages...
echo pip install -r requirements.txt
echo echo.
echo echo Setup complete! Run start_kael.bat to launch KAEL.
echo pause
) > portable\setup.bat

echo.
echo Portable package created in the 'portable' directory!
echo.
echo To use:
echo 1. Copy the 'portable' directory to any location
echo 2. Run setup.bat to install dependencies
echo 3. Run start_kael.bat to launch KAEL
echo.

pause