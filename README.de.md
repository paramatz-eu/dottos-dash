# Dotto's Dash

[English version](README.md) · [Deutsches Webspiel](de/index.html) · [Bauanleitung](de/build.html) · [Aus dem Browser flashen](de/flash.html) · [Familienleitfaden (Englisch)](FAMILY-GUIDE.md) · [Projekt-TODO](PROJECT-TODO.md) · [Mitmachen](CONTRIBUTING.md)

> Ein kinderfreundliches Offline-Projekt mit ESP32: Morsezeichen mit Spiel,
> echter Taste, farbigem Licht und Ton lernen.

**Dotto's Dash** ist für neugierige Kinder ab 10 Jahren gedacht. Beim Flashen
über USB und beim Verkabeln sollte eine erwachsene Person helfen. Das Projekt
braucht weder Konto noch PHP-Server oder Cloud-Dienst. Es funktioniert ganz
ohne Heim-WLAN; Erwachsene können es bei Bedarf zusätzlich einrichten.

Der Name ist das Spiel: Dotto startet als Punkt, folgt Punkten und Strichen
durch Morse-Routen und flitzt von Checkpoint zu Checkpoint.

Nach dem Flashen steckt die komplette Spielseite in der ESP32-Firmware. Der
ESP32 baut sein eigenes WLAN auf und liefert das Spiel selbst aus – ohne extra
Server, Installation oder Internetseite.

Für die praktische Elektronik-Lektion im Browser gibt es [Dottos Controller bauen](de/build.html).
Sie erklärt Bauteile, Sicherheit, Verkabelung, Konzepte, Tests und Fehlersuche
Schritt für Schritt. Die [Markdown-Fassung](BAUEN.md) bleibt für GitHub erhalten.

## Worum geht es?

Dotto's Dash verbindet das, was auf dem Bildschirm passiert, direkt mit
echter Elektronik: Ein Punkt oder Strich im Spiel ist derselbe Punkt oder
Strich an der Morse-Taste. Das Projekt bleibt absichtlich klein,
offline-tauglich und wieder auseinandernehmbar. Zuerst kann gespielt werden;
danach wächst die Schaltung in sicheren, überschaubaren Schritten.

