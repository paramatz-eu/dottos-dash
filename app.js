const ESP_EMBEDDED = !document.getElementById('tree-panel');

function renderEmbeddedEspGame() {
  document.documentElement.lang = 'de';
  document.title = 'Dotto’s Dash';
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.append(viewport);
  }
  // ESPHome's default page disables pinch zoom. The Morse tree needs it on a
  // phone, so deliberately allow normal browser zoom here.
  viewport.content = 'width=device-width, initial-scale=1';
  document.body.dataset.espHosted = 'true';
  document.body.innerHTML = `
    <main class="page">
      <header class="hero">
        <p class="eyebrow">Ein Punkt-und-Strich-Abenteuer</p>
        <h1>Dotto’s Dash</h1>
        <div class="dotto-track" aria-hidden="true"><span class="dotto-dot">••</span><span class="dotto-dash"></span><span class="dotto-finish">★</span></div>
        <p class="hero-copy">Reise mit Dotto durch die wahre Geschichte des Morsecodes. In jedem Kapitel löst du dasselbe Problem wie die Erfinder.</p>
        <p class="offline-badge">Direkt vom ESP32 · offline · kein Konto</p>
        <p id="hardware-status" class="keyboard-help" aria-live="polite">Verbinde Dottos Controller …</p>
      </header>

      <section class="story-journey" aria-labelledby="journey-title">
        <div class="story-intro"><p class="eyebrow">Eine wahre Erfinder-Geschichte</p><h2 id="journey-title">Warum wurde der Morsecode erfunden?</h2><p>Lerne die Menschen und ihr Problem kennen. Dann probierst du ihre nächste Idee selbst aus.</p></div>
        <ol class="story-map" aria-label="Kapitel der Geschichte">
          <li><button class="story-step active" type="button" data-story-chapter="0" aria-current="step"><span>1</span><strong>Das Problem</strong><small>Vor dem Telegrafen</small></button></li>
          <li><button class="story-step" type="button" data-story-chapter="1"><span>2</span><strong>Das Team</strong><small>1830er-Jahre</small></button></li>
          <li><button class="story-step" type="button" data-story-chapter="2"><span>3</span><strong>Die Taste</strong><small>Ab 1837</small></button></li>
          <li><button class="story-step" type="button" data-story-chapter="3"><span>4</span><strong>Die erste Leitung</strong><small>1843–1844</small></button></li>
          <li><button class="story-step" type="button" data-story-chapter="4"><span>5</span><strong>Ein Weltcode</strong><small>1865–1906</small></button></li>
        </ol>
        <article class="story-card" aria-live="polite">
          <div class="story-copy"><p id="story-period" class="story-period">Vor elektrischen Telegrafen · Das Problem</p><h3 id="story-title">Eine Nachricht war nicht schneller als ein Pferd</h3><p id="story-text">Stell dir vor, du müsstest einer Person in der nächsten Stadt sagen: Ein Schiff ist angekommen, jemand aus der Familie ist sicher oder das Wetter ändert sich. Briefe reisten mit Reitern und Schiffen; die Nachricht konnte Tage oder Wochen unterwegs sein. Signalflaggen und Türme waren schneller, aber jede Station musste die nächste sehen können. Erfinder suchten nach einer Nachricht, die weiter reiste als unsere Augen sehen.</p><div class="story-detail"><strong id="story-detail-title">Wie ein Draht eine Nachricht tragen kann</strong><p id="story-detail">Eine Batterie liefert Strom, eine Taste öffnet und schließt den Stromkreis, und ein Empfänger am anderen Ende bemerkt jede Änderung. Aus den zwei Zuständen – an und aus – kann ein Muster entstehen. Der clevere Teil ist die gemeinsame Bedeutung dieses Musters.</p></div><div class="story-people"><span aria-hidden="true">💭</span><p><strong id="story-people-title">Die große Frage</strong><span id="story-people-text">Kann Elektrizität eine Idee weiter tragen, als unsere Augen sehen können?</span></p></div></div>
          <aside class="story-mission"><p class="eyebrow">Deine Kapitel-Aufgabe</p><h3 id="story-mission-title">Baue ein winziges Alphabet</h3><p id="story-mission-text">Beginne mit nur zwei Signalen. Ein Punkt geht nach links, ein Strich nach rechts. Führe Dotto zum nächsten Buchstaben.</p><p class="story-lesson-link">Probiere es gleich darunter aus ↓</p></aside>
        </article>
        <nav class="story-controls" aria-label="Zwischen den Kapiteln wechseln"><button id="story-back" class="secondary-button" type="button">← Früheres Kapitel</button><strong id="story-position">Kapitel 1 von 5</strong><button id="story-next" class="primary-button" type="button">Nächstes Kapitel →</button></nav>
        <details class="activity-picker"><summary>Direkt zu einer Aufgabe springen</summary><div class="mode-options" aria-label="Aufgaben">
          <button class="mode-button active" type="button" data-mode="tree" data-story-target="0" aria-pressed="true"><span aria-hidden="true">🌿</span><strong>Code-Wege</strong><small>Punkten und Strichen folgen</small></button>
          <button class="mode-button" type="button" data-mode="free" data-story-target="2" aria-pressed="false"><span aria-hidden="true">🔑</span><strong>Taste ausprobieren</strong><small>Senden und entschlüsseln</small></button>
          <button class="mode-button" type="button" data-mode="receive" data-story-target="3" aria-pressed="false"><span aria-hidden="true">👂</span><strong>Klicks hören</strong><small>Hören und auswählen</small></button>
          <button class="mode-button" type="button" data-mode="create" data-story-target="4" aria-pressed="false"><span aria-hidden="true">✎</span><strong>Nachricht senden</strong><small>Sehen, hören, senden</small></button>
        </div></details>
        <details class="play-settings"><summary>Ton-Einstellungen</summary><label class="sound-toggle"><input id="sound-toggle" type="checkbox" checked> Browser-Töne</label></details>
      </section>

      <section id="free-panel" class="game-panel hidden">
        <div class="mission-card write-card"><p class="prompt">Dottos Tasten-Checkpoint</p><h2>Was sagt Dottos Taste?</h2><p>Sende frei Morse. Nach jeder Pause liest Dottos Decoder den nächsten Buchstaben.</p><p class="prompt">Der Decoder liest:</p><output id="free-message" class="free-message" aria-live="polite">—</output><p id="free-key-status" class="keyboard-help" aria-live="polite">Bereit für deinen ersten Buchstaben.</p></div>
        <div class="input-card free-key-card"><button id="free-key-button" class="morse-key-button" type="button"><span aria-hidden="true">●</span><strong>Morse-Taste halten</strong><small>Kurz = Punkt · lang = Strich</small></button><button id="free-clear-button" class="secondary-button" type="button">Neu beginnen</button><p class="keyboard-help">Leertaste am Computer halten, diese Taste auf dem Touchscreen drücken oder den echten Taster benutzen.</p><details class="free-key-help"><summary>Hilfe &amp; Timing einstellen</summary><div class="free-key-help-content"><p><strong>So sendest du:</strong> Kurz drücken ist ein Punkt. Ab der Strich-Grenze wird dein Druck ein Strich. Warte die Buchstabenpause zwischen Buchstaben und die Wortpause zwischen Wörtern.</p><div class="timing-controls"><label class="pause-control" for="dash-threshold"><span>Strich ab: <output id="dash-threshold-value">300 ms</output></span><input id="dash-threshold" type="range" min="150" max="1000" step="50" value="300"><small>Kürzere Drucke sind Punkte. Stell das höher, wenn aus deinen Punkten Striche werden.</small></label><label class="pause-control" for="letter-pause"><span>Buchstabenpause: <output id="letter-pause-value">600 ms</output></span><input id="letter-pause" type="range" min="500" max="2000" step="100" value="600"><small>Danach liest der Decoder einen Buchstaben. Sie bleibt immer länger als ein Strich.</small></label><label class="pause-control" for="word-pause"><span>Wortpause: <output id="word-pause-value">1400 ms</output></span><input id="word-pause" type="range" min="1200" max="5000" step="100" value="1400"><small>Danach setzt der Decoder ein Leerzeichen. Sie bleibt immer länger als die Buchstabenpause.</small></label></div></div></details></div>
      </section>

      <section id="create-panel" class="game-panel hidden">
        <div class="mission-card write-card"><p class="prompt">Dottos Nachrichten-Werkstatt</p><h2>Schreibe sie. Hör sie. Sende sie.</h2><label class="write-label" for="message-input">Buchstaben, Zahlen und Leerzeichen</label><input id="message-input" class="custom-message" type="text" maxlength="24" autocomplete="off" autocapitalize="characters" placeholder="LOS DOTTO"><p class="prompt">So klingt der Morsecode:</p><output id="translation-output" class="morse-input translation-output" aria-live="polite">—</output><div class="action-controls create-actions"><button id="play-translation-button" class="secondary-button" type="button">▶ Anhören</button><button id="start-writing-button" class="primary-button" type="button">Selbst senden</button></div><p class="keyboard-help"><strong>/</strong> bedeutet Wortpause. Klicke auf „Selbst senden“, wenn du bereit für die Aufgabe bist.</p><div class="create-task" hidden><p id="write-message" class="target-word" aria-live="polite">—</p><p id="write-position" class="mission-count">Schreibe zuerst eine Nachricht.</p><p class="prompt">Nächster Buchstabe:</p><div id="write-target-letter" class="target-letter" aria-live="polite">—</div></div></div>
        <div class="input-card create-challenge" hidden><p class="prompt">Dein Morse-Code</p><output id="write-morse-input" class="morse-input" aria-live="polite">—</output><div class="input-controls"><button id="write-dot-button" class="signal-button dot" type="button">← Punkt <span>·</span></button><button id="write-dash-button" class="signal-button dash" type="button">Strich → <span>—</span></button></div><div class="action-controls"><button id="write-check-button" class="primary-button" type="button">Jetzt prüfen</button><button id="write-clear-button" class="secondary-button" type="button">Löschen</button></div><p class="keyboard-help">Mit der Taste, Leertaste, ← oder → sendest du jeden Buchstaben.</p></div>
      </section>

      <section id="tree-panel" class="game-panel">
        <div class="tree-intro"><div><p id="tree-mission" class="mission-count"></p><h2>Führe Dotto zu <span id="tree-word" class="tree-word">E</span></h2><p>Finde den nächsten Buchstaben: <strong id="tree-target">E</strong>. Gehe mit einem Punkt nach links oder mit einem Strich nach rechts. Danach den Buchstaben wählen.</p></div><div id="tree-status" class="tree-status" aria-live="polite"></div></div>
        <div class="tree-controls" aria-label="Steuerung für den Morsebaum"><button id="tree-dot-button" class="signal-button dot" type="button">← Punkt</button><button id="tree-dash-button" class="signal-button dash" type="button">Strich →</button><button id="tree-confirm-button" class="primary-button tree-confirm-button" type="button">Buchstaben wählen ↵</button><button id="tree-reset-button" class="secondary-button" type="button">Neu beginnen</button></div><p class="tree-mobile-tip">Die ganze Karte passt unten ins Bild. Zoome hinein, um einen Ast anzusehen.</p><div id="morse-tree" class="tree-wrap" tabindex="0"></div>
      </section>

      <section id="receive-panel" class="receive-panel hidden"><div class="listen-card"><p id="receive-mission" class="mission-count"></p><h2>Was hat Dotto gehört?</h2><p>Starte das Signal, höre genau zu und wähle Dottos Nachricht.</p><div class="listen-controls"><button id="play-button" class="primary-button" type="button">▶ Morsecode abspielen</button><button id="replay-button" class="secondary-button" type="button">Noch einmal</button></div></div><div class="answer-card"><p class="prompt">Was bedeutet der Code?</p><div id="answer-options" class="answer-options" aria-live="polite"></div></div></section>

      <p id="feedback" class="feedback" role="status" aria-live="polite"></p>
      <section class="progress-card"><div><span class="stat-label">Dash-Punkte</span><strong id="stars">0</strong></div><div><span class="stat-label">Nächster Checkpoint</span><strong id="next-letter">T</strong></div><button id="restart-button" class="secondary-button" type="button">Dash neu starten</button></section>
      <details class="cheat-sheet"><summary>Spickzettel: Morse-Alphabet</summary><div id="alphabet" class="alphabet-grid"></div></details>
      <details class="binary-lesson"><summary>Wie Computer denken: zwei Signale genügen</summary><div class="binary-content">
        <p>Dottos ganzes Alphabet besteht aus zwei Signalen. Das ist kein Trick, damit das Spiel leichter wird – es ist genau die Idee, mit der jeder Computer der Welt arbeitet.</p>
        <p>Eine Maschine kann schlecht genau messen, aber sehr gut zwei deutlich verschiedene Zustände unterscheiden. Darum benutzt die Technik genau zwei und nennt sie <strong>1</strong> und <strong>0</strong>. Eine solche Entscheidung heißt <strong>Bit</strong>, kurz für <em>binary digit</em>, also Binärziffer.</p>
        <table class="wire-table binary-table"><thead><tr><th>Wo die zwei Zustände stecken</th><th>1</th><th>0</th></tr></thead><tbody><tr><td>Deine Morsetaste</td><td>gedrückt</td><td>losgelassen</td></tr><tr><td>Ein Telegrafendraht von 1844</td><td>Strom fließt</td><td>kein Strom</td></tr><tr><td>Ein Pin am ESP32</td><td>3,3 V (HIGH)</td><td>0 V (LOW)</td></tr><tr><td>Speicher im Handy oder Laptop</td><td>geladen</td><td>leer</td></tr></tbody></table>
        <p>Ein Bit kann nur zwei Dinge sagen: ja oder nein, Punkt oder Strich, <strong>E</strong> oder <strong>T</strong>. Aber jedes weitere Bit <strong>verdoppelt</strong>, wie viel du sagen kannst – und das wird schnell riesig:</p>
        <ul class="binary-doubling"><li><strong>1 Bit</strong> → 2 Nachrichten <small>E und T, die erste Reihe im Baum</small></li><li><strong>2 Bits</strong> → 4 <small>I, A, N, M</small></li><li><strong>3 Bits</strong> → 8 <small>S, U, R, W, D, K, G, O</small></li><li><strong>8 Bits</strong> → 256 <small>genug für alle Buchstaben, Ziffern und Satzzeichen</small></li></ul>
        <p>Genau diese Verdopplung läufst du im Morsebaum ab: Jeder Punkt und jeder Strich halbiert die Buchstaben, die noch möglich sind.</p>
        <div class="binary-lab"><p class="prompt">Baue ein Byte</p><p>Acht Bits nebeneinander heißen <strong>Byte</strong>. Jede Stelle ist doppelt so viel wert wie die rechts daneben. Schalte ein paar Bits an, zähle ihre Werte zusammen und sieh, welches Zeichen zu dieser Zahl gehört.</p><div id="binary-bits" class="binary-bits" role="group" aria-label="Acht Bits, von 128 bis 1"></div><output id="binary-readout" class="binary-readout" aria-live="polite"></output><div class="action-controls"><button id="binary-letter-button" class="secondary-button" type="button">Zeig mir einen Buchstaben</button><button id="binary-clear-button" class="secondary-button" type="button">Alles auf null</button></div><p class="keyboard-help">Computer haben sich auf eine gemeinsame Liste geeinigt, welche Zahl welches Zeichen bedeutet. Sie heißt ASCII: <strong>A</strong> ist 65, <strong>B</strong> ist 66 und ein Leerzeichen ist 32.</p></div>
        <p><strong>Ist Morsecode also Binärcode?</strong> Fast – und der Unterschied lohnt sich. Ein Byte hat immer genau acht Bits, deshalb weiß ein Computer, wo ein Zeichen endet und das nächste beginnt. Morsezeichen sind unterschiedlich lang: <strong>E</strong> hat ein Signal, <strong>Z</strong> hat vier. Darum braucht Morse zusätzlich die Stille dazwischen, die zeigt, wo ein Buchstabe aufhört. Morse benutzt also drei Dinge: Punkt, Strich und Pause.</p>
        <p><strong>In Dottos Controller</strong> ist wirklich alles Bits. Der Taster-Pin liest 1, solange die Taste offen ist, und 0, während du sie hältst. Jede Farbe entsteht aus tausenden schnellen Einsen und Nullen pro Sekunde. Der Ton geht als Binärzahlen zum Lautsprecher-Verstärker. Auch diese Seite kam als Bits zu dir: Der ESP32 speichert das ganze Spiel als etwa eine Million davon.</p>
      </div></details>
      <section class="make-it-card"><h2>Baue Dottos Controller</h2><p>Die Taste und der Drehgeber senden direkt in dieses Spiel. Ein kurzer Tastendruck ist ein Punkt, ein langer ein Strich. Mit einem Piezo oder MAX98357A hörst du jeden Checkpoint.</p><p><strong>Tipp:</strong> Verbinde zuerst das WLAN <em>Dotto's Dash</em>, dann öffne diese Seite. Internet brauchst du nie.</p><details class="build-guide"><summary>📘 Bauanleitung öffnen</summary><div class="build-guide-content"><p>Diese Kurz-Bauanleitung ist direkt auf dem ESP32 gespeichert und funktioniert deshalb auch ohne Internet.</p><div class="safety-note"><strong>Sicherheit:</strong> Vor jeder Änderung der Kabel USB abziehen. Einen GPIO-Pin nie mit 5 V verbinden.</div><h3>1. Firmware</h3><p>Zuerst die Firmware flashen: <code>esphome run firmware/dottos-dash.yaml</code>. Ein einziges Image deckt Piezo und MAX98357A ab. Die eingebaute <strong>BOOT</strong>-Taste ist danach bereits eine Morse-Taste: kurz = Punkt, lang = Strich. BOOT beim Neustart oder Flashen nicht gedrückt halten.</p><h3>2. RGB-Licht und externer Taster</h3><table class="wire-table"><thead><tr><th>Bauteil</th><th>ESP32</th></tr></thead><tbody><tr><td>RGB-Modul R / G / B</td><td>GPIO16 / GPIO17 / GPIO18</td></tr><tr><td>RGB gemeinsamer Kathoden-Pin</td><td>GND</td></tr><tr><td>Taster, eine Seite</td><td>GPIO13</td></tr><tr><td>Taster, andere Seite</td><td>GND</td></tr></tbody></table><p>Die BOOT-Taste braucht keine Kabel. Der externe Taster bleibt zusätzlich nutzbar.</p><h3>3. Ton</h3><table class="wire-table"><thead><tr><th>Passiver Piezo</th><th>ESP32</th></tr></thead><tbody><tr><td>+</td><td>GPIO27</td></tr><tr><td>-</td><td>GND</td></tr></tbody></table><p>Nur ein <strong>passiver</strong> Piezo erzeugt die Morse-Töne am ESP32. Für Browser-Töne zuerst einmal auf dem Handy in diese Seite tippen; das ist eine Sicherheitsregel des Browsers.</p><h3>4. Drehgeber (optional)</h3><table class="wire-table"><thead><tr><th>Drehgeber</th><th>ESP32</th></tr></thead><tbody><tr><td>CLK / A</td><td>GPIO21</td></tr><tr><td>DT / B</td><td>GPIO19</td></tr><tr><td>SW</td><td>GPIO13</td></tr><tr><td>GND</td><td>GND</td></tr><tr><td>VCC</td><td>3V3</td></tr></tbody></table><p>Links drehen = Punkt, rechts drehen = Strich. Ist es vertauscht, USB abziehen und nur CLK und DT tauschen.</p><h3>Test</h3><p>Ein kurzer Druck muss cyan blinken und einen Punkt senden; ein langer Druck orange und einen Strich. Die einstellbare Buchstabenpause oben beginnt bei 500 ms. Piezo stumm? Prüfen: passiv, an GPIO27 und GND.</p></div></details></section>
      <details class="family-guide"><summary>Für Erwachsene: Familienleitfaden</summary><div class="family-guide-content"><p>Beginnt mit dem Spiel und ergänzt den Controller Stück für Stück. Eine funktionierende BOOT-Taste ist bereits ein vollständiges Projekt.</p><h3>Vor dem Einschalten</h3><ul><li>Eine erwachsene Person sollte die Platine flashen und die Verkabelung prüfen.</li><li>Vor jeder Änderung der Kabel USB abziehen und niemals 5 V mit einem ESP32-GPIO-Pin verbinden.</li><li>Wird die Platine heiß, riecht ungewöhnlich, startet ständig neu oder trennt die Verbindung: USB abziehen.</li></ul><h3>Eine entspannte erste Runde</h3><ol><li>Das Spiel zunächst ohne Hardware erkunden.</li><li><strong>E</strong> (Punkt), <strong>T</strong> (Strich) und dann <strong>SOS</strong> ausprobieren.</li><li>Nach der Erwachsenen-Prüfung die eingebaute BOOT-Taste des ESP32 testen.</li><li>Licht, Ton, Taste oder Drehgeber erst für das nächste Experiment ergänzen.</li></ol><h3>Privatsphäre und WLAN</h3><p>Das Spiel hat kein Konto, keine Analyse, keinen Cloud-Dienst und keinen Chat. Das lokale WLAN heißt <strong>Dotto’s Dash</strong>; das Passwort lautet <strong>dottodash</strong>. Internet wird nicht benötigt. Die optionale Heim-WLAN-Einrichtung ist eine Aufgabe für Erwachsene und gehört nur in ein vertrauenswürdiges Netzwerk.</p></div></details>
      <details class="wifi-card"><summary>Für Erwachsene: Mit Heim-WLAN verbinden</summary><div class="wifi-content"><p>Optional: Der ESP32 kann sich mit eurem 2,4-GHz-Heim-WLAN verbinden. Danach das Handy ebenfalls mit diesem WLAN verbinden und <strong>http://dottos-dash.local</strong> öffnen. Falls das nicht klappt, die IP-Adresse in der Geräteliste des Routers nachsehen.</p><p>Das Passwort wird nur an diesen ESP32 über das passwortgeschützte Dotto's-Dash-WLAN gesendet und nicht im Projekt gespeichert. Bei einem offenen WLAN das Passwortfeld leer lassen.</p><form id="wifi-setup-form" class="wifi-setup-form"><label class="write-label" for="wifi-ssid">WLAN-Name</label><input id="wifi-ssid" class="custom-message" type="text" maxlength="32" autocomplete="off" placeholder="Mein WLAN" required><label class="write-label" for="wifi-password">WLAN-Passwort</label><input id="wifi-password" class="custom-message" type="password" maxlength="63" autocomplete="current-password"><button id="wifi-connect-button" class="primary-button" type="submit">WLAN speichern &amp; verbinden</button></form><p id="wifi-setup-status" class="keyboard-help" aria-live="polite">Dottos Controller bleibt auch ohne Heim-WLAN nutzbar.</p></div></details>
      <details class="ota-card"><summary>Für Erwachsene: Firmware aktualisieren</summary><div class="ota-content"><p>Nur eine normale OTA-Firmware-Datei mit <code>.bin</code> auswählen – niemals eine <code>factory.bin</code>. Während des Hochladens den ESP32 eingeschaltet lassen. Danach startet er selbst neu.</p><p>Vorher am Handy die <strong>mobilen Daten ausschalten</strong>: Android wechselt sonst mitten in der Übertragung ins Mobilfunknetz, weil dieses WLAN kein Internet hat, und der Upload bricht ab.</p><form id="ota-update-form" action="/update" method="post" enctype="multipart/form-data"><label class="write-label" for="ota-firmware">Neue Firmware-Datei</label><input id="ota-firmware" class="ota-file-input" name="update" type="file" accept=".bin,application/octet-stream" required><button id="ota-install-button" class="primary-button" type="submit">Firmware installieren</button><progress id="ota-progress" class="ota-progress" max="100" value="0" hidden aria-describedby="ota-status"></progress><p id="ota-status" class="ota-status" role="status" aria-live="polite">Wähle eine OTA-Datei aus, um den Namen und den Fortschritt zu sehen.</p></form></div></details>
    </main><footer>Dotto läuft mit Neugier, Punkten und Strichen. ● —</footer>`;
}

