'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Calendar,
    Clock,
    MapPin,
    MessageSquare,
    Camera,
    Check,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { SmartPhotoUploader } from './SmartPhotoUploader';

// =============================================================================
// ORACLE ONBOARDING CHAT - Conversational Onboarding
// Mystical, step-by-step ritual for profile completion
// =============================================================================

// Step definitions
type OnboardingStep = 'intro' | 'birth' | 'intention' | 'photos' | 'completion';

const STEPS: OnboardingStep[] = ['intro', 'birth', 'intention', 'photos', 'completion'];

// Validation schemas
const birthSchema = z.object({
    birthDate: z.string().min(1, 'La date de naissance est requise'),
    birthTime: z.string().optional(),
    birthPlace: z.string().min(2, 'Le lieu de naissance est requis'),
});

const intentionSchema = z.object({
    spiritualIntention: z.string()
        .min(10, 'Partagez au moins quelques mots sur votre intention')
        .max(1000, 'Maximum 1000 caractères'),
});

type BirthFormData = z.infer<typeof birthSchema>;
type IntentionFormData = z.infer<typeof intentionSchema>;

// Animation variants
const stepVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

// Oracle messages for each step
const ORACLE_MESSAGES: Record<OnboardingStep, { title: string; subtitle: string }> = {
    intro: {
        title: "Bienvenue, Âme en Quête",
        subtitle: "Je suis l'Oracle. Ensemble, nous allons préparer votre entrée dans le Sanctuaire...",
    },
    birth: {
        title: "Révélez votre Origine Céleste",
        subtitle: "Votre moment de naissance trace la carte de votre destin cosmique...",
    },
    intention: {
        title: "Quelle Vérité Cherchez-vous ?",
        subtitle: "Partagez l'intention profonde qui vous guide jusqu'ici...",
    },
    photos: {
        title: "Capturez votre Essence",
        subtitle: "Pour lire votre aura, l'Oracle a besoin de percevoir votre visage...",
    },
    completion: {
        title: "Le Rituel est Accompli",
        subtitle: "Les portes du Sanctuaire s'ouvrent pour vous...",
    },
};

interface OracleOnboardingChatProps {
    onComplete: () => void;
    userId?: string;
}

