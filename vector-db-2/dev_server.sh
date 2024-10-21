#!/usr/bin/sh
source venv/bin/activate
watchmedo auto-restart --patterns="*.py" --recursive -- python main.py
