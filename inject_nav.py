#!/usr/bin/env python3
"""
inject_nav.py – DIY Finanzcoaching
Ersetzt den <nav>...</nav>-Block in allen HTML-Dateien automatisch.
Nav-Inhalt wird zentral in _nav.html gepflegt.

Der Platzhalter {ROOT} wird je nach Verzeichnistiefe ersetzt:
  - Root-Dateien (index.html, impressum.html …): {ROOT} → ./
  - Unterordner (blog/*.html):                   {ROOT} → ../
"""

import os
import re

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
NAV_FILE  = os.path.join(REPO_ROOT, "_nav.html")

# Tupel: (Verzeichnis, relativer Pfad zum Root)
SEARCH_DIRS = [
    (REPO_ROOT,                          "./"),
    (os.path.join(REPO_ROOT, "blog"),    "../"),
]

EXCLUDE_FILES = {"_nav.html"}


def load_nav():
    with open(NAV_FILE, "r", encoding="utf-8") as f:
        return f.read().strip()


def inject_nav_into_file(filepath, nav_html):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(r"<nav>.*?</nav>", re.DOTALL)

    if not pattern.search(content):
        print(f"  SKIP (kein <nav> gefunden): {filepath}")
        return

    new_content = pattern.sub(f"<nav>\n{nav_html}\n</nav>", content)

    if new_content == content:
        print(f"  UNVERÄNDERT: {filepath}")
        return

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"  AKTUALISIERT: {filepath}")


def main():
    nav_template = load_nav()
    print(f"Nav geladen aus: {NAV_FILE}\n")

    for directory, root_prefix in SEARCH_DIRS:
        if not os.path.isdir(directory):
            print(f"Ordner nicht gefunden, übersprungen: {directory}")
            continue

        nav_html = nav_template.replace("{ROOT}", root_prefix)

        for filename in os.listdir(directory):
            if not filename.endswith(".html"):
                continue
            if filename in EXCLUDE_FILES:
                continue

            filepath = os.path.join(directory, filename)
            inject_nav_into_file(filepath, nav_html)

    print("\nFertig.")


if __name__ == "__main__":
    main()
