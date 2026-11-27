/* The positions on the home page's timeline: plain context for the pieces.
   One entry per EMPLOYER (Globant is one position, with its clients on
   the pieces), newest first. The detail lives on /cv/.

   `line` is one sentence of context. DRAFTS, adapted from the CV and the
   current home page -- rewrite them in your own words. `role` for Globant
   is a draft too: the title changed across its five projects. */
import type { ImageMetadata } from 'astro';
import { pieces, type Piece } from './pieces';
/* The employers' logos. The rule: a logo is the picture on the company's
   LinkedIn page -- a 200x200 square, which fills the tile on Home.
   LinkedIn refuses automated requests for its pages, so the picture's
   address is copied by hand (right-click the logo on the company page,
   "Copy image address") and fetched with:

     npm run logo -- kaia-health "https://media.licdn.com/…"

   which saves src/assets/logos/kaia-health.jpg; then import it here. */
import justrelateLogo from '../assets/logos/justrelate.jpg';
import kaiaLogo from '../assets/logos/kaia-health.jpg';
import globantLogo from '../assets/logos/globant.jpg';

export interface Position {
  employer: string;
  /* The employer's logo: an imported image or a file in public/. Until
     there is one, the timeline shows the employer's initial instead. */
  logo?: ImageMetadata | string;
  /* No employer: the site's own diamond stands in for a logo. */
  ownMark?: boolean;
  role: string;
  /* Years only: the timeline is context, and a short span always fits
     beside the role. The months are on /cv/. */
  years: string;
  place: string;
  line: string;
  /* slugs from pieces.ts, in the order they appear under the position */
  pieces: string[];
}

export const positions: Position[] = [
  {
    employer: 'JustRelate Group',
    logo: justrelateLogo,
    role: 'Head of Design',
    years: '2024 – Present',
    place: 'Munich, Germany / Remote',
    line: 'Defining platform vision and building DesignOps from the ground up, for B2B software used by Marketing, Sales and Service teams.',
    /* One case study for the whole position, for now. Its four parts
       (platform vision, JR Coworker, the team and DesignOps, the brand
       refresh) have draft pages of their own under /work/justrelate/,
       kept but not listed anywhere; to split it again, list their slugs
       here (src/data/pieces.ts has them). */
    pieces: ['justrelate-head-of-design'],
  },
  {
    employer: 'Kaia Health',
    logo: kaiaLogo,
    role: 'Senior Product Designer, Design Systems Manager',
    years: '2021 – 2024',
    place: 'Munich, Germany / Remote',
    line: 'Kickstarted Kaia’s Kinetic Design System and led the team that built it, then moved to a Lead/DesignOps role in charge of tooling, processes, hiring and mentoring.',
    pieces: ['kaia-health-kinetic-design-system'],
  },
  {
    employer: 'Globant',
    logo: globantLogo,
    role: 'Senior Product Designer',
    years: '2017 – 2021',
    place: 'La Plata and Buenos Aires, Argentina / Remote',
    line: 'Product design and design systems for Globant’s clients: Google, Disney and Openbank.',
    pieces: ['google-small-business-advisors', 'openbank-design-system'],
  },
  {
    employer: 'Self-employed',
    ownMark: true,
    role: 'UX/UI, Web, Graphic & Visual Designer',
    years: '2009 – 2017',
    place: 'La Plata, Argentina / Remote',
    line: 'Branding, web and product design for clients in Argentina, Australia, Europe, the US and India.',
    pieces: [],
  },
];

/* Pieces that belong to no position. */
export const sideProjects: string[] = ['this-site'];

export const piecesOf = (slugs: string[]): Piece[] =>
  slugs.map((s) => {
    const p = pieces.find((x) => x.slug === s);
    if (!p) throw new Error(`No piece "${s}" in src/data/pieces.ts`);
    return p;
  });
