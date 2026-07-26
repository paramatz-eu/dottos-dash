# Dotto's Dash: a family companion guide

[Main project guide](README.md) · [Step-by-step build lesson](BUILD.md) · [Deutsche Anleitung](README.de.md)

Dotto's Dash is an offline-first family project for learning Morse code, electronics and a real programmable device. It is made for children aged 10+ with an adult for flashing and wiring. The role names below are only a convenient first-session split: swap, share or ignore them as you like.

> **The short version:** begin with the browser game, add the ESP32 only after it has been flashed and checked, and grow the controller one component at a time. A working button is already a complete project.

## Before the first session: the family safety card

An adult should flash the board and inspect every connection before power is applied. Once that check is done, a child can safely play, press the built-in BOOT key and help make observations.

- Disconnect USB before adding, moving or checking any wire.
- Power this learning project from the ESP32's USB connection only. Do not use mains electricity, unknown power supplies, or batteries above the board's rating.
- ESP32 GPIO pins use **3.3 V logic**. Never connect 5 V to a GPIO pin. The board's `VIN`/`5V` pin is a power input for a suitable module, not a signal pin.
- Use the specified common-cathode HW-479 RGB *module*, not a bare RGB LED. A bare LED needs a resistor on every colour channel.
- Keep small parts away from younger siblings and pets. Put loose jumper wires and modules away after a session.
- Keep the piezo or speaker quiet enough for the room; turn off browser key sounds if they are distracting or uncomfortable.
- Stop immediately if the board gets hot, smells unusual, repeatedly resets, or the computer disconnects it. Unplug USB and inspect the wiring before any retry.

