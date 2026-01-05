# PowerShell helper to run backend while suppressing DeprecationWarnings about get_engine
# Usage: Open PowerShell in project root and run: .\scripts\run_backend.ps1

$Env:PYTHONWARNINGS = 'ignore::DeprecationWarning'
python backend/app.py