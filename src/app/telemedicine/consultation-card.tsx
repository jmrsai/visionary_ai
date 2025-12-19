"use client";

import { motion } from 'framer-motion';
import { MessageSquare, Video, Clock } from 'lucide-react';
import type { Consultation } from '@/lib/types';
import { format } from 'date-fns';

const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in_progress': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'follow_up': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'routine': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'second_opinion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
            className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                        {consultation.patientName.charAt(0)}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-medium">
                            {consultation.patientName}
                        </h3>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                                {formatDate(scheduledTime)} at {formatTime(scheduledTime)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {consultation.duration} min
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(consultation.type)}`}>
                                {consultation.type.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status.replace('_', ' ')}
                    </span>
                    
                    {consultation.status === 'scheduled' && (
                        <div className="flex items-center space-x-2">
                            <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-background transition-colors">
                                <MessageSquare className="h-4 w-4" />
                            </button>
                            <button 
                                onClick={onJoin}
                                className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                            >
                                <Video className="h-4 w-4" />
                                <span>Join</span>
                            </button>
                        </div>
                    )}

                    {consultation.status === 'completed' && (
                        <button className="flex items-center space-x-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium py-2 px-4 rounded-lg transition-all duration-200">
                            <Clock className="h-4 w-4" />
                            <span>Review</span>
                        </button>
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
        </motion.div>
    );
}
