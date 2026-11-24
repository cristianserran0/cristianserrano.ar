/* The pieces: one entry per case study, written once and read everywhere
   -- Home (under their position, src/data/positions.ts), each piece's
   first screen, the "Next piece" links, and the guide (also as plain data
   for its AI: /guide/pieces.json).

   `label` is one sentence, FIRST person like the rest of the site
   ("I built…"), or with no subject at all. DRAFTS, adapted from each
   page's meta description -- rewrite them in your own words.
   The guide and the search-engine data talk ABOUT Cristian, so they take
   the label through aboutCristian() below: "I built…" -> "Cristian built…".

   Order matters: "Next piece" and the guide's tours walk the featured
   pieces in this order. */
import type { ImageMetadata } from 'astro';
import kaiaCover from '../assets/work/work3-cover.png';
import googleCover from '../assets/work/work1-cover.png';
import openbankCover from '../assets/work/work2-cover.png';
import kaiaHero from '../assets/work/kaia-health-kinetic-design-system/hero-img.png';
import googleHero from '../assets/work/google-small-business-advisors/hero.jpg';
import openbankHero from '../assets/work/openbank-design-system/openbank-cover.png';
import insurancesHero from '../assets/work/openbank-insurances/hero.png';
import virtstartHero from '../assets/work/focusfreak-virtstart/hero.png';
import thisSiteHero from '../assets/work/this-site/hero.png';

export interface Piece {
  slug: string;
  title: string;
  /* The title on a title-only card (Home), where no client line stands
     beside it and the title has to name the client itself. */
  cardTitle?: string;
  client: string;
  years: string;
  label: string;
  /* Wall image and first-screen image. A string is a file in public/. */
  cover: ImageMetadata | string;
  hero: ImageMetadata | string;
  alt: string;
  /* The facts of the PROJECT, not of the position it belongs to (that is
     src/data/positions.ts, and Home shows it).
       time  how long the project ran -- left out where that is not known
             yet, never filled with the position's dates
       role  the part played in it. Not shown in the facts: the label says
             it better ("as the only designer assigned to it full time").
             Kept for the guide and for search engines. */
  facts: { category: string; platforms: string; role: string; time?: string };
  featured: boolean;
}

