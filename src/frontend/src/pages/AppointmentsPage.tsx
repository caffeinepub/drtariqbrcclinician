import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Leaf,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { SiGooglepay, SiPaytm, SiPhonepe } from "react-icons/si";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetEmailSettings,
  useGetPaymentDetails,
  useSubmitAppointment,
} from "../hooks/useQueries";
import { ConsultationType, Status } from "../types";

export default function AppointmentsPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: paymentDetails } = useGetPaymentDetails();
  const { data: emailSettings } = useGetEmailSettings();
  const submitAppointment = useSubmitAppointment();

  const [patientName, setPatientName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [consultationType, setConsultationType] = useState<
    "online" | "clinicVisit"
  >("clinicVisit");
  const [healthConcerns, setHealthConcerns] = useState("");

  const isAuthenticated = !!identity;
  const emailNotificationsEnabled = emailSettings?.isEnabled ?? true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to book an appointment");
      return;
    }

    // Validate all required fields
    if (!patientName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!contactInfo.trim()) {
      toast.error("Please enter your contact information");
      return;
    }

    if (!preferredDate) {
      toast.error("Please select a preferred date");
      return;
    }

    if (!preferredTime) {
      toast.error("Please select a preferred time");
      return;
    }

    if (!healthConcerns.trim()) {
      toast.error("Please describe your health concerns");
      return;
    }

    const preferredDateTime = `${preferredDate} ${preferredTime}`;
    const currentDate = new Date().toISOString();

    try {
      const appointmentId = await submitAppointment.mutateAsync({
        id: BigInt(0),
        patientName: patientName.trim(),
        contactInfo: contactInfo.trim(),
        preferredDateTime,
        consultationType:
          consultationType === "online"
            ? ConsultationType.online
            : ConsultationType.clinicVisit,
        healthConcerns: healthConcerns.trim(),
        status: Status.pending,
        dateSubmitted: currentDate,
        isNew: true,
        timestamp: BigInt(0),
      });

      // Success - appointment was saved
      toast.success(
        "Appointment request submitted successfully! We will contact you soon to confirm.",
      );

      // Reset form
      setPatientName("");
      setContactInfo("");
      setPreferredDate("");
      setPreferredTime("");
      setHealthConcerns("");
      setConsultationType("clinicVisit");

      console.log("Appointment submitted with ID:", appointmentId);
    } catch (error: any) {
      console.error("Appointment submission error:", error);

      // Show appropriate error message
      const errorMessage = error?.message || "Failed to submit appointment";
      toast.error(`Error: ${errorMessage}. Please try again.`);
    }
  };

  // Pre-fill form with user profile data if available
  const handleAutoFill = () => {
    if (userProfile) {
      setPatientName(userProfile.name);
      setContactInfo(`${userProfile.email} | ${userProfile.phone}`);
      toast.success("Form auto-filled with your profile information");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Calendar className="h-4 w-4" />
          <span>Book Appointment</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">
          Schedule Your Consultation
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Take the first step towards natural wellness. Book an online
          consultation or clinic visit with Dr. Tariq.
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Email Notification Info */}
        {emailNotificationsEnabled && (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4" style={{ color: "#FF0000" }} />
            <AlertTitle className="text-emerald-800">
              Email notifications: Enabled
            </AlertTitle>
            <AlertDescription className="text-emerald-700">
              When you submit an appointment request, an automatic email
              notification will be sent to Dr. Tariq at{" "}
              <strong>
                {emailSettings?.recipientEmail || "drtariqherbal@gmail.com"}
              </strong>
              . You will receive confirmation shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* Consultation Fee Card */}
        <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <IndianRupee className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">
                  Naturopathic Consultation
                </h3>
                <p className="text-sm text-gray-600">
                  Initial consultation fee
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-2xl font-bold text-emerald-700">
                <IndianRupee className="h-6 w-6" />
                <span>600</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated ? (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h3 className="mb-2 font-semibold text-amber-900">
                  Login Required
                </h3>
                <p className="text-amber-800">
                  Please login to book an appointment. This helps us maintain
                  your appointment history and provide better service.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-2xl text-emerald-800">
                Appointment Details
              </CardTitle>
              <CardDescription>
                Fill in the form below to request an appointment. We'll contact
                you to confirm your booking.
              </CardDescription>
              {userProfile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFill}
                  className="mt-2 w-fit border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Auto-fill with my profile
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">
                    Patient Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    disabled={submitAppointment.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactInfo">
                    Contact Information <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Email and/or phone number"
                    required
                    disabled={submitAppointment.isPending}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">
                      Preferred Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="preferredDate"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="pl-10"
                        min={new Date().toISOString().split("T")[0]}
                        required
                        disabled={submitAppointment.isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime">
                      Preferred Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="preferredTime"
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="pl-10"
                        required
                        disabled={submitAppointment.isPending}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultationType">
                    Consultation Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={consultationType}
                    onValueChange={(value: any) => setConsultationType(value)}
                    disabled={submitAppointment.isPending}
                  >
                    <SelectTrigger id="consultationType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinicVisit">Clinic Visit</SelectItem>
                      <SelectItem value="online">
                        Online Consultation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthConcerns">
                    Health Concerns / Reason for Visit{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="healthConcerns"
                    value={healthConcerns}
                    onChange={(e) => setHealthConcerns(e.target.value)}
                    placeholder="Please describe your health concerns or reason for consultation..."
                    rows={5}
                    required
                    disabled={submitAppointment.isPending}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={submitAppointment.isPending}
                >
                  {submitAppointment.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Appointment Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex rounded-full bg-emerald-100 p-2">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mb-2 font-semibold text-emerald-800">
                What to Expect
              </h3>
              <p className="text-sm text-gray-700">
                Your first consultation will include a comprehensive health
                assessment and discussion of your wellness goals. Please bring
                any relevant medical records.
              </p>
            </CardContent>
          </Card>

          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-6">
              <div className="mb-3 inline-flex rounded-full bg-teal-100 p-2">
                <Clock className="h-5 w-5 text-teal-600" />
              </div>
              <h3 className="mb-2 font-semibold text-teal-800">
                Appointment Duration
              </h3>
              <p className="text-sm text-gray-700">
                Initial consultations typically last 60-90 minutes. Follow-up
                appointments are usually 30-45 minutes. We ensure adequate time
                for thorough care.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Options Section */}
        {paymentDetails && (
          <Card className="mt-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-100 p-2">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-emerald-800">
                  Payment Options
                </CardTitle>
              </div>
              <CardDescription>
                We accept digital payments for your convenience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-3 font-semibold text-emerald-800">
                  Accepted Payment Methods
                </h4>
                <div className="flex flex-wrap gap-4">
                  {paymentDetails.methods.map((method) => (
                    <div
                      key={method.method}
                      className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2"
                    >
                      {method.method === "Paytm" && (
                        <SiPaytm className="h-5 w-5 text-blue-600" />
                      )}
                      {method.method === "Google Pay" && (
                        <SiGooglepay className="h-5 w-5 text-blue-600" />
                      )}
                      {method.method === "PhonePe" && (
                        <SiPhonepe className="h-5 w-5 text-purple-600" />
                      )}
                      <span className="font-medium text-gray-700">
                        {method.method}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <h4 className="mb-1 font-semibold text-emerald-800">
                      Payment Number
                    </h4>
                    <p className="text-gray-700">
                      {paymentDetails.methods[0]?.number}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <h4 className="mb-1 font-semibold text-emerald-800">
                      UPI ID
                    </h4>
                    <p className="font-mono text-gray-700">
                      {paymentDetails.methods[0]?.upiId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-white p-4">
                <p className="text-sm text-gray-600">
                  <strong className="text-emerald-800">Note:</strong> After
                  booking your appointment, you can make payment using any of
                  the above methods. Please keep your payment confirmation for
                  reference.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
