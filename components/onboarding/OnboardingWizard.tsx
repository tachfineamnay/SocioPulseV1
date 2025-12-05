'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Briefcase,
    FileCheck,
    CreditCard,
    ChevronRight,
    ChevronLeft,
    Check,
    Loader2,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Award
} from 'lucide-react';
import { DocumentUpload } from './DocumentUpload';

interface StepProps {
    currentStep: number;
    totalSteps: number;
}

const STEPS = [
    { id: 1, title: 'Profil', icon: User },
    { id: 2, title: 'Compétences', icon: Briefcase },
    { id: 3, title: 'Documents', icon: FileCheck },
    { id: 4, title: 'Paiement', icon: CreditCard },
];

const SPECIALTIES = [
    'Aide-soignant(e)',
    'Infirmier(ère)',
    'Éducateur spécialisé',
    'Auxiliaire de vie',
    'Psychomotricien(ne)',
    'Ergothérapeute',
    'Moniteur éducateur',
    'AES',
];

const DIPLOMAS = [
    'DEAS (Diplôme d\'État d\'Aide-Soignant)',
    'DEI (Diplôme d\'État d\'Infirmier)',
    'DEES (Diplôme d\'État d\'Éducateur Spécialisé)',
    'DEAES (Diplôme d\'État d\'Accompagnant Éducatif et Social)',
    'Licence Sciences de l\'Éducation',
    'Master Psychologie',
];

