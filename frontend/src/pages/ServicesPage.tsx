import { useGetAllServices } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, IndianRupee } from 'lucide-react';

// PERMANENT SERVICE INFORMATION - DO NOT MODIFY
// These are the core BRC Clinician services with correct pricing
const PERMANENT_SERVICES = [
  {
    id: 1n,
    name: 'Naturopathic Consultation',
    description: 'Comprehensive assessment and personalized treatment planning using natural healing methods',
    serviceType: {
      serviceTypeName: 'Initial Consultation',
      serviceTypePrice: 600,
    },
  },
  {
    id: 2n,
    name: 'Integrative Medicine Therapy',
    description: 'Holistic treatment combining conventional and alternative medicine approaches',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 3n,
    name: 'Nutritional Counseling',
    description: 'Personalized dietary guidance and nutritional therapy for optimal health',
    serviceType: {
      serviceTypeName: 'Counseling Session',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 4n,
    name: 'Herbal Medicine',
    description: 'Traditional herbal remedies and plant-based therapeutic treatments',
    serviceType: {
      serviceTypeName: 'Herbal Remedies',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 5n,
    name: 'Stress Management Program',
    description: 'Comprehensive stress reduction techniques and wellness strategies',
    serviceType: {
      serviceTypeName: 'Program Session',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 6n,
    name: 'Electro Magnetic Therapy',
    description: 'Therapeutic electromagnetic field treatment for healing and pain relief',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 500,
    },
  },
  {
    id: 7n,
    name: 'Hot and Cold Therapy',
    description: 'Alternating temperature therapy for improved circulation and recovery',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 300,
    },
  },
  {
    id: 8n,
    name: 'Steaming Therapy',
    description: 'Steam-based treatment for detoxification and respiratory wellness',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 200,
    },
  },
  {
    id: 9n,
    name: 'Hot Water Emersion',
    description: 'Therapeutic hot water immersion therapy for muscle relaxation and healing',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 10n,
    name: 'DIP Diet Therapy',
    description: 'Specialized dietary intervention program for optimal health outcomes',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 1000,
    },
  },
  {
    id: 11n,
    name: 'Mud Therapy',
    description: 'Natural mud-based treatment for skin health and detoxification',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 500,
    },
  },
  {
    id: 12n,
    name: 'Face Therapy',
    description: 'Specialized facial treatment for skin rejuvenation and wellness',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 500,
    },
  },
  {
    id: 13n,
    name: 'Taping for Disc and Heating Therapy',
    description: 'Therapeutic taping combined with heat treatment for spinal health',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 500,
    },
  },
  {
    id: 14n,
    name: 'Massage Therapy',
    description: 'Professional therapeutic massage for muscle relaxation and stress relief',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 300,
    },
  },
  {
    id: 15n,
    name: 'Zero Volt Therapy Guide',
    description: 'Specialized electrical therapy guidance for pain management and healing',
    serviceType: {
      serviceTypeName: 'Therapy Session',
      serviceTypePrice: 500,
    },
  },
];

export default function ServicesPage() {
  const { data: backendServices } = useGetAllServices();

  // Use backend services if available, otherwise use permanent fallback - NO LOADING STATES
  const services = backendServices && backendServices.length > 0 ? backendServices : PERMANENT_SERVICES;

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          <Leaf className="h-4 w-4" />
          <span>Our Services</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-emerald-800 md:text-5xl">
          Naturopathic & Integrative Care
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Discover our comprehensive range of natural healing services designed to restore balance and promote
          optimal health.
        </p>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id.toString()}
              className="border-emerald-200 transition-all hover:shadow-lg hover:shadow-emerald-100"
            >
              <CardHeader>
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-full bg-emerald-100 p-3">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                    {service.serviceType.serviceTypeName}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-emerald-800">{service.name}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
                  <IndianRupee className="h-5 w-5" />
                  <span>{service.serviceType.serviceTypePrice.toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mx-auto mt-16 max-w-4xl rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold text-emerald-800">Not Sure Which Service is Right for You?</h2>
        <p className="mb-6 text-gray-700">
          Schedule a consultation with Dr. Tariq to discuss your health concerns and create a personalized
          treatment plan.
        </p>
        <p className="text-sm text-gray-600">
          All services are tailored to your individual needs and may be combined for optimal results.
        </p>
      </div>
    </div>
  );
}
