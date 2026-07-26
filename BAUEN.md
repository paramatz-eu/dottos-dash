# Dotto's Dash bauen

[Formatierte Browser-Lektion](de/build.html) · [English build lesson](BUILD.md) · [Projektübersicht](README.de.md)

Die farbige Browser-Lektion oben ist die kinderfreundliche Version mit Erklärungen zu jedem Bauteil. Diese Markdown-Seite ist zusätzlich als technische Nachschlagehilfe für GitHub gedacht.

Das ist eine Bauanleitung für Dottos Controller, gedacht für ein Kind und eine erwachsene Hilfsperson. Immer nur eine kleine Schaltung bauen, testen und erst dann das nächste Teil hinzufügen. So suchen auch echte Ingenieurinnen und Ingenieure Fehler, ohne den Überblick zu verlieren.

## Die Idee

Ein ESP32 ist ein winziger Computer mit Anschlüssen, den **GPIO-Pins**. Ein Pin kann eine Eingabe bemerken (Taste wird gedrückt) oder etwas ausgeben (Licht oder Ton).

```text
Finger oder Drehknopf → Eingangs-Pin am ESP32 → Morse-Programm → Licht und Ton
```

Das Webspiel erklärt zuerst den Code. Die Hardware macht dieselben Entscheidungen echt:

```text
kurz drücken = Punkt       lang drücken = Strich
links drehen = Punkt       rechts drehen = Strich
1,2 Sekunden Pause = Buchstabe wird entschlüsselt
```

## Sicherheit zuerst

Eine erwachsene Person sollte flashen und die Kabel prüfen, bevor Strom angeschlossen wird.

- USB abziehen, bevor ein Kabel umgesteckt wird.
- Zum Lernen nur USB-Strom verwenden. Dieses Projekt niemals an Steckdose, Netzspannung, zu starke Batterien oder unbekannte Netzteile anschließen.
- ESP32-GPIO-Pins vertragen nur **3,3 V**. Niemals 5 V an einen GPIO-Pin geben.
- Der Pin `VIN`/`5V` ist nur zum Versorgen eines passenden Moduls wie des MAX98357A da. Er ist kein Signal-Pin.
- Das unten genannte HW-479-RGB-**Modul** verwenden – oder an jeden Anschluss einer nackten LED einen Widerstand setzen. Eine nackte LED direkt am GPIO kann die LED oder den ESP32 beschädigen.
- Wird das Board heiß, riecht komisch oder trennt sich vom Computer: sofort USB abziehen und die Verdrahtung mit der erwachsenen Person prüfen.

## Teile und ihre Aufgaben

| Teil | Aufgabe im Projekt | Ab wann nötig |
| --- | --- | --- |
| ESP32 DevKit + USB-Kabel | Der kleine Computer. | Immer |
| Steckbrett + Jumper-Kabel | Für sichere, wieder lösbare Verbindungen. | Hardware-Stufen |
| HW-479 RGB mit gemeinsamer Kathode | Zeigt Punkte, Striche und Antworten als Farben. | Stufe 1 |
| Taster | Eine echte Morse-Taste. | Stufe 2 |
| Drehgeber-Modul | Morsecode durch Drehen eingeben. | Stufe 3 |
| Passiver Piezo-Summer | Macht leise elektronische Töne. | Stufe 4A |
| MAX98357A + kleiner 4–8-Ω-Lautsprecher | Lautere Alternative. | Stufe 4B statt 4A |

`GND` heißt **Masse**. Das ist der gemeinsame Rückweg für Strom. Bauteile können nur zusammenarbeiten, wenn sie Masse mit dem ESP32 teilen.

## Vor dem Verkabeln: flashen und Pins finden

1. Zuerst die Anfänger-Firmware flashen, während außer USB noch nichts angeschlossen ist:

   ```sh
   esphome run firmware/dottos-dash-piezo.yaml
   ```

2. USB abziehen.
3. Den ESP32 mit dem USB-Anschluss immer zur gleichen Seite ins Steckbrett stecken. Die winzigen Beschriftungen lesen: Wichtig sind `13`, `21`, `GND`, `3V3` und `VIN`/`5V` – nicht die Nummer der Steckbrett-Reihe.
4. Diese Pin-Liste auf Papier schreiben und jedes Kabel beim Einstecken abhaken:

| ESP32-Pin | Verbindung | Aufgabe |
| --- | --- | --- |
| GPIO16 | RGB `R` | Roter Lichtanteil |
| GPIO17 | RGB `G` | Grüner Lichtanteil |
| GPIO18 | RGB `B` | Blauer Lichtanteil |
| GPIO13 | Taster / Drehgeber `SW` | Kurze oder lange Drücke lesen |
| GPIO21 | Drehgeber `CLK` / `A` | Drehen lesen |
| GPIO19 | Drehgeber `DT` / `B` | Drehrichtung lesen |
| GPIO27 | Passiver Piezo `+` | Piezo schwingen lassen |
| GPIO26 | MAX98357A `BCLK` | Ton-Takt |
| GPIO25 | MAX98357A `LRC` / `WS` | Ton-Kanal-Takt |
| GPIO22 | MAX98357A `DIN` | Ton-Daten |

