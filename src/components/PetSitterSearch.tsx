import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './common/Button';

interface PetSitterSearchProps {
  onClose: () => void;
}

interface FormData {
  petTypes: string[];
  city: string;
  startDate: string;
  endDate: string;
}

const PetSitterSearch: React.FC<PetSitterSearchProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    petTypes: [],
    city: '',
    startDate: '',
    endDate: '',
  });

  const petTypeOptions = [
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
    { value: 'bird', label: 'Bird' },
    { value: 'small-mammal', label: 'Small Mammal' },
    { value: 'reptile', label: 'Reptile' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search data:', formData);
  };

  const handlePetTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      petTypes: prev.petTypes.includes(value)
        ? prev.petTypes.filter(type => type !== value)
        : [...prev.petTypes, value]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-accent-500 transition-colors"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Find Your Perfect Pet Sitter</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Types (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {petTypeOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.petTypes.includes(option.value)}
                      onChange={() => handlePetTypeChange(option.value)}
                      className="h-4 w-4 text-accent-500 rounded focus:ring-accent-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-accent-500 focus:border-accent-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit">
                Search Pet Sitters
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PetSitterSearch;