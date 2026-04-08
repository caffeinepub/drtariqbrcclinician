import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

// Migration: drop the old `admins` stable variable from the previous version
(with migration =
  func(_ : {
    admins : Map.Map<Principal, Bool>;
  }) : {} {
    {};
  }
)
actor {
  type ContactInfo = {
    phone : Text;
    address : Text;
    email : Text;
  };

  type PatientDetails = {
    name : Text;
    contactInfo : ContactInfo;
    appointmentCount : Nat;
    mostRecentAppointmentDate : Text;
    lastAppointmentTimestamp : Time.Time;
    status : Status;
    lastVisitStatus : PatientStatus;
  };

  module PatientDetails {
    public func compareByLastAppointmentTimestamp(a : PatientDetails, b : PatientDetails) : Order.Order {
      Nat.compare(toNat(b.lastAppointmentTimestamp), toNat(a.lastAppointmentTimestamp));
    };

    public func compareByAppointmentCount(a : PatientDetails, b : PatientDetails) : Order.Order {
      Nat.compare(b.appointmentCount, a.appointmentCount);
    };

    func toNat(time : Time.Time) : Nat {
      if (time < 0) { 0 } else { time.toNat() };
    };
  };

  public type PaymentDetails = {
    methods : [PaymentMethod];
    currency : Text;
    email : Text;
  };

  public type PaymentMethod = {
    method : Text;
    number : Text;
    upiId : Text;
  };

  public type DoctorProfile = {
    name : Text;
    qualifications : Text;
    biography : Text;
    philosophy : Text;
    contactInfo : ContactInfo;
  };

  public type Service = {
    id : Nat;
    name : Text;
    description : Text;
    serviceType : {
      serviceTypeName : Text;
      serviceTypePrice : Float;
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type Appointment = {
    id : Nat;
    patientName : Text;
    contactInfo : Text;
    preferredDateTime : Text;
    consultationType : ConsultationType;
    healthConcerns : Text;
    status : Status;
    dateSubmitted : Text;
    isNew : Bool;
    timestamp : Time.Time;
  };

  type Status = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  type ConsultationType = {
    #online;
    #clinicVisit;
  };

  public type Inquiry = {
    name : Text;
    contactInfo : Text;
    message : Text;
    dateSubmitted : Text;
  };

  public type Testimonial = {
    patientName : Text;
    message : Text;
    rating : Nat8;
    dateSubmitted : Text;
  };

  public type HomePage = {
    headline : Text;
  };

  // --- Inline access control ---
  let admins = Map.empty<Principal, Bool>();

  func isAdmin(p : Principal) : Bool {
    switch (admins.get(p)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  // Allow the first caller to register themselves as admin, or any existing admin to add another
  public shared ({ caller }) func setAdmin(target : Principal) : async () {
    if (admins.size() > 0 and not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only existing admin can add admins");
    };
    admins.add(target, true);
  };

  public shared ({ caller }) func removeAdmin(target : Principal) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can remove admins");
    };
    admins.remove(target);
  };

  public query func isCallerAdmin(caller : Principal) : async Bool {
    isAdmin(caller);
  };

  // --- Persistent storage variables ---
  let userProfiles = Map.empty<Principal, UserProfile>();
  let testimonialList = List.empty<Testimonial>();
  let inquiryList = List.empty<Inquiry>();
  let appointmentList = List.empty<Appointment>();

  // Fixed home page headline
  let homePage : HomePage = {
    headline = "Welcome to Dr BRC Clinician — Dr Tariq Akhoon";
  };

  var nextAppointmentId : Nat = 1;
  var nextServiceId : Nat = 16; // Start from 16 since there are 15 fixed services

  var services = [
    {
      id = 1;
      name = "Naturopathic Consultation";
      description = "Comprehensive health assessment and personalized treatment plan using natural therapies.";
      serviceType = {
        serviceTypeName = "Initial Consultation";
        serviceTypePrice = 600.0;
      };
    },
    {
      id = 2;
      name = "Integrative Medicine Therapy";
      description = "Combining conventional medical approaches with evidence-based naturopathic treatments.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 1000.0;
      };
    },
    {
      id = 3;
      name = "Nutritional Counseling";
      description = "Personalized dietary recommendations to support overall health and wellness.";
      serviceType = {
        serviceTypeName = "Counseling Session";
        serviceTypePrice = 1000.0;
      };
    },
    {
      id = 4;
      name = "Herbal Medicine";
      description = "Customized herbal remedies to address specific health concerns and promote healing.";
      serviceType = {
        serviceTypeName = "Herbal Remedies";
        serviceTypePrice = 1000.0;
      };
    },
    {
      id = 5;
      name = "Stress Management Program";
      description = "Techniques and therapies aimed at reducing stress and improving mental well-being.";
      serviceType = {
        serviceTypeName = "Program Session";
        serviceTypePrice = 1000.0;
      };
    },
    // New therapy services
    {
      id = 6;
      name = "Electro Magnetic Therapy";
      description = "Therapeutic electromagnetic field treatment for healing and pain relief.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 500.0;
      };
    },
    {
      id = 7;
      name = "Hot and Cold Therapy";
      description = "Alternating temperature therapy for improved circulation and recovery.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 300.0;
      };
    },
    {
      id = 8;
      name = "Steaming Therapy";
      description = "Steam-based treatment for detoxification and respiratory wellness.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 200.0;
      };
    },
    {
      id = 9;
      name = "Hot Water Emersion";
      description = "Therapeutic hot water immersion therapy for muscle relaxation and healing.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 1000.0;
      };
    },
    {
      id = 10;
      name = "DIP Diet Therapy";
      description = "Specialized dietary intervention program for optimal health outcomes.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 1000.0;
      };
    },
    {
      id = 11;
      name = "Mud Therapy";
      description = "Natural mud-based treatment for skin health and detoxification.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 500.0;
      };
    },
    {
      id = 12;
      name = "Face Therapy";
      description = "Specialized facial treatment for skin rejuvenation and wellness.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 500.0;
      };
    },
    {
      id = 13;
      name = "Taping for Disc and Heating Therapy";
      description = "Therapeutic taping combined with heat treatment for spinal health.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 500.0;
      };
    },
    {
      id = 14;
      name = "Massage Therapy";
      description = "Professional therapeutic massage for muscle relaxation and stress relief.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 300.0;
      };
    },
    {
      id = 15;
      name = "Zero Volt Therapy Guide";
      description = "Specialized electrical therapy guidance for pain management and healing.";
      serviceType = {
        serviceTypeName = "Therapy Session";
        serviceTypePrice = 500.0;
      };
    },
  ];

  type PatientStatus = {
    #active;
    #inactive;
  };

  module PatientStatusHelper {
    func isActive(lastAppointmentTimestamp : Time.Time) : Bool {
      let currentTime = Time.now();
      let thirtyDaysInNanos = 30 * 24 * 60 * 60 * 1_000_000_000;
      (currentTime - lastAppointmentTimestamp <= thirtyDaysInNanos);
    };

    public func getPatientStatus(lastAppointmentTimestamp : Time.Time) : PatientStatus {
      if (isActive(lastAppointmentTimestamp)) { #active } else { #inactive };
    };
  };

  module AppointmentComparator {
    public func compareByDate(a : Appointment, b : Appointment) : Order.Order {
      Text.compare(a.dateSubmitted, b.dateSubmitted);
    };
  };

  // Email Notification System Settings
  type EmailNotificationSettings = {
    isEnabled : Bool;
    recipientEmail : Text;
  };

  var emailSettings : EmailNotificationSettings = {
    isEnabled = true;
    recipientEmail = "drtariqherbal@gmail.com";
  };

  public query ({ caller }) func getEmailSettings() : async EmailNotificationSettings {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view email settings");
    };
    emailSettings;
  };

  public shared ({ caller }) func enableEmailNotifications(_ : ()) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can enable email notifications");
    };
    emailSettings := { emailSettings with isEnabled = true };
  };

  public shared ({ caller }) func disableEmailNotifications(_ : ()) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can disable email notifications");
    };
    emailSettings := { emailSettings with isEnabled = false };
  };

  // Email sending is a no-op stub (http-outcalls extension not available)
  func sendEmailNotification(
    _patientName : Text,
    _contactInfo : Text,
    _preferredDateTime : Text,
    _consultationType : ConsultationType,
    _healthConcerns : Text,
  ) : async () {
    // Email notifications require the http-outcalls extension; skipped in this build
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  public query func getHomePage() : async HomePage {
    homePage;
  };

  public query func getDoctorProfile() : async DoctorProfile {
    {
      name = "Dr. Tariq Akhoon";
      qualifications = "BNYS/MD, Certified Integrative Medicine Naturopath";
      biography = "Dr. Tariq Akhoon is a highly qualified Naturopathic Doctor with expertise in Integrative Medicine. He combines traditional naturopathic treatments with modern medical approaches to provide comprehensive patient care.";
      philosophy = "Our approach focuses on treating the whole person – mind, body, and spirit. We believe in the body's innate ability to heal and strive to restore balance through natural therapies and evidence-based integrative practices.";
      contactInfo = {
        phone = "+91 7006566575";
        address = "Kralhar Kanispora near SBI Bank, Baramulla, Kashmir";
        email = "drtariqherbal@gmail.com";
      };
    };
  };

  public query func getAllServices() : async [Service] {
    services;
  };

  public shared ({ caller }) func addCustomService(
    name : Text,
    description : Text,
    serviceTypeName : Text,
    serviceTypePrice : Float,
  ) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can add services");
    };
    let service : Service = {
      id = nextServiceId;
      name;
      description;
      serviceType = { serviceTypeName; serviceTypePrice };
    };
    services := services.concat([service]);
    nextServiceId += 1;
  };

  public shared ({ caller }) func updateService(id : Nat, updatedService : Service) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can update services");
    };
    let updatedServices = Array.tabulate(
      services.size(),
      func(i) {
        if (services[i].id == id) { updatedService } else { services[i] };
      },
    );
    services := updatedServices;
  };

  public shared ({ caller }) func deleteService(id : Nat) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can delete services");
    };
    if (id <= 15) {
      Runtime.trap("Cannot delete standard BRC services");
    };
    services := services.filter<Service>(func(service) { service.id != id });
  };

  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view all appointments");
    };
    appointmentList.sort(AppointmentComparator.compareByDate).toArray();
  };

  public shared func submitAppointment(newAppointment : Appointment) : async Nat {
    let appointmentWithId = {
      newAppointment with
      id = nextAppointmentId;
      timestamp = Time.now();
    };
    appointmentList.add(appointmentWithId);

    await sendEmailNotification(
      newAppointment.patientName,
      newAppointment.contactInfo,
      newAppointment.preferredDateTime,
      newAppointment.consultationType,
      newAppointment.healthConcerns,
    );

    let currentId = nextAppointmentId;
    nextAppointmentId += 1;
    currentId;
  };

  public shared ({ caller }) func markAppointmentsAsViewed() : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can mark appointments as viewed");
    };
    let updatedAppointments = appointmentList.map<Appointment, Appointment>(
      func(appointment) {
        { appointment with isNew = false };
      }
    );
    appointmentList.clear();
    for (appointment in updatedAppointments.values()) {
      appointmentList.add(appointment);
    };
  };

  public shared ({ caller }) func updateAppointmentStatus(id : Nat, status : { #pending; #confirmed; #cancelled; #completed }) : async () {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can update appointment status");
    };
    let appointments = appointmentList.toArray();
    let updatedAppointments = appointments.map(
      func(appointment) {
        if (appointment.id == id) {
          { appointment with status };
        } else {
          appointment;
        };
      },
    );
    appointmentList.clear();
    for (appointment in updatedAppointments.vals()) {
      appointmentList.add(appointment);
    };
  };

  public query ({ caller }) func getNewAppointmentsCount() : async Nat {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view new appointments count");
    };
    appointmentList.filter(func(a : Appointment) : Bool { a.isNew }).size();
  };

  public shared func submitTestimonial(testimonial : Testimonial) : async () {
    testimonialList.add(testimonial);
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonialList.toArray();
  };

  public shared func submitInquiry(inquiry : Inquiry) : async () {
    inquiryList.add(inquiry);
  };

  public query ({ caller }) func getInquiries() : async [Inquiry] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view inquiries");
    };
    inquiryList.toArray();
  };

  public query func getPaymentDetails() : async PaymentDetails {
    {
      methods = [
        { method = "Paytm"; number = "+91 7006566575"; upiId = "cpobyoh@oksbi" },
        { method = "Google Pay"; number = "+91 7006566575"; upiId = "cpobyoh@oksbi" },
        { method = "PhonePe"; number = "+91 7006566575"; upiId = "cpobyoh@oksbi" },
      ];
      currency = "INR";
      email = "drtariqherbal@gmail.com";
    };
  };

  // --- Patient Details Functionality ---

  func buildPatientDetailsMap() : Map.Map<Text, PatientDetails> {
    let patientMap = Map.empty<Text, PatientDetails>();

    for (appointment in appointmentList.values()) {
      let contactInfo : ContactInfo = {
        phone = "+91 7006566575";
        address = "Kralhar Kanispora near SBI Bank, Baramulla, Kashmir";
        email = "drtariqherbal@gmail.com";
      };

      let existingPatient = patientMap.get(appointment.patientName);

      switch (existingPatient) {
        case (?patient) {
          if (appointment.timestamp > patient.lastAppointmentTimestamp) {
            let updatedPatient : PatientDetails = {
              patient with
              appointmentCount = patient.appointmentCount + 1;
              mostRecentAppointmentDate = appointment.dateSubmitted;
              lastAppointmentTimestamp = appointment.timestamp;
              status = appointment.status;
              lastVisitStatus = PatientStatusHelper.getPatientStatus(appointment.timestamp);
            };
            patientMap.add(appointment.patientName, updatedPatient);
          } else {
            let updatedPatient : PatientDetails = {
              patient with
              appointmentCount = patient.appointmentCount + 1;
            };
            patientMap.add(appointment.patientName, updatedPatient);
          };
        };
        case (null) {
          let newPatient : PatientDetails = {
            name = appointment.patientName;
            contactInfo;
            appointmentCount = 1;
            mostRecentAppointmentDate = appointment.dateSubmitted;
            lastAppointmentTimestamp = appointment.timestamp;
            status = appointment.status;
            lastVisitStatus = PatientStatusHelper.getPatientStatus(appointment.timestamp);
          };
          patientMap.add(appointment.patientName, newPatient);
        };
      };
    };

    patientMap;
  };

  public query ({ caller }) func getAllPatientDetails() : async [PatientDetails] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can view patient details");
    };
    let patientMap = buildPatientDetailsMap();
    patientMap.values().toArray();
  };

  public query ({ caller }) func searchPatientDetails(searchTerm : Text) : async [PatientDetails] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can search patient details");
    };

    let patientMap = buildPatientDetailsMap();
    let allPatients = patientMap.values().toArray();

    let filteredPatients = allPatients.filter(
      func(patient) {
        textContains(patient.name, searchTerm) or
        textContains(patient.contactInfo.email, searchTerm) or
        textContains(patient.contactInfo.phone, searchTerm)
      }
    );

    filteredPatients.sort(PatientDetails.compareByLastAppointmentTimestamp);
  };

  func textContains(text : Text, searchTerm : Text) : Bool {
    let lowerText = text.toLower();
    let lowerSearchTerm = searchTerm.toLower();
    lowerText.contains(#text lowerSearchTerm);
  };

  public query ({ caller }) func getSortedPatientDetails(sortBy : Nat) : async [PatientDetails] {
    if (not isAdmin(caller)) {
      Runtime.trap("Unauthorized: Only admin can sort patient details");
    };

    let patientMap = buildPatientDetailsMap();
    let patients = patientMap.values().toArray();

    switch (sortBy) {
      case (1) { patients.sort(PatientDetails.compareByAppointmentCount) };
      case (2) { patients.sort(PatientDetails.compareByLastAppointmentTimestamp) };
      case (_) { patients };
    };
  };
};
