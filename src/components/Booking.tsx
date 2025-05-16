import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import SectionHeading from './common/SectionHeading';
import Button from './common/Button';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  service: string;
  date: string;
  time: string;
  notes: string;
}

const Booking: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    petName: '',
    petType: 'dog',
    service: 'daily-walks',
    date: '',
    time: '',
    notes: '',
  });

  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setFormStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Book Our Services"
          subtitle="Schedule care for your furry friend"
          centered
        />

        <div className="max-w-3xl mx-auto mt-12">
          {!isSubmitted ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200">
                <div
                  className={`flex-1 py-4 text-center font-medium ${
                    formStep === 1 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="hidden sm:inline">Your Information</span>
                  <span className="sm:hidden">1. Info</span>
                </div>
                <div
                  className={`flex-1 py-4 text-center font-medium ${
                    formStep === 2 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="hidden sm:inline">Pet Details</span>
                  <span className="sm:hidden">2. Pet</span>
                </div>
                <div
                  className={`flex-1 py-4 text-center font-medium ${
                    formStep === 3 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-500'
                  }`}
                >
                  <span className="hidden sm:inline">Schedule & Confirm</span>
                  <span className="sm:hidden">3. Schedule</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                {formStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-xl font-semibold mb-4">Your Information</h3>
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button type="button" onClick={nextStep}>
                        Next: Pet Details
                      </Button>
                    </div>
                  </div>
                )}

                {formStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-xl font-semibold mb-4">Pet Details</h3>
                    
                    <div>
                      <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">
                        Pet's Name
                      </label>
                      <input
                        type="text"
                        id="petName"
                        name="petName"
                        value={formData.petName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="petType" className="block text-sm font-medium text-gray-700 mb-1">
                        Type of Pet
                      </label>
                      <select
                        id="petType"
                        name="petType"
                        value={formData.petType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="dog">Dog</option>
                        <option value="cat">Cat</option>
                        <option value="bird">Bird</option>
                        <option value="small-mammal">Small Mammal</option>
                        <option value="reptile">Reptile</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                        Service Needed
                      </label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="daily-walks">Daily Dog Walks</option>
                        <option value="home-visits">In-Home Pet Sitting</option>
                        <option value="overnight">Overnight Care</option>
                        <option value="pet-taxi">Pet Taxi Services</option>
                      </select>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button type="button" onClick={nextStep}>
                        Next: Schedule
                      </Button>
                    </div>
                  </div>
                )}

                {formStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <h3 className="text-xl font-semibold mb-4">Schedule & Confirm</h3>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            required
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special requirements or information about your pet..."
                      ></textarea>
                    </div>
                    
                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                      <Button type="submit">
                        Book Now
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fadeIn">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for booking with PawKeeper. We'll be in touch within 2 hours to confirm your appointment and discuss any additional details.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  A confirmation email has been sent to <strong>{formData.email}</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Booking;