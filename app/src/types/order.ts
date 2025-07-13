export interface CustomerDetails {
    name: string;
    surname: string;
    phone: string;
    email: string;
    address: string;
}

export interface ProductDetails {
    type: 'ethanol' | 'methanol';
    quantity: number;
    format: 'bottle' | 'barrel'; // bottle = 20L, barrel = 200L
}

export interface DeliveryDetails {
    type: 'same-day' | 'standard'; // same-day or 1-3 days
}

export interface PricingDetails {
    unitPrice: number;
    totalBeforeDiscount: number;
    discount: number;
    discountPercentage: number;
    totalAfterDiscount: number;
}

export interface Order {
    id?: string;
    customer: CustomerDetails;
    product: ProductDetails;
    delivery: DeliveryDetails;
    pricing: PricingDetails;
    confirmed: boolean;
    createdAt?: Date;
}

export interface OrderState {
    currentStep: number;
    order: Partial<Order>;
    isLoading: boolean;
    error: string | null;
}

export type OrderStep =
    | 'customer-details'
    | 'product-selection'
    | 'delivery-options'
    | 'order-review'
    | 'confirmation'
    | 'payment';

// Product catalog
export const PRODUCT_CATALOG = {
    ethanol: {
        name: 'Ethanol (E95)',
        bottle: {
            size: '20L',
            price: 549.99,
            description: '20L Ethanol (E95) - Premium Grade'
        },
        barrel: {
            size: '200L',
            price: 5499.99,
            description: '200L Ethanol (E95) - Bulk Supply'
        }
    },
    methanol: {
        name: '100% Methanol',
        bottle: {
            size: '20L',
            price: 349.99,
            description: '20L 100% Methanol - Industrial Grade'
        },
        barrel: {
            size: '200L',
            price: 3499.99,
            description: '200L 100% Methanol - Bulk Supply'
        }
    }
} as const;

// Business rules
export const BUSINESS_RULES = {
    minQuantityForDiscount: 5,
    discountPercentage: 20,
    maxBottleQuantity: 20,
    deliveryOptions: {
        sameDay: 'Same Day Delivery',
        standard: '1-3 Business Days'
    }
} as const;

// Banking details for payment
export const BANKING_DETAILS = {
    bankName: 'DS Fueling Banking',
    accountName: 'DS Fueling (Pty) Ltd',
    accountNumber: '1234567890',
    branchCode: '123456',
    reference: 'Please use your order number as reference'
} as const;