export function OnboardingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Step 1 - Profile
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        address: '',
        city: '',
        postalCode: '',
        bio: '',
        // Step 2 - Skills
        specialties: [] as string[],
        diplomas: [] as string[],
        yearsExperience: '',
        // Step 3 - Documents
        idDocument: null as any,
        diplomaDocument: null as any,
        insuranceDocument: null as any,
        // Step 4 - Payment
        iban: '',
        bic: '',
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayField = (field: 'specialties' | 'diplomas', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(value)
                ? prev[field].filter(v => v !== value)
                : [...prev[field], value],
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        // Redirect to success or dashboard
        window.location.href = '/onboarding/success';
    };

    const progressPercentage = (currentStep / 4) * 100;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-bold text-slate-900">
                            Devenir <span className="text-gradient">Extra</span>
                        </h1>
                        <span className="text-sm text-slate-500">
                            Étape {currentStep} sur 4
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-coral-500 to-orange-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-between mt-4">
                        {STEPS.map((step) => {
                            const Icon = step.icon;
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-2 ${isActive ? 'text-coral-600' : isCompleted ? 'text-green-600' : 'text-slate-400'
                                        }`}
                                >
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isActive
                                            ? 'bg-coral-100 text-coral-600'
                                            : isCompleted
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-slate-100 text-slate-400'
                                        }
                  `}>
                                        {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium">{step.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Form Content */}
            <main className="max-w-3xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {/* Step 1: Profile */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Informations personnelles</h2>
                                <p className="text-slate-500">Commençons par faire connaissance</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Prénom *</label>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => updateField('firstName', e.target.value)}
                                            className="input-premium"
                                            placeholder="Marie"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => updateField('lastName', e.target.value)}
                                            className="input-premium"
                                            placeholder="Dupont"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            <Mail className="w-4 h-4 inline mr-1" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            className="input-premium"
                                            placeholder="marie@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            <Phone className="w-4 h-4 inline mr-1" />
                                            Téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            className="input-premium"
                                            placeholder="06 12 34 56 78"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        <Calendar className="w-4 h-4 inline mr-1" />
                                        Date de naissance *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => updateField('birthDate', e.target.value)}
                                        className="input-premium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => updateField('address', e.target.value)}
                                        className="input-premium"
                                        placeholder="123 rue de la Santé"
                                    />
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="col-span-2 sm:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Ville *</label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => updateField('city', e.target.value)}
                                            className="input-premium"
                                            placeholder="Lyon"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Code postal *</label>
                                        <input
                                            type="text"
                                            value={formData.postalCode}
                                            onChange={(e) => updateField('postalCode', e.target.value)}
                                            className="input-premium"
                                            placeholder="69003"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio (optionnel)</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => updateField('bio', e.target.value)}
                                        className="input-premium min-h-[100px] resize-none"
                                        placeholder="Présentez-vous en quelques mots..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Skills */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Compétences & Expérience</h2>
                                <p className="text-slate-500">Décrivez votre profil professionnel</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        <Briefcase className="w-4 h-4 inline mr-1" />
                                        Spécialités * (sélectionnez au moins une)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {SPECIALTIES.map((specialty) => (
                                            <button
                                                key={specialty}
                                                type="button"
                                                onClick={() => toggleArrayField('specialties', specialty)}
                                                className={`
                          pill-btn
                          ${formData.specialties.includes(specialty)
                                                        ? 'pill-btn-active'
                                                        : 'pill-btn-inactive'
                                                    }
                        `}
                                            >
                                                {specialty}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        <Award className="w-4 h-4 inline mr-1" />
                                        Diplômes obtenus
                                    </label>
                                    <div className="space-y-2">
                                        {DIPLOMAS.map((diploma) => (
                                            <label
                                                key={diploma}
                                                className={`
                          flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                          ${formData.diplomas.includes(diploma)
                                                        ? 'border-coral-500 bg-coral-50'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }
                        `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.diplomas.includes(diploma)}
                                                    onChange={() => toggleArrayField('diplomas', diploma)}
                                                    className="sr-only"
                                                />
                                                <div className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center
                          ${formData.diplomas.includes(diploma)
                                                        ? 'border-coral-500 bg-coral-500'
                                                        : 'border-slate-300'
                                                    }
                        `}>
                                                    {formData.diplomas.includes(diploma) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <span className="text-sm text-slate-700">{diploma}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Années d'expérience *
                                    </label>
                                    <select
                                        value={formData.yearsExperience}
                                        onChange={(e) => updateField('yearsExperience', e.target.value)}
                                        className="input-premium"
                                    >
                                        <option value="">Sélectionner...</option>
                                        <option value="0-1">Moins d'1 an</option>
                                        <option value="1-3">1 à 3 ans</option>
                                        <option value="3-5">3 à 5 ans</option>
                                        <option value="5-10">5 à 10 ans</option>
                                        <option value="10+">Plus de 10 ans</option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Documents */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Documents justificatifs</h2>
                                <p className="text-slate-500">Téléversez vos documents pour la vérification</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-6">
                                <DocumentUpload
                                    label="Pièce d'identité"
                                    description="CNI, Passeport ou Titre de séjour (recto-verso)"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    required
                                    onFilesChange={(files) => updateField('idDocument', files)}
                                />

                                <DocumentUpload
                                    label="Diplôme(s)"
                                    description="Uploadez vos diplômes en lien avec vos spécialités"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                    required
                                    onFilesChange={(files) => updateField('diplomaDocument', files)}
                                />

                                <DocumentUpload
                                    label="Attestation d'assurance RC Pro"
                                    description="Responsabilité Civile Professionnelle en cours de validité"
                                    accept=".pdf"
                                    required
                                    onFilesChange={(files) => updateField('insuranceDocument', files)}
                                />

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <p className="text-sm text-blue-700">
                                        <strong>🔒 Confidentialité</strong> : Vos documents sont stockés de manière sécurisée et ne sont consultés que par notre équipe de vérification.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Payment */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Informations de paiement</h2>
                                <p className="text-slate-500">Pour recevoir vos paiements après chaque mission</p>
                            </div>

                            <div className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">IBAN *</label>
                                    <input
                                        type="text"
                                        value={formData.iban}
                                        onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
                                        className="input-premium font-mono"
                                        placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">BIC/SWIFT *</label>
                                    <input
                                        type="text"
                                        value={formData.bic}
                                        onChange={(e) => updateField('bic', e.target.value.toUpperCase())}
                                        className="input-premium font-mono"
                                        placeholder="BNPAFRPP"
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                    <p className="text-sm text-green-700">
                                        <strong>💸 Paiements rapides</strong> : Les virements sont effectués sous 48h après validation de chaque mission via Stripe Connect.
                                    </p>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-gradient-to-br from-coral-500 to-orange-500 rounded-2xl p-6 text-white">
                                <h3 className="font-bold text-lg mb-4">Récapitulatif</h3>
                                <div className="space-y-2 text-sm">
                                    <p><strong>Nom :</strong> {formData.firstName} {formData.lastName}</p>
                                    <p><strong>Ville :</strong> {formData.city}</p>
                                    <p><strong>Spécialités :</strong> {formData.specialties.join(', ') || 'Non renseigné'}</p>
                                    <p><strong>Expérience :</strong> {formData.yearsExperience || 'Non renseigné'}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            Précédent
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < 4 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-coral-500 text-white font-medium hover:bg-coral-600 transition-colors shadow-lg shadow-coral-500/30"
                        >
                            Continuer
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Soumettre ma candidature
                                </>
                            )}
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