if (ESP_EMBEDDED) renderEmbeddedEspGame();

const MORSE = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y', '--..': 'Z',
  '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9',
};
const LETTERS = Object.fromEntries(Object.entries(MORSE).map(([code, letter]) => [letter, code]));
const LEVELS = [
  { message: 'E', choices: ['E', 'T', 'I', 'A'] },
  { message: 'T', choices: ['T', 'E', 'N', 'M'] },
  { message: 'I', choices: ['I', 'A', 'S', 'U'] },
  { message: 'A', choices: ['A', 'N', 'R', 'W'] },
  { message: 'N', choices: ['N', 'A', 'D', 'K'] },
  { message: 'M', choices: ['M', 'O', 'G', 'Q'] },
  { message: 'S', choices: ['S', 'O', 'H', 'V'] },
  { message: 'O', choices: ['O', 'S', '0', '9'] },
  { message: 'SOS', choices: ['SOS', 'DOTTO', 'HI', 'GO'] },
  { message: 'DOTTO', choices: ['DOTTO', 'SOS', 'MORSE', 'CODE'] },
  { message: 'HI', choices: ['HI', 'GO', 'NO', 'YES'] },
  { message: 'GO', choices: ['GO', 'HI', 'NO', 'YES'] },
  { message: 'CODE', choices: ['CODE', 'MORSE', 'DOTTO', 'SOS'] },
  { message: 'MORSE', choices: ['MORSE', 'CODE', 'DOTTO', 'SOS'] },
];
const language = document.documentElement.lang.toLowerCase().startsWith('de') ? 'de' : 'en';
const espHosted = document.body.dataset.espHosted === 'true';
// All Morse timing grows out of one unit: a dash is three units, so the dot/dash
// decision sits at two, a letter gap is three and a word gap is seven. Children
// key much slower and far less evenly than that ideal, so the defaults here are
// deliberately generous — the dash threshold starts at 300 ms because a
// ten-year-old's "short" tap often runs past 250 ms and would read as a dash.
//
// The two gaps are floored *relative to* the dash threshold rather than being
// independent knobs. Without that, raising the threshold to 1000 ms while the
// letter gap sat at 300 ms committed the letter long before the next dash could
// begin, which made the decoder look broken.
const DEFAULT_DASH_THRESHOLD_MS = 300;
const MIN_DASH_THRESHOLD_MS = 150;
const MAX_DASH_THRESHOLD_MS = 1000;
const DEFAULT_CHARACTER_PAUSE_MS = 600;
const MIN_CHARACTER_PAUSE_MS = 300;
const MAX_CHARACTER_PAUSE_MS = 2000;
const DEFAULT_WORD_PAUSE_MS = 1400;
const MIN_WORD_PAUSE_MS = 700;
const MAX_WORD_PAUSE_MS = 5000;
// A letter gap must outlast the longest press that is still one signal, and a
// word gap must outlast the pause that already ended a letter.
const CHARACTER_PAUSE_PER_THRESHOLD = 1.5;
const WORD_PAUSE_PER_CHARACTER_PAUSE = 2;
const TREE_IDLE_RESET_MS = 6000;
const TEXT = {
  en: {
    treeMission: (number, total, message, position) => `Route ${number} of ${total} · ${message} · letter ${position} of ${message.length}`,
    receiveMission: (number, total) => `Listening checkpoint ${number} of ${total}`,
    tooLong: 'Morse letters use at most five signals. Pause or clear first.',
    makeSignal: 'Make a dot or dash first.',
    unfinished: 'That code is not a letter yet. Try again!',
    bottom: 'You are at the bottom of the tree. Pause or reset.',
    emptyBranch: 'This branch has no letter. Try another path.',
    foundWrong: (letter, targetLetter) => `You found ${letter}. Find ${targetLetter} next.`,
    letterCorrect: (letter, nextLetter) => `${letter} is right! Dotto’s next stop is ${nextLetter}.`,
    levelComplete: (message) => `Checkpoint reached! Dotto made it to ${message}.`,
    heardCorrect: (message) => `Checkpoint reached! Dotto heard ${message}.`,
    heardWrong: (answer) => `${answer} is not the message. Listen again and try another choice.`,
    treeMode: 'Guide Dotto along the route: dot goes left, dash goes right.',
    chooseTreeFirst: 'Walk to a letter in the tree first.',
    treeTimedOut: 'No movement for a moment, so the tree returned to Start.',
    freeMode: 'Use the Morse key freely. Pause after a letter and it will be decoded.',
    freeDecoded: (letter) => `${letter} decoded! Keep going or pause after the next letter.`,
    freeUnknown: 'That is not a Morse letter yet. Try another code!',
    freeKeyReady: 'Hold the key to send your first letter.',
    freeKeyListening: 'Listening… pause when your letter is finished.',
    freeKeyNext: 'Ready for the next letter.',
    createMode: 'Build a message for Dotto. See it, hear it, then send it yourself.',
    translateNoMessage: 'Type a message first.',
    receiveMode: 'Press Play Morse, listen carefully, then choose the message.',
    writeStart: 'Type a message, then choose Send it yourself.',
    writeMission: (position, total) => `Your message · letter ${position} of ${total}`,
    writeReady: (message) => `Dotto is ready for ${message}!`,
    writeNoMessage: 'Type a message first.',
    messageChanged: 'Your message changed. Choose Send it yourself when you are ready.',
    writeCorrect: (letter, nextLetter) => `${letter} is right! Now send ${nextLetter}.`,
    writeComplete: (message) => `Checkpoint reached! You sent ${message}.`,
    writeWrong: (letter, targetLetter) => `That is ${letter}. Your next letter is ${targetLetter}.`,
    cleared: 'Cleared. Try again!',
    reset: 'Back to Start.',
    fresh: 'Dotto is back at the start line. The first route leads to E.',
    welcome: 'Dotto is at the start line. Reach E with one dot.',
    listening: 'Listen carefully…',
    start: 'Start', path: 'Dotto’s path', letter: 'Letter', dot: 'Dot', dash: 'Dash',
    treeStageLabel: 'Dotto’s route controls',
    treeAt: 'Dotto is here',
    treeChoose: 'Choose letter',
    treeReset: 'Reset',
    treeDotHint: 'go left',
    treeDashHint: 'go right',
    treeMapHint: 'The complete map fits below. Zoom in to inspect a branch.',
    treeMapTitle: 'Full Morse map',
    treeRouteTitle: 'Build the route',
    treeGoal: 'Goal',
    treeFit: 'Fit',
    treeZoomOut: 'Zoom out',
    treeZoomIn: 'Zoom in',
    treeRouteProgress: (depth) => `Step ${depth} of 5`,
    treeStagePrompt: (letter) => `Find ${letter}. Choose a turn.`,
    ariaTree: 'Morse code tree. Dot branches go left and dash branches go right.',
    binaryBitLabel: (place, on) => `Bit worth ${place}, currently ${on ? 1 : 0}`,
    binaryLetter: (value, letter, code) => `= ${value} = the letter ${letter}, which is ${code} in Morse`,
    binaryDigit: (value, digit, code) => `= ${value} = the digit ${digit}, which is ${code} in Morse`,
    binarySmall: (value, letter, capital) => `= ${value} = a small ${letter}. Computers give it a different number from ${capital}.`,
    binarySpace: (value) => `= ${value} = the space between two words`,
    binarySign: (value, sign) => `= ${value} = the sign ${sign}`,
    binaryNothing: (value) => `= ${value} = no character Dotto can show. Try another byte!`,
  },
  de: {
    treeMission: (number, total, message, position) => `Route ${number} von ${total} · ${message} · Buchstabe ${position} von ${message.length}`,
    receiveMission: (number, total) => `Hör-Checkpoint ${number} von ${total}`,
    tooLong: 'Ein Morsezeichen hat höchstens fünf Signale. Mach eine Pause oder lösche es.',
    makeSignal: 'Mach zuerst einen Punkt oder einen Strich.',
    unfinished: 'Dieser Code ist noch kein Buchstabe. Versuch es noch einmal!',
    bottom: 'Du bist am Ende des Baums. Mach kurz Pause oder beginne neu.',
    emptyBranch: 'An diesem Ast gibt es keinen Buchstaben. Versuch einen anderen Weg.',
    foundWrong: (letter, targetLetter) => `Du hast ${letter} gefunden. Finde als Nächstes ${targetLetter}.`,
    letterCorrect: (letter, nextLetter) => `${letter} ist richtig! Dottos nächste Station ist ${nextLetter}.`,
    levelComplete: (message) => `Checkpoint erreicht! Dotto ist bei ${message}.`,
    heardCorrect: (message) => `Checkpoint erreicht! Dotto hat ${message} gehört.`,
    heardWrong: (answer) => `${answer} ist nicht die Nachricht. Hör noch einmal zu und wähle neu.`,
    treeMode: 'Führe Dotto über die Route: Punkt geht nach links, Strich nach rechts.',
    chooseTreeFirst: 'Gehe zuerst zu einem Buchstaben im Baum.',
    treeTimedOut: 'Kurz keine Bewegung – der Baum ist wieder beim Start.',
    freeMode: 'Taste frei, was du möchtest. Nach einer Pause wird dein Buchstabe entschlüsselt.',
    freeDecoded: (letter) => `${letter} entschlüsselt! Taste den nächsten Buchstaben oder mach danach wieder eine Pause.`,
    freeUnknown: 'Das ist noch kein Morse-Buchstabe. Versuch einen anderen Code!',
    freeKeyReady: 'Halte die Taste für deinen ersten Buchstaben.',
    freeKeyListening: 'Der Decoder hört zu … mach Pause, wenn dein Buchstabe fertig ist.',
    freeKeyNext: 'Bereit für den nächsten Buchstaben.',
    createMode: 'Baue eine Nachricht für Dotto. Sieh sie, hör sie und sende sie selbst.',
    translateNoMessage: 'Schreibe zuerst eine Nachricht.',
    receiveMode: 'Starte den Morsecode, höre genau zu und wähle danach die Nachricht.',
    writeStart: 'Schreibe eine Nachricht und wähle dann Selbst senden.',
    writeMission: (position, total) => `Deine Nachricht · Buchstabe ${position} von ${total}`,
    writeReady: (message) => `Dotto ist bereit für ${message}!`,
    writeNoMessage: 'Schreibe zuerst eine Nachricht.',
    messageChanged: 'Deine Nachricht hat sich geändert. Wähle Selbst senden, wenn du bereit bist.',
    writeCorrect: (letter, nextLetter) => `${letter} ist richtig! Sende jetzt ${nextLetter}.`,
    writeComplete: (message) => `Checkpoint erreicht! Du hast ${message} gesendet.`,
    writeWrong: (letter, targetLetter) => `Das ist ${letter}. Dein nächster Buchstabe ist ${targetLetter}.`,
    cleared: 'Gelöscht. Versuch es noch einmal!',
    reset: 'Zurück zum Start.',
    fresh: 'Dotto ist zurück an der Startlinie. Die erste Route führt zu E.',
    welcome: 'Dotto steht an der Startlinie. Erreiche E mit einem Punkt.',
    listening: 'Hör genau zu…',
    start: 'Start', path: 'Dottos Weg', letter: 'Buchstabe', dot: 'Punkt', dash: 'Strich',
    treeStageLabel: 'Steuerung für Dottos Route',
    treeAt: 'Dotto ist hier',
    treeChoose: 'Buchstaben wählen',
    treeReset: 'Neu beginnen',
    treeDotHint: 'nach links',
    treeDashHint: 'nach rechts',
    treeMapHint: 'Die ganze Karte passt unten ins Bild. Zoome hinein, um einen Ast anzusehen.',
    treeMapTitle: 'Vollständiger Morsebaum',
    treeRouteTitle: 'Baue den Weg',
    treeGoal: 'Ziel',
    treeFit: 'Einpassen',
    treeZoomOut: 'Verkleinern',
    treeZoomIn: 'Vergrößern',
    treeRouteProgress: (depth) => `Schritt ${depth} von 5`,
    treeStagePrompt: (letter) => `Finde ${letter}. Wähle eine Richtung.`,
    ariaTree: 'Morsebaum. Punkt-Äste gehen nach links, Strich-Äste nach rechts.',
    binaryBitLabel: (place, on) => `Bit mit dem Wert ${place}, gerade ${on ? 1 : 0}`,
    binaryLetter: (value, letter, code) => `= ${value} = der Buchstabe ${letter}, in Morse ${code}`,
    binaryDigit: (value, digit, code) => `= ${value} = die Ziffer ${digit}, in Morse ${code}`,
    binarySmall: (value, letter, capital) => `= ${value} = ein kleines ${letter}. Computer geben ihm eine andere Zahl als ${capital}.`,
    binarySpace: (value) => `= ${value} = das Leerzeichen zwischen zwei Wörtern`,
    binarySign: (value, sign) => `= ${value} = das Zeichen ${sign}`,
    binaryNothing: (value) => `= ${value} = kein Zeichen, das Dotto zeigen kann. Probiere ein anderes Byte!`,
  },
}[language];

