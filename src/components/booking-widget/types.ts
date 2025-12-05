// Types et interfaces pour le BookingWidget

/**
 * Option de tarification d'un service
 * Structure JSON stockée dans pricingOptions du modèle Service
 */
export interface PricingOption {
  name: string;
  price: number;
  duration?: string;
  maxParticipants?: number;
}

/**
 * Données du service nécessaires au widget
 */
export interface ServiceData {
  id: string;
  name: string;
  description?: string;
  pricingOptions: PricingOption[];
  maxCapacity: number;
  category?: string;
}

/**
 * Tranches d'âge disponibles
 */
export const AGE_GROUPS = [
  { value: "3-5", label: "3-5 ans" },
  { value: "6-12", label: "6-12 ans" },
  { value: "13-17", label: "13-17 ans" },
  { value: "adultes", label: "Adultes" },
  { value: "seniors", label: "Séniors (60+)" },
  { value: "mixte", label: "Tous âges" },
] as const;

/**
 * Créneaux horaires disponibles
 */
export const TIME_SLOTS = [
  { value: "08:00", label: "08:00" },
  { value: "08:30", label: "08:30" },
  { value: "09:00", label: "09:00" },
  { value: "09:30", label: "09:30" },
  { value: "10:00", label: "10:00" },
  { value: "10:30", label: "10:30" },
  { value: "11:00", label: "11:00" },
  { value: "11:30", label: "11:30" },
  { value: "12:00", label: "12:00" },
  { value: "14:00", label: "14:00" },
  { value: "14:30", label: "14:30" },
  { value: "15:00", label: "15:00" },
  { value: "15:30", label: "15:30" },
  { value: "16:00", label: "16:00" },
  { value: "16:30", label: "16:30" },
  { value: "17:00", label: "17:00" },
  { value: "17:30", label: "17:30" },
  { value: "18:00", label: "18:00" },
] as const;

/**
 * Données du formulaire de réservation
 */
export interface BookingFormData {
  selectedOption: string;
  ageGroup: string;
  participantCount: number;
  objectives: string;
  sessionDate: Date;
  sessionTime: string;
}

/**
 * Données du formulaire de demande de tarif (Lead Magnet)
 */
export interface QuoteRequestData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

/**
 * Props du composant BookingWidget
 */
export interface BookingWidgetProps {
  service: ServiceData;
  onBookingSubmit?: (data: BookingFormData) => Promise<void>;
  onQuoteRequest?: (data: QuoteRequestData) => Promise<void>;
  className?: string;
}
