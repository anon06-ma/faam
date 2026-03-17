export type Category = 'Economy' | 'SUV' | 'Luxury' | 'Automatic';

export interface Vehicle {
  id: string;
  name: string;
  category: Category;
  pricePerDay: number;
  transmission: 'Manual' | 'Automatic';
  seats: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  description: string;
  images: string[];
  specs: {
    engine: string;
    ac: boolean;
    gps: boolean;
  };
}

export interface Booking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  paymentMethod: 'delivery' | 'online';
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export type Language = 'en' | 'fr';
