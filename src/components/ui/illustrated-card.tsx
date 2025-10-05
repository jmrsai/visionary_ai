
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface IllustratedCardProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
  illustration: React.ReactNode;
  className?: string;
}

export function IllustratedCard({
  title,
  description,
  buttonText,
  href,
  illustration,
  className,
}: IllustratedCardProps) {
  return (
    <Card className={cn("flex flex-col justify-between overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center gap-4">
        <div className="flex-grow flex items-center justify-center">
            {illustration}
        </div>
        <Button asChild className="w-full mt-4">
          <Link href={href}>{buttonText} <ChevronRight className="ml-2 h-4 w-4"/></Link>
        </Button>
      </CardContent>
    </Card>
  );
}
