'use client';

import React from 'react';
import { useOrder } from '@/contexts/OrderContext';
import { CustomerDetailsStep } from './CustomerDetailsStep';
import { ProductSelectionStep } from './ProductSelectionStep';
import { DeliveryStep } from './DeliveryStep';
import { OrderReviewStep } from './OrderReviewStep';
import { OrderConfirmationStep } from './OrderConfirmationStep';

export function OrderForm() {
    const { state, utils } = useOrder();

    const renderCurrentStep = () => {
        switch (state.currentStep) {
            case 0:
                return <CustomerDetailsStep />;
            case 1:
                return <ProductSelectionStep />;
            case 2:
                return <DeliveryStep />;
            case 3:
                return <OrderReviewStep />;
            case 4:
                return <OrderConfirmationStep />;
            default:
                return <CustomerDetailsStep />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        DS Fueling
                    </h1>
                    <p className="text-lg text-gray-600">
                        Premium Fuel Supply Solutions
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-8">
                    {/* Mobile Progress - Horizontal Scrollable */}
                    <div className="block sm:hidden mb-4">
                        <div className="relative">
                            {/* Scroll hint gradient */}
                            <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10"></div>
                            
                            <div className="overflow-x-auto pb-2 scrollbar-hide">
                                <div className="flex items-center space-x-3 px-4" style={{ minWidth: 'max-content' }}>
                                    {Array.from({ length: utils.getTotalSteps() - 1 }, (_, index) => {
                                        const stepNames = ['Details', 'Products', 'Delivery', 'Review', 'Confirm'];
                                        return (
                                            <React.Fragment key={index}>
                                                <div className="flex flex-col items-center space-y-1">
                                                    <div
                                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 shadow-sm transition-all duration-200 ${state.currentStep > index
                                                                ? 'bg-black text-white'
                                                                : state.currentStep === index
                                                                    ? 'bg-black text-white ring-2 ring-black ring-opacity-20'
                                                                    : 'bg-gray-200 text-gray-600'
                                                            }`}
                                                    >
                                                        {state.currentStep > index ? (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <span className={`text-xs font-medium whitespace-nowrap transition-colors duration-200 ${state.currentStep === index ? 'text-black' : 'text-gray-500'}`}>
                                                        {stepNames[index]}
                                                    </span>
                                                </div>
                                                {index < utils.getTotalSteps() - 2 && (
                                                    <div
                                                        className={`h-0.5 w-8 flex-shrink-0 transition-colors duration-200 ${state.currentStep > index ? 'bg-black' : 'bg-gray-200'}`}
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Progress - Original Layout */}
                    <div className="hidden sm:flex items-center justify-center space-x-4 mb-4">
                        {Array.from({ length: utils.getTotalSteps() - 1 }, (_, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${state.currentStep > index
                                                ? 'bg-black text-white'
                                                : state.currentStep === index
                                                    ? 'bg-black text-white ring-2 ring-black ring-opacity-20'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {state.currentStep > index ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                </div>
                                {index < utils.getTotalSteps() - 2 && (
                                    <div
                                        className={`flex-1 h-1 transition-colors duration-200 ${state.currentStep > index ? 'bg-black' : 'bg-gray-200'
                                            }`}
                                        style={{ minWidth: '40px' }}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Current Step Info */}
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">
                            Step {state.currentStep + 1} of {utils.getTotalSteps() - 1}: {utils.getCurrentStepName()}
                        </p>
                    </div>
                </div>

                {/* Current Step Content */}
                <div className="mb-8">
                    {renderCurrentStep()}
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 mt-12 space-y-2">
                    <p>DS Fueling - Premium Fuel Supply Solutions</p>
                    <p>Need help? Contact us at support@dsfueling.com or call +27 123 456 789</p>
                </div>
            </div>

            {/* Loading Overlay */}
            {state.isLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                        <p className="font-medium">Processing your order...</p>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {state.error && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    <p className="font-medium">{state.error}</p>
                </div>
            )}
        </div>
    );
}