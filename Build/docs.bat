@echo off
@echo Building Telenor Documentation

@echo Installing npm dependencies
call npm install

call .\node_modules\.bin\gulp docs-build -p

if errorlevel 1 (
	@echo ********** BUILD FAILURE **********
	@echo Can't build documentation.
	exit /b 1
)
