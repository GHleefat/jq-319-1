import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Avatar({
  src,
  alt,
  size = "md",
  className,
}: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "rounded-full object-cover bg-ivory-dark",
        sizeClasses[size],
        className,
      )}
    />
  );
}