| Du möchtest… | Hier anfangen |
| --- | --- |
| Das Lernspiel im Browser ausprobieren | [de/index.html](de/index.html) |
| Die Elektronik mit einem Kind bauen | [Schritt-für-Schritt-Bauanleitung](de/build.html) |
| Einen ESP32 flashen, ohne etwas zu installieren | [de/flash.html](de/flash.html), mit Chrome oder Edge |
| Einen ESP32 über die Kommandozeile flashen | [ESP32 flashen](#2-den-esp32-flashen) |
| Technische, pädagogische und Sicherheitsaufgaben in der Familie aufteilen | [Familienleitfaden (Englisch)](FAMILY-GUIDE.md) |
| Das Projekt verbessern | [CONTRIBUTING.md](CONTRIBUTING.md) |

### Das bietet das Projekt

- Kein Konto, Cloud-Dienst, Internet oder Heim-WLAN nötig.
- Optional kann eine erwachsene Person das Gerät direkt im Spiel mit einem
  2,4-GHz-Heim-WLAN verbinden; Zugangsdaten stehen nie im Repository.
- Der ESP32 erstellt sein lokales WLAN `Dotto's Dash` und liefert das Spiel selbst aus.
- Die eingebaute **BOOT**-Taste wird nach dem Flashen zur Morse-Taste; ein
  externer Taster und ein Drehgeber können später ergänzt werden.
- Fünf kurze Kapitel erzählen die Erfindungsgeschichte; nach jedem folgt eine
  passende praktische Morse-Aufgabe.
- Licht- und Ton-Rückmeldung sowie eine Offline-Kurz-Bauanleitung direkt auf dem Gerät.

## Los geht's

| Stufe | Was Dotto macht | Was gebraucht wird |
| --- | --- | --- |
| 1. Webspiel | Buchstaben lernen und den Morsebaum erforschen. | Browser auf Computer, Tablet oder Handy; nach dem Flashen über das WLAN des ESP32. |
| 2. Morse-Taste | Mit der eingebauten BOOT-Taste oder einem externen Taster Punkte und Striche machen. Licht und optionaler Ton geben Rückmeldung. | ESP32; RGB-Modul und Taster können ergänzt werden. |
| 3. Morse-Drehgeber | Links für Punkt, rechts für Strich drehen. | Zusätzlich ein Drehgeber. |
| 4. Es piept! | Punkte, Striche und richtige Antworten hören. | Piezo-Summer oder MAX98357A mit kleinem Lautsprecher. |

## 1. Das Webspiel spielen

Öffne [de/index.html](de/index.html) im Browser. Die Seite funktioniert direkt
aus einem heruntergeladenen Ordner und auf GitHub Pages – ohne Installation.

Das Spiel ist eine Reise durch fünf Kapitel der Morse-Geschichte:

1. Warum langsame Nachrichten und Sichtsignale ein Problem waren.
2. Wie Samuel Morse, Leonard Gale, Joseph Henry und Alfred Vail verschiedene
   Ideen und Fähigkeiten beitrugen.
3. Wie Telegrafentaste, Empfänger und Buchstabencode die Idee praktisch machten.
4. Wie die Leitung Washington–Baltimore einen gescheiterten ersten Plan
   überstand und 1844 die berühmte öffentliche Nachricht übertrug.
5. Wie internationale Absprachen Morse zu einem gemeinsamen Code und `SOS`
   später zum internationalen Notsignal machten.

Unter jedem Kapitel öffnet sich die passende Aufgabe. Die Code-Wege zeigen, wie
Punkte und Striche zu Buchstaben führen. Die freie Taste entschlüsselt eigene
Signale. Die Hör-Aufgabe ahmt Telegrafisten nach, die Klicks verstanden. In der
Nachrichten-Werkstatt können Kinder eine Nachricht schreiben, hören und selbst
senden. Wer schon alles kennt, springt über das eingeklappte Aufgaben-Menü
direkt zu einer Übung.

In den Code-Wegen kommen erst einzelne Buchstaben (`E` bis `O`), dann `SOS`,
dann `DOTTO` und anschließend kurze Wörter wie `HI`, `GO`, `CODE` und `MORSE`.
Finde immer einen Buchstaben, bis die ganze Nachricht fertig ist.

- `←` ist ein Punkt.
- `→` ist ein Strich.
- Halte die `Leertaste` wie eine echte Morse-Taste: kurz ist Punkt, lang ist
  Strich und während des Haltens klingt ein Ton.
- `Rücktaste` entfernt ein Signal.

Im Morsebaum nach dem richtigen Knoten **Buchstaben wählen** oder `Eingabe`
drücken. Die `Leertaste` bleibt ausschließlich die Morse-Taste. Ein unfertiger
Weg springt nach 3,5 Sekunden ohne Eingabe zum Start zurück.

Die Nachrichten-Werkstatt erlaubt A–Z, Zahlen und Leerzeichen. Tasten-Töne und
Pausenlänge stehen unter **Ton und Tasten-Einstellungen**.

Gespeichert werden nur Dash-Punkte, die nächste Aufgabe und das aktuelle
Geschichtskapitel im Browser selbst. Auf der ESP32-Seite sprechen die
Bildschirm-Tasten nur mit genau diesem ESP32, damit sein Licht und Ton
reagieren; keine Daten verlassen das lokale Netzwerk.

Für GitHub Pages: Repository erstellen und unter **Settings → Pages → Deploy
from a branch → main → /(root)** einschalten. Danach ist das Spiel automatisch
unter der GitHub-Pages-Adresse erreichbar; die deutsche Fassung liegt unter
`/de/`.

## 2. Den ESP32 flashen

Die Piezo-Version ist der beste Anfang. GPIO27 kann zunächst leer bleiben –
ein Piezo muss noch nicht angeschlossen sein.

1. [ESPHome](https://esphome.io/guides/getting_started_command_line.html) auf
   dem Computer der erwachsenen Person installieren.
2. ESP32 DevKit per USB anschließen.
3. Im Projektordner diesen Befehl ausführen:

   ```sh
   esphome run firmware/dottos-dash-piezo.yaml
   ```

4. Falls dieses DevKit nicht selbst in den Upload-Modus geht: **BOOT** gedrückt
   halten, kurz **EN** drücken, BOOT noch zwei Sekunden gedrückt halten und den
   Befehl erneut ausführen.

Es wird keine `secrets.yaml` benötigt. Nach dem Flashen funktioniert der ESP32
auch ohne Handy sofort als eigenständige Morse-Taste.

Die eingebaute **BOOT**-Taste ist die erste Morse-Taste: Beim Loslassen wird
ein kurzer Druck als Punkt und ein langer als Strich gelesen. Mit angeschlossenem
RGB-Licht und optionalem Piezo oder Lautsprecher beginnt die Rückmeldung schon
beim Drücken. BOOT beim Neustart oder Flashen nicht gedrückt halten, weil GPIO0
beim Start auch den Bootloader auswählt.

Der ESP32 erstellt zusätzlich ein lokales Offline-WLAN namens **Dotto's
Dash**. Das Passwort ist **dottodash**. Wer mag, verbindet ein Handy damit und
öffnet `http://192.168.4.1/`. Dort liegt das komplette Spiel im Flash-Speicher
des ESP32. Bildschirm-Tasten lassen die echte LED und den Lautsprecher reagieren;
die echte Taste oder der Drehgeber bewegen umgekehrt das Spiel auf dem Bildschirm.
Internet wird nicht benutzt. Unten im Spiel kann außerdem die
**Bauanleitung öffnen**-Karte aufgeklappt werden.

Bei Android kann beim WLAN **Kein Internet** stehen. **Trotzdem verbunden
bleiben** (oder die ähnliche Formulierung des Handys) wählen, den Android-Hinweis
schließen und dann in Chrome genau `http://192.168.4.1/` eingeben – nicht
`https://`.

### Optional: Mit dem Heim-WLAN verbinden

Unten im ESP32-Spiel **Für Erwachsene: Mit Heim-WLAN verbinden** aufklappen.
Den Namen und das Passwort eines 2,4-GHz-WLANs eingeben und **WLAN speichern &
verbinden** wählen. Der ESP32 speichert die Verbindungseinstellung selbst,
nicht dieses Projekt. Danach das Handy mit demselben Heim-WLAN verbinden und
`http://dottos-dash.local/` öffnen (bei der MAX98357A-Firmware
`dottos-dash-max.local`). Falls der Name auf dem Handy nicht
gefunden wird, die IP-Adresse des ESP32 in der Geräteliste des Routers
nachsehen. Ist das Heim-WLAN nicht erreichbar, erscheint das WLAN `Dotto's
Dash` nach kurzer Zeit wieder.

### Spätere Firmware weitergeben

Der erste USB-Flash installiert auch das Update-Werkzeug im Browser. Für ein
späteres Update dieselbe Variante kompilieren, die entstandene **OTA**-`.bin`
an die Person mit dem Board senden und mit **Dotto's Dash** verbinden. Unten
auf der Spielseite **Für Erwachsene: Firmware aktualisieren** öffnen, die Datei
auswählen und warten, bis der ESP32 neu startet. Niemals eine
`firmware.factory.bin` nehmen und während des Updates nicht den Strom trennen.
Die Person muss beim Board sein: Dieser Offline-Zugangspunkt ist nicht über das
Internet erreichbar.

## Schritt für Schritt verkabeln

Vor jeder Änderung der Kabel den USB-Stecker ziehen. Niemals 5 V an einen
GPIO-Pin des ESP32 anschließen.

### Stufe 2 – RGB-Licht und optionaler externer Taster

Für die eingebaute **BOOT**-Taste werden keine Kabel benötigt. Der externe
Taster ist sinnvoll, wenn eine größere Morse-Taste auf dem Steckbrett gewünscht ist.

| Bauteil | Verbindung zum ESP32 | Hinweis |
| --- | --- | --- |
| HW-479 RGB, R | GPIO16 | Diese Anleitung gilt für ein **gemeinsames Kathoden**-Modul. |
| HW-479 RGB, G | GPIO17 | |
| HW-479 RGB, B | GPIO18 | |
| Gemeinsamer Pin des RGB-Moduls | GND | Beim HW-479 ist das oft das längste Bein. |
| Taster, eine Seite | GPIO13 | Der interne Pull-up-Widerstand des ESP32 wird verwendet. |
| Taster, andere Seite | GND | Kein zusätzlicher Widerstand nötig. |

- Kurz drücken (unter 0,3 Sekunden) bedeutet **Punkt**: cyanfarbenes Licht und
  kurzer Ton.
- Lang drücken bedeutet **Strich**: oranges Licht und längerer Ton.
- Nach 1,2 Sekunden Pause wird entschlüsselt: Grün bedeutet Buchstabe oder
  Zahl, Rot bedeutet: noch einmal probieren.

### Stufe 3 – Drehgeber

Der Drehgeber braucht die RGB-LED und seine Taste weiterhin. Seine Taste wird
genauso angeschlossen wie der Taster aus Stufe 2.

| Pin am Drehgeber | Verbindung zum ESP32 |
| --- | --- |
| `CLK` / `A` | GPIO21 |
| `GND` / `C` | GND |
| `DT` / `B` | GPIO19 |
| `SW` | GPIO13 |
| `+` / `VCC` | Nur 3V3 |

**Links drehen ist Punkt, rechts drehen ist Strich.** Das entspricht genau dem
Morsebaum auf der Webseite. Wenn sich der Drehgeber falsch herum anfühlt,
`CLK` und `DT` vertauschen.

### Stufe 4a – passiver Piezo-Summer (empfohlen)

| Piezo-Pin | Verbindung zum ESP32 |
| --- | --- |
| `+` | GPIO27 |
| `-` | GND |

Es muss ein **passiver** Piezo-Summer sein, kein Summer, der bei Strom von
allein piept. Die bereits geflashte Piezo-Firmware unterstützt ihn sofort; nach
dem späteren Anschließen ist kein erneutes Flashen nötig.

### Stufe 4b – MAX98357A und kleiner Lautsprecher

Für lauteren Klang stattdessen diese Firmware flashen:

```sh
esphome run firmware/dottos-dash-max98357a.yaml
```

| MAX98357A-Pin | Verbindung zum ESP32 |
| --- | --- |
| `BCLK` | GPIO26 |
| `LRC` / `WS` | GPIO25 |
| `DIN` | GPIO22 |
| `GND` | GND |
| `VIN` | 5V / `VIN`-Pin des DevKit |

Der Lautsprecher wird nur an `SPK+` und `SPK-` des Verstärkers angeschlossen.
Eine erwachsene Person soll die Verkabelung prüfen: Die GPIO-Pins des ESP32
arbeiten mit 3,3 V und dürfen niemals 5 V abbekommen.

## Was gehört ins GitHub-Repository?

```text
index.html / style.css / app.js         Webspiel; diese Dateien werden in beide Firmware-Versionen eingebettet
de/index.html                           Deutsche Offline-Version
firmware/dottos-dash-piezo.yaml      Zuerst flashen; Piezo ist optional
firmware/dottos-dash-max98357a.yaml  I2S-Alternative für Lautsprecher
firmware/dottos-dash-common.yaml     Gemeinsames Verhalten des Lernpads
```

Vor dem Veröffentlichen beide Firmware-Varianten auf echter Hardware testen.
Dann nur die Quelldateien committen, nicht `.esphome/`, `secrets.yaml` oder
generierte `.bin`-Dateien. Ein Foto von Ottos fertigem Projekt und getestete
Firmware-Dateien in einem GitHub Release machen das Projekt für andere noch
einfacher.

## Entwicklung

Das Webspiel besteht aus einfachem HTML, CSS und JavaScript. ESPHome bettet
`style.css` und `app.js` beim Kompilieren in beide Firmware-Varianten ein.
Gemeinsame Änderungen deshalb mit beiden Varianten und auf echter Hardware
testen. Die praktische Checkliste steht in [CONTRIBUTING.md](CONTRIBUTING.md).

## Lizenz

Der Programmcode steht unter der [MIT-Lizenz](LICENSE). Die Lernmaterialien
stehen unter [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt), und künftige
Hardware-Entwurfsdaten unter [CERN-OHL-W-2.0](LICENSES/CERN-OHL-W-2.0.txt).
Die vollständige Zuordnung steht im [Lizenzleitfaden](LICENSING.md), einschließlich
der [Regeln für Name und Logo](TRADEMARKS.md).
