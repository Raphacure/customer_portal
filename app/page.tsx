import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Ambulance,
  Building2,
  Calendar,
  HeartPulse,
  Microscope,
  Phone,
  Pill,
  Search,
  Stethoscope,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-slate-50 dark:bg-slate-950">
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
                Healthcare that comes to you
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Experience the future of healthcare with RaphaCure. From teleconsultations to home diagnostics, we bring quality care to your doorstep.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <Input
                  className="max-w-lg flex-1 bg-background"
                  placeholder="Search for doctors, tests, or services..."
                  type="text"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Book Consultation
              </Button>
              <Button variant="outline" size="lg">
                View Health Packages
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400 blur-[100px]" />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Our Services
            </h2>
            <p className="text-gray-500 md:text-lg dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed around your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="group hover:shadow-lg transition-all duration-200 border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    <service.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Wellness Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                Corporate Wellness
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Healthy Employees, Healthy Business
              </h2>
              <p className="text-gray-500 md:text-lg dark:text-gray-400">
                We partner with organizations to provide comprehensive wellness programs, health checks, and emergency care for employees. Reduce claims and boost productivity with RaphaCure.
              </p>
              <ul className="space-y-2">
                {[
                  "On-site Health Checks",
                  "Mental Wellness Programs",
                  "24/7 Doctor Access",
                  "Emergency Ambulance Support"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-4">
                Learn More
              </Button>
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
               {/* Placeholder for an image */}
               <Building2 className="h-24 w-24 text-slate-400" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-purple-600 text-white">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">
            Ready to prioritize your health?
          </h2>
          <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who trust RaphaCure for their medical needs.
            Download our app or book online today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Phone className="mr-2 h-4 w-4" />
              Call 24/7 Helpline
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Calendar className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    title: "Doctor Consultation",
    description:
      "Connect with top specialists via video call or book in-clinic visits. Available 24/7.",
    icon: Stethoscope,
  },
  {
    title: "Lab Tests & Diagnostics",
    description:
      "Book blood tests and full body checkups from home. NABL certified labs.",
    icon: Microscope,
  },
  {
    title: "Medicine Delivery",
    description:
      "Order prescription medicines and wellness products delivered to your doorstep.",
    icon: Pill,
  },
  {
    title: "Ambulance Services",
    description:
      "Quick emergency response and patient transport services when you need them most.",
    icon: Ambulance,
  },
  {
    title: "Home Nursing Care",
    description:
      "Professional nursing care, elderly care, and physiotherapy at home.",
    icon: HeartPulse,
  },
  {
    title: "Wellness Packages",
    description:
      "Curated health packages for preventive care and lifestyle management.",
    icon: Activity,
  },
];
