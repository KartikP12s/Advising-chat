import Link from "next/link";

interface BrandProps {
  compact?: boolean;
}

export function Brand({ compact = false }: BrandProps) {
  return (
    <Link className="brand" href="/" aria-label="Common Ground home">
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      {!compact && <span>Common Ground</span>}
    </Link>
  );
}