const STORY_CHAPTERS = {
  en: [
    {
      period: 'Before electric telegraphs · The problem',
      title: 'A message could not outrun a horse',
      text: 'Imagine needing to tell someone in another town that a ship had arrived, a family member was safe, or the weather was changing. Letters travelled with riders and ships, so the news could take days or weeks. Signal flags and towers were quicker, but each station had to see the next one. Inventors wanted a message that could travel farther than eyes could see.',
      detailTitle: 'How a wire can carry a message',
      detail: 'A telegraph does not send letters through a wire. A battery supplies electricity; a key opens and closes the circuit; a receiver at the far end notices each change. Those two states—on and off—can make a pattern. The clever part is agreeing what the pattern means.',
      peopleTitle: 'The big question',
      people: 'Could electricity carry an idea farther than eyes could see?',
      missionTitle: 'Make a tiny alphabet',
      mission: 'Start with only two signals. A dot goes left and a dash goes right. Guide Dotto to the next letter.',
      mode: 'tree',
    },
    {
      period: 'The 1830s · The team',
      title: 'A painter gathers a team',
      text: 'Samuel Morse was a painter, not a lone wizard with one perfect idea. He began pursuing an electric telegraph in the 1830s, then found people whose knowledge filled the gaps. Leonard Gale helped with the science, drawing on earlier electromagnet experiments by Joseph Henry. Alfred Vail brought money, tools, a workshop at his family’s iron works, and the skill to make a fragile demonstration into a machine.',
      detailTitle: 'Why the team mattered',
      detail: 'A long wire weakens an electric signal. Henry had shown that an electromagnet could turn a small electrical effect into a strong movement. Gale helped Morse use batteries, wire, and electromagnets more effectively; later telegraph lines used relay stations to pass a fresh signal onward. Big inventions often need connected ideas, not just one inventor.',
      peopleTitle: 'Four different strengths',
      people: 'Morse led the project, Gale understood the science, Henry’s experiments showed what electromagnets could do, and Vail made the machine practical.',
      missionTitle: 'Give every letter a route',
      mission: 'A useful machine needs a simple code. Explore how different dot-and-dash paths can lead to different letters.',
      mode: 'tree',
    },
    {
      period: 'From 1837 · The key and code',
      title: 'Alfred Vail helps make the idea practical',
      text: 'Morse’s early plan used numbers: an operator would send a number, then look it up in a codebook. That was slow. During their collaboration, Morse and Vail developed machinery and a more direct alphabetic code, so a trained operator could send letters themselves. Pressing a key closed the circuit. At the far end, an electromagnet pulled an arm that made marks on a moving paper strip.',
      detailTitle: 'Turn time into code',
      detail: 'A quick press made a short mark; a longer press made a long mark. Gaps separated signals, letters, and words. That is why a Morse key feels like an instrument: its rhythm carries information. Dotto uses International Morse, the later international version with regular dots and dashes; the original American Morse system was a little different.',
      peopleTitle: 'The workshop teammate',
      people: 'Vail saw Morse’s demonstration in 1837 and joined the project. His family’s iron works gave the team a place and tools to build.',
      missionTitle: 'Become the telegraph key',
      mission: 'Hold the key briefly for a dot or longer for a dash. Pause, and Dotto’s decoder turns your signal into a letter.',
      mode: 'free',
    },
    {
      period: '1843–1844 · The first public line',
      title: 'Forty miles, one stubborn wire',
      text: 'In 1843, the United States Congress funded an experimental line between Washington and Baltimore—about forty miles (64 kilometres). The first plan put wire underground in lead pipes, but the insulation failed. Instead, the team strung separate wires on wooden poles, a solution that became a familiar part of the landscape. On 24 May 1844, Morse sent “What hath God wrought?” to Vail in Baltimore. Vail’s reply showed that the message had really crossed the distance.',
      detailTitle: 'From marks to music',
      detail: 'Copper wire has resistance, so very long lines need careful wiring and, later, relay stations. At first operators read marks on paper. They soon noticed that the electromagnet’s arm made recognisable clicks, and skilled operators learned to read the rhythm by ear—often faster than reading the paper. That is the listening skill you are about to try.',
      peopleTitle: 'A message with many helpers',
      people: 'Annie Ellsworth suggested the words. Morse sent them from Washington, and Vail received and returned them from Baltimore.',
      missionTitle: 'Hear what came through the wire',
      mission: 'Operators soon learned to understand the machine’s clicks by ear. Play Dotto’s signal, listen, and choose the message.',
      mode: 'receive',
    },
    {
      period: '1865–1906 · A world code',
      title: 'One code had to work for everyone',
      text: 'Soon wires crossed borders and even reached under oceans. A message is only useful if the next operator can understand it, so countries needed shared rules about equipment, timing, and code. Delegates created the International Telegraph Union in 1865 and agreed on arrangements for international telegraph service. Radio later carried the same dot-and-dash idea without a wire, allowing ships and shore stations to speak across the sea.',
      detailTitle: 'Why SOS is so easy to recognise',
      detail: 'The 1906 International Radiotelegraph Conference chose three dots, three dashes, and three dots as the distress signal, for use from 1908: ···———···. It is one continuous signal—there are no letter gaps—and its rhythm cuts through noise. It was not originally short for “Save Our Souls”; the pattern itself was what mattered.',
      peopleTitle: 'From a team to the world',
      people: 'Engineers, operators, governments, and ship radio crews kept adapting the system so strangers could understand one another.',
      missionTitle: 'Send a message across the world',
      mission: 'Type SOS, hear its rhythm, and send it yourself. Then create a helpful message of your own.',
      mode: 'create',
    },
  ],
  de: [
    {
      period: 'Vor elektrischen Telegrafen · Das Problem',
      title: 'Eine Nachricht war nicht schneller als ein Pferd',
      text: 'Stell dir vor, du müsstest einer Person in der nächsten Stadt sagen: Ein Schiff ist angekommen, jemand aus der Familie ist sicher oder das Wetter ändert sich. Briefe reisten mit Reitern und Schiffen; die Nachricht konnte Tage oder Wochen unterwegs sein. Signalflaggen und Türme waren schneller, aber jede Station musste die nächste sehen können. Erfinder suchten nach einer Nachricht, die weiter reiste als unsere Augen sehen.',
      detailTitle: 'Wie ein Draht eine Nachricht tragen kann',
      detail: 'Ein Telegraf schickt keine Buchstaben durch den Draht. Eine Batterie liefert Strom, eine Taste öffnet und schließt den Stromkreis, und ein Empfänger am anderen Ende bemerkt jede Änderung. Aus den zwei Zuständen – an und aus – kann ein Muster entstehen. Der clevere Teil ist die gemeinsame Bedeutung dieses Musters.',
      peopleTitle: 'Die große Frage',
      people: 'Kann Elektrizität eine Idee weiter tragen, als unsere Augen sehen können?',
      missionTitle: 'Baue ein winziges Alphabet',
      mission: 'Beginne mit nur zwei Signalen. Ein Punkt geht nach links, ein Strich nach rechts. Führe Dotto zum nächsten Buchstaben.',
      mode: 'tree',
    },
    {
      period: 'Die 1830er-Jahre · Das Team',
      title: 'Ein Maler versammelt ein Team',
      text: 'Samuel Morse war Maler, kein einsamer Zauberer mit einer perfekten Idee. In den 1830er-Jahren arbeitete er an einem elektrischen Telegrafen und fand Menschen, deren Wissen die Lücken füllte. Leonard Gale half bei der Wissenschaft und nutzte frühere Elektromagnet-Versuche von Joseph Henry. Alfred Vail brachte Geld, Werkzeuge, eine Werkstatt in der Eisenhütte seiner Familie und das Geschick mit, aus einer empfindlichen Vorführung eine Maschine zu machen.',
      detailTitle: 'Warum das Team wichtig war',
      detail: 'Auf einem langen Draht wird ein elektrisches Signal schwächer. Henry hatte gezeigt, dass ein Elektromagnet aus einem kleinen elektrischen Effekt eine starke Bewegung machen kann. Gale half Morse, Batterien, Draht und Elektromagnete besser einzusetzen; spätere Telegrafenleitungen nutzten Relaisstationen, die ein neues Signal weitergaben. Große Erfindungen brauchen oft verbundene Ideen, nicht nur eine Person.',
      peopleTitle: 'Vier verschiedene Stärken',
      people: 'Morse leitete das Projekt, Gale verstand die Wissenschaft, Henrys Versuche zeigten, was Elektromagnete konnten, und Vail machte die Maschine praktisch.',
      missionTitle: 'Gib jedem Buchstaben einen Weg',
      mission: 'Eine nützliche Maschine braucht einen einfachen Code. Entdecke, wie verschiedene Punkt-Strich-Wege zu verschiedenen Buchstaben führen.',
      mode: 'tree',
    },
    {
      period: 'Ab 1837 · Die Taste und der Code',
      title: 'Alfred Vail macht die Idee praktisch',
      text: 'Morses erster Plan arbeitete mit Zahlen: Ein Telegrafist hätte eine Zahl gesendet und sie dann in einem Codebuch nachgeschlagen. Das war langsam. In ihrer Zusammenarbeit entwickelten Morse und Vail die Maschine und einen direkteren Buchstabencode weiter, sodass geübte Telegrafisten Buchstaben selbst senden konnten. Ein Druck auf die Taste schloss den Stromkreis. Am anderen Ende zog ein Elektromagnet einen Arm an, der Zeichen auf einen laufenden Papierstreifen machte.',
      detailTitle: 'Aus Zeit wird ein Code',
      detail: 'Ein kurzer Druck machte ein kurzes Zeichen, ein längerer ein langes. Pausen trennten Signale, Buchstaben und Wörter. Darum fühlt sich eine Telegrafentaste wie ein Instrument an: Ihr Rhythmus trägt Information. Dotto nutzt den internationalen Morsecode, die spätere Weltversion mit regelmäßigen Punkten und Strichen; der ursprüngliche amerikanische Morsecode war etwas anders.',
      peopleTitle: 'Der Teamkollege in der Werkstatt',
      people: 'Vail sah Morses Vorführung 1837 und stieg in das Projekt ein. Die Eisenhütte seiner Familie gab dem Team Platz und Werkzeuge zum Bauen.',
      missionTitle: 'Werde selbst zur Telegrafentaste',
      mission: 'Halte die Taste kurz für einen Punkt oder länger für einen Strich. Nach einer Pause macht Dottos Decoder daraus einen Buchstaben.',
      mode: 'free',
    },
    {
      period: '1843–1844 · Die erste öffentliche Leitung',
      title: 'Vierzig Meilen und ein störrischer Draht',
      text: '1843 bezahlte der US-Kongress eine Versuchsstrecke zwischen Washington und Baltimore – etwa vierzig Meilen oder 64 Kilometer. Der erste Plan verlegte Draht unter der Erde in Bleirohren, doch die Isolierung versagte. Also spannte das Team einzelne Drähte auf hölzerne Masten; bald prägten solche Leitungen die Landschaft. Am 24. Mai 1844 sendete Morse „What hath God wrought?“ an Vail in Baltimore. Vails Antwort zeigte: Die Nachricht hatte die Strecke wirklich überquert.',
      detailTitle: 'Von Papierzeichen zu Musik',
      detail: 'Kupferdraht hat Widerstand. Für sehr lange Leitungen braucht man deshalb sorgfältige Verbindungen und später Relaisstationen. Zuerst lasen Telegrafisten Zeichen auf Papier. Bald merkten sie, dass der Arm des Elektromagneten erkennbare Klicks machte, und geübte Menschen lasen den Rhythmus mit den Ohren – oft schneller als das Papier. Genau dieses Hören probierst du gleich aus.',
      peopleTitle: 'Eine Nachricht mit vielen Helfern',
      people: 'Annie Ellsworth schlug die Worte vor. Morse sendete sie aus Washington; Vail empfing und beantwortete sie in Baltimore.',
      missionTitle: 'Höre, was durch den Draht kam',
      mission: 'Bald verstanden Telegrafisten die Klicks der Maschine mit den Ohren. Spiele Dottos Signal ab, höre zu und wähle die Nachricht.',
      mode: 'receive',
    },
    {
      period: '1865–1906 · Ein Weltcode',
      title: 'Ein Code musste für alle funktionieren',
      text: 'Bald überquerten Drähte Grenzen und erreichten sogar Meeresböden. Eine Nachricht hilft nur, wenn der nächste Telegrafist sie versteht. Deshalb brauchten Länder gemeinsame Regeln für Geräte, Zeitabstände und Code. Delegierte gründeten 1865 die Internationale Telegraphenunion und vereinbarten Regeln für den internationalen Telegrafendienst. Später trug Funk dieselbe Punkt-Strich-Idee ohne Draht über das Meer, sodass Schiffe und Küstenstationen miteinander sprechen konnten.',
      detailTitle: 'Warum SOS so gut zu erkennen ist',
      detail: 'Die Internationale Funkkonferenz von 1906 wählte drei Punkte, drei Striche und drei Punkte als Notsignal, gültig ab 1908: ···———···. Es ist ein durchgehendes Signal – ohne Buchstabenpausen – und sein Rhythmus fällt auch im Lärm auf. SOS war ursprünglich keine Abkürzung für „Save Our Souls“; wichtig war das Muster selbst.',
      peopleTitle: 'Vom Team hinaus in die Welt',
      people: 'Ingenieure, Telegrafisten, Regierungen und Funker auf Schiffen entwickelten das System weiter, damit Fremde einander verstehen konnten.',
      missionTitle: 'Sende eine Nachricht um die Welt',
      mission: 'Schreibe SOS, höre seinen Rhythmus und sende es selbst. Danach erfindest du deine eigene hilfreiche Nachricht.',
      mode: 'create',
    },
  ],
}[language];

