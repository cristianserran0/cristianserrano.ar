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
  // The page title's size (tokens/type.css, "EXPERIMENT").
  { key: 'display-size', label: 'Page title size', options: [
    { value: '60', label: '60px' },
    { value: '54', label: '54px' },
  ] },
  // The small label over or beside something: a fact's name, the client and years on a card (tokens/type.css, "EXPERIMENT").
  { key: 'labels', label: 'Small labels', options: [
    { value: 'caps', label: 'Bold capitals, 13px' },
    { value: '13-medium', label: 'Medium, 13px, no capitals' },
    { value: '14-regular', label: 'Regular, 14px, no capitals' },
  ] },
];
