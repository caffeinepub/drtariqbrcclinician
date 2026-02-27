import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitInquiry, useGetDoctorProfile, useGetCallerUserProfile, useGetPaymentDetails } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock, AlertCircle, CreditCard, Smartphone } from 'lucide-react';
import { SiPaytm, SiGooglepay, SiPhonepe } from 'react-icons/si';
import { toast } from 'sonner';

// PERMANENT CLINIC CONTACT INFORMATION - DO NOT MODIFY
const PERMANENT_CONTACT_INFO = {
  phone: '+91 7006566575',
  address: 'Kralhar Kanispora near SBI Bank, Baramulla, Kashmir',
  email: 'drtariqherbal@gmail.com',
};

export default function ContactPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: doctorProfile } = useGetDoctorProfile();
  const { data: paymentDetails } = useGetPaymentDetails();
  const submitInquiry = useSubmitInquiry();

  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [message, setMessage] = useState('');

  const isAuthenticated = !!identity;

  // Use backend data with permanent fallback
  const clinicContactInfo = doctorProfile?.contactInfo || PERMANENT_CONTACT_INFO;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit an inquiry');
      return;
    }

    if (!name.trim() || !contactInfo.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const currentDate = new Date().toISOString();

    try {
      await submitInquiry.mutateAsync({
        name,
        contactInfo,
        message,
        dateSubmitted: currentDate,
      });

      toast.success('Your inquiry has been submitted. We will get back to you soon!');
      setName('');
      setContactInfo('');
      setMessage('');
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Inquiry submission error:', error);
    }
  };

  const handleAutoFill = () => {
    if (userProfile) {
      setName(userProfile.name);
      setContactInfo(`${userProfile.email} | ${userProfile.phone}`);
      toast.success('Form auto-filled with your profile information');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Mail className="h-4 w-4" />
          <span>Contact Us</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">Get in Touch</h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Have questions about our services? We're here to help. Reach out to us and we'll respond as soon as
          possible.
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            {!isAuthenticated ? (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="flex items-start gap-4 p-6">
                  <AlertCircle className="h-6 w-6 flex-shrink-0 text-amber-600" />
                  <div>
                    <h3 className="mb-2 font-semibold text-amber-900">Login Required</h3>
                    <p className="text-amber-800">
                      Please login to submit an inquiry. This helps us respond to you more effectively.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-emerald-800">Send Us a Message</CardTitle>
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
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactInfo">Contact Information</Label>
                      <Input
                        id="contactInfo"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="Email and/or phone number"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can we help you?"
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={submitInquiry.isPending}
                    >
                      {submitInquiry.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* PERMANENT Contact Information - DO NOT REMOVE */}
          <div className="space-y-6">
            <Card className="border-emerald-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-emerald-800">Clinic Address</h3>
                    <p className="text-gray-700">{clinicContactInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-full bg-teal-100 p-3">
                    <Phone className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-emerald-800">Phone Number</h3>
                    <p className="text-gray-700">{clinicContactInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-emerald-800">Email</h3>
                    <p className="text-gray-700">{clinicContactInfo.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold text-emerald-800">Business Hours</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Monday - Friday:</span>
                        <span>9:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>10:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options Section */}
            {paymentDetails && (
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-emerald-100 p-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-xl text-emerald-800">Payment Options</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-3 font-semibold text-emerald-800">Accepted Payment Methods</h4>
                    <div className="flex flex-wrap gap-3">
                      {paymentDetails.methods.map((method, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2"
                        >
                          {method.method === 'Paytm' && <SiPaytm className="h-5 w-5 text-blue-600" />}
                          {method.method === 'Google Pay' && <SiGooglepay className="h-5 w-5 text-blue-600" />}
                          {method.method === 'PhonePe' && <SiPhonepe className="h-5 w-5 text-purple-600" />}
                          <span className="text-sm font-medium text-gray-700">{method.method}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border border-emerald-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <div>
                        <h4 className="mb-1 text-sm font-semibold text-emerald-800">Payment Number</h4>
                        <p className="text-sm text-gray-700">{paymentDetails.methods[0]?.number}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CreditCard className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                      <div>
                        <h4 className="mb-1 text-sm font-semibold text-emerald-800">UPI ID</h4>
                        <p className="font-mono text-sm text-gray-700">{paymentDetails.methods[0]?.upiId}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600">
                    You can make payments using any of the above methods for consultations and services.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Map Placeholder */}
            <Card className="border-emerald-200">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 h-12 w-12 text-emerald-600" />
                      <p className="text-sm text-gray-600">Map Location</p>
                      <p className="px-4 text-xs text-gray-500">{clinicContactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
