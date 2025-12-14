'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    VideoLayout,
    PreJoinScreen,
    VideoRoom,
    ControlBar,
    MOCK_PARTICIPANTS,
    type VisioParticipant,
} from '@/components/visio';

type RoomState = 'LOBBY' | 'WAITING' | 'ACTIVE';

export default function VisioPage() {
    const router = useRouter();
    const [roomState, setRoomState] = useState<RoomState>('LOBBY');

    // Media State
    const [isAudioOn, setIsAudioOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);

    // Participants
    const [participants, setParticipants] = useState<VisioParticipant[]>([]);

    const handleJoin = () => {
        setRoomState('WAITING');

        // Update my participant state
        const myParticipant: VisioParticipant = {
            ...MOCK_PARTICIPANTS[0],
            isAudioOn,
            isVideoOn,
        };

        // Simulate waiting for host... then connect
        setTimeout(() => {
            setParticipants([myParticipant]); // Just me at first
            setRoomState('ACTIVE');

            // Simulate host joining after 2 seconds
            setTimeout(() => {
                setParticipants([myParticipant, MOCK_PARTICIPANTS[1]]);
            }, 2000);
        }, 1500);
    };

    const handleToggleAudio = () => {
        setIsAudioOn(!isAudioOn);
        // If in active room, update participant state
        if (roomState === 'ACTIVE') {
            setParticipants(prev => prev.map(p =>
                p.id === 'me' ? { ...p, isAudioOn: !isAudioOn } : p
            ));
        }
    };

    const handleToggleVideo = () => {
        setIsVideoOn(!isVideoOn);
        // If in active room, update participant state
        if (roomState === 'ACTIVE') {
            setParticipants(prev => prev.map(p =>
                p.id === 'me' ? { ...p, isVideoOn: !isVideoOn } : p
            ));
        }
    };

    const handleEndCall = () => {
        if (confirm('Voulez-vous vraiment quitter la réunion ?')) {
            router.push('/bookings');
        }
    };

    return (
        <VideoLayout>
            <AnimatePresence mode="wait">
                {roomState === 'LOBBY' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full h-full flex items-center justify-center p-4"
                    >
                        <PreJoinScreen
                            onJoin={handleJoin}
                            isAudioOn={isAudioOn}
                            isVideoOn={isVideoOn}
                            onToggleAudio={() => setIsAudioOn(!isAudioOn)}
                            onToggleVideo={() => setIsVideoOn(!isVideoOn)}
                        />
                    </motion.div>
                )}

                {roomState === 'WAITING' && (
                    <motion.div
                        key="waiting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center gap-6"
                    >
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center animate-pulse">
                                <span className="text-4xl">👋</span>
                            </div>
                            <div className="absolute inset-0 rounded-full border-2 border-coral-500/50 animate-ping" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-white mb-1">Connexion en cours...</h2>
                            <p className="text-slate-400">Nous préparons le salon</p>
                        </div>
                    </motion.div>
                )}

                {roomState === 'ACTIVE' && (
                    <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full h-full flex flex-col"
                    >
                        {/* Main Grid */}
                        <div className="flex-1 flex items-center justify-center overflow-y-auto pt-4 pb-24">
                            <VideoRoom participants={participants} />
                        </div>

                        {/* Controls */}
                        <ControlBar
                            isAudioOn={isAudioOn}
                            isVideoOn={isVideoOn}
                            onToggleAudio={handleToggleAudio}
                            onToggleVideo={handleToggleVideo}
                            onEndCall={handleEndCall}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </VideoLayout>
    );
}
