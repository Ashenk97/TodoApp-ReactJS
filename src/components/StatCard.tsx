export default function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-[#0b1020]/35 px-3 py-2.5">
      <p className="m-0 text-xs tracking-wide text-[var(--muted)] uppercase">{label}</p>
      <p className="m-0 text-2xl font-semibold">{value}</p>
    </div>
  );
}