const $ = (id) => document.getElementById(id);
const treePanel = $('tree-panel');
const receivePanel = $('receive-panel');
const createPanel = $('create-panel');
const freePanel = $('free-panel');
const writeInputEl = $('write-morse-input');
const freeMessageEl = $('free-message');
const freeKeyStatusEl = $('free-key-status');
const freeKeyButton = $('free-key-button');
const messageInputEl = $('message-input');
const translationOutputEl = $('translation-output');
const createChallengeEl = document.querySelector('.create-challenge');
const createTaskEl = document.querySelector('.create-task');
const writeMessageEl = $('write-message');
const writePositionEl = $('write-position');
const writeTargetEl = $('write-target-letter');
const feedbackEl = $('feedback');
const starsEl = $('stars');
const nextLetterEl = $('next-letter');
const treeWordEl = $('tree-word');
const treeTargetEl = $('tree-target');
const treeMissionEl = $('tree-mission');
const treeStatusEl = $('tree-status');
const treeEl = $('morse-tree');
treeStatusEl.setAttribute('aria-atomic', 'true');
const treeMobileTipEl = document.querySelector('.tree-mobile-tip');
const treeStageEl = document.createElement('div');
treeStageEl.className = 'tree-stage';
treeStageEl.setAttribute('role', 'group');
treeStageEl.setAttribute('aria-label', TEXT.treeStageLabel);
(treeMobileTipEl || treeEl).before(treeStageEl);
const treeMapToolbarEl = document.createElement('div');
treeMapToolbarEl.className = 'tree-map-toolbar';
treeMapToolbarEl.innerHTML = `
  <div class="tree-map-heading">
    <span class="tree-map-icon" aria-hidden="true">🌿</span>
    <span><strong>${TEXT.treeMapTitle}</strong><small><i class="tree-legend-line dot"></i>${TEXT.dot} ← <i class="tree-legend-line dash"></i>${TEXT.dash} →</small></span>
  </div>
  <div class="tree-map-actions" role="group" aria-label="${TEXT.treeMapTitle}">
    <button class="tree-map-tool" type="button" data-tree-zoom="out" aria-label="${TEXT.treeZoomOut}">−</button>
    <output class="tree-map-zoom" data-tree-zoom-output aria-live="polite">100%</output>
    <button class="tree-map-tool tree-map-fit" type="button" data-tree-zoom="fit">${TEXT.treeFit}</button>
    <button class="tree-map-tool" type="button" data-tree-zoom="in" aria-label="${TEXT.treeZoomIn}">+</button>
  </div>`;
(treeMobileTipEl || treeEl).before(treeMapToolbarEl);
treeEl.removeAttribute('tabindex');
if (treeMobileTipEl) treeMobileTipEl.textContent = TEXT.treeMapHint;
const receiveMissionEl = $('receive-mission');
const answerOptionsEl = $('answer-options');
const soundToggle = $('sound-toggle');
const dashThresholdInput = $('dash-threshold');
const dashThresholdValueEl = $('dash-threshold-value');
const letterPauseInput = $('letter-pause');
const letterPauseValueEl = $('letter-pause-value');
const wordPauseInput = $('word-pause');
const wordPauseValueEl = $('word-pause-value');
const hardwareStatusEl = $('hardware-status');
const wifiSetupForm = $('wifi-setup-form');
const wifiSsidInput = $('wifi-ssid');
const wifiPasswordInput = $('wifi-password');
const wifiSetupStatusEl = $('wifi-setup-status');
const otaUpdateForm = $('ota-update-form');
const otaFileInput = $('ota-firmware');
const otaInstallButton = $('ota-install-button');
const otaProgressEl = $('ota-progress');
const otaStatusEl = $('ota-status');
const storyPeriodEl = $('story-period');
const storyTitleEl = $('story-title');
const storyTextEl = $('story-text');
const storyDetailTitleEl = $('story-detail-title');
const storyDetailEl = $('story-detail');
const storyPeopleTitleEl = $('story-people-title');
const storyPeopleTextEl = $('story-people-text');
const storyMissionTitleEl = $('story-mission-title');
const storyMissionTextEl = $('story-mission-text');
const storyPositionEl = $('story-position');
const storyBackButton = $('story-back');
const storyNextButton = $('story-next');

