import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Appointment {
    id: bigint;
    status: Status;
    contactInfo: string;
    dateSubmitted: string;
    preferredDateTime: string;
    timestamp: Time;
    patientName: string;
    isNew: boolean;
    healthConcerns: string;
    consultationType: ConsultationType;
}
export type Time = bigint;
export interface PaymentMethod {
    method: string;
    number: string;
    upiId: string;
}
export interface DoctorProfile {
    contactInfo: ContactInfo;
    name: string;
    biography: string;
    qualifications: string;
    philosophy: string;
}
export interface Service {
    id: bigint;
    serviceType: {
        serviceTypeName: string;
        serviceTypePrice: number;
    };
    name: string;
    description: string;
}
export interface EmailNotificationSettings {
    isEnabled: boolean;
    recipientEmail: string;
}
export interface PatientDetails {
    status: Status;
    appointmentCount: bigint;
    contactInfo: ContactInfo;
    lastVisitStatus: PatientStatus;
    name: string;
    lastAppointmentTimestamp: Time;
    mostRecentAppointmentDate: string;
}
export interface HomePage {
    headline: string;
}
export interface PaymentDetails {
    methods: Array<PaymentMethod>;
    email: string;
    currency: string;
}
export interface Inquiry {
    contactInfo: string;
    dateSubmitted: string;
    name: string;
    message: string;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Testimonial {
    dateSubmitted: string;
    message: string;
    patientName: string;
    rating: number;
}
export enum ConsultationType {
    clinicVisit = "clinicVisit",
    online = "online"
}
export enum PatientStatus {
    active = "active",
    inactive = "inactive"
}
export enum Status {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export interface backendInterface {
    addCustomService(name: string, description: string, serviceTypeName: string, serviceTypePrice: number): Promise<void>;
    deleteService(id: bigint): Promise<void>;
    disableEmailNotifications(arg0: null): Promise<void>;
    enableEmailNotifications(arg0: null): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllPatientDetails(): Promise<Array<PatientDetails>>;
    getAllServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getDoctorProfile(): Promise<DoctorProfile>;
    getEmailSettings(): Promise<EmailNotificationSettings>;
    getHomePage(): Promise<HomePage>;
    getInquiries(): Promise<Array<Inquiry>>;
    getNewAppointmentsCount(): Promise<bigint>;
    getPaymentDetails(): Promise<PaymentDetails>;
    getSortedPatientDetails(sortBy: bigint): Promise<Array<PatientDetails>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(caller: Principal): Promise<boolean>;
    markAppointmentsAsViewed(): Promise<void>;
    removeAdmin(target: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchPatientDetails(searchTerm: string): Promise<Array<PatientDetails>>;
    setAdmin(target: Principal): Promise<void>;
    submitAppointment(newAppointment: Appointment): Promise<bigint>;
    submitInquiry(inquiry: Inquiry): Promise<void>;
    submitTestimonial(testimonial: Testimonial): Promise<void>;
    updateAppointmentStatus(id: bigint, status: Status): Promise<void>;
    updateService(id: bigint, updatedService: Service): Promise<void>;
}
