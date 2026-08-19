// The ESP32 serves the game from its own flash and its access point has no
// internet, so the full build lesson has to travel inside the firmware. Keeping
// a second copy by hand would drift, so the embedded copy is generated from
// de/build.html — the same document the website publishes — and spliced into the
// ESP template in app.js between the BUILD-GUIDE markers.
//
// Run after editing de/build.html:  node tools/embed-build-guide.mjs
// tools/check-web.mjs fails when the two have drifted apart.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const GUIDE_START = '<!-- BUILD-GUIDE:START -->';
export const GUIDE_END = '<!-- BUILD-GUIDE:END -->';

// Everything below the lesson's own hero: the ESP page already has a heading, a
// language link and a "back to the game" link of its own.
export function buildGuideMarkup() {
  const source = readFileSync(join(root, 'de/build.html'), 'utf8');
  const start = source.indexOf('<div class="lesson-layout">');
  const end = source.indexOf('</main>');
  if (start < 0 || end < start) {
    throw new Error('de/build.html: could not find the lesson layout to embed.');
  }
  let markup = source.slice(start, end).trimEnd();

  // A link to a repository file cannot resolve on an offline access point, so it
  // becomes the path in plain text — still findable, just not clickable.
  markup = markup.replace(
    /<a href="\.\.\/firmware\/([^"]+)">([^<]*)<\/a>/g,
    '$2 (<code>firmware/$1</code>)',
  );

  const outgoing = [...markup.matchAll(/href="([^"#][^"]*)"/g)].map((m) => m[1]);
  if (outgoing.length) {
    throw new Error(
      `de/build.html: the lesson layout links out to ${outgoing.join(', ')}, which cannot ` +
      'resolve on the ESP32. Teach this script how to rewrite it first.',
    );
  }
  // The markup is spliced into a JavaScript template literal in app.js.
  if (markup.includes('`') || markup.includes('${')) {
    throw new Error('de/build.html: markup contains ` or ${, which would break the template literal in app.js.');
  }
  return markup;
}

export function embeddedGuideIn(app) {
  const start = app.indexOf(GUIDE_START);
  const end = app.indexOf(GUIDE_END);
  if (start < 0 || end < start) return null;
  return app.slice(start + GUIDE_START.length, end).trim();
}

function main() {
  const path = join(root, 'app.js');
  const app = readFileSync(path, 'utf8');
  const start = app.indexOf(GUIDE_START);
  const end = app.indexOf(GUIDE_END);
  if (start < 0 || end < start) {
    console.error(`embed-build-guide: could not find ${GUIDE_START} … ${GUIDE_END} in app.js.`);
    process.exit(1);
  }
  const markup = buildGuideMarkup();
  const next = `${app.slice(0, start + GUIDE_START.length)}\n${markup}\n${app.slice(end)}`;
  if (next === app) {
    console.log('embed-build-guide: already up to date.');
    return;
  }
  writeFileSync(path, next);
  console.log(`embed-build-guide: embedded ${markup.length} bytes from de/build.html into app.js.`);
}

if (process.argv[1] && process.argv[1].endsWith('embed-build-guide.mjs')) main();
