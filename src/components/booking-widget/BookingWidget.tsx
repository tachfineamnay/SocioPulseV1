"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

// Shadcn/UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Types & Schema
import type { BookingWidgetProps, BookingFormData, QuoteRequestData } from "./types";
import { AGE_GROUPS, TIME_SLOTS } from "./types";
import { createBookingSchema, quoteRequestSchema } from "./schema";

/**
 * BookingWidget - Widget de réservation complet
 * 
 * Composant divisé en deux zones :
 * 1. Lead Magnet (haut) : Demande de tarif via Dialog
 * 2. Booking Engine (bas) : Formulaire de réservation complet
 */
export function BookingWidget({
    service,
    onBookingSubmit,
    onQuoteRequest,
    className,
}: BookingWidgetProps) {
    // État pour la Dialog du Lead Magnet
    const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Création du schéma Zod avec la capacité du service
    const bookingSchema = createBookingSchema(service.maxCapacity);

    // Form pour le Booking Engine
    const bookingForm = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            selectedOption: "",
            ageGroup: "",
            participantCount: 1,
            objectives: "",
            sessionDate: undefined,
            sessionTime: "",
        },
    });

    // Form pour la demande de tarif (Lead Magnet)
    const quoteForm = useForm<QuoteRequestData>({
        resolver: zodResolver(quoteRequestSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
        },
    });

    // Handler du formulaire de réservation
    const handleBookingSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        try {
            await onBookingSubmit?.(data);
            bookingForm.reset();
        } catch (error) {
            console.error("Erreur lors de la réservation:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler de la demande de tarif
    const handleQuoteSubmit = async (data: QuoteRequestData) => {
        setIsSubmitting(true);
        try {
            await onQuoteRequest?.(data);
            quoteForm.reset();
            setIsQuoteDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de la demande de tarif:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={className}>
            {/* ============================================ */}
            {/* ZONE 1 : LEAD MAGNET - Demande de Tarif */}
            {/* ============================================ */}
            <section className="lead-magnet-section">
                <h2>DEMANDE DE TARIF</h2>
                <p>
                    Obtenez rapidement notre tarification personnalisée pour votre projet.
                    Remplissez le formulaire et nous vous répondrons sous 24h.
                </p>

                <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="default">Demander un devis</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Demande de tarif - {service.name}</DialogTitle>
                            <DialogDescription>
                                Remplissez ce formulaire pour recevoir notre tarification détaillée.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...quoteForm}>
                            <form onSubmit={quoteForm.handleSubmit(handleQuoteSubmit)}>
                                {/* Nom */}
                                <FormField
                                    control={quoteForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom complet</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Votre nom" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Email */}
                                <FormField
                                    control={quoteForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="votre@email.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Téléphone (optionnel) */}
                                <FormField
                                    control={quoteForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone (optionnel)</FormLabel>
                                            <FormControl>
                                                <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Message (optionnel) */}
                                <FormField
                                    control={quoteForm.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message (optionnel)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Précisions sur votre demande..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma demande"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </section>

            {/* ============================================ */}
            {/* ZONE 2 : BOOKING ENGINE - Formulaire complet */}
            {/* ============================================ */}
            <section className="booking-engine-section">
                <h2>Réserver une séance</h2>

                <Form {...bookingForm}>
                    <form onSubmit={bookingForm.handleSubmit(handleBookingSubmit)}>
                        {/* Formule (Select dynamique basé sur le service) */}
                        <FormField
                            control={bookingForm.control}
                            name="selectedOption"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Formule</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez une formule" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {service.pricingOptions.map((option) => (
                                                <SelectItem key={option.name} value={option.name}>
                                                    {option.name} - {option.price}€
                                                    {option.duration && ` (${option.duration})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Grid cols-2 : Tranche d'âge + Nb participants */}
                        <div className="grid-cols-2">
                            {/* Tranche d'âge */}
                            <FormField
                                control={bookingForm.control}
                                name="ageGroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tranche d'âge</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {AGE_GROUPS.map((group) => (
                                                    <SelectItem key={group.value} value={group.value}>
                                                        {group.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nombre de participants */}
                            <FormField
                                control={bookingForm.control}
                                name="participantCount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nb participants</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={service.maxCapacity}
                                                placeholder="1"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Objectifs et Descriptif */}
                        <FormField
                            control={bookingForm.control}
                            name="objectives"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Objectifs et Descriptif</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Décrivez vos attentes pédagogiques..."
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Grid cols-2 : Date + Heure */}
                        <div className="grid-cols-2">
                            {/* Date (Calendar dans Popover) */}
                            <FormField
                                control={bookingForm.control}
                                name="sessionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant="outline">
                                                        {field.value ? (
                                                            format(field.value, "PPP", { locale: fr })
                                                        ) : (
                                                            <span>Choisir une date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date()}
                                                    locale={fr}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Heure */}
                            <FormField
                                control={bookingForm.control}
                                name="sessionTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Heure</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionnez" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {TIME_SLOTS.map((slot) => (
                                                    <SelectItem key={slot.value} value={slot.value}>
                                                        {slot.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Bouton de soumission */}
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Réservation en cours..." : "Réserver maintenant"}
                        </Button>
                    </form>
                </Form>
            </section>
        </div>
    );
}

export default BookingWidget;
