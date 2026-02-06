@echo off
echo ==========================================
echo      Git Auto Commit and Push Helper
echo ==========================================

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in your PATH.
    pause
    exit /b
)

:: Prompt for commit message
set /p commit_msg="Enter your commit message: "

:: Default message if empty
if "%commit_msg%"=="" set commit_msg="Auto update"

echo.
echo [1/3] Adding changes...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "%commit_msg%"

echo.
echo [3/3] Pushing to remote repository...
git push origin main

echo.
echo ==========================================
echo                Success!
echo ==========================================
pause
