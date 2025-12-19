import Link from "next/link";
import { BlinkingOwlTherapy } from "@/components/therapies/blinking-owl-therapy";

export default function BlinkingOwlTherapyPage() {
  return (
    <div>
      <Link href="/gym" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        &larr; Back to Gym
      </Link>
      <BlinkingOwlTherapy />
    </div>
  );
}
