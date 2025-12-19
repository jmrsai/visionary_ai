
"use client";

import React, { useState, useMemo } from 'react';
import { Video, Calendar, Users, Clock, Shield } from 'lucide-react';
import type { Consultation } from '@/lib/types';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { VideoCall } from './video-call';
import { ConsultationCard } from './consultation-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginForm } from '../login/login-form';


function ConsultationList({ consultations, onJoin }: { consultations: Consultation[], onJoin: (c: Consultation) => void }) {
    if (consultations.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg mt-4">
                <Users className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No consultations found
                </h3>
            </div>
        )
    }

    return (
        <div className="space-y-4 mt-4">
            {consultations.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} onJoin={() => onJoin(consultation)} />
            ))}
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-4 mt-4">
            {[...Array(3)].map((_, i) => (
                 <Card key={i}>
                    <div className="p-4 flex items-center space-x-4">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </Card>
            ))}
        </div>
    )
}


export default function TeleMedicine() {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const consultationsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, 'users', user.uid, 'consultations'),
        orderBy('scheduledTime', 'desc')
    );
  }, [user, firestore]);

  const { data: consultations, isLoading: isLoadingConsultations } = useCollection<Consultation>(consultationsQuery);

  const startConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsInCall(true);
  };

  const endConsultation = () => {
    setIsInCall(false);
    setSelectedConsultation(null);
  };
  
  const getFilteredConsultations = (status: Consultation['status']) => {
    if (!consultations) return [];
    return consultations.filter(c => c.status === status);
  }

  const upcomingConsultations = useMemo(() => getFilteredConsultations('scheduled'), [consultations]);
  const inProgressConsultations = useMemo(() => getFilteredConsultations('in_progress'), [consultations]);
  const completedConsultations = useMemo(() => getFilteredConsultations('completed'), [consultations]);


  if (isInCall && selectedConsultation) {
    return (
      <VideoCall consultation={selectedConsultation} onEndCall={endConsultation} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            TeleMedicine Platform
          </h1>
          <p className="text-muted-foreground mt-1">
            HIPAA-compliant video consultations and remote patient care
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Schedule</span>
          </Button>
          <Button>
            <Video className="h-4 w-4 mr-2" />
            <span>Start Instant Call</span>
          </Button>
        </div>
      </div>

      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
          <AlertTitle className="text-green-900 dark:text-green-100">
            HIPAA-Compliant Platform
          </AlertTitle>
          <AlertDescription className="text-green-800 dark:text-green-200">
            All consultations are encrypted end-to-end and comply with healthcare privacy regulations. 
            No recordings are stored without explicit consent.
          </AlertDescription>
      </Alert>
      
      {isUserLoading ? (
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent><LoadingSkeleton /></CardContent>
        </Card>
      ) : !user ? (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Please Log In</CardTitle>
                <CardDescription>You need to be logged in to view your telemedicine appointments.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
            </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming ({upcomingConsultations.length})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({inProgressConsultations.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedConsultations.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
                {isLoadingConsultations ? <LoadingSkeleton /> : <ConsultationList consultations={upcomingConsultations} onJoin={startConsultation} />}
            </TabsContent>
            <TabsContent value="in_progress">
                 {isLoadingConsultations ? <LoadingSkeleton /> : <ConsultationList consultations={inProgressConsultations} onJoin={startConsultation} />}
            </TabsContent>
            <TabsContent value="completed">
                 {isLoadingConsultations ? <LoadingSkeleton /> : <ConsultationList consultations={completedConsultations} onJoin={startConsultation} />}
            </TabsContent>
        </Tabs>
      )}


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Calls</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">32m</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients Seen</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">156</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">HIPAA</div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

