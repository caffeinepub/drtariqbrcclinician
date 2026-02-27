import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, DoctorProfile, Service, Appointment, Testimonial, Inquiry, HomePage, PaymentDetails, PatientDetails, Status, EmailNotificationSettings } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// HomePage Queries
export function useGetHomePage() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePage>({
    queryKey: ['homePage'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHomePage();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes - this is static content
  });
}

// Doctor Profile Queries
export function useGetDoctorProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<DoctorProfile>({
    queryKey: ['doctorProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getDoctorProfile();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes - this is static content
  });
}

// Services Queries
export function useGetAllServices() {
  const { actor, isFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes - services don't change often
  });
}

// Appointments Queries and Mutations
export function useSubmitAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error('Actor not available');
      const appointmentId = await actor.submitAppointment(appointment);
      return appointmentId;
    },
    onSuccess: () => {
      // Immediately invalidate all appointment-related queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['newAppointmentsCount'] });
      queryClient.invalidateQueries({ queryKey: ['patientDetails'] });
      
      // Force refetch to ensure immediate visibility
      queryClient.refetchQueries({ queryKey: ['appointments'] });
      queryClient.refetchQueries({ queryKey: ['newAppointmentsCount'] });
      queryClient.refetchQueries({ queryKey: ['patientDetails'] });
    },
    retry: 2,
    retryDelay: 1000,
  });
}

export function useGetAllAppointments() {
  const { actor, isFetching } = useActor();

  return useQuery<Appointment[]>({
    queryKey: ['appointments'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const appointments = await actor.getAllAppointments();
      return appointments;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes for admin views
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useUpdateAppointmentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: Status }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['newAppointmentsCount'] });
      queryClient.invalidateQueries({ queryKey: ['patientDetails'] });
      
      // Force refetch for immediate updates
      queryClient.refetchQueries({ queryKey: ['appointments'] });
      queryClient.refetchQueries({ queryKey: ['patientDetails'] });
    },
  });
}

export function useGetNewAppointmentsCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['newAppointmentsCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNewAppointmentsCount();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 30000,
  });
}

export function useMarkAppointmentsAsViewed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.markAppointmentsAsViewed();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['newAppointmentsCount'] });
      
      // Force refetch
      queryClient.refetchQueries({ queryKey: ['appointments'] });
      queryClient.refetchQueries({ queryKey: ['newAppointmentsCount'] });
    },
  });
}

// Patient Details Queries
export function useGetAllPatientDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<PatientDetails[]>({
    queryKey: ['patientDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const patients = await actor.getAllPatientDetails();
      return patients;
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });
}

export function useSearchPatientDetails() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (searchTerm: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchPatientDetails(searchTerm);
    },
  });
}

// Testimonials Queries
export function useGetTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSubmitTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

// Inquiries Mutations
export function useSubmitInquiry() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (inquiry: Inquiry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitInquiry(inquiry);
    },
  });
}

// Payment Details Queries
export function useGetPaymentDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<PaymentDetails>({
    queryKey: ['paymentDetails'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPaymentDetails();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
    staleTime: 10 * 60 * 1000, // 10 minutes - payment details are static
  });
}

// Email Notification Settings Queries and Mutations
export function useGetEmailSettings() {
  const { actor, isFetching } = useActor();

  return useQuery<EmailNotificationSettings>({
    queryKey: ['emailSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEmailSettings();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    refetchOnMount: 'always',
    staleTime: 30000,
  });
}

export function useEnableEmailNotifications() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arg: null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.enableEmailNotifications(arg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailSettings'] });
      queryClient.refetchQueries({ queryKey: ['emailSettings'] });
    },
  });
}

export function useDisableEmailNotifications() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arg: null) => {
      if (!actor) throw new Error('Actor not available');
      return actor.disableEmailNotifications(arg);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailSettings'] });
      queryClient.refetchQueries({ queryKey: ['emailSettings'] });
    },
  });
}