let mode = 'tree';
let writeInput = '';
let freeInput = '';
let freeMessage = '';
let translatorMessage = '';
let treePath = '';
let treeCentred = false;
let treeLastMovePath = '';
let treeNotice = '';
let treeNoticeKind = 'info';
let treeResizeTimer;
let treeMapZoom = 1;
let writingMessage = '';
let writingIndex = 0;
let levelIndex = Number(localStorage.getItem('dottos-dash-level') || 0);
let letterIndex = 0;
let stars = Number(localStorage.getItem('dottos-dash-stars') || 0);
let audioContext;
let audioPrimed = false;
let liveKeyTone;
let morseKeyDownAt = 0;
let freeKeyDownAt = 0;
let inputPauseTimer;
let wordPauseTimer;
let treePauseTimer;
let hardwareEventSource;
let hardwareEventsReady = false;
let lastHardwareEvent = 0;
let pendingHardwareSignals = 0;
let hardwareKeyIsDown = false;
let dashThresholdMs = normaliseDashThreshold(Number(localStorage.getItem('dottos-dash-dash-threshold') ?? DEFAULT_DASH_THRESHOLD_MS));
let characterPauseMs = normaliseCharacterPause(Number(localStorage.getItem('dottos-dash-letter-pause') ?? DEFAULT_CHARACTER_PAUSE_MS));
let wordPauseMs = normaliseWordPause(Number(localStorage.getItem('dottos-dash-word-pause') ?? DEFAULT_WORD_PAUSE_MS));
let storyChapter = Number(localStorage.getItem('dottos-dash-story-chapter') || 0);

if (!Number.isInteger(levelIndex) || levelIndex < 0 || levelIndex >= LEVELS.length) levelIndex = 0;
if (!Number.isFinite(stars) || stars < 0) stars = 0;
if (!Number.isInteger(storyChapter) || storyChapter < 0 || storyChapter >= STORY_CHAPTERS.length) storyChapter = 0;

