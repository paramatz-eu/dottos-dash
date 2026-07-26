# Build Dotto's Dash

[View the styled browser lesson](build.html) · [Deutsche Bauanleitung](BAUEN.md) · [Main project guide](README.md)

This is a build lesson for Dotto's controller, designed for a child and an adult helper. Build one small circuit at a time, test it, then add the next part. That is how real engineers find mistakes without getting lost.

## The idea

An ESP32 is a tiny computer with connection pins called **GPIOs**. A GPIO can notice an input (a button being pressed) or make an output (an LED or a sound).

```text
finger or dial → ESP32 input pin → Morse program → light and sound
```

The web game teaches the code first. The hardware makes the same choices real:

```text
short press = dot        long press = dash
turn left = dot          turn right = dash
pause 1.2 seconds = decode the letter
```

## Safety first

An adult should handle flashing and check wiring before power is connected.

- Unplug USB before moving wires.
- Use only USB power while learning. Never connect this project to wall power, mains electricity, batteries above the board's rating, or unknown supplies.
- ESP32 GPIO pins are **3.3 V only**. Never connect 5 V to a GPIO pin.
- The 5 V / `VIN` pin is only for powering a suitable module such as the MAX98357A. It is not a signal pin.
- Use the HW-479 RGB **module** named below, or use a resistor with every channel of a bare LED. A bare LED connected directly to a GPIO can damage the LED or the ESP32.
- If the board becomes hot, smells unusual, or the computer disconnects it, unplug it immediately and ask the adult helper to inspect the wiring.

## Parts and their jobs

| Part | Job in the project | Needed when |
| --- | --- | --- |
| ESP32 DevKit + USB cable | The small computer. | Always |
| Breadboard + jumper wires | Lets us make removable connections. | Hardware stages |
| HW-479 common-cathode RGB module | Shows dots, dashes and answers as coloured light. | Stage 1 |
| Momentary push button | A real Morse key. | Stage 2 |
| Rotary encoder module | A twisty Morse input. | Stage 3 |
| Passive piezo buzzer | Makes quiet electronic beeps. | Stage 4A |
| MAX98357A + small 4–8 Ω speaker | Louder sound alternative. | Stage 4B, optionally alongside 4A |

`GND` means **ground**: the shared return path for electricity. Components can only communicate when they share ground with the ESP32.

## Ones and zeros: the language under all of it

A GPIO pin does not measure volts the way a meter does. It answers one question: is this pin nearer 3.3 V or nearer 0 V? Those two answers are called **HIGH** and **LOW**, or **1** and **0**. One such answer is a **bit**, short for *binary digit*.

Two states are all a computer needs, because two states survive interference. A slightly weak or noisy signal is still clearly nearer one end than the other, so it can be passed on perfectly. Telegraph operators found the same thing in 1844: a click either arrived or it did not.

| In this project | 1 / HIGH | 0 / LOW |
| --- | --- | --- |
| GPIO13 with the internal pull-up | Button open | Button pressed, joined to GND |
| GPIO16 driving the red channel | Red on | Red off |
| Encoder `CLK` and `DT` | Contact open | Contact closed |

One bit alone says very little, so bits are grouped—and each added bit **doubles** how many different things the group can mean:

```text
1 bit  →   2 values   0  1
2 bits →   4 values   00  01  10  11
3 bits →   8 values
8 bits → 256 values   = 1 byte = one text character
```

Computers agreed one shared list of which number means which character, called **ASCII**: `A` is 65, or `01000001`. The game's **Build a byte** panel flips those eight bits and shows the letter with its Morse code.

Where the bits are in this build:

- **The key:** the firmware reads one bit from GPIO13 over and over and measures how long it stayed 0. Under the dash threshold it is a dot; longer is a dash.
- **The colours:** PWM flips a pin between 1 and 0 thousands of times a second. "Half brightness" means the pin is 1 for half of each tiny slice of time.
- **The sound:** I2S sends the MAX98357A a stream of binary numbers. `BCLK` ticks once per bit and `DIN` carries the bit itself, so the amplifier knows exactly where each number ends.
- **The firmware:** flashing copies about a megabyte of bytes into the ESP32's memory—the program, the game page and this lesson, all as ones and zeros.