## Stufe 1: das RGB-Licht

### Anschließen

Das **HW-479 RGB-Modul mit gemeinsamer Kathode** verwenden. Der gemeinsame Pin ist mit `GND`, `-` oder „common cathode“ markiert.

| HW-479-Beschriftung | ESP32-Pin |
| --- | --- |
| `R` | GPIO16 |
| `G` | GPIO17 |
| `B` | GPIO18 |
| `GND` / gemeinsame Kathode | GND |

```text
GPIO16 ───────── RGB R
GPIO17 ───────── RGB G
GPIO18 ───────── RGB B
GND    ───────── RGB common / GND
```

Nicht nach der Farbe eines Jumper-Kabels raten, sondern die Beschriftung des Moduls lesen. Ist es eine LED mit gemeinsamer **Anode** oder gibt es dort einen `VCC`-Pin statt der vier Beschriftungen oben, anhalten: Diese Anleitung und Firmware sind für das HW-479 mit gemeinsamer Kathode gemacht.

### Testen

USB wieder anschließen. Beim Start sollte das Licht kurz blaugrün leuchten. Später gilt: Punkt = kurzer cyanfarbener Blitz; Strich = längerer orangefarbener Blitz; erkannter Buchstabe = grüner Blitz; unbekannter Code = roter Blitz.

### Was passiert hier?

RGB bedeutet Rot, Grün und Blau. Der ESP32 schaltet jeden Farbkanal sehr schnell an und aus. Das heißt **PWM** (Pulsweitenmodulation). Unsere Augen mischen die schnellen Blitze zu Farben. Bei einer LED mit gemeinsamer Kathode gibt es einen gemeinsamen Weg zur Masse; der ESP32 steuert die drei Farbwege getrennt.

## Stufe 2: die Morse-Taste

### Zuerst die eingebaute Taste nutzen

Nach dem Flashen funktioniert die **BOOT**-Taste des ESP32 DevKit schon als
Morse-Taste: Beim Loslassen wird ein kurzer Druck als Punkt und ein langer als
Strich gesendet. Mit angeschlossenem RGB-Licht und Piezo beginnt die
Rückmeldung schon beim Drücken. Für die Taste selbst werden keine Kabel
benötigt. BOOT beim Neustart oder Flashen nicht gedrückt halten, weil die Taste
beim Start auch den Bootloader auswählt.

### Anschließen

Den externen Taster unten ergänzen, wenn eine größere Morse-Taste auf dem
Steckbrett gewünscht ist.

| Seite des Tasters | ESP32-Pin |
| --- | --- |
| Eine Seite | GPIO13 |
| Andere Seite | GND |

```text
GPIO13 ───────── [ Taster ] ───────── GND
```

Viele kleine Steckbrett-Taster haben vier Beine. Die beiden Beine auf einer Seite sind im Taster schon verbunden, genauso die zwei Beine auf der anderen Seite. Ein Bein von jeder Seite über den Mittelspalt wählen. Zwei Beine auf derselben Seite wären immer verbunden.

### Testen

1. Kurz antippen: cyanfarbenes Licht bedeutet Punkt.
2. Etwa eine halbe Sekunde halten: orangefarbenes Licht bedeutet Strich.
3. Einmal antippen, dann warten: `.` wird zu `E` und gibt grünes Feedback.
4. `...` machen, dann warten: daraus wird `S`.

### Was passiert hier?

Das Programm zieht GPIO13 unsichtbar und ganz sanft in Richtung 3,3 V. Das heißt **interner Pull-up-Widerstand**. Ist die Taste offen, liest der Pin HIGH. Beim Drücken verbindet die Taste ihn mit GND, also LOW. Das Programm misst, wie lange LOW dauert. Außerdem ignoriert es die winzigen Zuckungen eines Metall-Tasterschalters beim ersten Kontakt. Das heißt **Entprellen**.

## Stufe 3: der Drehgeber

Der Drehgeber ist ein optionaler zweiter Morse-Controller. Der Taster bleibt angeschlossen: Der `SW`-Pin des Drehgebers nutzt dieselben zwei Verbindungen.

| Beschriftung am Drehgeber | ESP32-Pin | Hinweis |
| --- | --- | --- |
| `CLK` / `A` | GPIO21 | Erstes Drehsignal |
| `DT` / `B` | GPIO19 | Zweites Drehsignal |
| `GND` / `C` | GND | Gemeinsame Masse |
| `SW` | GPIO13 | Optionaler Druckschalter |
| `+` / `VCC` | 3V3 | Nur bei einem Modul mit diesem Pin |

```text
GPIO21 ───────── Drehgeber CLK / A
GPIO19 ───────── Drehgeber DT / B
GPIO13 ───────── Drehgeber SW
GND    ───────── Drehgeber GND / C
3V3    ───────── Drehgeber + / VCC   (nur Modul)
```

