import { GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";

const educationTopics = [
  {
    title: "Understanding Glaucoma",
    description: "Learn about the causes, symptoms, and treatments for glaucoma.",
    href: "/education/glaucoma"
  },
  {
    title: "Living with Dry Eye",
    description: "Tips and strategies for managing chronic dry eye syndrome.",
    href: "/education/dry-eye"
  },
  {
    title: "Cataracts: What You Need to Know",
    description: "An overview of cataracts, from prevention to surgery.",
    href: "/education/cataracts"
  },
  {
    title: "Protecting Your Eyes from Digital Strain",
    description: "Learn exercises and habits to reduce eye fatigue from screens.",
    href: "/education/digital-strain"
  }
];


export default function EducationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Education Center</h1>
        <p className="text-muted-foreground">
          Learn more about eye health, conditions, and preventative care.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {educationTopics.map((topic) => (
          <Link href={topic.href} key={topic.title}>
            <Card className="h-full hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
