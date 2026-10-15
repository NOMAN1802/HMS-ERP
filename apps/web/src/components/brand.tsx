// Brand mark with a name. Used for both brand slots (ADR-022 section 12): the tenant's logo and
// name inside the shell, and the product on the signed-out screens. Until a hospital exists the
// Bytespate logo is the placeholder tenant logo. The mark carries pure red and green, so it stays
// away from status badges (DESIGN.md, Logo Quarantine Rule). Implements: T-UI-02.
import Image from 'next/image';

export function Brand({ name }: { name: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <Image
        src="/brand/bytespate-mark.png"
        alt=""
        width={32}
        height={32}
        className="shrink-0 rounded-control"
        priority
      />
      <span className="truncate font-heading font-semibold text-heading">{name}</span>
    </span>
  );
}