Links drehen bedeutet Punkt, rechts drehen bedeutet Strich. Fühlt sich die Richtung falsch an: USB abziehen und nur die Kabel `CLK` und `DT` tauschen.

### Was passiert hier?

Ein Drehgeber meldet keinen Winkel wie ein Kompass. Er erzeugt zwei Klick-Signale. Eines ändert sich einen winzigen Moment vor dem anderen; diese Reihenfolge verrät dem ESP32 die Drehrichtung. Das Zwei-Signal-Prinzip heißt **Quadratur**.

## Stufe 4A: passiver Piezo-Summer

Die Piezo-Firmware wurde schon am Anfang geflasht. Ein **passiver** Piezo braucht ein wechselndes elektrisches Signal für einen Ton; genau das erzeugt dieses Projekt. Ein aktiver Summer macht seinen einzelnen Ton selbst und ist hier nicht das empfohlene Teil.

| Piezo-Pin | ESP32-Pin |
| --- | --- |
| `+` | GPIO27 |
| `-` | GND |

```text
GPIO27 ───────── Piezo +
GND    ───────── Piezo -
```

Nach dem erneuten Anschließen sollte die Startmelodie erklingen. Punkte machen kurze hohe, Striche längere tiefere Pieptöne.

### Was passiert hier?

Das Programm wackelt GPIO27 viele tausend Male pro Sekunde. Die Piezo-Keramik biegt sich jedes Mal ein winziges Stück und bewegt Luft – so entsteht Ton. Mehr Wackler pro Sekunde bedeuten einen höheren Ton, längeres Wackeln einen längeren Morse-Strich.

## Stufe 4B: MAX98357A als Lautsprecher-Alternative

Diese Stufe ist **statt** des Piezos für lauteren Klang. Vor dem Testen die andere Firmware flashen:

```sh
esphome run firmware/dottos-dash-max98357a.yaml
```

| MAX98357A-Beschriftung | ESP32-Pin |
| --- | --- |
| `BCLK` | GPIO26 |
| `LRC` / `WS` | GPIO25 |
| `DIN` | GPIO22 |
| `GND` | GND |
| `VIN` | ESP32 `VIN` / `5V` |
| `SPK+`, `SPK-` | Nur die beiden Lautsprecherkabel |

Der Lautsprecher wird nur am Verstärker angeschlossen, **nie** direkt an einem ESP32-GPIO. `BCLK`, `LRC` und `DIN` sind digitale Ton-Nachrichten, keine Lautsprecherkabel. Diese Drei-Kabel-Tonsprache heißt **I2S**. Der MAX98357A macht daraus das stärkere elektrische Signal für den Lautsprecher.

Bei einem kleinen Lautsprecher am USB-Strom des ESP32 nur mäßige Lautstärke nutzen. Setzt sich der ESP32 beim Ton zurück, USB abziehen und Stromversorgung und Verkabelung mit der erwachsenen Person prüfen.

## Wie ein Maker Fehler suchen

| Beobachtung | Immer nur eine Sache prüfen |
| --- | --- |
| RGB-Licht bleibt dunkel | Liegt der gemeinsame LED-Pin wirklich an ESP32 `GND`? Liegen `R`, `G`, `B` an 16, 17, 18? |
| RGB-Farben sind falsch | `R`/`G`/`B`-Beschriftung prüfen, nicht den Farben der Jumper vertrauen. |
| Taster scheint immer gedrückt | Bei einem Vierbein-Taster ein Kabel auf die andere Seite des Mittelspalts stecken. |
| Taster macht nichts | Prüfen, ob er GPIO13 mit GND verbindet, nicht GPIO13 mit 3V3. |
| Drehgeber dreht falsch herum | GPIO21 und GPIO19 bei abgezogenem USB tauschen. |
| Piezo bleibt still | Prüfen: passiv, GPIO27/GND, bei Bedarf Piezo-Firmware erneut flashen. |
| MAX98357A bleibt still | Prüfen, ob die MAX-Firmware geflasht ist und der Lautsprecher an `SPK+`/`SPK-` hängt. |
| Board setzt sich zurück oder wird warm | Sofort abziehen. Vor erneutem Anschließen Kurzschluss oder 5 V an GPIO suchen. |

## Eigene Experimente

1. `E` (`.`), `T` (`-`) und dann `SOS` (`... --- ...`) senden.
2. Vor dem Drücken die Lichtfarbe vorhersagen und dann die Vermutung testen.
3. Die Richtung des Drehgebers erst auf Papier umdrehen: Welche zwei Kabel müssten getauscht werden?
4. Mit einer erwachsenen Person [die gemeinsame Firmware](firmware/dottos-dash-common.yaml) öffnen. `GPIO13` suchen und dann die Pause von 1200 ms. Diese Einstellungen machen aus einem einfachen Taster eine Morse-Taste.

Jeder gelungene Test ist ein kleines Forschungsexperiment: Vermutung aufstellen, nur eine Sache ändern, Ergebnis beobachten und aufschreiben.
