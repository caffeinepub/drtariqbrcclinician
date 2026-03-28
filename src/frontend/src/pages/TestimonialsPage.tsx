import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetTestimonials,
  useSubmitTestimonial,
} from "../hooks/useQueries";

export default function TestimonialsPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: testimonials, isLoading } = useGetTestimonials();
  const submitTestimonial = useSubmitTestimonial();

  const [showForm, setShowForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please login to submit a testimonial");
      return;
    }

    if (!patientName.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const currentDate = new Date().toISOString();

    try {
      await submitTestimonial.mutateAsync({
        patientName,
        message,
        rating,
        dateSubmitted: currentDate,
      });

      toast.success("Thank you for your testimonial!");
      setShowForm(false);
      setPatientName("");
      setMessage("");
      setRating(5);
    } catch (error) {
      toast.error("Failed to submit testimonial. Please try again.");
      console.error("Testimonial submission error:", error);
    }
  };

  const handleAutoFill = () => {
    if (userProfile) {
      setPatientName(userProfile.name);
      toast.success("Name auto-filled from your profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <MessageCircle className="h-4 w-4" />
          <span>Patient Testimonials</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">
          What Our Patients Say
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Read about the healing experiences of our patients and their journey
          to wellness.
        </p>
      </div>

      {/* Add Testimonial Button */}
      <div className="mb-12 text-center">
        {isAuthenticated ? (
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "Share Your Experience"}
          </Button>
        ) : (
          <Card className="mx-auto max-w-2xl border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-4 p-6">
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="mb-2 font-semibold text-amber-900">
                  Login to Share Your Experience
                </h3>
                <p className="text-amber-800">
                  Please login to submit a testimonial about your experience
                  with BRC Clinician.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Testimonial Form */}
      {showForm && isAuthenticated && (
        <Card className="mx-auto mb-12 max-w-2xl border-emerald-200">
          <CardHeader>
            <CardTitle className="text-2xl text-emerald-800">
              Share Your Experience
            </CardTitle>
            {userProfile && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                className="mt-2 w-fit border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                Use my profile name
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientName">Your Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter your name (or initials for privacy)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Testimonial</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your experience with Dr. Tariq and BRC Clinician..."
                  rows={5}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={submitTestimonial.isPending}
              >
                {submitTestimonial.isPending
                  ? "Submitting..."
                  : "Submit Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Testimonials Grid */}
      {testimonials && testimonials.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={`testimonial-${index}-${testimonial.patientName}`}
              className="border-emerald-200 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {(["1", "2", "3", "4", "5"] as const).map((starId, i) => (
                    <Star
                      key={starId}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mb-4 text-gray-700 italic">
                  "{testimonial.message}"
                </p>
                <div className="border-t border-emerald-100 pt-4">
                  <p className="font-semibold text-emerald-800">
                    {testimonial.patientName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(testimonial.dateSubmitted).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-2xl border-emerald-200">
          <CardContent className="p-12 text-center">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-emerald-300" />
            <h3 className="mb-2 text-xl font-semibold text-emerald-800">
              No Testimonials Yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your experience with BRC Clinician!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
