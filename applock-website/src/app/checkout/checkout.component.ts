import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StripeService } from '../services/stripe.service';
import { ActivatedRoute, Router } from '@angular/router';

interface Product {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  products: Product[] = [
    {
      id: 'personal',
      name: 'Personal',
      price: 29,
      priceId: 'price_personal_monthly',
      features: [
        '1 Mac license',
        'All features included',
        '1 year of updates',
        'Email support'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 49,
      priceId: 'price_professional_monthly',
      features: [
        '3 Mac licenses',
        'All features included',
        'Lifetime updates',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: 199,
      priceId: 'price_business_monthly',
      features: [
        '20 Mac licenses',
        'Volume deployment',
        'Lifetime updates',
        'Phone support'
      ]
    }
  ];

  selectedProduct: Product | null = null;
  loading = false;
  email = '';
  name = '';
  showReceipt = false;
  receiptData: any = null;

  constructor(
    private stripeService: StripeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if returning from Stripe with success
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['success'] === 'true' && queryParams['session_id']) {
      this.showSuccessReceipt(queryParams['session_id']);
    }

    // Check for pre-selected product
    const productId = this.route.snapshot.queryParams['product'];
    if (productId) {
      this.selectedProduct = this.products.find(p => p.id === productId) || null;
    }
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
  }

  async processPayment() {
    if (!this.selectedProduct || !this.email || !this.name) {
      alert('Please fill in all fields');
      return;
    }

    this.loading = true;

    try {
      // In a real app, you'd create a payment intent on your backend
      // For demo, we'll simulate the payment process
      await this.simulatePayment();

      // Show receipt
      this.showReceipt = true;
      this.receiptData = {
        id: 'RCP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        date: new Date().toISOString(),
        email: this.email,
        name: this.name,
        product: this.selectedProduct,
        paymentMethod: '**** **** **** 4242',
        total: this.selectedProduct.price
      };

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      this.loading = false;
    }
  }

  private simulatePayment(): Promise<void> {
    // Simulate payment processing delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
  }

  private async showSuccessReceipt(sessionId: string) {
    // In production, fetch session details from your backend
    this.showReceipt = true;
    this.receiptData = {
      id: sessionId.substring(0, 12).toUpperCase(),
      date: new Date().toISOString(),
      email: 'customer@example.com',
      name: 'John Doe',
      product: this.products[1], // Default to professional
      paymentMethod: '**** **** **** 4242',
      total: 49
    };
  }

  downloadReceipt() {
    // Generate PDF receipt or trigger download
    const receiptText = `
APPLOCK RECEIPT
================
Receipt ID: ${this.receiptData.id}
Date: ${new Date(this.receiptData.date).toLocaleDateString()}

Customer Information:
Name: ${this.receiptData.name}
Email: ${this.receiptData.email}

Product: ${this.receiptData.product.name}
Price: $${this.receiptData.total}

Thank you for your purchase!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AppLock-Receipt-${this.receiptData.id}.txt`;
    a.click();
  }

  continueShopping() {
    this.router.navigate(['/']);
  }
}