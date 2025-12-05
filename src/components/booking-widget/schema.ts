import { z } from "zod";

/**
 * Crée un schéma de validation Zod pour le formulaire de réservation
 * Le schéma est dynamique car la validation du nombre de participants
 * dépend de la capacité maximale du service
 * 
 * @param maxCapacity - Capacité maximale du service
 * @returns Schéma Zod pour la validation du formulaire
 */
export const createBookingSchema = (maxCapacity: number) => {
    return z.object({
        // Formule sélectionnée - obligatoire
        selectedOption: z
            .string({
                required_error: "Veuillez sélectionner une formule",
            })
            .min(1, "Veuillez sélectionner une formule"),

        // Tranche d'âge - obligatoire
        ageGroup: z
            .string({
                required_error: "Veuillez sélectionner une tranche d'âge",
            })
            .min(1, "Veuillez sélectionner une tranche d'âge"),

        // Nombre de participants - obligatoire, entre 1 et la capacité max
        participantCount: z
            .number({
                required_error: "Le nombre de participants est requis",
                invalid_type_error: "Veuillez entrer un nombre valide",
            })
            .int("Le nombre de participants doit être un entier")
            .min(1, "Il faut au moins 1 participant")
            .max(
                maxCapacity,
                `Le nombre de participants ne peut pas dépasser ${maxCapacity}`
            ),

        // Objectifs et descriptif - obligatoire, min 10 caractères
        objectives: z
            .string({
                required_error: "Veuillez décrire vos objectifs",
            })
            .min(10, "Veuillez fournir une description d'au moins 10 caractères")
            .max(1000, "La description ne peut pas dépasser 1000 caractères"),

        // Date de la séance - obligatoire, doit être dans le futur
        sessionDate: z
            .date({
                required_error: "Veuillez sélectionner une date",
                invalid_type_error: "Date invalide",
            })
            .refine(
                (date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date >= today;
                },
                { message: "La date doit être aujourd'hui ou dans le futur" }
            ),

        // Heure de la séance - obligatoire
        sessionTime: z
            .string({
                required_error: "Veuillez sélectionner une heure",
            })
            .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:mm)"),
    });
};

/**
 * Type inféré du schéma de réservation
 */
export type BookingSchemaType = z.infer<ReturnType<typeof createBookingSchema>>;

/**
 * Schéma de validation pour la demande de tarif (Lead Magnet)
 */
export const quoteRequestSchema = z.object({
    name: z
        .string({
            required_error: "Le nom est requis",
        })
        .min(2, "Le nom doit contenir au moins 2 caractères"),

    email: z
        .string({
            required_error: "L'email est requis",
        })
        .email("Adresse email invalide"),

    phone: z
        .string()
        .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide")
        .optional()
        .or(z.literal("")),

    message: z
        .string()
        .max(500, "Le message ne peut pas dépasser 500 caractères")
        .optional(),
});

export type QuoteRequestSchemaType = z.infer<typeof quoteRequestSchema>;
