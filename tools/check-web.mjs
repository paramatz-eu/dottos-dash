// Guards the invariants that hold the three copies of the game together:
// index.html (English), de/index.html (German) and the ESP32 template inside
// app.js. They share one app.js, so an element that exists in only one copy is
// a silent breakage that no browser test on the other copy would catch.
//
// Run with: node tools/check-web.mjs

import { readFileSync, existsSync } from 'node:fs';
import { buildGuideMarkup, embeddedGuideIn, GUIDE_START, GUIDE_END } from './embed-build-guide.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => readFileSync(join(root, name), 'utf8');

// Controls that only exist on the ESP32-hosted page. app.js must null-guard each
// of these, because the two browser copies never contain them. Adding an id here
// is a deliberate decision, not routine maintenance.
const ESP_ONLY_IDS = new Set([
  'hardware-status',
  'wifi-setup-form',
  'wifi-ssid',
  'wifi-password',
  'wifi-connect-button',
  'wifi-setup-status',
  'ota-update-form',
  'ota-firmware',
  'ota-install-button',
  'ota-progress',
  'ota-status',
]);

const problems = [];
const fail = (message) => problems.push(message);

const app = read('app.js');
const en = read('index.html');
const de = read('de/index.html');

const embeddedStart = app.indexOf('function renderEmbeddedEspGame');
const embeddedEnd = app.indexOf('if (ESP_EMBEDDED)');
if (embeddedStart < 0 || embeddedEnd < embeddedStart) {
  console.error('check-web: could not locate renderEmbeddedEspGame() in app.js.');
  process.exit(1);
}
const embedded = app.slice(embeddedStart, embeddedEnd);

// The offline build lesson inside the ESP template is generated from de/build.html
// by tools/embed-build-guide.mjs. Its section ids belong to that document, not to
// the game page, so they are checked against their own source (rule 5) instead of
// against index.html.
const guideOpens = embedded.indexOf(GUIDE_START);
const guideCloses = embedded.indexOf(GUIDE_END);
const embeddedGame = guideOpens < 0 || guideCloses < guideOpens
  ? embedded
  : embedded.slice(0, guideOpens) + embedded.slice(guideCloses + GUIDE_END.length);

