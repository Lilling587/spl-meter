# SPL-mätare

En ljudnivåmätare som körs i webbläsaren (Chrome eller Edge). Den läser ljud från en mätmikrofon via ljudkortet och visar:

- **LAF** – A-vägd nivå med tidsvägning Fast (125 ms), just nu
- **LAFmax** – högsta värdet under mätningen
- **LAeq, rullande timme** – medelnivån senaste timmen
- **LAeq, hela mätningen** – medelnivån sedan Starta

Gränserna följer Folkhälsomyndighetens allmänna råd om höga ljudnivåer (FoHMFS 2014:15):

| Arrangemang | LAeq | LAFmax |
|---|---|---|
| Barn under 13 år har inte tillträde | 100 dB | 115 dB |
| Barn och vuxna har tillträde | 97 dB | 110 dB |

Loggen kan laddas ner som CSV (en rad per sekund, svenska decimalkomman).

> **Obs!** Detta är en prototyp och inte en certifierad mätare. Noggrannheten beror främst på mikrofonen och kalibreringen.

## Användning

1. Koppla in mätmikrofonen via ljudkortet (med fantommatning).
2. Öppna sidan i Chrome eller Edge, via GitHub Pages-adressen eller genom att dra `index.html` in i webbläsaren.
3. Välj ingång och tryck **Starta**. Tillåt mikrofonen när webbläsaren frågar.
4. Ställ gain så att den röda **CLIP**-skylten aldrig visas.
5. Sätt kalibratorn på mikrofonen, skriv in dess nivå (oftast 94 eller 114 dB) och tryck **Kalibrera (10 s)**.
6. Ändra inte gain på ljudkortet eller i Windows efter kalibreringen.

## Filer

| Fil | Innehåll |
|---|---|
| `index.html` | Hela appen i en fil, utan beroenden |
| `tests/test-dsp.js` | Jämför A-filtret med standardtabellen (IEC 61672) |

Kör testet med Node:

```
node tests/test-dsp.js
```

## Noggrannhet för A-filtret

Uppmätt med testet ovan, avvikelse från standardtabellen:

| Samplingsfrekvens | 31,5 Hz – 4 kHz | 8 kHz | 16 kHz |
|---|---|---|---|
| 48 kHz | högst 0,3 dB | +0,65 dB | −3,1 dB |
| 96 kHz | högst 0,1 dB | +0,11 dB | −0,6 dB |

Allt ligger inom toleranserna för klass 1. Använd 96 kHz om ljudkortet klarar det.
