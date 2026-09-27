/** Ambient aurora blobs used as the app background. */
export function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="gsa-float absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-primary/30 blur-[120px]" />
      <div className="gsa-drift absolute top-1/3 -right-24 h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-[120px]" />
      <div className="gsa-float absolute bottom-0 left-1/4 h-[26rem] w-[26rem] rounded-full bg-mint/15 blur-[120px]" />
    </div>
  );
}