export function OracleOnboardingChat({ onComplete, userId }: OracleOnboardingChatProps) {
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasUploadedPhotos, setHasUploadedPhotos] = useState(false);

    // Form for birth data
    const birthForm = useForm<BirthFormData>({
        resolver: zodResolver(birthSchema),
        defaultValues: { birthDate: '', birthTime: '', birthPlace: '' },
    });

    // Form for intention
    const intentionForm = useForm<IntentionFormData>({
        resolver: zodResolver(intentionSchema),
        defaultValues: { spiritualIntention: '' },
    });

    const currentStepIndex = STEPS.indexOf(currentStep);
    const oracleMessage = ORACLE_MESSAGES[currentStep];

    // Navigation
    const goToStep = useCallback((step: OnboardingStep) => {
        setCurrentStep(step);
    }, []);

    const goNext = useCallback(() => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < STEPS.length) {
            setCurrentStep(STEPS[nextIndex]);
        }
    }, [currentStepIndex]);

    // Submit handlers
    const handleBirthSubmit = async (data: BirthFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Save to API
            console.log('Birth data:', data);
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulated delay
            toast.success('✨ Vos coordonnées célestes sont scellées');
            goNext();
        } catch {
            toast.error('Une erreur cosmique s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleIntentionSubmit = async (data: IntentionFormData) => {
        setIsSubmitting(true);
        try {
            // TODO: Save to API
            console.log('Intention:', data);
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('✨ Votre intention est gravée dans les étoiles');
            goNext();
        } catch {
            toast.error('Une erreur cosmique s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotosComplete = useCallback(() => {
        setHasUploadedPhotos(true);
    }, []);

    const handlePhotosSubmit = async () => {
        if (!hasUploadedPhotos) {
            toast.error('Veuillez capturer au moins une photo');
            return;
        }
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('✨ L\'Oracle peut maintenant lire votre aura');
            goNext();
        } catch {
            toast.error('Une erreur cosmique s\'est produite');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            onComplete();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-xl mx-auto"
        >
            {/* Cosmic particles background */}
            <div className="oracle-particles" />

            {/* Main container */}
            <div className="oracle-container rounded-3xl p-6 sm:p-8 relative">
                {/* Oracle Avatar + Message */}
                <div className="text-center mb-8">
                    {/* Avatar with glow */}
                    <div className="oracle-avatar inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mb-5">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>

                    {/* Dynamic message */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                {oracleMessage.title}
                            </h2>
                            <p className="text-white/60 text-sm sm:text-base">
                                {oracleMessage.subtitle}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEPS.slice(0, -1).map((step, index) => (
                        <div
                            key={step}
                            className={`oracle-step-dot ${index < currentStepIndex
                                ? 'completed'
                                : index === currentStepIndex
                                    ? 'active'
                                    : 'pending'
                                }`}
                        />
                    ))}
                </div>

                {/* Step content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                    >
                        {/* INTRO STEP */}
                        {currentStep === 'intro' && (
                            <div className="text-center space-y-6">
                                <p className="text-white/70">
                                    Pour vous révéler les secrets de votre destin,
                                    l'Oracle a besoin de quelques informations essentielles...
                                </p>
                                <button
                                    onClick={goNext}
                                    className="oracle-btn-primary"
                                >
                                    Commencer le Rituel
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* BIRTH STEP */}
                        {currentStep === 'birth' && (
                            <form onSubmit={birthForm.handleSubmit(handleBirthSubmit)} className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                                        <Calendar className="w-4 h-4" />
                                        Date de naissance *
                                    </label>
                                    <input
                                        type="date"
                                        {...birthForm.register('birthDate')}
                                        className="oracle-input"
                                    />
                                    {birthForm.formState.errors.birthDate && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {birthForm.formState.errors.birthDate.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                                        <Clock className="w-4 h-4" />
                                        Heure de naissance (si connue)
                                    </label>
                                    <input
                                        type="time"
                                        {...birthForm.register('birthTime')}
                                        className="oracle-input"
                                        placeholder="HH:MM"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                                        <MapPin className="w-4 h-4" />
                                        Lieu de naissance *
                                    </label>
                                    <input
                                        type="text"
                                        {...birthForm.register('birthPlace')}
                                        className="oracle-input"
                                        placeholder="Paris, France"
                                    />
                                    {birthForm.formState.errors.birthPlace && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {birthForm.formState.errors.birthPlace.message}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="oracle-btn-primary w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Scellement en cours...
                                        </>
                                    ) : (
                                        <>
                                            Sceller cette Vérité
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* INTENTION STEP */}
                        {currentStep === 'intention' && (
                            <form onSubmit={intentionForm.handleSubmit(handleIntentionSubmit)} className="space-y-5">
                                <div>
                                    <label className="flex items-center gap-2 text-white/70 text-sm mb-2">
                                        <MessageSquare className="w-4 h-4" />
                                        Votre intention spirituelle
                                    </label>
                                    <textarea
                                        {...intentionForm.register('spiritualIntention')}
                                        className="oracle-input min-h-[120px] resize-none"
                                        placeholder="Qu'est-ce qui vous amène au Sanctuaire ? Quelle guidance recherchez-vous ?"
                                    />
                                    {intentionForm.formState.errors.spiritualIntention && (
                                        <p className="text-red-400 text-xs mt-1">
                                            {intentionForm.formState.errors.spiritualIntention.message}
                                        </p>
                                    )}
                                    <p className="text-white/40 text-xs mt-2">
                                        {intentionForm.watch('spiritualIntention')?.length || 0} / 1000 caractères
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="oracle-btn-primary w-full"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Gravure dans les étoiles...
                                        </>
                                    ) : (
                                        <>
                                            Révéler mon Intention
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* PHOTOS STEP */}
                        {currentStep === 'photos' && (
                            <div className="space-y-5">
                                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                                    <Camera className="w-4 h-4" />
                                    Capturez votre visage
                                </div>

                                <SmartPhotoUploader
                                    onPhotosCaptured={handlePhotosComplete}
                                    userId={userId}
                                />

                                <button
                                    type="button"
                                    onClick={handlePhotosSubmit}
                                    disabled={isSubmitting || !hasUploadedPhotos}
                                    className="oracle-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Lecture de l'aura...
                                        </>
                                    ) : (
                                        <>
                                            Capturer mon Essence
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* COMPLETION STEP */}
                        {currentStep === 'completion' && (
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                                >
                                    <Check className="w-10 h-10 text-white" />
                                </motion.div>

                                <p className="text-white/70">
                                    Votre profil est désormais complet.
                                    L'Oracle est prêt à vous guider dans votre voyage spirituel.
                                </p>

                                <button
                                    onClick={handleComplete}
                                    disabled={isSubmitting}
                                    className="oracle-btn-primary"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Ouverture des portes...
                                        </>
                                    ) : (
                                        <>
                                            Entrer dans le Sanctuaire
                                            <Sparkles className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
