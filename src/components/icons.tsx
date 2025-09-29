import type { SVGProps } from "react";

export function VisionaryLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function StereopsisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 11.5A8.5 8.5 0 0 1 8.5 3h7a8.5 8.5 0 0 1 7.5 8.5" />
      <path d="M2.5 11.5 2 21" />
      <path d="m14 3 1-1" />
      <path d="m10 3 1-1" />
      <path d="m22 21-1.5-9.5" />
      <path d="M8.5 3a4.5 4.5 0 0 0-4.27 3" />
      <path d="M15.5 3a4.5 4.5 0 0 1 4.27 3" />
      <path d="M2 21h20" />
    </svg>
  );
}
