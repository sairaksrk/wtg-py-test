"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchPrivateFile } from "@/libs/api/storage.api";
import { cn } from "@/utils/helpers";

interface UserProfileAvatarProps {
  imagePath?: string | null;
  alt?: string;
  className?: string;
}

function normalizeImagePath(imagePath?: string | null): string | null {
  if (imagePath == null) return null;
  if (typeof imagePath !== "string") return null;
  const trimmed = imagePath.trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower === "null" || lower === "undefined") return null;
  return trimmed;
}

export function UserProfileAvatar({
  imagePath,
  alt = "Profile Image",
  className = "size-full rounded-full object-cover",
}: UserProfileAvatarProps) {
  const raw = normalizeImagePath(imagePath);
  const isAbsolute = Boolean(raw && /^https?:\/\//i.test(raw));
  const fetchPrivate = Boolean(raw && !isAbsolute);
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!fetchPrivate || !raw) {
      setBlob(null);
      return;
    }

    let cancelled = false;

    void fetchPrivateFile(raw)
      .then((fetchedBlob) => {
        if (!cancelled) setBlob(fetchedBlob);
      })
      .catch(() => {
        if (!cancelled) setBlob(null);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchPrivate, raw]);

  const blobObjectUrl = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(() => {
    return () => {
      if (blobObjectUrl) URL.revokeObjectURL(blobObjectUrl);
    };
  }, [blobObjectUrl]);

  const displayUrl = isAbsolute ? raw : blobObjectUrl;

  if (displayUrl) {
    return (
      // eslint-disable-next-line next/no-img-element -- blob URL or external API URL
      <img src={displayUrl} alt={alt} className={className} />
    );
  }

  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-full bg-accent", className)}
    />
  );
}
