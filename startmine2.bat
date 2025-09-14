@echo off
set process_name=server
set minecraft_path=C:\Users\luisz\OneDrive\Desktop\Fabric_Server2

tasklist /FI "IMAGENAME eq %process_name%.exe" 2>NUL | find /I /N "%process_name%">NUL
if "%ERRORLEVEL%" == "0" (
    echo The process %process_name% is already running.
    exit /B 0
) else (
    echo Starting %process_name%...
    cd /D "%minecraft_path%" || (
        echo Error: Fabric server folder not found.
        exit /B 1
    )
    call run.bat
    echo Server Starting command has been executed
)