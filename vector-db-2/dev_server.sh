#!/usr/bin/sh
watchmedo auto-restart --patterns="*.py" --recursive -- python main.py
