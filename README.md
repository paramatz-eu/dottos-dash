# Dotto's Dash

[Family companion guide](FAMILY-GUIDE.md) · [Deutsche Anleitung](README.de.md) · [German web game](de/index.html) · [Build lesson](build.html) · [Flash from the browser](flash.html) · [Contributing](CONTRIBUTING.md)

> An offline, kid-friendly ESP32 project for learning Morse code with a game,
> a real key, coloured light and sound.

**Dotto's Dash** is made for curious children aged 10 and up, with an adult
nearby for the USB flashing and wiring. It deliberately has no accounts, no
PHP server or cloud service. It works fully offline, with an optional home
Wi-Fi setup for adults.

> [!IMPORTANT]
> **Starting with a child or sharing adult responsibilities?** Read the
> [family companion guide](FAMILY-GUIDE.md) first. It covers safety, a relaxed
> first 25 minutes, privacy, local Wi-Fi, troubleshooting, and the split
> between child and adult tasks.

The name is the game: Dotto starts as a dot, follows dots and dashes through
Morse-code routes, and races from one checkpoint to the next.

After flashing, the complete game interface is part of the ESP32 firmware. The
board creates its own Wi-Fi network and serves the game itself — there is no
separate server to install or website to deploy.

For the hands-on lesson in a browser, open [Build Dotto's controller](build.html).
It explains the parts, safety, wiring, electronics concepts, tests and debugging
one stage at a time. The [Markdown version](BUILD.md) is kept for GitHub.

## Why this project?

Dotto's Dash makes the connection between a screen and physical computing
visible: a dot or dash in the game is the same dot or dash made with a real
key. The project is deliberately small, offline-first and easy to take apart
again. It can be played before any components are wired, then grown one safe
step at a time.

| If you want to… | Start here |
| --- | --- |
| Try the learning game in a browser | [index.html](index.html) |
| Build the electronics with a child | [step-by-step build lesson](build.html) |
| Flash an ESP32 with no software to install | [flash.html](flash.html), from Chrome or Edge |
| Flash an ESP32 from the command line | [Flash the ESP32](#2-flash-the-esp32) |
| Start safely with a child or share adult responsibilities | **[family companion guide](FAMILY-GUIDE.md)** |
| Change or improve the project | [CONTRIBUTING.md](CONTRIBUTING.md) |

### Highlights

- Works without an account, cloud service, internet connection or home Wi-Fi.
- Can optionally join a 2.4 GHz home Wi-Fi network from the adult section in
  the game; no credentials are committed to this repository.
- The ESP32 creates the local `Dotto's Dash` Wi-Fi network and hosts the game.
- The built-in **BOOT** key works as a Morse key after flashing; an external
  button and rotary encoder can be added later.
- Tells the invention story in five short chapters, each followed by a matching
  hands-on Morse challenge.
- Includes sound and light feedback and an offline build guide on the device itself.

## Start here

There are four fun stages. Each one works before moving on to the next.

| Stage | What Dotto does | What is needed |
| --- | --- | --- |
| 1. Web game | Learns letters and explores the Morse tree. | Any computer, tablet or phone browser; after flashing, use the ESP32's own Wi-Fi. |
| 2. Morse button | Makes dots and dashes with the built-in BOOT key or an external button; RGB light and optional sound give feedback. | ESP32; add RGB module and an optional push button. |
| 3. Morse dial | Turns left for dot and right for dash. | Add a rotary encoder. |
| 4. Make it sing | Hears dots, dashes and correct answers. | Add a piezo buzzer or MAX98357A + small speaker. |

## 1. Play the web game

Open [index.html](index.html) in a browser. It works directly from a downloaded
folder and works on GitHub Pages without any build step.

The game is a five-chapter journey through Morse history:

1. Why slow, line-of-sight messages were a problem.
2. How Samuel Morse, Leonard Gale, Joseph Henry and Alfred Vail contributed
   different ideas and skills.
3. How the telegraph key, receiver and alphabetic code made the idea practical.
4. How the Washington–Baltimore line survived a failed first plan and carried
   the famous 1844 public message.
5. How international agreements turned Morse into a shared code and later made
   `SOS` an international distress signal.

Every chapter opens its matching activity underneath. The code routes teach
how dots and dashes reach letters; the free key decodes a child's signals; the
listening challenge imitates operators reading clicks; and the message workshop
lets the child type, hear and send a message. Returning players can still jump
straight to any activity from the collapsed activity menu.

In the code-route challenge, each checkpoint gives a message: first individual
letters (`E` through `O`), then `SOS`, then `DOTTO`, then short words such as
`HI`, `GO`, `CODE`, and `MORSE`. Find one letter at a time to build the full
message.

- `←` is a dot.
- `→` is a dash.
- Hold `Space` like a real Morse key: a short press is a dot and a long press
  is a dash, with a tone playing while it is held.
- `Backspace` removes one signal.

In the Morse tree, press **Choose letter** or `Enter` after reaching the intended
node. `Space` remains only the Morse key. An unfinished route returns to Start
after 3.5 seconds without input.

The message workshop accepts A–Z, digits and spaces. Key sounds start on by
default and can be changed under **Sound and key settings**.

The game remembers only Dash points, the next challenge and the current history
chapter in that browser's local storage. On the ESP32 page, its controls talk
only to that same local ESP32 so that its light and sound respond; nothing
leaves the local network.

To publish it, create a GitHub repository and enable **Settings → Pages → Deploy
from a branch → main → /(root)**. The page will be ready as soon as GitHub Pages
finishes its normal deployment.

## 2. Flash the ESP32

The first build is intentionally the piezo build. GPIO27 may be left empty, so
it is the right choice even before a buzzer is added.

1. Install [ESPHome](https://esphome.io/guides/getting_started_command_line.html)
   on the adult's computer.
2. Plug the ESP32 DevKit into USB.
3. From this project folder, run:

   ```sh
   esphome run firmware/dottos-dash-piezo.yaml
   ```

4. If this particular DevKit does not upload automatically: hold **BOOT**, tap
   **EN**, keep holding BOOT for two seconds, then run the command again.

No `secrets.yaml` is needed. After flashing, the board is ready to use as a
standalone Morse key even if no phone is connected.

The built-in **BOOT** button is the first Morse key: releasing it records a
short press as a dot or a long press as a dash. With the RGB light and an
optional piezo or speaker connected, feedback starts when it is pressed. Do not
hold BOOT while resetting or flashing, since GPIO0 also selects the ESP32
bootloader at startup.

The board also creates a local, offline Wi-Fi network named **Dotto's Dash**.
Its password is **dottodash**. Connecting a phone and opening
`http://192.168.4.1/` opens the complete game from the ESP32's flash memory.
Screen controls make the real LED and speaker respond, and the real button or
encoder moves the game on screen. No internet connection is used.
The game also includes an offline short build guide under **Build guide**.

On Android, the network may say **No internet**. Choose **Stay connected** (or
the similar wording on that phone), close Android's Wi-Fi notice, then open
Chrome and type exactly `http://192.168.4.1/` — not `https://`.

### Optional: connect to home Wi-Fi

At the bottom of the ESP32 game, open **For adults: connect to home Wi-Fi**.
Enter a 2.4 GHz network name and password, then choose **Save and connect**.
The ESP32 stores the connection setting itself, rather than writing it into
this project. Switch the phone to the same home network, then open
`http://dottos-dash.local/` (or `dottos-dash-max.local` for the MAX98357A
firmware). If that name does not resolve on the phone,
use the ESP32's IP address from the router's device list. If the home network
is unavailable, the `Dotto's Dash` hotspot returns after a short wait.

### Share a later firmware update

The first USB flash installs the browser update tool too. For a later update,
compile the same variant, send the resulting **OTA** `.bin` file to the person
with the board, and have them connect to **Dotto's Dash**. At the bottom of
the game page, open **For adults: update firmware**, choose that file and wait
for the ESP32 to restart. Do not use a `firmware.factory.bin`, and do not unplug
power during the update. The person must be near the board; this offline access
point cannot be updated from across the internet.

## Wire it up, one step at a time

Unplug the USB cable before changing any wire. Never connect 5 V to an ESP32
GPIO pin.

### Stage 2 — RGB light and optional external button

No wiring is needed to use the built-in **BOOT** key. Add this external button
when a larger, breadboard-friendly Morse key is wanted.

| Part | Connect to ESP32 | Notes |
| --- | --- | --- |
| HW-479 RGB, R | GPIO16 | This guide assumes a **common-cathode** module. |
| HW-479 RGB, G | GPIO17 | |
| HW-479 RGB, B | GPIO18 | |
| HW-479 RGB, common pin | GND | The longest leg is commonly GND on this module. |
| Push button, one side | GPIO13 | The firmware uses the ESP32's internal pull-up resistor. |
| Push button, other side | GND | No extra resistor is needed. |

- A short button press (under 0.3 seconds) is a **dot**: cyan flash and short
  beep.
- A long press is a **dash**: orange flash and longer beep.
- Pause for 1.2 seconds. Green means the code is a letter or number; red means
  try another combination. The game page shows which letter was decoded.

### Stage 3 — rotary encoder

The encoder replaces neither the RGB light nor its own button. Its button uses
the same two connections as the Stage 2 button.

| Encoder pin | Connect to ESP32 |
| --- | --- |
| `CLK` / `A` | GPIO21 |
| `GND` / `C` | GND |
| `DT` / `B` | GPIO19 |
| `SW` | GPIO13 |
| `+` / `VCC` | 3V3 only |

**Turn left for a dot. Turn right for a dash.** This is the same direction as
the web game's Morse tree. If the dial feels backwards, swap `CLK` and `DT`.

### Stage 4a — passive piezo buzzer (recommended)

| Piezo pin | Connect to ESP32 |
| --- | --- |
| `+` | GPIO27 |
| `-` | GND |

Use a **passive** piezo buzzer, not an active self-beeping buzzer. The existing
`dottos-dash-piezo.yaml` firmware already supports it; reflash is not needed
when the piezo is added later.

### Stage 4b — MAX98357A and a small speaker

For louder sound, use the MAX98357A build instead:

```sh
esphome run firmware/dottos-dash-max98357a.yaml
```

| MAX98357A pin | Connect to ESP32 |
| --- | --- |
| `BCLK` | GPIO26 |
| `LRC` / `WS` | GPIO25 |
| `DIN` | GPIO22 |
| `GND` | GND |
| `VIN` | 5V / `VIN` pin on the DevKit |

Connect the speaker only to the amplifier's `SPK+` and `SPK-` terminals. Ask an
adult to check the amplifier wiring before powering it: the ESP32's GPIO pins
are 3.3 V logic and must never receive 5 V.

## What is in the box?

```text
index.html / style.css / app.js       The web game; these files are embedded in both firmware builds
firmware/dottos-dash-piezo.yaml    Flash this first; piezo is optional
firmware/dottos-dash-max98357a.yaml Louder I2S-speaker alternative
firmware/dottos-dash-common.yaml   Shared learning-pad behaviour
```

The project intentionally does **not** include a remote-control server. Keeping
the game local makes it safer, easier to understand and easier to share.

## Development

The source web game is plain HTML, CSS and JavaScript. ESPHome embeds
`style.css` and `app.js` into both firmware variants at compile time. Keep the
two firmware variants working when changing shared behaviour, and test on real
hardware before sharing a firmware image. See [CONTRIBUTING.md](CONTRIBUTING.md)
for the practical checklist.

## GitHub checklist

Before sharing, flash both firmware choices on real hardware, then commit the
source files (not `.esphome/`, `secrets.yaml` or generated `.bin` files). Add a
photo of Dotto's finished controller and, if possible, attach tested firmware
images to a GitHub Release so friends can flash without installing ESPHome.

## License

Code is [MIT licensed](LICENSE). The learning documentation is
[CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt), and future hardware-design source is
[CERN-OHL-W-2.0](LICENSES/CERN-OHL-W-2.0.txt). See the complete
[licensing guide](LICENSING.md), including the [name and logo policy](TRADEMARKS.md).
