interface AvatarProps {
  seed: "moss" | "ember" | "sage" | "vale";
  size?: "small" | "medium" | "large";
  pulse?: boolean;
}

export function Avatar({ seed, size = "medium", pulse = false }: AvatarProps) {
  return (
    <span className={`avatar avatar-${seed} avatar-${size} ${pulse ? "avatar-pulse" : ""}`} aria-hidden="true">
      <span className="avatar-shape avatar-shape-one" />
      <span className="avatar-shape avatar-shape-two" />
    </span>
  );
}
