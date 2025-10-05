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


export function CheckupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="20"
        y="10"
        width="160"
        height="100"
        rx="10"
        className="fill-muted"
      />
      <path
        d="M50 60 L80 80 L150 30"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeGymIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="60" cy="60" r="30" className="fill-muted" />
      <path
        d="M60 40 L60 80 M40 60 L80 60"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M150 60 L120 60"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M170 60 L180 60"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProfileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="20"
        y="80"
        width="20"
        height="30"
        rx="5"
        className="fill-muted"
      />
      <rect
        x="50"
        y="60"
        width="20"
        height="50"
        rx="5"
        className="fill-muted"
      />
      <rect
        x="80"
        y="40"
        width="20"
        height="70"
        rx="5"
        className="fill-accent"
      />
      <rect
        x="110"
        y="20"
        width="20"
        height="90"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        className="fill-primary/50"
      />
      <rect
        x="140"
        y="50"
        width="20"
        height="60"
        rx="5"
        className="fill-muted"
      />
       <path d="M110 20 L130 20" stroke="currentColor" strokeWidth="2" />
       <path d="M110 110 L130 110" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
