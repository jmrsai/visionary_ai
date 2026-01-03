"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const suggestedTopics = [
  {
    title: "Understanding Glaucoma",
    slug: "glaucoma"
  },
  {
    title: "Living with Dry Eye",
    slug: "dry-eye-syndrome"
  },
  {
    title: "Cataracts: What You Need to Know",
    slug: "cataracts"
  },
  {
    title: "Macular Degeneration",
    slug: "macular-degeneration"
  }
];

export default function EducationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const slug = searchTerm.trim().toLowerCase().replace(/\s+/g, '-');
      router.push(`/education/${slug}`);
    }
  };

  const handleTopicClick = (slug: string) => {
    router.push(`/education/${slug}`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Education Center</h1>
        <p className="text-muted-foreground">
          Learn more about eye health, conditions, and preventative care.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search for an Eye Condition</CardTitle>
          <CardDescription>Enter a topic below to get an AI-generated overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., Glaucoma, Dry Eye, Cataracts..." 
              className="flex-grow"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Suggested Topics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {suggestedTopics.map((topic) => (
            <button key={topic.slug} onClick={() => handleTopicClick(topic.slug)} className="text-left">
              <Card className="h-full hover:border-primary transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {topic.title}
                  </CardTitle>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
