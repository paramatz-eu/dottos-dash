# Contributing to Dotto's Dash

Thanks for taking an interest in the project. Dotto's Dash is a small,
offline-first learning project for children and their adult helpers. Changes
should keep that goal clear: friendly, understandable, safe and usable without
an account or internet connection.

## Before changing code

- Keep the web game usable with a keyboard, touch screen and the physical key.
- Keep the default experience in German friendly for a child; update the English
  and German documentation together when the instructions change.
- Do not add private Wi-Fi details, API keys, generated `.bin` files or
  `.esphome/` build products. They are deliberately ignored by Git.
- Prefer a small, focused change over a broad rewrite.

## Testing checklist

The game page exists three times — `index.html`, `de/index.html` and the German
template that `app.js` builds on the ESP32 — and all three share one `app.js`.
After any change to the markup or to the entity names in the firmware, run:

```sh
node --check app.js
node tools/check-web.mjs
```

The second command checks that the three copies still expose the same elements
and that `app.js` still addresses entity names the firmware defines. Both run in
CI on every push.

Run the relevant firmware build before sharing a change:

```sh
esphome run firmware/dottos-dash-piezo.yaml
```

If changing sound support, test the MAX98357A variant as well:

```sh
esphome run firmware/dottos-dash-max98357a.yaml
```

On hardware, check at least the following:

1. The ESP32 starts the `Dotto's Dash` Wi-Fi network.
2. `http://192.168.4.1/` opens the game and its offline build guide.
3. BOOT works as a Morse key without an external button.
4. A physical key begins its light and tone when pressed, and records a dot or
   dash when released.
5. The game is usable on a phone as well as on a desktop browser.

## Safety

This project is intended for children aged 10 and up with adult help for
flashing and wiring. Never instruct someone to connect 5 V to an ESP32 GPIO.
Ask for a wiring check before power is applied if a change affects the circuit.

## Pull requests and issues

Please describe what changed, how you tested it, and the ESP32 board or modules
used. A screenshot or short video is especially useful for changes to the game
interface or physical feedback.

By submitting a contribution, you confirm that you can license it under the
applicable terms in [LICENSING.md](LICENSING.md). Tell us about third-party
material and its licence before it is merged.
