import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ConversationContext {
  userIntent: string[];
  askedQuestions: string[];
  userPreferences: any;
  sessionMood: 'curious' | 'frustrated' | 'happy' | 'neutral';
}

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.css']
})
export class AiChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  isOpen = false;
  messages: Message[] = [];
  userInput = '';
  isTyping = false;
  minimized = false;

  // Conversation memory
  context: ConversationContext = {
    userIntent: [],
    askedQuestions: [],
    userPreferences: {},
    sessionMood: 'neutral'
  };

  // Knowledge base
  knowledgeBase: any = {};

  // Personality traits
  personality = {
    greetings: [
      "Hey there! 👋 I'm MappLock's AI assistant - here to help you discover how to lock down your Mac apps! What would you like to know?",
      "Hi! Welcome to MappLock! 🔒 I'm super excited to help you learn about securing your Mac. What brings you here today?",
      "Hello! 🎉 Ready to make your Mac more focused and secure? I'm here to answer all your MappLock questions!"
    ],
    followUps: [
      "That's a great question! Is there anything else about MappLock you're curious about?",
      "Hope that helps! 😊 What other features would you like to explore?",
      "Awesome! By the way, have you thought about how you'd use MappLock in your specific situation?",
      "Great choice! Is there anything else you'd like MappLock to accomplish for you?",
      "Perfect! I'm curious - what made you interested in app locking today?"
    ],
    encouragements: [
      "That's exactly what MappLock was designed for! 🎯",
      "You're thinking in the right direction! 💡",
      "Oh, I love that use case! 🌟",
      "That's brilliant! MappLock would be perfect for that! ✨"
    ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadKnowledgeBase();
    this.initializeChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) {}
    }
  }

  loadKnowledgeBase() {
    // Load the knowledge from the markdown file
    this.http.get('/assets/applock-knowledge.md', { responseType: 'text' })
      .subscribe(data => {
        this.parseKnowledgeBase(data);
      });
  }

  parseKnowledgeBase(markdown: string) {
    // Parse the markdown into a structured knowledge base
    const sections = markdown.split('##').filter(s => s.trim());

    this.knowledgeBase = {
      overview: this.extractSection(markdown, 'Product Overview'),
      features: this.extractSection(markdown, 'Key Features'),
      useCases: this.extractSection(markdown, 'Use Cases'),
      pricing: this.extractSection(markdown, 'Pricing Plans'),
      technical: this.extractSection(markdown, 'Technical Requirements'),
      faq: this.extractSection(markdown, 'Common Questions'),
      support: this.extractSection(markdown, 'Support')
    };
  }

  extractSection(markdown: string, sectionName: string): string {
    const regex = new RegExp(`## ${sectionName}([\\s\\S]*?)(?=##|$)`, 'i');
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  }

  initializeChat() {
    // Add initial greeting after a short delay
    setTimeout(() => {
      const greeting = this.personality.greetings[Math.floor(Math.random() * this.personality.greetings.length)];
      this.addMessage(greeting, 'bot');
    }, 500);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.initializeChat();
    }
  }

  minimizeChat() {
    this.minimized = !this.minimized;
  }

  closeChat() {
    this.isOpen = false;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput;
    this.addMessage(userMessage, 'user');
    this.userInput = '';

    // Update context
    this.context.askedQuestions.push(userMessage);
    this.analyzeUserIntent(userMessage);

    // Show typing indicator
    this.isTyping = true;

    // Process and respond
    setTimeout(() => {
      const response = this.generateResponse(userMessage);
      this.isTyping = false;
      this.addMessage(response, 'bot');

      // Add follow-up after main response
      setTimeout(() => {
        if (Math.random() > 0.3) { // 70% chance of follow-up
          const followUp = this.generateFollowUp();
          this.addMessage(followUp, 'bot');
        }
      }, 1500);
    }, 1000 + Math.random() * 1000); // Variable typing time
  }

  analyzeUserIntent(message: string) {
    const lower = message.toLowerCase();

    // Detect mood
    if (lower.includes('frustrated') || lower.includes('annoying') || lower.includes('hate')) {
      this.context.sessionMood = 'frustrated';
    } else if (lower.includes('love') || lower.includes('awesome') || lower.includes('great')) {
      this.context.sessionMood = 'happy';
    } else if (lower.includes('?') || lower.includes('how') || lower.includes('what')) {
      this.context.sessionMood = 'curious';
    }

    // Track interests
    if (lower.includes('price') || lower.includes('cost') || lower.includes('buy')) {
      this.context.userIntent.push('pricing');
    }
    if (lower.includes('education') || lower.includes('school') || lower.includes('classroom')) {
      this.context.userIntent.push('education');
    }
    if (lower.includes('business') || lower.includes('trade show') || lower.includes('exhibition')) {
      this.context.userIntent.push('business');
    }
    if (lower.includes('security') || lower.includes('pin') || lower.includes('protect')) {
      this.context.userIntent.push('security');
    }
  }

  generateResponse(message: string): string {
    const lower = message.toLowerCase();

    // Check for specific topics
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much')) {
      return this.getPricingResponse();
    }

    if (lower.includes('feature') || lower.includes('what can') || lower.includes('capabilities')) {
      return this.getFeaturesResponse();
    }

    if (lower.includes('education') || lower.includes('school') || lower.includes('student')) {
      return this.getEducationResponse();
    }

    if (lower.includes('security') || lower.includes('safe') || lower.includes('pin')) {
      return this.getSecurityResponse();
    }

    if (lower.includes('trial') || lower.includes('try') || lower.includes('demo')) {
      return this.getDemoResponse();
    }

    if (lower.includes('support') || lower.includes('help') || lower.includes('contact')) {
      return this.getSupportResponse();
    }

    if (lower.includes('business') || lower.includes('trade') || lower.includes('kiosk')) {
      return this.getBusinessResponse();
    }

    // Default intelligent response
    return this.getContextualResponse(message);
  }

  getPricingResponse(): string {
    const responses = [
      "Great question about pricing! 💰 We have three main plans: Personal ($29) for single Mac, Professional ($79) for 5 Macs, and Business ($199) for 20 Macs. All include lifetime updates! Which setup matches your needs?",
      "Our pricing is super straightforward! 🎯 Starting at just $29 for personal use, up to $199 for businesses. Education discounts are also available! Are you looking for personal or business use?",
      "I'm glad you asked about pricing! We've got options from $29 to $199 depending on how many Macs you need to secure. Plus, schools get special discounts! 🎓 What's your use case?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getFeaturesResponse(): string {
    const responses = [
      "Oh, MappLock is packed with awesome features! 🚀 Instant app locking, PIN security, multi-screen support, custom branding, and even presenter mode for trade shows! What specific functionality interests you most?",
      "Let me tell you about my favorite features! 🌟 You can lock any app instantly, set time limits, customize the lock screen, and even control multiple displays. It's like having a security guard for your Mac! What would you use it for?",
      "MappLock's features are designed for maximum flexibility! 🔒 From simple PIN locks to advanced kiosk modes, custom backgrounds to auto-unlock timers - we've got it all! Any particular feature you're looking for?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getEducationResponse(): string {
    const responses = [
      "MappLock is AMAZING for education! 🎓 Teachers use it to lock students into exam software, prevent cheating, and create focused learning environments. Plus, we offer education discounts! How many computers would you need to secure?",
      "Schools love MappLock! 📚 It's perfect for computer labs, online testing, and keeping students focused on educational apps. We even have special pricing for educational institutions! Are you a teacher or administrator?",
      "Educational use is one of our specialties! 🏫 Lock down exam browsers, create kiosk stations in libraries, or manage entire computer labs. The education discount makes it super affordable too! What's your classroom setup like?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getSecurityResponse(): string {
    const responses = [
      "Security is our top priority! 🛡️ MappLock uses encrypted PIN storage, anti-brute-force protection, and intelligent overlay systems. Your apps are locked down tight! Are you securing sensitive information?",
      "You'll love our security features! 🔐 Military-grade PIN protection, screen recording prevention, clipboard isolation, and even network access control. It's Fort Knox for your Mac apps! What security concerns do you have?",
      "MappLock's security is rock-solid! 💪 Encrypted PINs, failsafe mechanisms, auto-lock on app switching - we've thought of everything! Plus, it leaves zero traces when unlocked. What are you looking to protect?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getDemoResponse(): string {
    const responses = [
      "Absolutely! 🎉 We have a full demo available that shows ALL features in action! You can see exactly how MappLock works before purchasing. Want me to explain any specific features you'd like to see demonstrated?",
      "Yes! Check out our interactive demo! 🎬 It walks you through all the key features - from locking apps to setting up kiosk mode. You'll see exactly how easy it is to use. What feature are you most interested in seeing?",
      "Of course! Our demo lets you experience MappLock's full capabilities! 🚀 You can see the PIN system, customization options, and how smoothly it locks down apps. Which use case would you like to see demonstrated?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getSupportResponse(): string {
    return "We've got your back! 🤝 Email support for all users (usually respond within 24 hours), and phone support for Business customers. Plus, our help center at help.applock.app has tons of guides! What kind of help do you need?";
  }

  getBusinessResponse(): string {
    const responses = [
      "MappLock is fantastic for business use! 💼 Perfect for trade shows, demo stations, point-of-sale systems, and customer kiosks. The Business plan includes 20 licenses and phone support! What's your business application?",
      "Businesses love MappLock for trade shows and exhibitions! 🏢 Lock demo iPads to presentation apps, secure POS systems, or create interactive kiosks. Volume licensing makes it very cost-effective! Tell me about your business needs?",
      "Professional kiosk mode is where MappLock shines! ✨ Create polished demo stations, secure customer-facing terminals, or lock down presentation computers. With custom branding options too! What kind of business are you in?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getContextualResponse(message: string): string {
    // Use context to generate relevant response
    if (this.context.sessionMood === 'frustrated') {
      return "I understand your concern! 😊 Let me help make this clearer. MappLock is designed to be super simple - just click and lock any app instantly. What specific challenge are you trying to solve?";
    }

    if (this.context.userIntent.includes('education') && !this.context.askedQuestions.some(q => q.includes('price'))) {
      return "Since you're interested in education use, you should know we offer special school pricing! 🎓 Would you like to hear about our education discounts?";
    }

    if (this.context.askedQuestions.length > 3 && !this.context.userIntent.includes('demo')) {
      return "You're asking great questions! 🌟 Would you like to see our demo? You can watch all these features in action and see exactly how MappLock works!";
    }

    // Default contextual response
    const responses = [
      "That's interesting! 🤔 MappLock can definitely help with that. It's all about creating focused, secure environments for your Mac. Would you like to know more about any specific aspect?",
      "I love your thinking! 💡 MappLock was built exactly for situations like this. Whether it's for focus, security, or presentations, we've got you covered! What matters most to you?",
      "Great point! 👍 Many of our users started with the same question. MappLock's flexibility means it adapts to YOUR needs, not the other way around. What would your ideal setup look like?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  generateFollowUp(): string {
    // Context-aware follow-ups
    if (this.context.userIntent.length === 0) {
      return "By the way, what brings you to MappLock today? Are you looking to secure a classroom, set up a kiosk, or maybe something else? 🤔";
    }

    if (this.context.userIntent.includes('pricing') && !this.context.userIntent.includes('demo')) {
      return "Oh, and did I mention we have a full demo? You can see everything in action before purchasing! 🎁";
    }

    if (this.context.sessionMood === 'happy') {
      return "You seem excited about MappLock! 🎉 Is there any specific scenario where you'd use it? I love hearing about creative use cases!";
    }

    if (this.context.askedQuestions.length === 1) {
      return "Feel free to ask me anything else! I know everything about MappLock - features, pricing, use cases, you name it! 😊";
    }

    // Random follow-up
    const followUps = [
      ...this.personality.followUps,
      "Quick thought - would you be using MappLock for yourself or setting it up for others? 🤔",
      "I'm curious - what's the main problem you're trying to solve with app locking? 💭",
      "Have you used any kiosk or locking software before? How can MappLock do better for you? 🎯"
    ];

    return followUps[Math.floor(Math.random() * followUps.length)];
  }

  addMessage(content: string, sender: 'user' | 'bot') {
    this.messages.push({
      content,
      sender,
      timestamp: new Date()
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}