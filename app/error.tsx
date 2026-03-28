// app/error.tsx (or app/dashboard/error.tsx)
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import ErrorComponent from "@/components/common/error";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return <ErrorComponent statusCode={500} message="Something went wrong!" />;
}
