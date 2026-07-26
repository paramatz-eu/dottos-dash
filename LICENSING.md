# Licensing Dotto's Dash

Dotto's Dash combines software, learning material and future hardware-design
sources. Each category has a licence suited to that material; see the complete
licence texts in [`LICENSES/`](LICENSES/README.md).

| Material | Licence | Where it applies |
| --- | --- | --- |
| Software | [MIT](LICENSE) | Firmware YAML and headers, JavaScript, CSS, workflows, and the executable markup in the HTML pages. |
| Learning documentation | [CC BY-SA 4.0](LICENSES/CC-BY-SA-4.0.txt) | The prose, diagrams, tables and other educational content in the Markdown and HTML guides. |
| Hardware design sources | [CERN-OHL-W-2.0](LICENSES/CERN-OHL-W-2.0.txt) | Hardware source placed under [`hardware/`](hardware/README.md), including schematics, PCB CAD, enclosure CAD, manufacturing files and wiring drawings. |
| Project name and logos | [Name and logo policy](TRADEMARKS.md) | The name “Dotto's Dash” and any project logo. They are not licensed by the licences above. |

## Applying the licences

The root [`LICENSE`](LICENSE) remains the exact MIT licence text for code.
The documentation and hardware licences override it for the material listed in
the table. A file which combines code and learning content, such as a web page,
is licensed by material: its code is MIT and its human-readable educational
content is CC BY-SA 4.0. The two grants are independent.

New hardware source must carry a copyright and licence notice. For example:

```text
Copyright 2026 Dotto's Dash contributors
SPDX-License-Identifier: CERN-OHL-W-2.0
Source Location: https://github.com/paramatz-eu/dottos-dash
```

Do not place generated firmware images, third-party libraries, component
datasheets or supplier manufacturing files under these project licences unless
their rights holder permits it. Keep their original notices and licence terms.

## Contributions

By submitting a contribution, you confirm that you have the right to submit it
and license it under the licence that applies to its material category above.
If that is not possible, identify the third-party material and its terms in the
pull request before it is merged.
