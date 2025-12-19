"use client";

import { motion } from 'framer-motion';
import { MessageSquare, Video, Clock } from 'lucide-react';
import type { Consultation } from '@/lib/types';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-300';
      case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400 border-gray-300';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-300';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-300';
      case 'routine': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300';
      case 'second_opinion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400 border-gray-300';
    }
};

interface ConsultationCardProps {
    consultation: Consultation;
    onJoin: () => void;
}

export function ConsultationCard({ consultation, onJoin }: ConsultationCardProps) {
    const scheduledTime = new Date(consultation.scheduledTime);

    const formatTime = (date: Date) => {
        return format(date, "p");
    };

    const formatDate = (date: Date) => {
        return format(date, "EEE, MMM d");
    };
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
          <Card className="hover:border-primary/50 transition-colors">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-lg">
                            {consultation.patientName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-medium">
                                {consultation.patientName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(scheduledTime)} at {formatTime(scheduledTime)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {consultation.duration} min
                                </span>
                                <Badge variant="outline" className={cn("text-xs", getTypeColor(consultation.type))}>
                                  {consultation.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={cn("text-xs", getStatusColor(consultation.status))}>
                          {consultation.status.replace('_', ' ')}
                        </Badge>
                        
                        {consultation.status === 'scheduled' && (
                            <div className="flex items-center space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button onClick={onJoin} size="sm">
                                    <Video className="h-4 w-4 mr-2" />
                                    <span>Join</span>
                                </Button>
                            </div>
                        )}

                        {consultation.status === 'completed' && (
                           <Button variant="secondary" size="sm">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Review</span>
                           </Button>
                        )}
                    </div>
                </div>

                {consultation.notes && (
                    <div className="mt-3 pl-16">
                        <p className="text-sm text-muted-foreground">
                            <strong>Notes:</strong> {consultation.notes}
                        </p>
                    </div>
                )}
            </div>
          </Card>
        </motion.div>
    );
}
