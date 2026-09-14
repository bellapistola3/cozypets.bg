import React from 'react';
import { X, CheckCircle2, Search } from 'lucide-react';
import { ServiceType } from '../../lib/services/servicesList';
import Button from '../common/Button';

interface ServiceModalProps {
    service: ServiceType;
    isOpen: boolean;
    onClose: () => void;
    onSearch: (serviceId: string) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ service, isOpen, onClose, onSearch }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all animate-scaleIn">
                {/* Header Image/Icon Section */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center relative">
                    <div className="text-7xl drop-shadow-lg">{service.icon}</div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>
                </div>

                <div className="p-8 sm:p-10">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{service.name}</h2>
                        <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                            {service.priceRange}
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            {service.longDescription || service.description}
                        </p>
                    </div>

                    {service.benefits && service.benefits.length > 0 && (
                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Какво включва услугата:</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {service.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Button
                            onClick={() => onSearch(service.id)}
                            className="flex-1 py-4 text-lg font-bold shadow-orange-200"
                        >
                            <Search className="h-5 w-5 mr-2" />
                            Намери подходящ гледач
                        </Button>
                        <button
                            onClick={onClose}
                            className="px-8 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                        >
                            Затвори
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;
