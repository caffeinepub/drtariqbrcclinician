import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useGetDoctorProfile } from "../hooks/useQueries";

// PERMANENT CLINIC CONTACT INFORMATION - DO NOT MODIFY
const PERMANENT_CONTACT_INFO = {
  phone: "+91 7006566575",
  address: "Kralhar Kanispora near SBI Bank, Baramulla, Kashmir",
  email: "drtariqherbal@gmail.com",
};

export default function AboutPage() {
  const { data: doctorProfile, isLoading } = useGetDoctorProfile();

  // Use backend data with permanent fallback
  const contactInfo = doctorProfile?.contactInfo || PERMANENT_CONTACT_INFO;
  const doctorName = doctorProfile?.name || "Dr. Tariq Akhoon";
  const qualifications =
    doctorProfile?.qualifications ||
    "BNYS/MD, Certified Integrative Medicine Naturopath";
  const biography =
    doctorProfile?.biography ||
    "Dr. Tariq Akhoon is a highly qualified Naturopathic Doctor with expertise in Integrative Medicine.";
  const philosophy =
    doctorProfile?.philosophy ||
    "Our approach focuses on treating the whole person – mind, body, and spirit.";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Leaf className="h-4 w-4" />
          <span>About Us</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">
          Meet {doctorName}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Learn about our founder's journey in naturopathic and integrative
          medicine.
        </p>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 grid gap-8 md:grid-cols-2 md:items-center">
          <div className="overflow-hidden rounded-2xl shadow-xl ring-4 ring-emerald-100">
            <img
              src="/assets/IMG-20250504-WA0008.jpg"
              alt="Dr. Tariq - BRC Clinician"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-emerald-800">
                {doctorName}
              </h2>
              <p className="text-lg font-medium text-emerald-600">
                {qualifications}
              </p>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">{biography}</p>
          </div>
        </div>

        {/* Philosophy Section */}
        <Card className="mb-12 overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8 md:p-12">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-800">
                Our Philosophy
              </h3>
            </div>
            <p className="text-lg leading-relaxed text-gray-700">
              {philosophy}
            </p>
          </CardContent>
        </Card>

        {/* Credentials Grid */}
        <div className="mb-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-emerald-800">
            Qualifications & Expertise
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-4">
                  <Award className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="mb-2 font-semibold text-emerald-800">BNYS/MD</h4>
                <p className="text-sm text-gray-600">
                  Bachelor of Naturopathy and Yogic Sciences with Medical
                  Doctorate
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex rounded-full bg-teal-100 p-4">
                  <BookOpen className="h-8 w-8 text-teal-600" />
                </div>
                <h4 className="mb-2 font-semibold text-emerald-800">
                  Certified Naturopath
                </h4>
                <p className="text-sm text-gray-600">
                  Specialized training in natural healing modalities and
                  therapies
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-4">
                  <Leaf className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="mb-2 font-semibold text-emerald-800">
                  Integrative Medicine
                </h4>
                <p className="text-sm text-gray-600">
                  Expert in combining conventional and natural medicine
                  approaches
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PERMANENT Clinic Details Section - DO NOT REMOVE */}
        <Card className="mb-12 border-emerald-200">
          <CardContent className="p-8 md:p-12">
            <h3 className="mb-6 text-2xl font-bold text-emerald-800">
              Clinic Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-100 p-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-emerald-800">
                    Address
                  </h4>
                  <p className="text-gray-700">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal-100 p-2">
                  <Phone className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-emerald-800">Phone</h4>
                  <p className="text-gray-700">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-100 p-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-emerald-800">Email</h4>
                  <p className="text-gray-700">{contactInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approach Section */}
        <Card className="mb-12 border-emerald-200">
          <CardContent className="p-8 md:p-12">
            <h3 className="mb-6 text-2xl font-bold text-emerald-800">
              Our Approach to Healing
            </h3>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                At BRC Clinician, we believe in treating the whole person, not
                just symptoms. Our integrative approach combines the wisdom of
                traditional naturopathic medicine with evidence-based modern
                practices.
              </p>
              <p className="leading-relaxed">
                We take time to understand each patient's unique health journey,
                lifestyle, and wellness goals. This comprehensive understanding
                allows us to create personalized treatment plans that address
                root causes and promote lasting health.
              </p>
              <p className="leading-relaxed">
                Our practice emphasizes patient education and empowerment. We
                work collaboratively with our patients, providing them with the
                knowledge and tools they need to take an active role in their
                healing process.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/naturopathy-herbs.dim_800x600.jpg"
              alt="Natural herbs"
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/integrative-medicine.dim_800x600.jpg"
              alt="Integrative medicine"
              className="h-64 w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
