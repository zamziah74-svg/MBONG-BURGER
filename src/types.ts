export type ProductCategory = 'burger' | 'popia' | 'kombo';

export type ProductSizeOption = {
  id: string;
  name: string;
  weightOrSize: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  image: string;
  basePrice: number;
  isPopular?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 'Tiada' | 'Sederhana' | 'Pedas Berapi';
  flavor?: 'Original' | 'Pedas' | 'Cheese' | 'Black Pepper' | 'BBQ';
  inStock: boolean;
  stockCount: number;
  sizes?: ProductSizeOption[];
  comboAvailable?: boolean;
  comboPriceExtra?: number;
};

export type CartItem = {
  cartItemId: string; // unique per configuration
  productId: string;
  name: string;
  image: string;
  selectedSize?: ProductSizeOption;
  isCombo?: boolean;
  specialInstructions?: string;
  unitPrice: number;
  quantity: number;
};

export type OrderStatus = 'Baru' | 'Sedang Dimasak' | 'Sedang Dihantar' | 'Selesai' | 'Batal';

export type DeliveryMethod = 'delivery' | 'pickup';

export type PaymentMethod = 'duitnow' | 'fpx' | 'cod';

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  preferredTime: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
};

export type RecipeStep = {
  stepNumber: number;
  title: string;
  description: string;
  tip?: string;
};

export type Recipe = {
  id: string;
  title: string;
  subtitle: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Mudah' | 'Sederhana' | 'Perlu Kesabaran';
  image: string;
  ingredients: {
    category: string;
    items: string[];
  }[];
  steps: RecipeStep[];
  proTips: string[];
};

export type PromoCoupon = {
  id: string;
  code: string;
  discountType: 'fixed' | 'percentage';
  discountValue: number;
  minSpend: number;
  description: string;
  active: boolean;
};

export type StoreSettings = {
  storeName: string;
  tagline: string;
  ownerName: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  isOpen: boolean;
  operatingHours: string;
  pickupLocation: string;
  deliveryCoverageArea?: string;
  announcement: string;
  heroImage?: string;
  ownerImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountHolder?: string;
  duitNowQrPhone?: string;
  coupons?: PromoCoupon[];
};
