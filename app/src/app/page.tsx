'use client';

import { OrderProvider } from '@/contexts/OrderContext';
import { OrderForm } from '@/components/order/OrderForm';

export default function HomePage() {
  return (
    <OrderProvider>
      <OrderForm />
    </OrderProvider>
  );
}