function level() { return LEVELS[levelIndex]; }
function currentLetter() { return level().message[letterIndex]; }
function currentWritingLetter() { return writingMessage[writingIndex]; }
function normaliseDashThreshold(value) {
  const numericValue = Number(value);
  const roundedValue = Number.isFinite(numericValue) ? Math.round(numericValue / 50) * 50 : DEFAULT_DASH_THRESHOLD_MS;
  return Math.min(MAX_DASH_THRESHOLD_MS, Math.max(MIN_DASH_THRESHOLD_MS, roundedValue));
}
// Both floors are rounded to the slider's own 100 ms step so the handle can
// always sit exactly on its minimum instead of one unreachable notch below it.
function characterPauseFloor() {
  const derived = Math.ceil(dashThresholdMs * CHARACTER_PAUSE_PER_THRESHOLD / 100) * 100;
  return Math.min(MAX_CHARACTER_PAUSE_MS, Math.max(MIN_CHARACTER_PAUSE_MS, derived));
}
function wordPauseFloor() {
  const derived = Math.ceil(characterPauseMs * WORD_PAUSE_PER_CHARACTER_PAUSE / 100) * 100;
  return Math.min(MAX_WORD_PAUSE_MS, Math.max(MIN_WORD_PAUSE_MS, derived));
}
function normaliseCharacterPause(value) {
  const numericValue = Number(value);
  const roundedValue = Number.isFinite(numericValue) ? Math.round(numericValue / 100) * 100 : DEFAULT_CHARACTER_PAUSE_MS;
  return Math.min(MAX_CHARACTER_PAUSE_MS, Math.max(characterPauseFloor(), roundedValue));
}
function normaliseWordPause(value) {
  const numericValue = Number(value);
  const roundedValue = Number.isFinite(numericValue) ? Math.round(numericValue / 100) * 100 : DEFAULT_WORD_PAUSE_MS;
  return Math.min(MAX_WORD_PAUSE_MS, Math.max(wordPauseFloor(), roundedValue));
}
function setDashThreshold(value) {
  dashThresholdMs = normaliseDashThreshold(value);
  dashThresholdInput.value = String(dashThresholdMs);
  dashThresholdValueEl.textContent = `${dashThresholdMs} ms`;
  localStorage.setItem('dottos-dash-dash-threshold', String(dashThresholdMs));
  setCharacterPause(characterPauseMs);
}
function setCharacterPause(value) {
  characterPauseMs = normaliseCharacterPause(value);
  letterPauseInput.min = String(characterPauseFloor());
  letterPauseInput.value = String(characterPauseMs);
  letterPauseValueEl.textContent = `${characterPauseMs} ms`;
  localStorage.setItem('dottos-dash-letter-pause', String(characterPauseMs));
  setWordPause(wordPauseMs);
}
function setWordPause(value) {
  wordPauseMs = normaliseWordPause(value);
  wordPauseInput.min = String(wordPauseFloor());
  wordPauseInput.value = String(wordPauseMs);
  wordPauseValueEl.textContent = `${wordPauseMs} ms`;
  localStorage.setItem('dottos-dash-word-pause', String(wordPauseMs));
}
function visualCode(code) { return code.replace(/\./g, '·').replace(/-/g, '—'); }
function spacedVisualCode(code) { return visualCode(code).split('').join(' '); }
function normaliseWritingMessage(message) { return message.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 24); }
function skipWritingSpaces() {
  while (writingMessage[writingIndex] === ' ') writingIndex += 1;
}
function saveProgress() {
  localStorage.setItem('dottos-dash-level', String(levelIndex));
  localStorage.setItem('dottos-dash-stars', String(stars));
}
function getAudioContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ||= new AudioContextClass();
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}
// A context that has only just started still reports currentTime 0 for a few
// milliseconds; scheduling a hair ahead keeps that first tone from being missed.
function soonestToneStart(context) { return context.currentTime + .01; }
function playTone(context, startsAt, duration, dash) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = dash ? 540 : 720;
  gain.gain.setValueAtTime(.001, startsAt);
  gain.gain.exponentialRampToValueAtTime(.08, startsAt + .012);
  gain.gain.setValueAtTime(.08, startsAt + Math.max(.02, duration - .018));
  gain.gain.exponentialRampToValueAtTime(.001, startsAt + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration);
}
function beep(dash = false, force = false) {
  if (!force && !soundToggle.checked) return;
  const context = getAudioContext();
  if (!context) return;
  playTone(context, soonestToneStart(context), dash ? .18 : .07, dash);
}
// A browser only lets an AudioContext start from inside a user gesture, and
// resume() is asynchronous — a context can still be 'suspended' when the click
// that created it plays its tone. So keep trying on every gesture until the
// context really is running, rather than giving up after the first one. The
// silent primer gets the audio clock moving so the first real dot is not
// swallowed while the context is still starting up.
const AUDIO_UNLOCK_EVENTS = ['pointerdown', 'touchstart', 'keydown'];
function primeBrowserAudio(context) {
  if (audioPrimed) return;
  audioPrimed = true;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  gain.gain.value = 0;
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + .05);
}
function unlockBrowserAudio() {
  const context = getAudioContext();
  if (!context) return stopBrowserAudioUnlock();
  primeBrowserAudio(context);
  if (context.state === 'running') stopBrowserAudioUnlock();
}
function stopBrowserAudioUnlock() {
  for (const type of AUDIO_UNLOCK_EVENTS) document.removeEventListener(type, unlockBrowserAudio, { capture: true });
}
function startMorseKeyTone() {
  if (!soundToggle.checked || liveKeyTone) return;
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startsAt = soonestToneStart(context);
  oscillator.frequency.value = 680;
  gain.gain.setValueAtTime(.001, startsAt);
  gain.gain.exponentialRampToValueAtTime(.08, startsAt + .012);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startsAt);
  liveKeyTone = { oscillator, gain, context };
  document.body.classList.add('morse-key-down');
}
function stopMorseKeyTone() {
  document.body.classList.remove('morse-key-down');
  if (!liveKeyTone) return;
  const { oscillator, gain, context } = liveKeyTone;
  const stopsAt = context.currentTime + .025;
  gain.gain.cancelScheduledValues(context.currentTime);
  gain.gain.setValueAtTime(Math.max(.001, gain.gain.value), context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, stopsAt);
  oscillator.stop(stopsAt + .01);
  liveKeyTone = undefined;
}
function playMorse(message) {
  const context = getAudioContext();
  if (!context) return;
  let startsAt = context.currentTime + .08;
  for (const character of message) {
    if (character === ' ') {
      startsAt += .55;
      continue;
    }
    for (const signal of LETTERS[character]) {
      const duration = signal === '-' ? .27 : .09;
      playTone(context, startsAt, duration, signal === '-');
      startsAt += duration + .09;
    }
    startsAt += .22;
  }
  feedback(TEXT.listening, 'info');
}
function feedback(message, type = 'info') {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
  if (mode === 'tree') {
    treeNotice = message;
    treeNoticeKind = type;
    updateTreeStatus();
    renderTreeStage();
  }
}
function setHardwareStatus(message) {
  if (hardwareStatusEl) hardwareStatusEl.textContent = message;
}
function setWifiSetupStatus(message) {
  if (wifiSetupStatusEl) wifiSetupStatusEl.textContent = message;
}
function setOtaStatus(message, state = 'info') {
  if (!otaStatusEl) return;
  otaStatusEl.textContent = message;
  otaStatusEl.className = `ota-status ${state}`;
}
function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function otaFileProblem(file) {
  if (!file) return 'Wähle zuerst eine Firmware-Datei aus.';
  const name = file.name.toLowerCase();
  if (!name.endsWith('.bin')) return 'Die Datei muss auf .bin enden.';
  if (name.includes('factory')) return 'Das ist eine Factory-Datei. Bitte die Datei mit „-ota.bin“ auswählen.';
  if (file.size === 0) return 'Die ausgewählte Datei ist leer. Bitte die OTA-Datei erneut herunterladen.';
  return '';
}
// A firmware image the ESP32 dislikes never arrives as an HTTP error: ESPHome
// answers 200 with "Update Failed!" for that, which is handled below. A 4xx
// status comes from the web server underneath ESPHome, before the image is ever
// judged, and in practice means the upload was cut off mid-transfer — usually
// because the phone left the access point for mobile data.
function otaTransferErrorMessage(status) {
  if (status === 400 || status === 408) {
    return `Die Übertragung wurde unterwegs unterbrochen (HTTP ${status}). Die Datei ist damit sehr wahrscheinlich in Ordnung. Schalte die mobilen Daten aus, bleibe im WLAN „Dotto’s Dash“ und versuche es noch einmal.`;
  }
  if (status === 404) {
    return 'Dieser ESP32 nimmt keine Firmware über den Browser an (HTTP 404). Bitte über USB flashen.';
  }
  return `Der ESP32 hat die Übertragung abgelehnt (HTTP ${status}). Versuche es bei stabiler Verbindung noch einmal.`;
}
function setOtaBusy(busy) {
  if (otaFileInput) otaFileInput.disabled = busy;
  if (otaInstallButton) otaInstallButton.disabled = busy;
}
function showOtaFileSelection() {
  const file = otaFileInput?.files?.[0];
  const problem = otaFileProblem(file);
  if (otaProgressEl) otaProgressEl.hidden = true;
  if (problem) return setOtaStatus(problem, file ? 'error' : 'info');
  setOtaStatus(`Bereit: ${file.name} (${formatFileSize(file.size)}). Beim Installieren wird die Datei zum ESP32 übertragen.`, 'ready');
}
function waitForOtaRestart() {
  const startedAt = Date.now();
  const retry = () => {
    window.setTimeout(async () => {
      try {
        const response = await fetch('/', { cache: 'no-store' });
        if (!response.ok) throw new Error('ESP32 did not answer');
        setOtaStatus('Fertig: Der ESP32 antwortet wieder. Die Seite wird mit der neuen Firmware neu geladen …', 'success');
        window.setTimeout(() => window.location.reload(), 1200);
      } catch {
        if (Date.now() - startedAt < 60000) {
          setOtaStatus('Schritt 3 von 3: Der ESP32 startet neu. Warte auf die Verbindung …', 'info');
          retry();
        } else {
          setOtaStatus('Die Datei wurde angenommen, aber der ESP32 antwortet noch nicht. Warte noch etwas und öffne diese Seite erneut. Nicht den Strom trennen.', 'error');
          setOtaBusy(false);
        }
      }
    }, 2000);
  };
  retry();
}
function uploadFirmware(event) {
  event.preventDefault();
  const file = otaFileInput?.files?.[0];
  const problem = otaFileProblem(file);
  if (problem) return setOtaStatus(problem, 'error');

  setOtaBusy(true);
  if (otaProgressEl) {
    otaProgressEl.hidden = false;
    otaProgressEl.value = 0;
  }
  setOtaStatus(`Schritt 1 von 3: ${file.name} wird zum ESP32 übertragen …`, 'info');
  const request = new XMLHttpRequest();
  let uploadFinished = false;
  request.open('POST', otaUpdateForm.action, true);
  request.upload.addEventListener('progress', (progress) => {
    if (!progress.lengthComputable) return;
    const percent = Math.round((progress.loaded / progress.total) * 100);
    if (otaProgressEl) otaProgressEl.value = percent;
    setOtaStatus(`Schritt 1 von 3: Datei wird übertragen: ${percent}% (${formatFileSize(progress.loaded)} von ${formatFileSize(progress.total)}).`, 'info');
    uploadFinished = percent === 100;
  });
  request.addEventListener('load', () => {
    if (request.status < 200 || request.status >= 300) {
      setOtaStatus(otaTransferErrorMessage(request.status), 'error');
      return setOtaBusy(false);
    }
    if (!request.responseText.includes('Update Successful')) {
      setOtaStatus('Der ESP32 konnte diese Firmware nicht installieren. Prüfe, ob es die passende OTA-Datei (nicht Factory) für dieses Modell ist.', 'error');
      return setOtaBusy(false);
    }
    if (otaProgressEl) otaProgressEl.value = 100;
    setOtaStatus('Schritt 2 von 3: Datei angekommen. Der ESP32 prüft und schreibt die Firmware; die Seite darf kurz nicht antworten.', 'info');
    waitForOtaRestart();
  });
  request.addEventListener('error', () => {
    if (uploadFinished) {
      setOtaStatus('Schritt 2 von 3: Die Übertragung ist abgeschlossen. Der ESP32 startet wahrscheinlich schon neu …', 'info');
      return waitForOtaRestart();
    }
    setOtaStatus('Die Datei konnte nicht vollständig zum ESP32 übertragen werden. Schalte die mobilen Daten aus, prüfe, ob du noch mit „Dotto’s Dash“ verbunden bist, und versuche es erneut.', 'error');
    setOtaBusy(false);
  });
  request.addEventListener('abort', () => {
    setOtaStatus('Das Firmware-Update wurde abgebrochen. Die alte Firmware sollte weiterlaufen; versuche es bei stabiler WLAN-Verbindung erneut.', 'error');
    setOtaBusy(false);
  });
  request.send(new FormData(otaUpdateForm));
}
async function configureHomeWifi(event) {
  event.preventDefault();
  const ssid = wifiSsidInput.value.trim();
  const password = wifiPasswordInput.value;
  if (!ssid) return setWifiSetupStatus('Bitte zuerst den Namen des Heim-WLANs eingeben.');
  setWifiSetupStatus('WLAN-Daten werden gespeichert und die Verbindung wird gestartet …');
  try {
    const response = await fetch('/wifi-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}`,
    });
    if (!response.ok) throw new Error('WiFi connection request failed');
    wifiPasswordInput.value = '';
    setWifiSetupStatus('Der ESP32 verbindet sich jetzt. Danach das Handy ins Heim-WLAN wechseln und die Geräteadresse aus der Anleitung öffnen.');
  } catch {
    setWifiSetupStatus('Die WLAN-Daten konnten nicht an den ESP32 gesendet werden. Prüfe die Verbindung mit „Dotto’s Dash“.');
  }
}
function setCharacterPauseOnHardware() {
  if (!espHosted) return;
  fetch(`/number/${encodeURIComponent('Letter Pause')}/set?value=${characterPauseMs}`, { method: 'POST' }).then((response) => {
    if (!response.ok) throw new Error('Letter pause request failed');
  }).catch(() => setHardwareStatus('Die Buchstabenpause konnte nicht auf dem ESP32 gespeichert werden.'));
}
function setDashThresholdOnHardware() {
  if (!espHosted) return;
  fetch(`/number/${encodeURIComponent('Dash Threshold')}/set?value=${dashThresholdMs}`, { method: 'POST' }).then((response) => {
    if (!response.ok) throw new Error('Dash threshold request failed');
  }).catch(() => setHardwareStatus('Die Strich-Grenze konnte nicht auf dem ESP32 gespeichert werden.'));
}
function syncCharacterPauseFromHardware() {
  if (!espHosted) return;
  fetch(`/number/${encodeURIComponent('Letter Pause')}`).then((response) => {
    if (!response.ok) throw new Error('Letter pause request failed');
    return response.json();
  }).then((payload) => setCharacterPause(payload.state)).catch(() => {});
}
function syncDashThresholdFromHardware() {
  if (!espHosted) return;
  fetch(`/number/${encodeURIComponent('Dash Threshold')}`).then((response) => {
    if (!response.ok) throw new Error('Dash threshold request failed');
    return response.json();
  }).then((payload) => setDashThreshold(payload.state)).catch(() => {});
}
function sendSignalToHardware(signal) {
  if (!espHosted) return;
  const buttonName = signal === '.' ? 'Web Dot' : 'Web Dash';
  pendingHardwareSignals += 1;
  window.setTimeout(() => { pendingHardwareSignals = Math.max(0, pendingHardwareSignals - 1); }, 1800);
  fetch(`/button/${encodeURIComponent(buttonName)}/press`, { method: 'POST' }).then((response) => {
    if (!response.ok) throw new Error('Morse button request failed');
  }).catch(() => {
    pendingHardwareSignals = Math.max(0, pendingHardwareSignals - 1);
    setHardwareStatus('Dottos Controller antwortet gerade nicht. Prüfe die WLAN-Verbindung.');
  });
}
function connectEspHardware() {
  if (!espHosted || !window.EventSource) return;
  setHardwareStatus('Verbunden mit Dottos Controller. Taste auf dem ESP32 oder hier auf dem Bildschirm.');
  syncCharacterPauseFromHardware();
  syncDashThresholdFromHardware();
  hardwareEventSource = new EventSource('/events');
  hardwareEventSource.addEventListener('state', (event) => {
    let payload;
    try { payload = JSON.parse(event.data); } catch { return; }
    const identity = `${payload.name_id || ''} ${payload.id || ''}`.toLowerCase();
    const readableIdentity = identity.replace(/[^a-z0-9]+/g, ' ');
    if (readableIdentity.includes('letter pause')) {
      setCharacterPause(payload.state);
      return;
    }
    if (readableIdentity.includes('dash threshold')) {
      setDashThreshold(payload.state);
      return;
    }
    if (readableIdentity.includes('morse key')) {
      if (!hardwareEventsReady) return;
      const pressed = ['on', 'true', '1'].includes(String(payload.state || '').toLowerCase());
      if (pressed && !hardwareKeyIsDown) {
        hardwareKeyIsDown = true;
        pauseFreeTimersForKeyDown();
        startMorseKeyTone();
      } else if (!pressed && hardwareKeyIsDown) {
        hardwareKeyIsDown = false;
        stopMorseKeyTone();
      }
      return;
    }
    if (!identity.includes('morse event') && !identity.includes('morse-event') && !identity.includes('morse_event')) return;
    const eventParts = String(payload.state || '').split(':');
    const sequence = Number(eventParts[0]);
    const signal = eventParts[1];
    if (!Number.isFinite(sequence) || (signal !== '.' && signal !== '-') || sequence <= lastHardwareEvent) return;
    lastHardwareEvent = sequence;
    if (!hardwareEventsReady) return;
    if (pendingHardwareSignals) {
      pendingHardwareSignals -= 1;
      return;
    }
    // The continuous key tone starts above on press; release merely commits
    // the completed dot or dash without sending it back to the board.
    recordSignal(signal, true, true);
  });
  hardwareEventSource.onopen = () => {
    hardwareEventsReady = false;
    hardwareKeyIsDown = false;
    stopMorseKeyTone();
    window.setTimeout(() => {
      hardwareEventsReady = true;
      setHardwareStatus('Verbunden mit Dottos Controller. Taste auf dem ESP32 oder hier auf dem Bildschirm.');
    }, 250);
  };
  hardwareEventSource.onerror = () => setHardwareStatus('Verbindung wird wiederhergestellt … Die echte Taste funktioniert trotzdem.');
}
function updateWriteInput() { writeInputEl.textContent = writeInput ? visualCode(writeInput) : '—'; }
function updateFreeMode() {
  freeMessageEl.textContent = freeMessage || '—';
  if (freeKeyStatusEl) {
    freeKeyStatusEl.textContent = freeInput ? TEXT.freeKeyListening : (freeMessage ? TEXT.freeKeyNext : TEXT.freeKeyReady);
  }
}
function pauseFreeTimersForKeyDown() {
  if (mode !== 'free') return;
  window.clearTimeout(inputPauseTimer);
  window.clearTimeout(wordPauseTimer);
}
function morseForText(message) {
  return message.split(' ').map((word) => word.split('').map((letter) => spacedVisualCode(LETTERS[letter])).join('   ')).join('     /     ');
}
function normaliseTranslationInput(message) {
  return message.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/^ /, '').slice(0, 24);
}
function updateTranslation() {
  const editorText = normaliseTranslationInput(messageInputEl.value);
  messageInputEl.value = editorText;
  translatorMessage = editorText.trim();
  translationOutputEl.textContent = translatorMessage ? morseForText(translatorMessage) : '—';
}
function writingTotal() { return writingMessage.replace(/ /g, '').length; }
function updateWritingMode() {
  if (!writingMessage) {
    writeMessageEl.textContent = '—';
    writePositionEl.textContent = TEXT.writeStart;
    writeTargetEl.textContent = '—';
    updateWriteInput();
    return;
  }
  const position = writingMessage.slice(0, writingIndex).replace(/ /g, '').length + 1;
  writeMessageEl.textContent = writingMessage;
  writePositionEl.textContent = TEXT.writeMission(position, writingTotal());
  writeTargetEl.textContent = currentWritingLetter();
  updateWriteInput();
}
function startWriting() {
  const message = normaliseWritingMessage(messageInputEl.value);
  messageInputEl.value = message;
  updateTranslation();
  if (!message) {
    writingMessage = '';
    writingIndex = 0;
    writeInput = '';
    createChallengeEl.hidden = true;
    createTaskEl.hidden = true;
    createPanel.classList.remove('is-ready');
    updateWritingMode();
    return feedback(TEXT.writeNoMessage, 'try');
  }
  writingMessage = message;
  writingIndex = 0;
  writeInput = '';
  skipWritingSpaces();
  createChallengeEl.hidden = false;
  createTaskEl.hidden = false;
  createPanel.classList.add('is-ready');
  updateWritingMode();
  feedback(TEXT.writeReady(message), 'info');
}
function buildReceiveOptions() {
  answerOptionsEl.innerHTML = level().choices.map((answer) => `<button class="answer-button" type="button" data-answer="${answer}">${answer}</button>`).join('');
}
function updateMission() {
  const activeLevel = level();
  const position = letterIndex + 1;
  const number = levelIndex + 1;
  treeWordEl.textContent = activeLevel.message;
  treeTargetEl.textContent = currentLetter();
  treeMissionEl.textContent = TEXT.treeMission(number, LEVELS.length, activeLevel.message, position);
  receiveMissionEl.textContent = TEXT.receiveMission(number, LEVELS.length);
  nextLetterEl.textContent = LEVELS[(levelIndex + 1) % LEVELS.length].message;
  starsEl.textContent = stars;
  treePath = '';
  treeLastMovePath = '';
  buildReceiveOptions();
  renderTree();
}
function scheduleWriteFinish() {
  window.clearTimeout(inputPauseTimer);
  inputPauseTimer = window.setTimeout(checkWritingInput, characterPauseMs);
}
function scheduleFreeFinish() {
  window.clearTimeout(inputPauseTimer);
  window.clearTimeout(wordPauseTimer);
  inputPauseTimer = window.setTimeout(checkFreeInput, characterPauseMs);
  wordPauseTimer = window.setTimeout(finishFreeWord, wordPauseMs);
}
function scheduleTreeReset() {
  window.clearTimeout(treePauseTimer);
  treePauseTimer = window.setTimeout(() => {
    if (!treePath) return;
    treePath = '';
    treeLastMovePath = '';
    renderTree();
    feedback(TEXT.treeTimedOut, 'info');
  }, TREE_IDLE_RESET_MS);
}
function addWritingSignal(signal, playSound = true) {
  if (!writingMessage) return feedback(TEXT.writeNoMessage, 'info');
  if (writeInput.length >= 5) return feedback(TEXT.tooLong, 'try');
  writeInput += signal;
  if (playSound) beep(signal === '-');
  updateWriteInput();
  scheduleWriteFinish();
}
function addFreeSignal(signal, playSound = true) {
  if (freeInput.length >= 5) return feedback(TEXT.tooLong, 'try');
  freeInput += signal;
  if (playSound) beep(signal === '-');
  updateFreeMode();
  scheduleFreeFinish();
}
function advanceFromSentLetter(letter) {
  const activeLevel = level();
  const lastLetter = letterIndex === activeLevel.message.length - 1;
  stars += 1;
  if (lastLetter) {
    feedback(TEXT.levelComplete(activeLevel.message), 'good');
    levelIndex = (levelIndex + 1) % LEVELS.length;
    letterIndex = 0;
  } else {
    const nextLetter = activeLevel.message[letterIndex + 1];
    letterIndex += 1;
    feedback(TEXT.letterCorrect(letter, nextLetter), 'good');
  }
  saveProgress();
  updateMission();
}
function advanceFromWrittenLetter(letter) {
  const lastLetter = writingIndex === writingMessage.length - 1;
  stars += 1;
  if (lastLetter) {
    feedback(TEXT.writeComplete(writingMessage), 'good');
    writingIndex = 0;
  } else {
    writingIndex += 1;
    skipWritingSpaces();
    feedback(TEXT.writeCorrect(letter, currentWritingLetter()), 'good');
  }
  writeInput = '';
  saveProgress();
  updateWritingMode();
}
function checkWritingInput() {
  window.clearTimeout(inputPauseTimer);
  if (!writingMessage) return feedback(TEXT.writeNoMessage, 'info');
  if (!writeInput) return feedback(TEXT.makeSignal, 'info');
  const letter = MORSE[writeInput];
  writeInput = '';
  updateWriteInput();
  if (letter === currentWritingLetter()) advanceFromWrittenLetter(letter);
  else feedback(letter ? TEXT.writeWrong(letter, currentWritingLetter()) : TEXT.unfinished, 'try');
}
function checkFreeInput() {
  window.clearTimeout(inputPauseTimer);
  if (!freeInput) return feedback(TEXT.makeSignal, 'info');
  const letter = MORSE[freeInput];
  freeInput = '';
  if (letter) {
    freeMessage += letter;
    feedback(TEXT.freeDecoded(letter), 'good');
  } else {
    freeMessage += '?';
    feedback(TEXT.freeUnknown, 'try');
  }
  updateFreeMode();
}
function finishFreeWord() {
  if (freeInput || !freeMessage || freeMessage.endsWith(' ')) return;
  freeMessage += ' ';
  updateFreeMode();
}
function clearFreePractice() {
  window.clearTimeout(inputPauseTimer);
  window.clearTimeout(wordPauseTimer);
  freeInput = '';
  freeMessage = '';
  updateFreeMode();
  feedback(TEXT.cleared, 'info');
}
function startFreePointerKey(event) {
  if (event.button !== undefined && event.button !== 0) return;
  event.preventDefault();
  if (freeKeyDownAt) return;
  pauseFreeTimersForKeyDown();
  freeKeyDownAt = performance.now();
  freeKeyButton.classList.add('is-down');
  freeKeyButton.setPointerCapture?.(event.pointerId);
  startMorseKeyTone();
}
function finishFreePointerKey(event, cancelled = false) {
  if (!freeKeyDownAt) return;
  event?.preventDefault();
  const duration = performance.now() - freeKeyDownAt;
  freeKeyDownAt = 0;
  freeKeyButton.classList.remove('is-down');
  stopMorseKeyTone();
  if (!cancelled) recordSignal(duration < dashThresholdMs ? '.' : '-', true);
}
function playTranslation() {
  if (!translatorMessage) return feedback(TEXT.translateNoMessage, 'info');
  playMorse(translatorMessage);
}
function moveTree(signal, playSound = true) {
  if (treePath.length >= 5) return feedback(TEXT.bottom, 'info');
  treePath += signal;
  treeLastMovePath = treePath;
  treeNotice = '';
  if (playSound) beep(signal === '-');
  renderTree();
  scheduleTreeReset();
}
function chooseTreeLetter() {
  window.clearTimeout(treePauseTimer);
  if (!treePath) return feedback(TEXT.chooseTreeFirst, 'info');
  const letter = MORSE[treePath];
  treePath = '';
  treeLastMovePath = '';
  renderTree();
  if (!letter) return feedback(TEXT.emptyBranch, 'try');
  if (letter === currentLetter()) advanceFromSentLetter(letter);
  else feedback(TEXT.foundWrong(letter, currentLetter()), 'try');
}
function checkReceivedAnswer(answer) {
  const activeLevel = level();
  if (answer !== activeLevel.message) return feedback(TEXT.heardWrong(answer), 'try');
  stars += activeLevel.message.length;
  feedback(TEXT.heardCorrect(activeLevel.message), 'good');
  levelIndex = (levelIndex + 1) % LEVELS.length;
  letterIndex = 0;
  saveProgress();
  updateMission();
}
const TREE_VIEWBOX_WIDTH = 1200;
const TREE_VIEWBOX_HEIGHT = 730;
const TREE_TOP = 78;
const TREE_LEVEL_GAP = 126;
function nodeForPath(path) { return MORSE[path] || ''; }
function treeNodeRadius(depth) { return [38, 32, 27, 22, 17, 13][depth] || 13; }
function position(path) {
  const depth = path.length;
  const index = parseInt(path.replace(/\./g, '0').replace(/-/g, '1') || '0', 2);
  const sidePadding = 22;
  return {
    x: sidePadding + (TREE_VIEWBOX_WIDTH - sidePadding * 2) * (index + .5) / (2 ** depth),
    y: TREE_TOP + depth * TREE_LEVEL_GAP,
  };
}
function updateTreeStatus() {
  const shownPath = treePath ? visualCode(treePath) : TEXT.start;
  const selected = MORSE[treePath] || '—';
  const notice = treeNotice ? `<span class="tree-status-notice ${treeNoticeKind}">${treeNotice}</span>` : '';
  treeStatusEl.className = `tree-status ${treeNotice ? `has-notice ${treeNoticeKind}` : ''}`;
  treeStatusEl.innerHTML = `<span class="tree-status-route">${TEXT.path}: <strong>${shownPath}</strong><br>${TEXT.letter}: <strong>${selected}</strong></span>${notice}`;
}
function renderTreeStage() {
  const shownPath = treePath ? visualCode(treePath) : TEXT.start;
  const selected = MORSE[treePath] || '—';
  const currentLabel = selected === '—' ? TEXT.start : selected;
  const routeSlots = Array.from({ length: 5 }, (_, index) => {
    const signal = treePath[index];
    const direction = signal === '.' ? 'dot' : signal === '-' ? 'dash' : '';
    return `<span class="tree-stage-slot ${signal ? `is-filled ${direction}` : ''}">${signal ? visualCode(signal) : '○'}</span>`;
  }).join('');
  const notice = treeNotice || TEXT.treeStagePrompt(currentLetter());
  treeStageEl.innerHTML = `
    <div class="tree-stage-heading">
      <span><small>${TEXT.treeRouteTitle}</small><strong>${TEXT.treeStagePrompt(currentLetter())}</strong></span>
      <span class="tree-stage-goal">${TEXT.treeGoal} <strong>${currentLetter()}</strong></span>
    </div>
    <div class="tree-focus-board">
      <div class="tree-focus-current">
        <span class="tree-focus-dotto" aria-hidden="true"><i></i><i></i></span>
        <span class="tree-focus-node">${currentLabel}</span>
        <small>${TEXT.treeAt} · ${shownPath}</small>
      </div>
      <div class="tree-focus-fork" aria-hidden="true"><i></i><i></i></div>
      <div class="tree-stage-turns">
        <button class="tree-stage-turn dot" type="button" data-tree-stage-signal="."><span>← ${TEXT.dot}</span><strong>·</strong><small>${TEXT.treeDotHint}</small></button>
        <button class="tree-stage-turn dash" type="button" data-tree-stage-signal="-"><span>${TEXT.dash} →</span><strong>—</strong><small>${TEXT.treeDashHint}</small></button>
      </div>
    </div>
    <div class="tree-stage-route">
      <span>${TEXT.treeRouteProgress(treePath.length)}</span>
      <div class="tree-stage-trail" aria-hidden="true">${routeSlots}</div>
    </div>
    <div class="tree-stage-actions">
      <button class="primary-button" type="button" data-tree-stage-action="choose" ${treePath ? '' : 'disabled'}>${TEXT.treeChoose} <span aria-hidden="true">↵</span></button>
      <button class="secondary-button" type="button" data-tree-stage-action="reset" ${treePath ? '' : 'disabled'}>↺ ${TEXT.treeReset}</button>
    </div>
    <p class="tree-stage-notice ${treeNoticeKind}" aria-hidden="true">${notice}</p>`;
}
function applyTreeMapZoom(centre = true) {
  const svg = treeEl.querySelector('svg');
  if (svg) svg.style.setProperty('--tree-map-width', `${treeMapZoom * 100}%`);
  treeEl.classList.toggle('is-fit', treeMapZoom === 1);
  const output = treeMapToolbarEl.querySelector('[data-tree-zoom-output]');
  const zoomOutButton = treeMapToolbarEl.querySelector('[data-tree-zoom="out"]');
  const zoomInButton = treeMapToolbarEl.querySelector('[data-tree-zoom="in"]');
  if (output) output.textContent = `${Math.round(treeMapZoom * 100)}%`;
  if (zoomOutButton) zoomOutButton.disabled = treeMapZoom <= 1;
  if (zoomInButton) zoomInButton.disabled = treeMapZoom >= 3.5;
  if (treeMapZoom === 1) treeEl.scrollTo({ left: 0, top: 0, behavior: 'auto' });
  else if (centre) window.requestAnimationFrame(centreTreeOnCurrentNode);
}
function setTreeMapZoom(value) {
  treeMapZoom = Math.min(3.5, Math.max(1, Math.round(value * 2) / 2));
  treeCentred = false;
  applyTreeMapZoom();
}
function renderTree() {
  const paths = [''];
  for (let depth = 1; depth <= 5; depth++) {
    for (let index = 0; index < 2 ** depth; index++) {
      paths.push(index.toString(2).padStart(depth, '0').replace(/0/g, '.').replace(/1/g, '-'));
    }
  }
  const links = paths.filter(Boolean).map((path) => {
    const parent = position(path.slice(0, -1));
    const child = position(path);
    const parentRadius = treeNodeRadius(path.length - 1);
    const childRadius = treeNodeRadius(path.length);
    const startY = parent.y + parentRadius;
    const endY = child.y - childRadius;
    const middleY = (startY + endY) / 2;
    const kind = path[path.length - 1] === '.' ? 'dot-link' : 'dash-link';
    const active = treePath.startsWith(path) ? 'active-link' : '';
    const newest = path === treeLastMovePath ? 'newest-link' : '';
    return `<path class="tree-link ${kind} ${active} ${newest}" d="M ${parent.x} ${startY} C ${parent.x} ${middleY}, ${child.x} ${middleY}, ${child.x} ${endY}"/>`;
  }).join('');
  const nodes = paths.map((path) => {
    const point = position(path);
    const depth = path.length;
    const letter = nodeForPath(path);
    const radius = treeNodeRadius(depth);
    const current = path === treePath ? 'current' : '';
    const empty = !letter && path ? 'empty' : '';
    const target = letter && letter === currentLetter() ? 'target' : '';
    const label = path ? letter : TEXT.start;
    const root = path ? '' : 'root';
    const size = path ? Math.max(12, 21 - depth * 1.8) : 16;
    const dotto = current ? `<g class="tree-dotto-marker" transform="translate(${point.x} ${point.y - radius - 18})" aria-hidden="true"><circle class="tree-marker-halo" r="16"/><circle class="tree-marker-body" r="10"/><circle class="tree-marker-shine" cx="-3" cy="-3" r="2.5"/></g>` : '';
    const targetRing = target ? `<circle class="tree-target-ring" cx="${point.x}" cy="${point.y}" r="${radius + 8}"/>` : '';
    return `<g class="tree-node ${root} ${current} ${target} ${empty}">${targetRing}<circle class="tree-node-disc" cx="${point.x}" cy="${point.y}" r="${radius}"/><text x="${point.x}" y="${point.y + size * .35}" font-size="${size}">${label}</text>${dotto}</g>`;
  }).join('');
  updateTreeStatus();
  renderTreeStage();
  treeEl.innerHTML = `<svg class="morse-tree-svg" viewBox="0 0 ${TREE_VIEWBOX_WIDTH} ${TREE_VIEWBOX_HEIGHT}" preserveAspectRatio="xMidYMin meet" role="img" aria-label="${TEXT.ariaTree}">
    <defs><marker id="tree-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>
    ${links}${nodes}
  </svg>`;
  applyTreeMapZoom(false);
  centreTreeOnCurrentNode();
}
/* At 100% the complete map fits the viewport. Higher zoom levels scroll in both
   directions and follow Dotto, while the compact route board stays usable. */