const idsIn = (source) => new Set([...source.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
const classesIn = (source) => new Set(
  [...source.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].trim().split(/\s+/)),
);
const missing = (wanted, present) => [...wanted].filter((value) => !present.has(value));

const copies = [
  { label: 'index.html', ids: idsIn(en), classes: classesIn(en), esp: false },
  { label: 'de/index.html', ids: idsIn(de), classes: classesIn(de), esp: false },
  { label: 'app.js embedded ESP template', ids: idsIn(embeddedGame), classes: classesIn(embeddedGame), esp: true },
];

// 1. Every element app.js reaches for must exist in each copy that should have it.
const wantedIds = new Set([...app.matchAll(/\$\('([^']+)'\)/g)].map((m) => m[1]));
const wantedClasses = new Set(
  [...app.matchAll(/querySelector(?:All)?\('\.([A-Za-z0-9_-]+)'\)/g)].map((m) => m[1]),
);

for (const copy of copies) {
  const expectedIds = copy.esp ? wantedIds : new Set(missing(wantedIds, ESP_ONLY_IDS));
  const absentIds = missing(expectedIds, copy.ids);
  if (absentIds.length) fail(`${copy.label}: app.js looks up missing id(s): ${absentIds.join(', ')}`);

  const absentClasses = missing(wantedClasses, copy.classes);
  if (absentClasses.length) fail(`${copy.label}: app.js queries missing class(es): ${absentClasses.map((c) => `.${c}`).join(', ')}`);
}

// 2. The two browser copies are translations of each other, so their ids must match
//    exactly. Only the human-readable text may differ.
const [enCopy, deCopy, espCopy] = copies;
const onlyEn = missing(enCopy.ids, deCopy.ids);
const onlyDe = missing(deCopy.ids, enCopy.ids);
if (onlyEn.length) fail(`de/index.html is missing id(s) present in index.html: ${onlyEn.join(', ')}`);
if (onlyDe.length) fail(`index.html is missing id(s) present in de/index.html: ${onlyDe.join(', ')}`);

// 3. The ESP template is the superset: everything in index.html plus the ESP-only
//    controls, and nothing else undeclared.
const missingFromEsp = missing(enCopy.ids, espCopy.ids);
if (missingFromEsp.length) fail(`app.js embedded ESP template is missing id(s) present in index.html: ${missingFromEsp.join(', ')}`);

const undeclaredEspExtras = missing(espCopy.ids, enCopy.ids).filter((id) => !ESP_ONLY_IDS.has(id));
if (undeclaredEspExtras.length) {
  fail(
    `app.js embedded ESP template has id(s) not in index.html and not declared ESP-only: ${undeclaredEspExtras.join(', ')}` +
    '\n    Either add them to index.html and de/index.html, or list them in ESP_ONLY_IDS and null-guard their use.',
  );
}

// 4. ESPHome web_server v1 matches REST URLs on an entity's raw display name, and
//    its /events payload carries `name_id` as "{domain}/{name}". app.js therefore
//    depends on these exact names; renaming one in the YAML breaks the page with
//    no compile error.
//      rest — app.js builds a REST URL from the verbatim name, so the literal must
//             still appear in app.js.
//      sse  — app.js instead recognises the entity by this substring, after
//             lowercasing the identity and collapsing punctuation to spaces.
const COUPLED_ENTITIES = [
  { name: 'Letter Pause', domain: 'number', rest: true, sse: 'letter pause' },
  { name: 'Dash Threshold', domain: 'number', rest: true, sse: 'dash threshold' },
  { name: 'Web Dot', domain: 'button', rest: true },
  { name: 'Web Dash', domain: 'button', rest: true },
  { name: 'Morse Event', domain: 'text_sensor', sse: 'morse event' },
  { name: 'Morse Key (BOOT)', domain: 'binary_sensor', sse: 'morse key' },
  { name: 'Morse Key (external)', domain: 'binary_sensor', sse: 'morse key' },
];

const firmware = read('firmware/dottos-dash-common.yaml');
const firmwareNames = new Set([...firmware.matchAll(/^\s*name:\s*"([^"]+)"/gm)].map((m) => m[1]));

for (const entity of COUPLED_ENTITIES) {
  if (!firmwareNames.has(entity.name)) {
    fail(
      `firmware/dottos-dash-common.yaml no longer defines the ${entity.domain} named "${entity.name}", ` +
      'which app.js addresses by that exact name.',
    );
    continue;
  }
  if (entity.rest && !app.includes(`'${entity.name}'`)) {
    fail(
      `app.js no longer builds a REST URL from the literal "${entity.name}" — ` +
      'update COUPLED_ENTITIES if the coupling was intentionally removed.',
    );
  }
  if (entity.sse) {
    // Mirror the normalisation app.js applies to the SSE identity: web_server sends
    // name_id as "{domain}/{name}", which app.js lowercases and de-punctuates.
    const identity = `${entity.domain}/${entity.name}`.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
    if (!identity.includes(entity.sse)) {
      fail(`"${entity.name}" no longer matches the SSE filter "${entity.sse}", so app.js would ignore its events.`);
    }
    if (!app.includes(`'${entity.sse}'`)) {
      fail(`app.js no longer filters SSE events on "${entity.sse}", which "${entity.name}" relies on.`);
    }
  }
}

// 5. Every page at the root is published in German too. Shipping one without its
//    translation strands half the audience on a dead link.
for (const page of ['index.html', 'build.html', 'flash.html']) {
  const german = join(root, 'de', page);
  if (!existsSync(german)) fail(`de/${page} is missing — every root page needs its German counterpart.`);
}

// 6. Those SSE filters are substring matches, so a newly added entity can silently
//    steal another one's events. Every firmware entity must match at most the
//    filter it is supposed to match.
const sseFilters = [...new Set(COUPLED_ENTITIES.filter((e) => e.sse).map((e) => e.sse))];
const expectedFilter = new Map(COUPLED_ENTITIES.filter((e) => e.sse).map((e) => [e.name, e.sse]));

for (const name of firmwareNames) {
  // The domain prefix is unknown for entities outside COUPLED_ENTITIES, but every
  // ESPHome domain is lowercase a-z + underscore, which normalises to plain words
  // and cannot itself introduce one of these two-word filters.
  const identity = name.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
  for (const filter of sseFilters) {
    if (identity.includes(filter) && expectedFilter.get(name) !== filter) {
      fail(
        `firmware entity "${name}" matches the SSE filter "${filter}" but is not the entity app.js expects there. ` +
        'Rename it, or app.js will treat its state updates as another entity\'s.',
      );
    }
  }
}

// 5. The ESP32 has no internet, so it carries its own copy of the build lesson.
//    That copy is generated, never hand-edited: an edit to de/build.html that is
//    not regenerated would ship a stale lesson to every flashed board.
const embeddedGuide = embeddedGuideIn(app);
if (embeddedGuide === null) {
  fail(
    'app.js no longer contains the BUILD-GUIDE markers, so the offline build lesson cannot be regenerated. ' +
    'Restore them inside the build-guide details in renderEmbeddedEspGame().',
  );
} else if (embeddedGuide !== buildGuideMarkup()) {
  fail('app.js: the embedded build lesson has drifted from de/build.html. Run: node tools/embed-build-guide.mjs');
}

if (problems.length) {
  console.error('check-web failed:\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(
  `check-web: ok — ${wantedIds.size} ids and ${wantedClasses.size} class hooks consistent across ` +
  `index.html, de/index.html and the embedded ESP template; ` +
  `${COUPLED_ENTITIES.length} firmware entity names resolved; `
  + `the offline build lesson matches de/build.html.`,
);
