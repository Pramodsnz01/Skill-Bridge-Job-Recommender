@echo off
echo Starting SkillBridge Services...
echo.

echo [1/3] Starting Python Flask API...
cd resume-analyzer
start "Python API" cmd /k "python app.py"
cd ..

echo [2/3] Starting Node.js Backend...
cd skillbridge-backend
start "Node.js Backend" cmd /k "npm run dev"
cd ..

echo [3/3] Starting React Frontend...
cd skillbridge-frontend
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo All services are starting...
echo.
echo Python API: http://localhost:5001
echo Node.js Backend: http://localhost:5000
echo React Frontend: http://localhost:5173
echo.
echo Press any key to run the test script...
pause

echo.
echo Running test script...
cd skillbridge-backend
node test-analyze.js
cd ..

echo.
echo Test completed. Check the results above.
pause 