export const pieces: Piece[] = [
  {
    slug: 'justrelate-head-of-design',
    title: 'JustRelate Home',
    client: 'JustRelate',
    years: 'Dec 2024 – present',
    label: 'I defined the platform vision, unified a fragmented product suite, built DesignOps from scratch, and conceptualised the JR Coworker AI layer.',
    cover: '/work/justrelate-head-of-design/cover.png',
    hero: '/work/justrelate-head-of-design/cover.png',
    alt: 'JustRelate Home platform',
    facts: { category: 'B2B, SaaS, Design Operations, Design Leadership, AI', platforms: 'Web', role: 'Head of Design', time: 'Dec 2024 – present' },
    featured: true,
  },
  {
    slug: 'kaia-health-kinetic-design-system',
    title: 'Kinetic Design System',
    client: 'Kaia Health',
    years: '2021 - 2023',
    label: 'I built a cross-platform design system to support scalable product growth after two rounds of layoffs.',
    cover: kaiaCover,
    hero: kaiaHero,
    alt: 'Kinetic Design System',
    facts: { category: 'Start-up, Design Systems, Design Operations, Product Design', platforms: 'Web, iOS, Android', role: 'Product Designer, Design System Manager, Design Operations Lead', time: '2 years' },
    featured: true,
  },
  {
    slug: 'google-small-business-advisors',
    title: 'Small Business Advisors',
    cardTitle: 'Google Small Business Advisors',
    client: 'Globant + Google',
    years: '2020',
    label: 'Product design for Google My Business’s new advisory service, as the only designer assigned to it full time.',
    cover: googleCover,
    hero: googleHero,
    alt: 'Small Business Advisors',
    facts: { category: 'B2B, Customer service, Internal tools', platforms: 'Web', role: 'Product Designer', time: '8 months' },
    featured: true,
  },
  {
    slug: 'openbank-design-system',
    title: 'Openbank Design System',
    client: 'Globant + Openbank',
    years: '2018 - 2019',
    label: 'I led the design and development of Openbank Guidelines, a React-based design system, from proof of concept to a system the bank bought.',
    cover: openbankCover,
    hero: openbankHero,
    alt: 'Openbank Design System',
    facts: { category: 'B2E, Design systems, Internal tools', platforms: 'Web, iOS, Android', role: 'Product Designer', time: '1 year, 7 months' },
    featured: true,
  },
  {
    slug: 'this-site',
    title: 'This site',
    client: 'cristianserrano.ar',
    years: '2026',
    label: 'I designed this site as a small product: one token system behind every colour, type and space, and a guide that answers from the site itself on a free AI model.',
    cover: thisSiteHero,
    hero: thisSiteHero,
    alt: 'This site, with the guide open beside a case study',
    facts: { category: 'Design systems, Front-end, AI', platforms: 'Web', role: 'Design and front-end, with Claude Code as pair', time: '2026' },
    featured: true,
  },
  {
    slug: 'openbank-insurances',
    title: 'Insurances',
    client: 'Globant + Openbank',
    years: '2018',
    label: 'UX and visual design for the insurance products of Openbank, the digital bank of the Santander Group.',
    cover: insurancesHero,
    hero: insurancesHero,
    alt: 'Openbank Insurances',
    facts: { category: 'B2C, Banking.', platforms: 'Web, iOS, Android', role: 'UX/UI Designer', time: '5 months' },
    featured: false,
  },
  {
    slug: 'focusfreak-virtstart',
    title: 'Virtstart',
    client: 'FocusFreak',
    years: '2013 - 2014',
    label: 'Early product design for a virtual assistant platform, from the service’s conception to an MVP tested with real users.',
    cover: virtstartHero,
    hero: virtstartHero,
    alt: 'Virtstart',
    facts: { category: 'B2C, Productivity.', platforms: 'Web', role: 'Product Designer', time: '12 months' },
    featured: false,
  },
  /* The cases inside JustRelate Home, each on a page of its own
     (src/pages/work/justrelate/). Not featured: they are listed on Home
     under JustRelate, but are not in "Next piece" or the guide's tours
     yet. Labels and categories are drafts; the cover is the parent's,
     which is still missing. */
  {
    slug: 'justrelate/platform-vision',
    title: 'Platform vision',
    client: 'JustRelate',
    years: 'Dec 2024 – present',
    label: 'I reframed a suite of independent products as one platform, with JustRelate Home at its centre.',
    cover: '/work/justrelate-head-of-design/cover.png',
    hero: '/work/justrelate-head-of-design/cover.png',
    alt: 'Platform vision',
    facts: { category: 'B2B, SaaS, Product strategy', platforms: 'Web', role: 'Head of Design' },
    featured: false,
  },
  {
    slug: 'justrelate/jr-coworker',
    title: 'JR Coworker',
    client: 'JustRelate',
    years: 'Dec 2024 – present',
    label: 'I conceptualised JR Coworker, the AI layer on top of the JustRelate platform.',
    cover: '/work/justrelate-head-of-design/cover.png',
    hero: '/work/justrelate-head-of-design/cover.png',
    alt: 'JR Coworker',
    facts: { category: 'B2B, SaaS, AI', platforms: 'Web', role: 'Head of Design' },
    featured: false,
  },
  {
    slug: 'justrelate/design-team-designops',
    title: 'Design team & DesignOps',
    client: 'JustRelate',
    years: 'Dec 2024 – present',
    label: 'I turned designers working in silos into one team, and built DesignOps from scratch.',
    cover: '/work/justrelate-head-of-design/cover.png',
    hero: '/work/justrelate-head-of-design/cover.png',
    alt: 'Design team & DesignOps',
    facts: { category: 'Design Leadership, Design Operations', platforms: 'Web', role: 'Head of Design' },
    featured: false,
  },
  /* To be written. Its page only says so. */
  {
    slug: 'justrelate/brand-refresh',
    title: 'Brand refresh',
    client: 'JustRelate',
    years: 'Dec 2024 – present',
    label: '',
    cover: '/work/justrelate-head-of-design/cover.png',
    hero: '/work/justrelate-head-of-design/cover.png',
    alt: 'Brand refresh',
    facts: { category: 'Branding', platforms: 'Web', role: 'Head of Design' },
    featured: false,
  },
];

export const featured = pieces.filter((p) => p.featured);

export function piece(slug: string): Piece {
  const p = pieces.find((x) => x.slug === slug);
  if (!p) throw new Error(`No piece "${slug}" in src/data/pieces.ts`);
  return p;
}

/* The next featured piece, wrapping around; for an unfeatured piece, none. */
export function nextPiece(slug: string): Piece | undefined {
  const i = featured.findIndex((p) => p.slug === slug);
  return i === -1 ? undefined : featured[(i + 1) % featured.length];
}

export const href = (p: Piece) => `/work/${p.slug}/`;

/* A label as someone else would say it: for the guide, which speaks about
   Cristian, and for structured data. Only a leading "I " changes, so keep
   a label's first person to its first word. */
export const aboutCristian = (label: string) => label.replace(/^I /, 'Cristian ');