**Is Morse code the same as binary?** Almost. Morse has two signals, but its letters are different lengths—`E` is one signal and `Z` is four—so it needs a third thing: the silence that shows where a letter ends. A byte is always exactly eight bits, so a computer never needs a gap to know where one character stops and the next starts. That fixed size is why the firmware needs a `Letter Pause` setting and a laptop does not.

**Try it:** count on one hand—thumb 1, index 2, middle 4, ring 8, little 16. Each finger is a bit, so one hand counts to 31. Which fingers make 21?

## Before wiring: flash and identify the pins

1. Flash the beginner firmware while nothing except USB is attached:

   ```sh
   esphome run firmware/dottos-dash.yaml
   ```

2. Unplug USB.
3. Put the ESP32 on the breadboard, with its USB connector facing the same way each time. Read the tiny labels on the board: use labels such as `13`, `21`, `GND`, `3V3`, and `VIN`/`5V`—not their physical row number.
4. Make this pin map on paper and tick each wire as it is added:

| ESP32 pin | Goes to | What it does |
| --- | --- | --- |
| GPIO16 | RGB `R` | Red part of the light |
| GPIO17 | RGB `G` | Green part of the light |
| GPIO18 | RGB `B` | Blue part of the light |
| GPIO13 | Button / encoder `SW` | Reads short or long presses |
| GPIO21 | Encoder `CLK` / `A` | Reads turning |
| GPIO19 | Encoder `DT` / `B` | Reads turning direction |
| GPIO27 | Passive piezo `+` | Makes the piezo vibrate |
| GPIO26 | MAX98357A `BCLK` | Sound timing |
| GPIO25 | MAX98357A `LRC` / `WS` | Sound channel timing |
| GPIO22 | MAX98357A `DIN` | Sound data |

## Stage 1: the RGB light

### Connect it

Use the **common-cathode HW-479 RGB module**. Its shared pin is marked `GND`, `-`, or common cathode.

| HW-479 label | ESP32 pin |
| --- | --- |
| `R` | GPIO16 |
| `G` | GPIO17 |
| `B` | GPIO18 |
| `GND` / common cathode | GND |

```text
GPIO16 ───────── RGB R
GPIO17 ───────── RGB G
GPIO18 ───────── RGB B
GND    ───────── RGB common / GND
```

Do not guess a pin from wire colour. Read the label on the module. If it is a common-**anode** LED or has a `VCC` pin instead of the four labels above, stop: this guide and firmware are for a common-cathode HW-479 module.

### Test it

Plug USB back in. The light should briefly glow blue-green at startup. Later, a dot is a short cyan flash, a dash is a longer orange flash, a recognised letter is green, and an unknown code is red.

### What is happening?

RGB means red, green and blue. The ESP32 very quickly turns each colour channel on and off. This is called **PWM** (pulse-width modulation). Our eyes blend the fast flashes into different colours. A common-cathode LED has one shared route to ground; the ESP32 controls the three colour routes separately.

## Stage 2: the Morse button

### Start with the built-in key

The ESP32 DevKit's **BOOT** button already works as a Morse key after flashing:
releasing records a short press as a dot or a long press as a dash. With the
RGB light and piezo connected, pressing starts the feedback immediately. The
key itself needs no wiring. Do not hold BOOT while resetting or flashing,
because it also selects the ESP32 bootloader at startup.

### Connect it

Add the external button below when a larger, breadboard-friendly key is wanted.

| Button side | ESP32 pin |
| --- | --- |
| One side | GPIO13 |
| Other side | GND |

```text
GPIO13 ───────── [ push button ] ───────── GND
```

Many small breadboard buttons have four legs. The two legs on one side are already joined inside the button, and the two on the other side are joined. Choose one leg from each side across the centre gap. Using two legs from the same side makes a connection that is always on.

### Test it

1. Tap the button quickly: cyan light means a dot.
2. Hold it for about half a second: orange light means a dash.
3. Tap once, then wait: `.` becomes `E` and gives green feedback.
4. Make `...`, then wait: it becomes `S`.

### What is happening?

The program gives GPIO13 an invisible gentle pull toward 3.3 V. This is an **internal pull-up resistor**. When the button is open, the pin reads HIGH. Pressing the button connects it to GND, so it reads LOW. The program measures how long that LOW lasts. It also ignores the tiny noisy wiggles a metal switch makes when it first closes; that is called **debouncing**.

## Stage 3: the rotary encoder

