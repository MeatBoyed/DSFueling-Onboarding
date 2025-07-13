'use client';

import React, { useState } from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CustomerDetailsStep() {
    const { state, actions } = useOrder();

    // Local form state
    const [formData, setFormData] = useState({
        name: state.order.customer?.name || '',
        surname: state.order.customer?.surname || '',
        phone: state.order.customer?.phone || '',
        email: state.order.customer?.email || '',
        address: state.order.customer?.address || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.surname.trim()) newErrors.surname = 'Surname is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';

        // Basic email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Basic phone validation (South African format)
        if (formData.phone && !/^(\+27|0)[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid South African phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            actions.setCustomerDetails(formData);
            actions.nextStep();
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const isFormValid = formData.name && formData.surname && formData.phone && formData.email && formData.address;

    return (
        <div className="w-full max-w-lg mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Customer Details</h2>
                    <p className="text-sm text-gray-600 mt-1">Your contact information for delivery</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="name" className="text-xs font-medium text-gray-700 mb-1 block">
                                First Name *
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="John"
                                className="h-9 text-sm"
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="surname" className="text-xs font-medium text-gray-700 mb-1 block">
                                Surname *
                            </Label>
                            <Input
                                id="surname"
                                value={formData.surname}
                                onChange={(e) => handleInputChange('surname', e.target.value)}
                                placeholder="Doe"
                                className="h-9 text-sm"
                            />
                            {errors.surname && <p className="text-xs text-red-600 mt-1">{errors.surname}</p>}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="phone" className="text-xs font-medium text-gray-700 mb-1 block">
                            Phone Number *
                        </Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="0123456789"
                            className="h-9 text-sm"
                        />
                        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-xs font-medium text-gray-700 mb-1 block">
                            Email Address *
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="john@example.com"
                            className="h-9 text-sm"
                        />
                        {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <Label htmlFor="address" className="text-xs font-medium text-gray-700 mb-1 block">
                            Delivery Address *
                        </Label>
                        <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="123 Main St, City, Postal Code"
                            className="h-9 text-sm"
                        />
                        {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                    </div>

                    <Button 
                        type="submit"
                        className="w-full h-10 bg-black text-white hover:bg-gray-800 text-sm font-medium"
                        disabled={!isFormValid}
                    >
                        Continue to Products
                    </Button>
                </form>
            </div>
        </div>
    );
}