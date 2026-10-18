/** Flat maroon hero backdrop. The wordmark itself is drawn by the fixed header,
 * so this section only reserves the first viewport and anchors the scroll
 * transition; nothing here touches the mark's transform.
 */
export function SignatureHero() {
  return <section id="signature-hero" className="signature-hero" aria-labelledby="signature-heading">
    <h1 className="sr-only" id="signature-heading">HAVELI</h1>
  </section>;
}
