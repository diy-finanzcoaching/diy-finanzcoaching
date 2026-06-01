# DIY Finanzcoaching

Statische Website für **DIY Finanzcoaching – Oliver Nitsch**. Ziel ist es, Menschen zu befähigen, ihre Finanzen eigenständig zu verstehen, zu planen und umzusetzen – ohne Provisionsberater, ohne teure Honorarberatung.

Live unter: [diy-finanzcoaching.de](https://diy-finanzcoaching.de)

---

## Projektstruktur

```
/
├── index.html              # Startseite (Hero, Ansatz, Themen, Preise, FAQ, Über mich)
├── datenschutz.html        # Datenschutzerklärung
├── impressum.html          # Impressum
├── style.css               # Globales Stylesheet (CSS Custom Properties, kein Framework)
├── main.js                 # Interaktivität (FAQ-Akkordeon, Mobile Nav, Scroll-Animationen)
├── _nav.html               # Zentrale Nav-Vorlage (Single Source of Truth)
├── inject_nav.py           # Skript: injiziert _nav.html in alle HTML-Dateien
├── blog/
│   ├── index.html          # Blog-Übersicht
│   ├── sind-nachhaltige-geldanlagen-wirklich-sinnvoll.html
│   └── excel-tool-vs-finanzguru.html
└── Assets/                 # Bilder (Banner, Portrait, Blog-Thumbnails)
```

---

## Navigation verwalten

Die Navigation ist **zentral** in `_nav.html` gepflegt. Änderungen dort werden automatisch in alle HTML-Dateien übernommen – entweder manuell oder per CI.

**Manuell ausführen:**

```bash
python inject_nav.py
```

**Automatisch via GitHub Actions:** Bei jedem Push auf `main`, der `_nav.html` oder eine `.html`-Datei berührt, läuft `.github/workflows/inject-nav.yml` und committet die aktualisierten Dateien zurück ins Repository.

---

## Neuen Blogartikel anlegen

1. Neue HTML-Datei in `blog/` erstellen (z. B. `blog/mein-neuer-artikel.html`).
2. Bestehenden Artikel als Vorlage kopieren und Inhalt anpassen.
3. Artikel in der Blog-Übersicht (`blog/index.html`) verlinken.
4. Committen und auf `main` pushen – die Nav wird automatisch injiziert.

---

## Lokale Entwicklung

Da es sich um eine rein statische Website ohne Build-Schritt handelt, reicht ein einfacher lokaler Webserver:

```bash
# Python (ab 3.x)
python -m http.server 8080
```

Dann im Browser: `http://localhost:8080`

---

## Technologie-Stack

| Bereich | Technologie |
|---|---|
| HTML/CSS/JS | Vanilla – kein Framework, kein Build-Tool |
| Schriften | Google Fonts: Playfair Display, DM Sans |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages / statisches Hosting |

---

## Inhalt & Angebot

- **Coaching-Mitgliedschaft:** 135 €/Jahr (zzgl. MwSt.) – 2 Sessions, E-Mail-Support, Mitgliederbereich
- **Themen:** Finanzüberblick, Versicherungen, Geldanlage & ETFs, Kredit & Finanzierung
- **Buchung:** [Kostenloses Kennenlerngespräch via Calendly](https://calendly.com/diy-finanzcoaching-nitsch/neues-meeting)
