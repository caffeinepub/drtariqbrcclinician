// Local type definitions for clinic data models
// These match the field shapes expected by all pages

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface DoctorProfile {
  name: string;
  qualifications: string;
  specialization: string;
  experience: string;
  bio: string;
  biography: string;
  philosophy: string;
  imageUrl: string;
  contactInfo: ContactInfo;
}

export interface HomePage {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  welcomeMessage: string;
  headline: string;
}

export interface Service {
  id: bigint;
  name: string;
  description: string;
  duration: string;
  priceInr: number;
  category: string;
}

// Enum-style constants for Status
export const Status = {
  pending: "pending",
  confirmed: "confirmed",
  completed: "completed",
  cancelled: "cancelled",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

// Enum-style constants for ConsultationType
export const ConsultationType = {
  online: "online",
  clinicVisit: "clinicVisit",
} as const;
export type ConsultationType =
  (typeof ConsultationType)[keyof typeof ConsultationType];

// Enum-style constants for PatientStatus
export const PatientStatus = {
  active: "active",
  inactive: "inactive",
} as const;
export type PatientStatus = (typeof PatientStatus)[keyof typeof PatientStatus];

export interface Appointment {
  id: bigint;
  patientName: string;
  contactInfo: string;
  preferredDateTime: string;
  consultationType: ConsultationType;
  symptoms: string;
  healthConcerns: string;
  status: Status;
  dateSubmitted: string;
  isNew: boolean;
  paymentMethod: string;
  notes: string;
  timestamp: bigint;
}

export interface PatientDetails {
  name: string;
  contactInfo: { email: string; phone: string };
  appointmentCount: bigint;
  mostRecentAppointmentDate: string;
  status: Status;
  lastVisitStatus: PatientStatus;
}

export interface Testimonial {
  id: bigint;
  patientName: string;
  message: string;
  rating: number;
  date: string;
  dateSubmitted: string;
}

export interface Inquiry {
  name: string;
  email?: string;
  phone?: string;
  contactInfo: string;
  message: string;
  dateSubmitted: string;
}

export interface PaymentMethod {
  method: string;
  number: string;
  upiId: string;
}

export interface PaymentDetails {
  methods: PaymentMethod[];
  email: string;
  currency: string;
  upiId: string;
  paytmNumber: string;
  googlePayNumber: string;
  phonepeNumber: string;
  bankName: string;
  accountName: string;
}

export interface EmailNotificationSettings {
  enabled: boolean;
  isEnabled: boolean;
  email: string;
  recipientEmail: string;
  notifyOnNewAppointment: boolean;
}

// Backend actor interface defining all available methods
export interface BackendActor {
  getCallerUserProfile(): Promise<UserProfile | null>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  isCallerAdmin(): Promise<boolean>;
  getHomePage(): Promise<HomePage>;
  getDoctorProfile(): Promise<DoctorProfile>;
  getAllServices(): Promise<Service[]>;
  submitAppointment(appointment: Partial<Appointment>): Promise<bigint>;
  getAllAppointments(): Promise<Appointment[]>;
  updateAppointmentStatus(id: bigint, status: Status): Promise<void>;
  getNewAppointmentsCount(): Promise<bigint>;
  markAppointmentsAsViewed(): Promise<void>;
  getAllPatientDetails(): Promise<PatientDetails[]>;
  searchPatientDetails(searchTerm: string): Promise<PatientDetails[]>;
  getTestimonials(): Promise<Testimonial[]>;
  submitTestimonial(testimonial: Partial<Testimonial>): Promise<void>;
  submitInquiry(inquiry: Inquiry): Promise<void>;
  getPaymentDetails(): Promise<PaymentDetails>;
  getEmailSettings(): Promise<EmailNotificationSettings>;
  enableEmailNotifications(arg: null): Promise<void>;
  disableEmailNotifications(arg: null): Promise<void>;
}
