import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export const photographs = [
  {
    slug: 'japanese-tweet-ex1',
    fileName: 'ThinkPad X1 Carbon Japanese Keyboard.jpg',
    alt: 'Close view of a Japanese-layout ThinkPad keyboard.',
    creator: 'TAKA@P.P.R.S',
    creatorUrl: 'https://www.flickr.com/photos/26414679@N05/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:ThinkPad_X1_Carbon_Japanese_Keyboard.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    slug: 'in-life-there-is-rain',
    fileName: 'New York Rain 3 (4669030741).jpg',
    alt: 'Pedestrians and cars on a rain-soaked Manhattan street at dusk.',
    creator: 'Tony Hisgett',
    creatorUrl: 'https://www.flickr.com/people/hisgett/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:New_York_Rain_3_(4669030741).jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
    objectPosition: 'center 58%',
  },
  {
    slug: 'yerkes-dodson-law',
    fileName: 'Robert-Yerkes.jpg',
    alt: 'Psychologist Robert Yerkes seated at his desk at Harvard University.',
    creator: 'Unknown photographer',
    creatorUrl: 'https://commons.wikimedia.org/wiki/File:Robert-Yerkes.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Robert-Yerkes.jpg',
    license: 'Public domain (US)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    objectPosition: 'center 35%',
  },
  {
    slug: 'on-the-benign-unprovability-of-our',
    fileName: 'Close up shot of the human eye, 9 August 2024.jpg',
    alt: 'Close photograph of a human eye and iris.',
    creator: 'Kookaaa',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Kookaaa',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Close_up_shot_of_the_human_eye,_9_August_2024.jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    slug: 'on-the-unprovability-of-our-perception',
    fileName: 'Camera Obscura MET DP202274.jpg',
    alt: 'William Henry Fox Talbot’s early photograph of a camera obscura.',
    creator: 'William Henry Fox Talbot',
    creatorUrl: 'https://www.metmuseum.org/art/collection/search/289224',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Camera_Obscura_MET_DP202274.jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    slug: 'pressure',
    fileName: 'Macro Pressure Gauge (14623199976).jpg',
    alt: 'Close view of the dial and needle on a pressure gauge.',
    creator: 'Dyroc',
    creatorUrl: 'https://www.flickr.com/people/57875964@N08/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Macro_Pressure_Gauge_(14623199976).jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  {
    slug: 'they-say-you-snooze-you-lose',
    fileName: 'Roman numerals on alarm clock (Unsplash).jpg',
    alt: 'A small metal alarm clock with Roman numerals.',
    creator: 'Ales Krivec',
    creatorUrl: 'https://unsplash.com/@aleskrivec',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Roman_numerals_on_alarm_clock_(Unsplash).jpg',
    license: 'CC0 1.0',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  {
    slug: 'treehacks-application',
    fileName: 'Stanford University campus, Palo Alto, California 03.jpg',
    alt: 'Arcades and tiled roofs on the Stanford University campus.',
    creator: 'GualdimG',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:GualdimG',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stanford_University_campus,_Palo_Alto,_California_03.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    slug: 'unfair',
    fileName: 'The Constitution of the United States - DPLA - dd872eac3769e46b78b056b8eb5ab9ec.jpeg',
    alt: 'A copy of the United States Constitution displayed beside its protective case.',
    creator: 'U.S. National Archives',
    creatorUrl: 'https://www.archives.gov/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Constitution_of_the_United_States_-_DPLA_-_dd872eac3769e46b78b056b8eb5ab9ec.jpeg',
    license: 'Public domain (US)',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
  },
  {
    slug: 'when-people-ask-you-to-do-stuff',
    fileName: 'People engaging in conversation.jpg',
    alt: 'People talking together on a sidewalk in Owen Sound, Ontario.',
    creator: 'Alectrevelyan006',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Alectrevelyan006',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:People_engaging_in_conversation.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    slug: 'why-csgo-is-a-better-sport-than-hero-shooter-fps-esports',
    fileName: 'HAVU eSM 2023.jpg',
    alt: 'Counter-Strike players competing together at the 2023 Finnish esports championship.',
    creator: 'Richard Häyrinen',
    creatorUrl: 'https://commons.wikimedia.org/wiki/File:HAVU_eSM_2023.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:HAVU_eSM_2023.jpg',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
  {
    slug: 'coding-questions',
    fileName: 'Woman Conducting an Interview.jpg',
    alt: 'Two people seated across a table during a job interview.',
    creator: 'Amtec Photos',
    creatorUrl: 'https://www.flickr.com/people/141761303@N08/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Woman_Conducting_an_Interview.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    slug: 'leetcode-352-data-stream-as-disjoint-intervals',
    fileName: 'Łódź Kaliska railway clock train departure board.jpg',
    alt: 'Clock and split-flap departure board at Łódź Kaliska railway station.',
    creator: 'Jarosław Góralczyk',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Triskaidekafil',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Łódź_Kaliska_railway_clock_train_departure_board.jpg',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    slug: 'leetcode-355-design-twitter',
    fileName: 'Twitter headquarters in San Francisco (TK2).JPG',
    alt: 'The former Twitter headquarters in San Francisco.',
    creator: 'Tobias Kleinlercher',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:TheTokl',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Twitter_headquarters_in_San_Francisco_(TK2).JPG',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  {
    slug: 'the-journey-begins',
    fileName: '2017 03 Antonovich Trail H.jpg',
    alt: 'A narrow hiking trail winding through green hills in California.',
    creator: 'Zuoyue Wang',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Zuoyuewang',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:2017_03_Antonovich_Trail_H.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    slug: 'i-wish-i-could-go-back-to-coding-for-fun',
    fileName: 'Grace Hopper and UNIVAC.jpg',
    alt: 'Grace Hopper and colleagues at a UNIVAC computer in 1957.',
    creator: 'Smithsonian Institution',
    creatorUrl: 'https://www.si.edu/',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Grace_Hopper_and_UNIVAC.jpg',
    license: 'No known copyright restrictions',
    licenseUrl: 'https://www.si.edu/termsofuse',
  },
  {
    slug: 'how-do-you-stay-focused-when-your',
    fileName: 'Cat on balcony.jpg',
    alt: 'A long-haired ginger cat perched on a balcony wall.',
    creator: 'Filippo Salamone',
    creatorUrl: 'https://www.flickr.com/people/34707874@N03',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cat_on_balcony.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  {
    slug: 'american-urbanism-focuses-too-much',
    fileName: 'W 56th St 8th Av 03.jpg',
    alt: 'The green bicycle lane on Eighth Avenue at West 56th Street in Manhattan.',
    creator: 'Tdorante10',
    creatorUrl: 'https://commons.wikimedia.org/wiki/User:Tdorante10',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:W_56th_St_8th_Av_03.jpg',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
];

function safeFileName(fileName) {
  return `source-${fileName.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').toLowerCase()}`;
}

async function download(photo, destination) {
  const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(photo.fileName)}`;
  const response = await fetch(url, { headers: { 'user-agent': 'HakanBlogArchive/1.0 (https://hakanalpay.com/blog/)' } });
  if (!response.ok) throw new Error(`${photo.slug}: ${response.status} ${response.statusText}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return response.url;
}

const selected = new Set(process.argv.slice(2));

for (const photo of photographs) {
  if (selected.size > 0 && !selected.has(photo.slug)) continue;
  const outputDir = join(root, 'public', 'images', 'editorial', photo.slug);
  const sourceName = safeFileName(photo.fileName);
  const sourcePath = join(outputDir, sourceName);
  const livePath = join(outputDir, 'hero.webp');
  await mkdir(outputDir, { recursive: true });

  let originalImageUrl;
  try {
    originalImageUrl = JSON.parse(await readFile(join(outputDir, 'source.json'), 'utf8')).originalImageUrl;
    await readFile(sourcePath);
  } catch {
    originalImageUrl = await download(photo, sourcePath);
  }

  execFileSync('magick', [
    sourcePath,
    '-auto-orient',
    '-resize', '1600x900^',
    '-gravity', 'center',
    '-extent', '1600x900',
    '-strip',
    '-quality', '82',
    livePath,
  ]);

  await writeFile(join(outputDir, 'source.json'), `${JSON.stringify({
    ...photo,
    originalImageUrl,
    downloadedFile: basename(sourcePath),
    liveDerivative: basename(livePath),
    derivativeNotes: 'Auto-oriented, center-cropped to 1600 × 900, WebP quality 82.',
  }, null, 2)}\n`);
  console.log(`Imported ${photo.slug}: ${basename(sourcePath)}`);
}
