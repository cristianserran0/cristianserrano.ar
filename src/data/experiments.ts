/* Experiments: versions of something on trial, side by side, switched
   from the Experiments menu in the header (not shown on the live site).

   To run one, add it here and write its styles against the attribute:

     { key: 'shell', label: 'Page without the guide', options: [
       { value: 'panel', label: 'Always a panel' },     // the first is what the site does now
       { value: 'a', label: 'Edge to edge' },
     ] }

     [experiment-shell="a"] .page { … }

   Choosing an option sets <html experiment-KEY="VALUE"> (nothing for
   the first option), kept for the visit; ?experiment=KEY:VALUE in an
   address does the same. When it is decided: make the winner the rule,
   delete the rest and the entry here. With an empty list the
   button is unavailable and its tooltip says nothing is running. */

export interface Experiment {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

export const experiments: Experiment[] = [
  // 19 or 18 for the four text styles at that size: lead, subtitle, subheading, meta (tokens/type.css, "EXPERIMENT").
  { key: 'lead-size', label: 'Lead, subtitle, h4 and dates', options: [
    { value: '19', label: '19px' },
    { value: '18', label: '18px' },
  ] },
];
