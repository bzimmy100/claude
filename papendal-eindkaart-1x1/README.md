# Papendal Eindkaart 1:1 (zonder achtergrond)

Vierkante variant (1080x1080) van de Papendal video-eindkaart, met een
transparante achtergrond zodat de kaart over eigen beeld gelegd kan worden.

## Bestanden

| Bestand | Wat |
| --- | --- |
| `Papendal Eindkaart 1x1 (standalone).html` | Alles-in-een. Openen in de browser, geen server of internet nodig. Hiermee exporteer je. |
| `Papendal Eindkaart 1x1.dc.html` | Instappunt voor Claude Design. Laadt de losse bronbestanden hiernaast. |
| `eindkaart-scene-1x1.jsx` | De vierkante scene. Registreert `window.PapendalEndCardSquare`. |
| `eindkaart-scene-standalone.jsx` | De 9:16-bron waarvan deze variant is afgeleid, ter vergelijking. |
| `animations-v2.jsx`, `tweaks-panel.jsx`, `support.js` | Ongewijzigde engine en runtime. |
| `motif-lijnen.png`, `papendal-logo.png`, `preview-man.png` | Beeldmateriaal. |

## Wat er anders is dan de 9:16

Tekst, kleuren, timing en animatiecurves zijn ongewijzigd. Alleen het canvas
en de verticale opbouw zijn aangepast:

| | 9:16 | 1:1 |
| --- | --- | --- |
| Canvas | 1080 x 1920 | 1080 x 1080 |
| Blok 1 (JOUW / THUISBASIS) | top 402 | top 150 |
| Blok 2 (VOOR / TOPPRESTATIES) | top 1178 | top 555 |
| Badge | bottom 448 | bottom 140 |
| Achtergrond in voorbeeld | foto | geen |

De korpsgrootte blijft 92. Het canvas is even breed als de 9:16-versie, dus de
regels breken identiek en `TOPPRESTATIES` (509 px) past ruim binnen 1080 px.

Tussen de twee tekstblokken blijft een open middenvlak, zodat de kaart ook over
beeld met een persoon in het midden gelegd kan worden.

## Achtergrond

`previewBg` staat op `geen`, dus er wordt geen achtergrondlaag achter het canvas
gezet. De exporteerbare SVG heeft `bg="transparent"`, waardoor de export een
alfakanaal houdt. Via het tweaks-paneel kun je tijdens het werken alsnog `foto`
of `donker` kiezen; dat is puur voorbeeldweergave en komt niet in de export.

## Video exporteren (MOV met alfakanaal)

```bash
./render-mov.sh 25     # of 30
```

Levert `export/Papendal-Eindkaart-1x1-alpha-25fps.mov`: 1080 x 1080, ProRes 4444,
`yuva444p10le`, 2,8 seconden. De achtergrond is volledig transparant, dus de kaart
kan zo over eigen beeld in de montage.

De renderer zet de scene stil per frame via het `data-om-seek-to-time-frame`
event van de engine, zodat elk frame exact op zijn tijdstip staat en er niets
wordt overgeslagen. `export/` staat in `.gitignore`; de videobestanden zijn
afgeleid materiaal en worden niet meegecommit.