The complete wiring tables and troubleshooting guide are in [Build Dotto's controller](BUILD.md).

## For Mum: the learning and big-picture view

### What the child is actually learning

The aim is not to memorise a whole alphabet. The game lets a child discover connected ideas:

| Dotto activity | The underlying idea |
| --- | --- |
| Choosing left/right routes in the Morse tree | A message can be represented with a few symbols and a decision tree. |
| Holding a key for a dot or dash | A physical action becomes data when a computer applies a rule. |
| Waiting for a letter to decode | Timing and pauses matter in communication systems. |
| Seeing light, hearing sound and watching the game | One input can have several forms of feedback. |
| Following the history chapters | Inventions are made by teams, experiments and improvement. |
| Checking one wire or idea at a time | Prediction, observation and revision are how engineers troubleshoot. |

Make the first win deliberately small: `E` is one dot, `S` is three dots, and `SOS` is `... --- ...`. A thoughtful wrong answer is useful evidence: “What did Dotto hear, and what could we change once?”

### A relaxed first 25 minutes

1. **Explore without hardware (5 minutes).** Open `index.html`. Let the child choose a history chapter and find `E` in the Morse tree. There is no Wi-Fi or wiring to set up.
2. **Play with the code (7 minutes).** Try `S`, `T` and then `SOS`. Ask for a prediction—dot or dash?—before each move.
3. **Meet the controller (8 minutes).** After the adult has flashed and checked the ESP32, use its built-in BOOT key. A short press makes a dot; a longer press makes a dash. The light, external button, dial and sound come later.
4. **Explain it back (5 minutes).** Invite the child to demonstrate a letter and explain why it worked. Good questions are: “What did the pause do?”, “How could someone at the other end tell the difference?”, and “Which part would you improve?”

Stop while curiosity is still high. In the next session, add one component and repeat the same predict–test–explain rhythm.

### Support without taking over

Let the child make the safe choices: select a route, press the checked key, read a pin label aloud, and tick a wire on a paper map. Keep the adult jobs visible too: flashing, checking labels, connecting USB and deciding when it is safe to apply power.

Useful things to say out loud:

- “The colour of a wire is not its job; the printed label tells us its job.”
- “We change one thing, then test. That helps us find the cause.”
- “A computer follows exact rules; we can read and improve those rules.”
- “`SOS` is an historical distress signal, not a substitute for calling local emergency services or asking an adult for help in a real emergency.”

The game works with touch, keyboard and the physical controller. For a child who prefers less sound, turn off key sounds in **Sound and key settings**. For a child who finds a long press tricky, begin with the screen buttons or keyboard arrows and return to the physical key later.

### Privacy and supervision

The browser game has no account, analytics, cloud service or chat. It stores only the Dash score, game checkpoint, chosen story chapter and letter-pause preference in that browser's local storage. A typed practice message is used in the current activity and is not saved as progress.

The ESP32 can be used entirely offline on its own local Wi-Fi network. The optional **For adults: connect to home Wi-Fi** form sends a network name and password to the ESP32 so that it can save them for later; they are not written into this repository. Treat that as a household setup task, not part of a child's play session. Read the network safety section before using it.

## For Dad: ESPHome and the technical hand-off

### Architecture at a glance

```text
index.html + style.css + app.js
              │ embedded at compile time
              ▼
ESPHome configuration ──► ESP32 firmware ──► local Dotto's Dash Wi-Fi
                                                 │
              ESP32 BOOT/button/dial ◄──────────┼──────── phone or browser
                         │                       │
                         └── light + piezo/speaker feedback
```

There is no separate web server to deploy. ESPHome embeds the CSS and JavaScript in the firmware, then the ESP32 serves the game itself. Screen controls use the same ESPHome actions as the physical button and encoder, while state events keep the game in step with physical input.

Shared behavior is in [`firmware/dottos-dash-common.yaml`](firmware/dottos-dash-common.yaml). Do not flash that file directly.

| Target | Use it when | Sound wiring |
| --- | --- | --- |
| `dottos-dash-piezo.yaml` | First flash and the normal build | Optional passive piezo on GPIO27 and GND |
| `dottos-dash-max98357a.yaml` | Using the louder amplifier and small speaker | MAX98357A on GPIO26, GPIO25, GPIO22, GND and `VIN`/5V |

Start with the piezo target: it works with no piezo attached. The MAX98357A target is an alternative sound build and requires a reflash.

### First flash and smoke test

1. Install ESPHome on the adult computer and connect the ESP32 DevKit by USB.
2. With no breadboard wiring attached, run:

   ```sh
   esphome run firmware/dottos-dash-piezo.yaml
   ```

3. If this DevKit will not upload automatically, hold **BOOT**, tap **EN**, keep holding BOOT for two seconds, then run the command again.
4. Release BOOT after normal startup. Press it briefly for a dot and hold it longer for a dash. Do not hold BOOT while resetting or flashing: GPIO0 selects the serial bootloader at startup.
5. Connect a phone, tablet or computer to **Dotto's Dash** (password: `dottodash`) and open `http://192.168.4.1/`. Android may say “No internet”; choose to stay connected. Use `http`, not `https`.

No `secrets.yaml` is required by the supplied firmware configurations. The first USB flash also installs the local browser update capability.

### Hardware map and expected behaviour

| Function | ESP32 connection | Notes |
| --- | --- | --- |
| Built-in Morse key | BOOT / GPIO0 | Works after flashing; no wire needed. |
| External button / encoder switch | GPIO13 to GND | Internal pull-up is used. |
| RGB module R / G / B | GPIO16 / GPIO17 / GPIO18 | HW-479 common-cathode module; common pin to GND. |
| Encoder CLK / DT | GPIO21 / GPIO19 | 3V3 only for a module's `VCC`; swap CLK and DT if direction is reversed. |
| Passive piezo | GPIO27 / GND | Use a passive, not self-beeping, buzzer. |
| MAX98357A BCLK / LRC / DIN | GPIO26 / GPIO25 / GPIO22 | Speaker connects to the amplifier's `SPK+`/`SPK-` only. |

For the physical key, a press under 300 ms is a dot and a longer press is a dash. The screen key uses a 250 ms threshold. The letter pause is adjustable from 300 to 2,000 ms and starts at 500 ms; on the hosted game it is saved on the ESP32 too. Green feedback means a recognised letter or number, and red means an invalid sequence.

### Where to make changes

- Gameplay copy, Morse routes, accessibility labels and browser timing: [`app.js`](app.js).
- Visual game: [`index.html`](index.html) and [`style.css`](style.css).
- GPIO behavior, signals and feedback scripts: [`firmware/dottos-dash-common.yaml`](firmware/dottos-dash-common.yaml). Keep both targets buildable.
- Adult Wi-Fi setup: [`firmware/wifi_setup_handler.h`](firmware/wifi_setup_handler.h). It validates the SSID/password length and lets ESPHome save the connection.

After a firmware change, test the piezo variant; test the MAX variant too if sound changed:

```sh
esphome run firmware/dottos-dash-piezo.yaml
esphome run firmware/dottos-dash-max98357a.yaml
```

For an update sent to another household, compile the *same* target already on their board. They connect to Dotto's Dash, choose **For adults: update firmware**, select the normal OTA `.bin`, and keep power connected until restart. Never give that form a `firmware.factory.bin`.

### Local network security: know the boundary

“Offline” means the default game does not need or contact the internet; it does **not** mean the board is a hardened private service. Treat it as a small local web server.

- The hotspot password (`dottodash`) is deliberately published in the project. It is convenient for a family activity, not a secret for a public place.
- The current configuration provides web controls and browser firmware-update access without a separate app login. Anyone able to access the relevant local network can potentially operate the device or attempt an update.
- `api:` is enabled for normal ESPHome/Home Assistant discovery after a home-Wi-Fi connection. This supplied configuration does not set an API encryption key or an OTA password.
- Use the hotspot only around people you trust, turn the board off when unattended, and do not configure it on a public or shared network.
- Joining home Wi-Fi is optional. Prefer a trusted, access-controlled home or isolated IoT network. Before putting a modified version on a broader network, an experienced maintainer should add ESPHome API encryption, OTA authentication and suitable web-server access protection.

The ESP32 stores submitted home-Wi-Fi details on the device, not in the source tree. There is no “forget Wi-Fi” button; if credentials must be removed, use an ESPHome-supported erase/reprovisioning procedure and expect to lose saved device settings.

## FAQ

### Do we need every component before playing?

No. Open `index.html` to play the entire learning game without hardware. After flashing, the bare ESP32's BOOT button is a Morse key. Build the light, external button, encoder and sound only when you want the next experiment.

### Does it need internet, an account or a phone app?

No. The browser game runs from the project folder, and the flashed board serves its own game on a local Wi-Fi network. There are no accounts or a phone app; a phone is simply one convenient browser screen.

### My phone says “No internet” after joining Dotto's Dash. Is it broken?

No. That is expected. Choose **Stay connected** (or the equivalent), dismiss the notice, and type `http://192.168.4.1/` into the browser. Do not search for it and do not use `https://`.

### Why does the board not appear on our usual Wi-Fi?

By default it creates its own hotspot. Joining a 2.4 GHz home network is optional and is done from the adult form in the hosted game. Then move the phone to the same network and try `http://dottos-dash.local/` (or `http://dottos-dash-max.local/` for the MAX build). If that name is not found, use the board's IP address from the router's device list.

### Which firmware should we flash?

Start with `dottos-dash-piezo.yaml`, even with no buzzer. Use `dottos-dash-max98357a.yaml` only with the MAX98357A amplifier and small speaker. It replaces the piezo sound build.

### The board will not upload. What should we try first?

Disconnect breadboard wiring, use a data-capable USB cable, then repeat the BOOT–EN sequence above. If it still fails, check the selected serial port and board model before changing firmware.

### The RGB light is dark or colours are wrong. What is the safest check?

Unplug USB. Read the module's printed labels—not jumper-wire colours—and check `R` → GPIO16, `G` → GPIO17, `B` → GPIO18 and common cathode → GND. Stop if the module is common-anode or has a `VCC` pin instead of the expected common-cathode arrangement.

### The button always seems pressed, or does nothing.

With power removed, verify that it joins GPIO13 to GND. On a four-leg breadboard button, use legs from opposite sides of the centre gap; two legs on the same side are already joined internally.

### Why are dots and dashes inconsistent?

For a real key, release in under 300 ms for a dot and hold longer for a dash. Wait for the configured letter pause before the next letter. Start with `E`, `T` and `S`; clean, separated signals are easier to practise than a long word.

### What is stored, and how do we reset the game?

The browser keeps score, level, story chapter and letter-pause preference in local storage. **Restart the dash** resets score and game route. To remove all browser settings, clear this site's storage in the browser. Home-Wi-Fi settings, if entered, live separately on the ESP32.

### Can we share a firmware update safely?

Share only a normal OTA `.bin` built for the same firmware variant. The recipient updates while beside the board, connected to its local network, and keeps power connected until restart. Do not use a factory image in the browser updater or update a board on an untrusted network.

### When should we stop instead of troubleshooting?

Immediately stop and unplug if anything is warm, smells unusual, makes an unexpected high-pitched sound, repeatedly disconnects, or causes USB failures. Review wiring with USB disconnected; never “try one more time” while a possible short circuit is powered.

