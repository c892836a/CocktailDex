#!/usr/bin/env python3
"""Compatibility shim. All logic lives in wiki.py — this just runs `wiki.py compile`
in a fresh process. Prefer: `python scripts/wiki.py compile`."""
import sys, subprocess
from pathlib import Path

sys.exit(subprocess.call([sys.executable, str(Path(__file__).with_name("wiki.py")), "compile"]))