function centreTreeOnCurrentNode() {
  const svg = treeEl.querySelector('svg');
  if (!svg) return;
  const overflowX = treeEl.scrollWidth - treeEl.clientWidth;
  const overflowY = treeEl.scrollHeight - treeEl.clientHeight;
  if (overflowX <= 0 && overflowY <= 0) return;
  const bounds = svg.getBoundingClientRect();
  const scaleX = bounds.width / TREE_VIEWBOX_WIDTH;
  const scaleY = bounds.height / TREE_VIEWBOX_HEIGHT;
  const current = position(treePath);
  const left = current.x * scaleX - treeEl.clientWidth / 2;
  const top = current.y * scaleY - treeEl.clientHeight / 2;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  treeEl.scrollTo({
    left: Math.max(0, Math.min(overflowX, left)),
    top: Math.max(0, Math.min(overflowY, top)),
    behavior: treeCentred && !reduceMotion ? 'smooth' : 'auto',
  });
  treeCentred = true;
}
function resetTree() {
  window.clearTimeout(treePauseTimer);
  treePath = '';
  treeLastMovePath = '';
  renderTree();
  feedback(TEXT.reset, 'info');
}
function setMode(nextMode) {
  morseKeyDownAt = 0;
  freeKeyDownAt = 0;
  freeKeyButton.classList.remove('is-down');
  stopMorseKeyTone();
  mode = nextMode;
  treePanel.classList.toggle('hidden', mode !== 'tree');
  receivePanel.classList.toggle('hidden', mode !== 'receive');
  createPanel.classList.toggle('hidden', mode !== 'create');
  freePanel.classList.toggle('hidden', mode !== 'free');
  document.querySelectorAll('.mode-button').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  window.clearTimeout(inputPauseTimer);
  window.clearTimeout(wordPauseTimer);
  window.clearTimeout(treePauseTimer);
  const modeMessage = {
    tree: TEXT.treeMode,
    free: TEXT.freeMode,
    receive: TEXT.receiveMode,
    create: TEXT.createMode,
  };
  feedback(modeMessage[mode], 'info');
  updateMission();
  if (mode === 'create') updateWritingMode();
  if (mode === 'free') updateFreeMode();
  if (mode === 'create') updateTranslation();
  if (mode === 'tree') { treeCentred = false; centreTreeOnCurrentNode(); }
}
function showStoryChapter(nextChapter) {
  const index = Number(nextChapter);
  if (!Number.isInteger(index) || index < 0 || index >= STORY_CHAPTERS.length) return;
  storyChapter = index;
  document.body.dataset.storyChapter = String(storyChapter);
  const chapter = STORY_CHAPTERS[storyChapter];
  storyPeriodEl.textContent = chapter.period;
  storyTitleEl.textContent = chapter.title;
  storyTextEl.textContent = chapter.text;
  storyDetailTitleEl.textContent = chapter.detailTitle;
  storyDetailEl.textContent = chapter.detail;
  storyPeopleTitleEl.textContent = chapter.peopleTitle;
  storyPeopleTextEl.textContent = chapter.people;
  storyMissionTitleEl.textContent = chapter.missionTitle;
  storyMissionTextEl.textContent = chapter.mission;
  storyPositionEl.textContent = language === 'de'
    ? `Kapitel ${storyChapter + 1} von ${STORY_CHAPTERS.length}`
    : `Chapter ${storyChapter + 1} of ${STORY_CHAPTERS.length}`;
  storyBackButton.disabled = storyChapter === 0;
  storyNextButton.disabled = storyChapter === STORY_CHAPTERS.length - 1;
  document.querySelectorAll('.story-step').forEach((button) => {
    const active = Number(button.dataset.storyChapter) === storyChapter;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  localStorage.setItem('dottos-dash-story-chapter', String(storyChapter));
  setMode(chapter.mode);
}
function recordSignal(signal, fromMorseKey = false, fromHardware = false) {
  if (mode === 'tree') moveTree(signal, !fromMorseKey);
  if (mode === 'create') addWritingSignal(signal, !fromMorseKey);
  if (mode === 'free') addFreeSignal(signal, !fromMorseKey);
  if (!fromHardware && (mode === 'tree' || mode === 'create' || mode === 'free')) sendSignalToHardware(signal);
}

document.querySelectorAll('.story-step').forEach((button) => button.addEventListener('click', () => showStoryChapter(button.dataset.storyChapter)));
storyBackButton.addEventListener('click', () => showStoryChapter(storyChapter - 1));
storyNextButton.addEventListener('click', () => showStoryChapter(storyChapter + 1));
document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => {
  if (button.dataset.storyTarget !== undefined) showStoryChapter(button.dataset.storyTarget);
  else setMode(button.dataset.mode);
}));
$('start-writing-button').addEventListener('click', startWriting);
$('write-dot-button').addEventListener('click', () => recordSignal('.'));
$('write-dash-button').addEventListener('click', () => recordSignal('-'));
$('write-check-button').addEventListener('click', checkWritingInput);
$('write-clear-button').addEventListener('click', () => { window.clearTimeout(inputPauseTimer); writeInput = ''; updateWriteInput(); feedback(TEXT.cleared, 'info'); });
freeKeyButton.addEventListener('pointerdown', startFreePointerKey);
freeKeyButton.addEventListener('pointerup', finishFreePointerKey);
freeKeyButton.addEventListener('pointercancel', (event) => finishFreePointerKey(event, true));
freeKeyButton.addEventListener('lostpointercapture', (event) => finishFreePointerKey(event, true));
$('free-clear-button').addEventListener('click', clearFreePractice);
messageInputEl.addEventListener('input', () => {
  updateTranslation();
  if (!writingMessage) return;
  writingMessage = '';
  writingIndex = 0;
  writeInput = '';
  createChallengeEl.hidden = true;
  createTaskEl.hidden = true;
  createPanel.classList.remove('is-ready');
  updateWritingMode();
  feedback(TEXT.messageChanged, 'info');
});
$('play-translation-button').addEventListener('click', playTranslation);
$('tree-dot-button').addEventListener('click', () => recordSignal('.'));
$('tree-dash-button').addEventListener('click', () => recordSignal('-'));
$('tree-confirm-button').addEventListener('click', chooseTreeLetter);
$('tree-reset-button').addEventListener('click', resetTree);
treeStageEl.addEventListener('click', (event) => {
  const signalButton = event.target.closest('[data-tree-stage-signal]');
  if (signalButton) {
    const signal = signalButton.dataset.treeStageSignal;
    recordSignal(signal);
    window.requestAnimationFrame(() => treeStageEl.querySelector(`[data-tree-stage-signal="${signal}"]`)?.focus());
    return;
  }
  const actionButton = event.target.closest('[data-tree-stage-action]');
  if (!actionButton) return;
  if (actionButton.dataset.treeStageAction === 'choose') chooseTreeLetter();
  if (actionButton.dataset.treeStageAction === 'reset') resetTree();
});
treeMapToolbarEl.addEventListener('click', (event) => {
  const button = event.target.closest('[data-tree-zoom]');
  if (!button) return;
  if (button.dataset.treeZoom === 'out') setTreeMapZoom(treeMapZoom - .5);
  if (button.dataset.treeZoom === 'in') setTreeMapZoom(treeMapZoom + .5);
  if (button.dataset.treeZoom === 'fit') setTreeMapZoom(1);
});
$('play-button').addEventListener('click', () => playMorse(level().message));
$('replay-button').addEventListener('click', () => playMorse(level().message));
answerOptionsEl.addEventListener('click', (event) => {
  const answerButton = event.target.closest('[data-answer]');
  if (answerButton) checkReceivedAnswer(answerButton.dataset.answer);
});
$('restart-button').addEventListener('click', () => {
  window.clearTimeout(inputPauseTimer);
  window.clearTimeout(wordPauseTimer);
  window.clearTimeout(treePauseTimer);
  morseKeyDownAt = 0;
  freeKeyDownAt = 0;
  freeKeyButton.classList.remove('is-down');
  stopMorseKeyTone();
  levelIndex = 0;
  letterIndex = 0;
  stars = 0;
  writingMessage = '';
  writingIndex = 0;
  writeInput = '';
  freeInput = '';
  freeMessage = '';
  translatorMessage = '';
  messageInputEl.value = '';
  createChallengeEl.hidden = true;
  createTaskEl.hidden = true;
  createPanel.classList.remove('is-ready');
  saveProgress();
  updateMission();
  updateWritingMode();
  updateFreeMode();
  updateTranslation();
  showStoryChapter(0);
  feedback(TEXT.fresh, 'info');
});
window.addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.matches?.('input, textarea')) return;
  const nativeControl = event.target.closest?.('button, input, a, select, textarea, summary');
  if (event.code === 'Space') {
    if (nativeControl) return;
    event.preventDefault();
    if ((mode === 'tree' || mode === 'create' || mode === 'free') && !event.repeat && !morseKeyDownAt) {
      pauseFreeTimersForKeyDown();
      morseKeyDownAt = performance.now();
      startMorseKeyTone();
    }
  }
  else if (event.key === 'ArrowLeft') { event.preventDefault(); recordSignal('.'); }
  else if (event.key === 'ArrowRight') { event.preventDefault(); recordSignal('-'); }
  else if (event.key === 'Enter' && mode === 'tree' && !nativeControl) { event.preventDefault(); chooseTreeLetter(); }
  else if (event.key === 'Enter' && mode === 'receive' && !nativeControl) { event.preventDefault(); playMorse(level().message); }
  else if (event.key === 'Enter' && mode === 'create' && !nativeControl) { event.preventDefault(); checkWritingInput(); }
  else if (event.key === 'Enter' && mode === 'free' && !nativeControl) { event.preventDefault(); checkFreeInput(); }
  else if (event.key === 'Backspace' && (mode === 'tree' || mode === 'create' || mode === 'free')) {
    event.preventDefault();
    if (mode === 'tree') {
      treePath = treePath.slice(0, -1);
      treeLastMovePath = '';
      treeNotice = '';
      renderTree();
      if (treePath) scheduleTreeReset();
      else window.clearTimeout(treePauseTimer);
    } else if (mode === 'create') {
      writeInput = writeInput.slice(0, -1);
      updateWriteInput();
      if (writeInput) scheduleWriteFinish();
    } else {
      freeInput = freeInput.slice(0, -1);
      updateFreeMode();
      if (freeInput) scheduleFreeFinish();
      else {
        window.clearTimeout(inputPauseTimer);
        window.clearTimeout(wordPauseTimer);
      }
    }
  }
  else if (event.key.toLowerCase() === 'r' && mode === 'tree') {
    resetTree();
  }
});
window.addEventListener('resize', () => {
  window.clearTimeout(treeResizeTimer);
  treeResizeTimer = window.setTimeout(() => {
    if (mode !== 'tree') return;
    treeCentred = false;
    centreTreeOnCurrentNode();
  }, 120);
});
window.addEventListener('keyup', (event) => {
  if (event.code !== 'Space' || !morseKeyDownAt) return;
  event.preventDefault();
  const duration = performance.now() - morseKeyDownAt;
  morseKeyDownAt = 0;
  stopMorseKeyTone();
  recordSignal(duration < dashThresholdMs ? '.' : '-', true);
});
window.addEventListener('blur', () => {
  morseKeyDownAt = 0;
  freeKeyDownAt = 0;
  freeKeyButton.classList.remove('is-down');
  stopMorseKeyTone();
});
soundToggle.addEventListener('change', unlockBrowserAudio);
dashThresholdInput.addEventListener('input', () => setDashThreshold(dashThresholdInput.value));
// Raising the threshold can drag the letter gap up with it, so the board has to
// hear about both or its decoder drifts out of step with the page's.
dashThresholdInput.addEventListener('change', () => { setDashThresholdOnHardware(); setCharacterPauseOnHardware(); });
letterPauseInput.addEventListener('input', () => setCharacterPause(letterPauseInput.value));
letterPauseInput.addEventListener('change', setCharacterPauseOnHardware);
wordPauseInput.addEventListener('input', () => setWordPause(wordPauseInput.value));
if (wifiSetupForm) wifiSetupForm.addEventListener('submit', configureHomeWifi);
if (otaFileInput) otaFileInput.addEventListener('change', showOtaFileSelection);
if (otaUpdateForm) otaUpdateForm.addEventListener('submit', uploadFirmware);
for (const type of AUDIO_UNLOCK_EVENTS) document.addEventListener(type, unlockBrowserAudio, { capture: true, passive: true });
function buildAlphabet() {
  $('alphabet').innerHTML = Object.entries(LETTERS).sort(([a], [b]) => a.localeCompare(b)).map(([letter, code]) => `<div class="alphabet-item"><strong>${letter}</strong><span>${spacedVisualCode(code)}</span></div>`).join('');
}

