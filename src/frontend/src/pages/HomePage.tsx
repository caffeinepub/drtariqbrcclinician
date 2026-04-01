import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  Heart,
  LayoutDashboard,
  Leaf,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetDoctorProfile, useGetHomePage } from "../hooks/useQueries";

// PERMANENT CLINIC CONTACT INFORMATION - DO NOT MODIFY
const PERMANENT_CONTACT_INFO = {
  phone: "+91 7006566575",
  address: "Kralhar Kanispora near SBI Bank, Baramulla, Kashmir",
  email: "drtariqherbal@gmail.com",
};

const PERMANENT_HEADLINE = "Welcome to Dr BRC Clinician — Dr Tariq Akhoon";
const PERMANENT_DOCTOR_NAME = "Dr. Tariq Akhoon";
const PERMANENT_QUALIFICATIONS =
  "BNYS/MD, Certified Integrative Medicine Naturopath";
const PERMANENT_BIOGRAPHY =
  "Dr. Tariq Akhoon is a highly qualified Naturopathic Doctor with expertise in Integrative Medicine. He combines traditional naturopathic treatments with modern medical approaches to provide comprehensive patient care.";
const PERMANENT_PHILOSOPHY =
  "Our approach focuses on treating the whole person – mind, body, and spirit. We believe in the body's innate ability to heal and strive to restore balance through natural therapies and evidence-based integrative practices.";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: doctorProfile } = useGetDoctorProfile();
  const { data: homePage } = useGetHomePage();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  // Use backend data with permanent fallback - NO LOADING STATES for static content
  const contactInfo = doctorProfile?.contactInfo || PERMANENT_CONTACT_INFO;
  const doctorName = doctorProfile?.name || PERMANENT_DOCTOR_NAME;
  const qualifications =
    doctorProfile?.qualifications || PERMANENT_QUALIFICATIONS;
  const biography = doctorProfile?.biography || PERMANENT_BIOGRAPHY;
  const philosophy = doctorProfile?.philosophy || PERMANENT_PHILOSOPHY;
  const headline = homePage?.headline || PERMANENT_HEADLINE;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white">
        <div className="absolute inset-0 bg-[url('/assets/natural-healing.dim_600x400.jpg')] bg-cover bg-center opacity-10" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm">
                <Leaf className="h-4 w-4" />
                <span>Natural Healing & Integrative Medicine</span>
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                {headline}
              </h1>
              <p className="text-lg text-emerald-50 md:text-xl">
                Experience holistic healthcare with {doctorName}, a certified
                naturopathic doctor specializing in integrative medicine. We
                treat the whole person – mind, body, and spirit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => navigate({ to: "/appointments" })}
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-emerald-50"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button
                  onClick={() => navigate({ to: "/services" })}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Explore Services
                </Button>
                {/* Admin Login / Dashboard Button */}
                <Button
                  onClick={() => navigate({ to: "/admin/dashboard" })}
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  {isAuthenticated ? (
                    <>
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      My Dashboard
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Admin Login
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/20">
                <img
                  src="/assets/img_20260401_145036-019d4858-d3f7-7575-9c32-2a3803da1d90.png"
                  alt="Dr. Tariq Akhoon - BRC Clinician"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Certified
                    </p>
                    <p className="text-xs text-gray-600">BNYS/MD</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dr BRC Logo Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-emerald-100 transition-transform hover:scale-105">
            <img
              src="/assets/generated/dr-brc-logo-transparent.dim_200x200.png"
              alt="Dr BRC Clinician Logo"
              className="h-32 w-32 object-contain sm:h-40 sm:w-40 md:h-48 md:w-48"
            />
          </div>
        </div>
      </section>

      {/* PERMANENT Contact Information Section - DO NOT REMOVE */}
      <section className="container mx-auto px-4">
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-emerald-800">
              Contact Information
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <Phone className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-emerald-800">Phone</h3>
                  <p className="text-gray-700">{contactInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal-100 p-3">
                  <MapPin className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-emerald-800">
                    Address
                  </h3>
                  <p className="text-gray-700">{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <Mail className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-emerald-800">Email</h3>
                  <p className="text-gray-700">{contactInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* About Dr. Tariq */}
      <section className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-emerald-800 md:text-4xl">
            Meet {doctorName}
          </h2>
          <p className="mb-2 text-lg font-medium text-emerald-600">
            {qualifications}
          </p>
          <p className="text-lg leading-relaxed text-gray-700">{biography}</p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="container mx-auto px-4">
        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
          <CardContent className="p-8 md:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-emerald-100 p-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-emerald-800 md:text-3xl">
                Our Healing Philosophy
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {philosophy}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-emerald-800 md:text-4xl">
          Why Choose Natural Medicine?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-3">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-emerald-800">
                Natural Therapies
              </h3>
              <p className="text-gray-600">
                Harness the power of nature with herbal medicine, nutritional
                counseling, and holistic treatments tailored to your unique
                needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-full bg-teal-100 p-3">
                <Sparkles className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-emerald-800">
                Integrative Approach
              </h3>
              <p className="text-gray-600">
                Combining the best of conventional medicine with evidence-based
                natural therapies for comprehensive care.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-full bg-emerald-100 p-3">
                <Heart className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-emerald-800">
                Personalized Care
              </h3>
              <p className="text-gray-600">
                Every patient receives individualized attention and treatment
                plans designed specifically for their health goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-emerald-800 md:text-4xl">
          Our Healing Environment
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/naturopathy-herbs.dim_800x600.jpg"
              alt="Natural herbs and remedies"
              className="h-64 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/integrative-medicine.dim_800x600.jpg"
              alt="Integrative medicine approach"
              className="h-64 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/clinic-interior.dim_1024x768.jpg"
              alt="Clinic interior"
              className="h-64 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg">
            <img
              src="/assets/generated/wellness-meditation.dim_800x600.jpg"
              alt="Wellness and meditation"
              className="h-64 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-xl shadow-lg md:col-span-2">
            <img
              src="/assets/generated/natural-healing.dim_600x400.jpg"
              alt="Natural healing"
              className="h-64 w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="overflow-hidden border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Start Your Healing Journey?
            </h2>
            <p className="mb-8 text-lg text-emerald-50">
              Book your consultation today and take the first step towards
              natural wellness.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => navigate({ to: "/appointments" })}
                size="lg"
                className="bg-white text-emerald-700 hover:bg-emerald-50"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Appointment
              </Button>
              <Button
                onClick={() => navigate({ to: "/contact" })}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
