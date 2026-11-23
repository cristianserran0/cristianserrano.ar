/* The positions on the home page's timeline: plain context for the pieces.
   One entry per EMPLOYER (Globant is one position, with its clients on
   the pieces), newest first. The detail lives on /cv/.

   `line` is one sentence of context. DRAFTS, adapted from the CV and the
   current home page -- rewrite them in your own words. `role` for Globant
   is a draft too: the title changed across its five projects. */
import type { ImageMetadata } from 'astro';
import { pieces, type Piece } from './pieces';

export interface Position {
  employer: string;
  /* The employer's logo: an imported image or a file in public/. Until
     there is one, the timeline shows the employer's initial instead. */
  logo?: ImageMetadata | string;
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
    employer: 'JustRelate',
    role: 'Head of Design',
    years: '2024 – Present',
    place: 'Munich, Germany / Remote',
    line: 'Defining platform vision and building DesignOps from the ground up, for B2B software used by Marketing, Sales and Service teams.',
    pieces: ['justrelate/platform-vision', 'justrelate/jr-coworker', 'justrelate/design-team-designops', 'justrelate/brand-refresh'],
  },
  {
    employer: 'Kaia Health',
    role: 'Senior Product Designer, Design Systems Manager',
    years: '2021 – 2024',
    place: 'Munich, Germany / Remote',
    line: 'Kickstarted Kaia’s Kinetic Design System and led the team that built it, then moved to a Lead/DesignOps role in charge of tooling, processes, hiring and mentoring.',
    pieces: ['kaia-health-kinetic-design-system'],
  },
  {
    employer: 'Globant',
    role: 'Senior Product Designer',
    years: '2017 – 2021',
    place: 'La Plata and Buenos Aires, Argentina / Remote',
    line: 'Product design and design systems for Globant’s clients: Google, Disney and Openbank.',
    pieces: ['google-small-business-advisors', 'openbank-design-system'],
  },
  {
    employer: 'Self-employed',
    role: 'UX/UI, Web, Graphic & Visual Designer',
    years: '2009 – 2017',
    place: 'Remote',
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