// The byte builder under the cheat sheet. Morse's two signals are the same idea
// as a bit, so the readout answers in the game's own terms: a number, the
// character it stands for, and that character's Morse code. The bit buttons are
// built once and then updated in place, so keyboard focus survives a click.
const BINARY_PLACES = [128, 64, 32, 16, 8, 4, 2, 1];
const binaryBitsEl = $('binary-bits');
const binaryReadoutEl = $('binary-readout');
const binaryBitsTextEl = document.createElement('span');
const binaryMeaningEl = document.createElement('span');
let binaryValue = 0;
let binaryBitButtons = [];

function binaryMeaning(value) {
  const character = String.fromCharCode(value);
  if (LETTERS[character]) {
    const code = spacedVisualCode(LETTERS[character]);
    return character >= '0' && character <= '9'
      ? TEXT.binaryDigit(value, character, code)
      : TEXT.binaryLetter(value, character, code);
  }
  if (value === 32) return TEXT.binarySpace(value);
  if (LETTERS[character.toUpperCase()]) return TEXT.binarySmall(value, character, character.toUpperCase());
  if (value > 32 && value < 127) return TEXT.binarySign(value, character);
  return TEXT.binaryNothing(value);
}

function updateBinaryLab() {
  binaryBitButtons.forEach((button, index) => {
    const on = (binaryValue >> (7 - index)) & 1;
    button.classList.toggle('is-on', on === 1);
    button.setAttribute('aria-pressed', on === 1 ? 'true' : 'false');
    button.setAttribute('aria-label', TEXT.binaryBitLabel(BINARY_PLACES[index], on === 1));
    button.firstElementChild.textContent = on;
  });
  const bits = binaryValue.toString(2).padStart(8, '0');
  binaryBitsTextEl.textContent = `${bits.slice(0, 4)} ${bits.slice(4)}`;
  binaryMeaningEl.textContent = binaryMeaning(binaryValue);
}

function setBinaryValue(value) {
  binaryValue = ((Math.trunc(value) % 256) + 256) % 256;
  updateBinaryLab();
}

function buildBinaryLab() {
  binaryBitsTextEl.className = 'binary-bits-text';
  binaryMeaningEl.className = 'binary-meaning';
  binaryReadoutEl.append(binaryBitsTextEl, binaryMeaningEl);
  binaryBitButtons = BINARY_PLACES.map((place, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'binary-bit';
    const bit = document.createElement('strong');
    const placeLabel = document.createElement('small');
    placeLabel.textContent = String(place);
    button.append(bit, placeLabel);
    button.addEventListener('click', () => setBinaryValue(binaryValue ^ (1 << (7 - index))));
    return button;
  });
  binaryBitsEl.append(...binaryBitButtons);
  // E is the game's first checkpoint and one dot in Morse, so it is the friendliest byte to open on.
  setBinaryValue('E'.charCodeAt(0));
}
$('binary-letter-button').addEventListener('click', () => {
  const characters = Object.keys(LETTERS);
  let next = binaryValue;
  while (next === binaryValue) next = characters[Math.floor(Math.random() * characters.length)].charCodeAt(0);
  setBinaryValue(next);
});
$('binary-clear-button').addEventListener('click', () => setBinaryValue(0));

buildAlphabet();
buildBinaryLab();
setDashThreshold(dashThresholdMs);
setCharacterPause(characterPauseMs);
updateMission();
updateWritingMode();
updateFreeMode();
updateTranslation();
showStoryChapter(storyChapter);
connectEspHardware();
