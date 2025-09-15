import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface QuickReply {
  label: string;
  value: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  isMinimized = false;
  messages: Message[] = [];
  userInput = '';
  isTyping = false;
  hasNewMessage = false;

  quickReplies: QuickReply[] = [
    { label: 'What is MappLock?', value: 'What is MappLock?' },
    { label: 'Pricing', value: 'Tell me about pricing' },
    { label: 'Demo', value: 'I want to try a demo' },
    { label: 'Support', value: 'I need support' }
  ];

  predefinedResponses: { [key: string]: string } = {
    'hello': 'Hello! 👋 Welcome to MappLock support. I\'m here to help you learn about our powerful kiosk mode solution for macOS. How can I assist you today?',
    'hi': 'Hello! 👋 Welcome to MappLock support. I\'m here to help you learn about our powerful kiosk mode solution for macOS. How can I assist you today?',
    'what is mapplock': 'MappLock is a professional kiosk mode application for macOS that transforms your Mac into a secure, locked-down system. It\'s perfect for:\n\n🏫 Educational institutions (exam mode, focused learning)\n🏢 Trade shows and exhibitions\n🏪 Retail displays and information kiosks\n🎮 Gaming lounges and entertainment centers\n\nKey features include app locking, website filtering, time limits, and remote management. Would you like to know more about any specific feature?',
    'pricing': 'MappLock offers three pricing tiers:\n\n💎 **Personal** - $29 (one-time)\n• 1 Mac license\n• All kiosk features\n• 1 year of updates\n\n⚡ **Professional** - $49 (one-time)\n• 3 Mac licenses\n• Priority support\n• 2 years of updates\n\n🚀 **Business** - $199 (one-time)\n• Unlimited licenses\n• Remote management\n• Lifetime updates\n• Phone support\n\nEducation discounts available! Would you like to learn more about any specific plan?',
    'demo': 'Great! You can try our demo right from this website. Click the "Try Demo" button in the navigation bar to experience MappLock\'s locked browser mode.\n\nThe demo shows:\n• Complete browser lock\n• Kiosk mode security\n• Focus enhancement features\n• Usage analytics\n\nWould you like me to guide you through the demo features?',
    'support': 'We offer multiple support channels:\n\n📧 **Email**: support@mapplock.com\n📞 **Phone**: Available for Business plan customers\n💬 **Live Chat**: You\'re using it right now!\n📚 **Documentation**: Comprehensive guides at docs.mapplock.com\n🎥 **Video Tutorials**: Available on our YouTube channel\n\nFor immediate assistance, please describe your issue and I\'ll help you right away!',
    'features': 'MappLock comes packed with powerful features:\n\n🔒 **App Locking**: Block specific applications\n🌐 **Website Filtering**: Control internet access\n⏱️ **Time Limits**: Set usage schedules\n📊 **Analytics**: Track usage patterns\n🖥️ **Multi-Display**: Support for multiple monitors\n🔄 **Quick Toggle**: Instant on/off switching\n☁️ **Cloud Sync**: Sync settings across devices\n🎯 **Focus Mode**: Eliminate distractions\n\nWhich feature interests you most?',
    'education': 'MappLock is perfect for educational institutions!\n\n🎓 **Benefits for Schools**:\n• Secure exam environments\n• Prevent cheating during tests\n• Focus students on educational content\n• Block social media and games\n• Time-based access control\n\n💰 **Special Education Pricing**:\n• 50% discount for verified institutions\n• Volume licensing available\n• Free training sessions\n• Priority support\n\nContact education@mapplock.com for special pricing!',
    'trade show': 'MappLock is ideal for trade shows and exhibitions!\n\n🏢 **Trade Show Features**:\n• Lock displays to your demo\n• Prevent visitors from browsing\n• Kiosk mode for presentations\n• Remote management of multiple stations\n• Usage analytics for visitor engagement\n\n✨ **Benefits**:\n• Professional appearance\n• Worry-free demonstrations\n• Increased engagement\n• Security for expensive equipment\n\nNeed help setting up for an upcoming event?',
    'how to install': 'Installing MappLock is simple:\n\n1. 📥 Purchase and download from our website\n2. 📂 Open the downloaded DMG file\n3. 🖱️ Drag MappLock to Applications folder\n4. 🚀 Launch MappLock from Applications\n5. 🔐 Grant necessary permissions when prompted\n6. ⚙️ Configure your preferences\n7. ✅ You\'re ready to go!\n\nThe whole process takes less than 5 minutes. Need help with any step?',
    'refund': 'We offer a 30-day money-back guarantee!\n\n💯 **Refund Policy**:\n• Full refund within 30 days\n• No questions asked\n• Process takes 3-5 business days\n• Original payment method credited\n\nTo request a refund, email refunds@mapplock.com with your order number. We\'d love to hear your feedback to improve our product!',
    'contact': 'Here\'s how to reach us:\n\n📧 **General**: hello@mapplock.com\n🛟 **Support**: support@mapplock.com\n🎓 **Education**: education@mapplock.com\n💼 **Enterprise**: enterprise@mapplock.com\n💰 **Refunds**: refunds@mapplock.com\n\n🏢 **Office**:\nMappLock Inc.\n123 Innovation Drive\nSan Francisco, CA 94107\n\nWe typically respond within 24 hours!',
    'help': 'I can help you with:\n\n• 📖 Learning about MappLock features\n• 💰 Pricing and plans information\n• 🎯 Demo walkthrough\n• 🛠️ Installation guidance\n• 🏫 Education discounts\n• 🏢 Enterprise solutions\n• 📧 Contact information\n• ❓ Troubleshooting\n\nWhat would you like to know about?'
  };

  constructor() {}

  ngOnInit() {
    // Add welcome message after a short delay
    setTimeout(() => {
      this.addBotMessage('Hello! 👋 I\'m your MappLock assistant. How can I help you today?');
    }, 1000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.hasNewMessage = false;

    if (this.isOpen && this.messages.length === 0) {
      setTimeout(() => {
        this.addBotMessage('Hello! 👋 I\'m your MappLock assistant. How can I help you today?');
      }, 300);
    }

    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChat() {
    this.isMinimized = !this.isMinimized;
  }

  closeChat() {
    this.isOpen = false;
    this.isMinimized = false;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.addUserMessage(userMessage);
    this.userInput = '';

    // Show typing indicator
    this.isTyping = true;

    // Simulate response delay
    setTimeout(() => {
      this.isTyping = false;
      const response = this.generateResponse(userMessage);
      this.addBotMessage(response);
    }, 1000 + Math.random() * 1000);
  }

  sendQuickReply(value: string) {
    this.userInput = value;
    this.sendMessage();
  }

  generateResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Check for keywords and return appropriate response
    for (const key in this.predefinedResponses) {
      if (lowerMessage.includes(key)) {
        return this.predefinedResponses[key];
      }
    }

    // Check for specific patterns
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
      return this.predefinedResponses['pricing'];
    }

    if (lowerMessage.includes('feature') || lowerMessage.includes('what can')) {
      return this.predefinedResponses['features'];
    }

    if (lowerMessage.includes('school') || lowerMessage.includes('education') || lowerMessage.includes('student')) {
      return this.predefinedResponses['education'];
    }

    if (lowerMessage.includes('trade') || lowerMessage.includes('show') || lowerMessage.includes('exhibition')) {
      return this.predefinedResponses['trade show'];
    }

    if (lowerMessage.includes('install') || lowerMessage.includes('setup') || lowerMessage.includes('download')) {
      return this.predefinedResponses['how to install'];
    }

    if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
      return this.predefinedResponses['refund'];
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      return this.predefinedResponses['contact'];
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('?')) {
      return this.predefinedResponses['help'];
    }

    // Default response for unmatched queries
    return `I understand you're asking about "${message}". Let me connect you with our support team for more detailed assistance. Meanwhile, you can:\n\n• 📧 Email us at support@mapplock.com\n• 📖 Check our documentation\n• 🎯 Try our demo\n• 💬 Ask me about features, pricing, or installation\n\nIs there anything specific I can help you with right now?`;
  }

  addUserMessage(text: string) {
    this.messages.push({
      text,
      sender: 'user',
      timestamp: new Date()
    });
    setTimeout(() => this.scrollToBottom(), 50);
  }

  addBotMessage(text: string) {
    this.messages.push({
      text,
      sender: 'bot',
      timestamp: new Date()
    });

    if (!this.isOpen) {
      this.hasNewMessage = true;
    }

    setTimeout(() => this.scrollToBottom(), 50);
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}