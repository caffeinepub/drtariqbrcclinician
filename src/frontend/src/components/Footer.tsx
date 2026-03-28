import { Heart, Mail, MapPin, Phone } from "lucide-react";

// PERMANENT CLINIC CONTACT INFORMATION - DO NOT MODIFY
// These values are hardcoded to ensure they remain permanent across all builds
const PERMANENT_CONTACT_INFO = {
  phone: "+91 7006566575",
  address: "Kralhar Kanispora near SBI Bank, Baramulla, Kashmir",
  email: "drtariqherbal@gmail.com",
};

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Logo and Branding */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <div className="flex items-center gap-2 text-emerald-800">
              <img
                src="/assets/generated/dr-brc-logo-transparent.dim_200x200.png"
                alt="Dr BRC Clinician Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold">BRC Clinician</span>
            </div>
            <p className="text-sm text-gray-600">
              Natural Healing & Integrative Medicine
            </p>
          </div>

          {/* PERMANENT Contact Information - DO NOT REMOVE */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <h3 className="font-semibold text-emerald-800">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" style={{ color: "#FF0000" }} />
                <span>{PERMANENT_CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin
                  className="mt-0.5 h-4 w-4 flex-shrink-0"
                  style={{ color: "#FF0000" }}
                />
                <span>{PERMANENT_CONTACT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: "#FF0000" }} />
                <span>{PERMANENT_CONTACT_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Attribution */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="text-center text-sm text-gray-600 md:text-right">
              © 2025. Built with{" "}
              <Heart className="inline h-4 w-4 fill-rose-500 text-rose-500" />{" "}
              using{" "}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
