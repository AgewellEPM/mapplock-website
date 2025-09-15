import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  price: number;
  priceId: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-modal.component.html',
  styleUrls: ['./checkout-modal.component.css']
})
export class CheckoutModalComponent implements OnInit {
  @Input() selectedPlan: string = '';
  @Output() close = new EventEmitter<void>();

  products: Product[] = [
    {
      id: 'personal',
      name: 'Personal',
      price: 29,
      priceId: 'price_personal',
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
      priceId: 'price_professional',
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
      priceId: 'price_business',
      features: [
        '20 Mac licenses',
        'Volume deployment',
        'Lifetime updates',
        'Phone support'
      ]
    }
  ];

  selectedProduct: Product | null = null;
  currentStep: 'plans' | 'payment' | 'processing' | 'success' = 'plans';

  // Form fields
  email = '';
  name = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';

  loading = false;
  showReceipt = false;
  receiptData: any = null;

  ngOnInit() {
    if (this.selectedPlan) {
      this.selectedProduct = this.products.find(p => p.id === this.selectedPlan) || null;
      if (this.selectedProduct) {
        this.currentStep = 'payment';
      }
    }
  }

  selectProduct(product: Product) {
    this.selectedProduct = product;
    setTimeout(() => {
      this.currentStep = 'payment';
    }, 300);
  }

  goBack() {
    if (this.currentStep === 'payment') {
      this.currentStep = 'plans';
    }
  }

  closeModal() {
    this.close.emit();
  }

  async processPayment() {
    if (!this.selectedProduct || !this.email || !this.name || !this.cardNumber) {
      return;
    }

    this.currentStep = 'processing';
    this.loading = true;

    // Simulate payment processing
    await this.simulatePayment();

    this.currentStep = 'success';
    this.loading = false;
    this.receiptData = {
      id: 'RCP-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      email: this.email,
      name: this.name,
      product: this.selectedProduct,
      paymentMethod: '**** **** **** ' + this.cardNumber.slice(-4),
      total: this.selectedProduct.price
    };
  }

  private simulatePayment(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 2500);
    });
  }

  downloadReceipt() {
    if (!this.receiptData) return;

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

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = value;
    event.target.value = formattedValue;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.cardExpiry = value;
    event.target.value = value;
  }
}