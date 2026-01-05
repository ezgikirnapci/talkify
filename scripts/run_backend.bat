@echo off
REM Helper to run backend and suppress DeprecationWarnings about get_engine
set PYTHONWARNINGS=ignore::DeprecationWarning
python backend/app.py