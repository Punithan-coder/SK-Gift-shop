@echo off
cd /d "%~dp0backend"
echo Installing dependencies if needed...
pip install -r requirements.txt -q
echo.
echo Starting backend on http://localhost:5000
echo Keep this window open while using the app.
echo.
python app.py
