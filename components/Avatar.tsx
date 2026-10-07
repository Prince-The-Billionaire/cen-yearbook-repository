"use client";

import Image from "next/image";
import { imageProps } from "@/lib/cloudinary-image";
import { getInitials, hasValue } from "@/lib/student-utils";

interface AvatarProps {
  name: string;
  src?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  initialsClassName?: string;
}

/** Profile photo, or a gradient initials tile when the student has no photo yet. */
export default function Avatar({
  name,
  src,
  sizes,
  priority,
  className = "",
  initialsClassName = "text-5xl",
}: AvatarProps) {
  if (hasValue(src)) {
    return (
      <Image
        src={src}
        alt={name}
        fill
        sizes={sizes}
        priority={priority}
        {...imageProps(src)}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} (photo coming soon)`}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 font-display font-bold text-zinc-300 ${initialsClassName}`}
    >
      {getInitials(name)}
    </div>
  );
}
