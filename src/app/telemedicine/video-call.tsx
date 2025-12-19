"use client";

import { Video, Phone, MessageSquare, Monitor } from 'lucide-react';
import type { Consultation } from '@/lib/types';
import { useUser } from '@/firebase';

interface VideoCallProps {
    consultation: Consultation;
    onEndCall: () => void;
    isDoctor: boolean;
}

export function VideoCall({ consultation, onEndCall, isDoctor }: VideoCallProps) {
    const { user } = useUser();
    const doctorName = "Dr. Chen";
    const patientName = consultation.patientName;
    const selfName = isDoctor ? doctorName : patientName;
    const otherName = isDoctor ? patientName : doctorName;

    return (
        <div className="fixed inset-0 bg-gray-900 z-50">
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">
                                {otherName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-white font-medium">{otherName}</h3>
                            <p className="text-gray-300 text-sm">Patient ID: {consultation.userId}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-green-400 text-sm">● Connected</span>
                        <span className="text-gray-300 text-sm">15:23</span>
                    </div>
                </div>

                {/* Video Area */}
                <div className="flex-1 relative bg-gray-900">
                    {/* Main video */}
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-32 h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white text-4xl font-medium">
                                    {otherName.charAt(0)}
                                </span>
                            </div>
                            <h3 className="text-white text-xl font-medium">{otherName}</h3>
                            <p className="text-gray-400">Audio only - Camera disabled</p>
                        </div>
                    </div>

                    {/* Self video */}
                    <div className="absolute top-4 right-4 w-48 h-36 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                <span className="text-white text-lg font-medium">
                                    {selfName.charAt(0)}
                                    {selfName.split(' ')[1]?.charAt(0) || ''}
                                </span>
                            </div>
                            <p className="text-white text-sm">{selfName}</p>
                        </div>
                    </div>

                    {/* Screen sharing indicator */}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-2">
                        <Monitor className="h-4 w-4" />
                        <span>Sharing: Medical Records</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-gray-800 px-6 py-4">
                    <div className="flex items-center justify-center space-x-6">
                        <button className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors">
                            <Video className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors">
                            <Phone className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors">
                            <MessageSquare className="h-5 w-5" />
                        </button>
                        <button className="w-12 h-12 bg-gray-600 hover:bg-gray-500 rounded-full flex items-center justify-center text-white transition-colors">
                            <Monitor className="h-5 w-5" />
                        </button>
                        <button 
                            onClick={onEndCall}
                            className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <Phone className="h-5 w-5 transform rotate-135" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

    