The encoder is an optional second Morse controller. Keep the button connected: the encoder's `SW` pin uses the same two connections as the button.

| Encoder label | ESP32 pin | Note |
| --- | --- | --- |
| `CLK` / `A` | GPIO21 | First turning signal |
| `DT` / `B` | GPIO19 | Second turning signal |
| `GND` / `C` | GND | Shared ground |
| `SW` | GPIO13 | Optional push switch |
| `+` / `VCC` | 3V3 | Only on an encoder module that has this pin |

```text
GPIO21 ───────── encoder CLK / A
GPIO19 ───────── encoder DT / B
GPIO13 ───────── encoder SW
GND    ───────── encoder GND / C
3V3    ───────── encoder + / VCC   (module only)
```

Turn left for a dot and right for a dash. If the direction feels backwards, unplug USB and swap only the `CLK` and `DT` wires.

### What is happening?

An encoder does not report an angle like a compass. It sends two clicking signals. One signal changes a moment before the other; the order tells the ESP32 which way it was turned. This two-signal idea is called **quadrature**.

## Stage 4A: passive piezo buzzer

The firmware already flashed in the first step supports this. A **passive** piezo needs a changing electrical signal to make a note; that is exactly what this project creates. An active buzzer makes its own single tone and is not the recommended part here.

| Piezo pin | ESP32 pin |
| --- | --- |
| `+` | GPIO27 |
| `-` | GND |

```text
GPIO27 ───────── piezo +
GND    ───────── piezo -
```

After reconnecting USB, the startup tune should play. Dots make short high beeps and dashes make longer lower beeps.

### What is happening?

The program wiggles GPIO27 thousands of times per second. The piezo ceramic bends a tiny amount each time, moving air and making sound. More wiggles per second means a higher note; a longer wiggle makes a longer Morse mark.

## Stage 4B: MAX98357A speaker

Add this for louder sound. It uses the same firmware as the piezo and can be
wired **with** the piezo; when both are connected, both play each game sound.

| MAX98357A label | ESP32 pin |
| --- | --- |
| `BCLK` | GPIO26 |
| `LRC` / `WS` | GPIO25 |
| `DIN` | GPIO22 |
| `GND` | GND |
| `VIN` | ESP32 `VIN` / `5V` |
| `SPK+`, `SPK-` | The two speaker wires only |

The speaker must connect to the amplifier, **never** directly to an ESP32 GPIO. `BCLK`, `LRC`, and `DIN` are digital sound messages, not speaker wires. This three-wire sound language is called **I2S**; the MAX98357A turns it into the stronger electrical signal a speaker needs.

For a small speaker powered from the ESP32 USB connection, keep the volume modest. If the ESP32 resets when sound plays, unplug it and ask the adult helper to check the power supply and wiring.

## Debug like a maker

| Symptom | Check one thing at a time |
| --- | --- |
| No RGB light at all | Is the shared LED pin really on ESP32 `GND`? Are `R`, `G`, and `B` on 16, 17, 18? |
| All RGB colours are wrong | Check the `R`/`G`/`B` labels; do not trust jumper-wire colours. |
| Button always acts pressed | On a four-leg button, move one wire to the opposite side of the centre gap. |
| Button does nothing | Check that it joins GPIO13 to GND, not GPIO13 to 3V3. |
| Encoder turns the wrong way | Swap GPIO21 and GPIO19 with USB unplugged. |
| Piezo is silent | Check it is passive and on GPIO27/GND; reflash the combined build if needed. |
| MAX98357A is silent | Check its wiring and that the speaker is on `SPK+`/`SPK-`, not ESP32 pins. |
| Board resets or becomes warm | Unplug now. Look for a short circuit or 5 V on a GPIO before reconnecting. |

## Invent your own experiment

1. Send `E` (`.`), `T` (`-`), then `SOS` (`... --- ...`).
2. Predict the light colour before pressing the button, then test your guess.
3. Swap the encoder direction on paper first: which two wires should change?
4. Open [the shared firmware](firmware/dottos-dash-common.yaml) with an adult. Find `GPIO13`, then find `Dash Threshold` (300 ms) and `Letter Pause` (600 ms). Those settings turn a simple switch into a Morse key: the first decides how long a press has to be to count as a dash, the second how long a rest has to be before the letter is read.

Every successful test is a tiny scientific experiment: make a prediction, change one thing, observe the result, and write down what happened.
