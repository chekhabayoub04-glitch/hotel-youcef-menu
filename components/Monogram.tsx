export function Monogram({ className = "size-9 text-lg" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`grid place-items-center rounded-full border border-gold/60 bg-gradient-to-b from-[#f3dc9a] via-[#c9a24a] to-[#8a6420] font-serif font-bold text-[#141210] shadow-[0_0_18px_-4px_rgba(201,162,74,0.7)] ${className}`}
    >
      Y
    </span>
  );
}
