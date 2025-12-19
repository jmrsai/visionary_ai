"use client";

import React, { useState } from 'react';
import { Video, Phone, MessageSquare, Calendar, Users, Clock, Shield, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Consultation } from '@/lib/types';
import { MOCK_CONSULTATIONS } from '@/lib/data';
import { VideoCall } from './video-call';
import { ConsultationCard } from './consultation-card';

export default function TeleMedicine() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'in_progress' | 'completed'>('upcoming');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isInCall, setIsInCall] = useState(false);

  const startConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsInCall(true);
  };

  const endConsultation = () => {
    setIsInCall(false);
    setSelectedConsultation(null);
  };

  const filteredConsultations = MOCK_CONSULTATIONS.filter(consultation => {
    switch (activeTab) {
      case 'upcoming': return consultation.status === 'scheduled';
      case 'in_progress': return consultation.status === 'in_progress';
      case 'completed': return consultation.status === 'completed';
      default: return true;
    }
  });

  if (isInCall && selectedConsultation) {
    return (
      <VideoCall consultation={selectedConsultation} onEndCall={endConsultation} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            TeleMedicine Platform
          </h1>
          <p className="text-muted-foreground mt-1">
            HIPAA-compliant video consultations and remote patient care
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-background hover:bg-muted text-foreground font-medium py-2 px-4 rounded-lg border transition-all duration-200">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-4 rounded-lg transition-all duration-200">
            <Video className="h-4 w-4" />
            <span>Start Instant Call</span>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-100">
              HIPAA-Compliant Platform
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
              All consultations are encrypted end-to-end and comply with healthcare privacy regulations. 
              No recordings are stored without explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-card rounded-xl shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upcoming', label: 'Upcoming', count: MOCK_CONSULTATIONS.filter(c => c.status === 'scheduled').length },
              { id: 'in_progress', label: 'In Progress', count: MOCK_CONSULTATIONS.filter(c => c.status === 'in_progress').length },
              { id: 'completed', label: 'Completed', count: MOCK_CONSULTATIONS.filter(c => c.status === 'completed').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} onJoin={() => startConsultation(consultation)} />
            ))}

            {filteredConsultations.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No consultations found
                </h3>
                <p className="text-muted-foreground">
                  {activeTab === 'upcoming' && 'No upcoming consultations scheduled.'}
                  {activeTab === 'in_progress' && 'No consultations currently in progress.'}
                  {activeTab === 'completed' && 'No completed consultations to show.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Today's Calls</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
              <p className="text-2xl font-bold">32m</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Patients Seen</p>
              <p className="text-2xl font-bold">156</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Security Score</p>
              <p className="text-2xl font-bold">100%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
