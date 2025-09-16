import { Component, OnInit, HostListener, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-interactive-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interactive-demo.component.html',
  styleUrls: ['./interactive-demo.component.css', './interactive-demo-animations.css']
})
export class InteractiveDemoComponent implements OnInit, OnDestroy {
  @ViewChild('demoContainer', { static: false }) demoContainer!: ElementRef;
  @ViewChild('browserPopup', { static: false }) browserPopup!: ElementRef;

  // Touch and mobile state
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private swipeThreshold = 50;
  private tapThreshold = 200;
  private lastTap = 0;
  isMobile = false;
  isAndroid = false;
  isIOS = false;

  // Performance optimization
  private animationFrame: number | null = null;
  private resizeTimeout: number | null = null;
  private particles: HTMLElement[] = [];
  // Demo states
  isDemoOpen = false;
  isFullscreen = false;
  isLocked = false;
  showUnlockPrompt = false;
  unlockPin = '';
  correctPin = '1234';
  wrongPinAttempts = 0;

  // Browser simulation
  currentUrl = 'https://www.google.com';
  browserHistory: string[] = [];
  historyIndex = -1;
  canGoBack = false;
  canGoForward = false;
  isLoading = false;
  searchQuery = '';
  searchResults: any[] = [];
  showInstructions = true;

  // Demo sites
  demoSites = [
    { name: 'Apple', url: 'https://www.apple.com', icon: '🍎' },
    { name: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { name: 'Quiz Portal', url: 'https://kahoot.it', icon: '📝' },
    { name: 'Trade Show', url: 'https://www.ces.tech', icon: '🎭' },
    { name: 'Education', url: 'https://www.khanacademy.org', icon: '🎓' }
  ];

  // Current site display
  currentSite = {
    name: 'Google Search',
    icon: '🔍',
    content: 'google',
    data: null as any
  };

  // Simulated search database
  searchDatabase = [
    {
      title: 'MappLock - Professional Mac App Locker',
      url: 'https://mapplock.com',
      description: 'Lock any Mac application into secure kiosk mode. Perfect for classrooms, exhibitions, and public displays.',
      keywords: ['mapplock', 'kiosk', 'mac', 'lock', 'app']
    },
    {
      title: 'How to Set Up Kiosk Mode on Mac',
      url: 'https://support.apple.com/guide/mac',
      description: 'Learn how to configure your Mac for kiosk usage with guided access and single app mode.',
      keywords: ['kiosk', 'mac', 'setup', 'guide', 'tutorial']
    },
    {
      title: 'Best Kiosk Software for macOS 2024',
      url: 'https://techreview.com/kiosk-software',
      description: 'Compare the top kiosk mode applications for Mac including MappLock, Kiosk Pro, and more.',
      keywords: ['kiosk', 'software', 'mac', 'review', 'comparison']
    },
    {
      title: 'Digital Signage Solutions for Trade Shows',
      url: 'https://tradefair.com/digital-signage',
      description: 'Transform your trade show booth with professional digital signage and kiosk displays.',
      keywords: ['trade show', 'digital signage', 'kiosk', 'exhibition']
    },
    {
      title: 'Classroom Management Software for Teachers',
      url: 'https://education.com/classroom-tools',
      description: 'Control student devices and lock them to educational apps during lessons.',
      keywords: ['classroom', 'education', 'management', 'teacher', 'student']
    },
    {
      title: 'Museum Interactive Display Systems',
      url: 'https://museumtech.org/displays',
      description: 'Create engaging interactive exhibits with secure touchscreen kiosks.',
      keywords: ['museum', 'interactive', 'display', 'kiosk', 'exhibition']
    },
    {
      title: 'Retail Point of Sale Kiosk Solutions',
      url: 'https://retailtech.com/pos-kiosks',
      description: 'Self-service kiosks for retail stores, restaurants, and customer service.',
      keywords: ['retail', 'pos', 'kiosk', 'self-service', 'restaurant']
    },
    {
      title: 'Online Exam Proctoring Software',
      url: 'https://examsoft.com',
      description: 'Secure online testing with browser lockdown and monitoring features.',
      keywords: ['exam', 'test', 'proctor', 'online', 'education']
    },
    {
      title: 'Apple Store - Shop Mac',
      url: 'https://www.apple.com/mac',
      description: 'Explore the latest Mac computers including MacBook Pro, iMac, and Mac Studio.',
      keywords: ['apple', 'mac', 'macbook', 'imac', 'computer']
    },
    {
      title: 'Khan Academy - Free Online Courses',
      url: 'https://www.khanacademy.org',
      description: 'Learn for free about math, art, computer programming, economics, physics, and more.',
      keywords: ['education', 'learning', 'khan', 'academy', 'online', 'courses']
    }
  ];

  // Product catalog for Apple store
  appleProducts = [
    { name: 'MacBook Pro 14"', price: '$1,999', specs: 'M3 Pro chip, 18GB RAM' },
    { name: 'MacBook Air 15"', price: '$1,299', specs: 'M2 chip, 8GB RAM' },
    { name: 'iMac 24"', price: '$1,399', specs: 'M3 chip, 4.5K Retina' },
    { name: 'Mac Studio', price: '$1,999', specs: 'M2 Max chip, 32GB RAM' },
    { name: 'Mac mini', price: '$599', specs: 'M2 chip, 8GB RAM' },
    { name: 'Studio Display', price: '$1,599', specs: '27" 5K Retina' }
  ];

  // Quiz questions
  quizQuestions = [
    {
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2
    },
    {
      question: 'What is 15 × 8?',
      options: ['100', '120', '140', '160'],
      correct: 1
    },
    {
      question: 'Who painted the Mona Lisa?',
      options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Rembrandt'],
      correct: 1
    }
  ];
  currentQuizIndex = 0;
  quizScore = 0;
  showQuizResult = false;

  safeUrl!: SafeResourceUrl;
  lockMessage = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Detect mobile platform
    this.detectMobile();

    // Start with Google
    this.navigateToUrl(this.currentUrl);

    // Add mobile-optimized particle effects
    this.initParticleEffects();

    // Setup mobile touch handlers
    this.setupTouchHandlers();

    // Setup resize handler
    this.setupResizeHandler();
  }

  ngOnDestroy() {
    // Clean up
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.cleanupParticles();
  }

  detectMobile() {
    const userAgent = navigator.userAgent || navigator.vendor;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    this.isAndroid = /Android/i.test(userAgent);
    this.isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    // Add mobile class to body for CSS targeting
    if (this.isMobile) {
      document.body.classList.add('mobile-device');
      if (this.isIOS) document.body.classList.add('ios-device');
      if (this.isAndroid) document.body.classList.add('android-device');
    }
  }

  setupTouchHandlers() {
    if (!this.isMobile) return;

    // Prevent zoom on double tap
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  setupResizeHandler() {
    window.addEventListener('resize', () => {
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }
      this.resizeTimeout = window.setTimeout(() => {
        this.handleResize();
      }, 250);
    });
  }

  handleResize() {
    // Handle mobile orientation changes and resize events
    if (this.isMobile && this.isDemoOpen) {
      // Adjust demo popup height for mobile keyboards
      const popup = this.browserPopup?.nativeElement;
      if (popup) {
        popup.style.height = window.innerHeight + 'px';
      }
    }
  }

  initParticleEffects() {
    // Create floating particles when demo is opened (reduced on mobile)
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        this.createFloatingParticles();
      }, 1000);
    }
  }

  createFloatingParticles() {
    const container = document.querySelector('.demo-container');
    if (!container) return;

    // Reduce particles on mobile for better performance
    const particleCount = this.isMobile ? 3 : 5;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${this.isMobile ? '3px' : '4px'};
        height: ${this.isMobile ? '3px' : '4px'};
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: particleDrift ${10 + Math.random() * 10}s linear infinite;
        opacity: ${0.3 + Math.random() * 0.4};
        will-change: transform;
      `;
      container.appendChild(particle);
      this.particles.push(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
        const index = this.particles.indexOf(particle);
        if (index > -1) {
          this.particles.splice(index, 1);
        }
      }, 20000);
    }
  }

  cleanupParticles() {
    this.particles.forEach(particle => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    });
    this.particles = [];
  }

  // Open the demo popup
  openDemo() {
    this.isDemoOpen = true;

    // Mobile-specific message
    if (this.isMobile) {
      this.lockMessage = '📱 Tap the Lock button to secure this browser!';
    } else {
      this.lockMessage = '✨ Try pressing ⌘L to lock this browser!';
    }

    // Play opening sound (reduced volume on mobile)
    this.playSound('open');

    // Add opening animation class with mobile optimization
    const popup = document.querySelector('.demo-browser-popup');
    if (popup) {
      popup.classList.add('opening');
      // Faster animation on mobile
      setTimeout(() => popup.classList.remove('opening'), this.isMobile ? 400 : 600);

      // Set mobile-specific styles
      if (this.isMobile) {
        (popup as HTMLElement).style.height = window.innerHeight + 'px';
      }
    }

    // Auto-show lock hint after 3 seconds (longer on mobile)
    setTimeout(() => {
      if (!this.isLocked && this.isDemoOpen) {
        this.showLockHint();
      }
    }, this.isMobile ? 4000 : 3000);

    // Create celebration particles (reduced on mobile)
    this.createCelebrationParticles();

    // Prevent body scroll on mobile
    if (this.isMobile) {
      document.body.style.overflow = 'hidden';
    }
  }

  createCelebrationParticles() {
    const colors = ['#3b82f6', '#1d4ed8', '#60a5fa', '#2563eb', '#1e40af'];
    const popup = document.querySelector('.demo-browser-popup');
    if (!popup) return;

    // Reduce particles on mobile for better performance
    const particleCount = this.isMobile ? 12 : 20;
    const delay = this.isMobile ? 40 : 30;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: ${this.isMobile ? '6px' : '8px'};
          height: ${this.isMobile ? '6px' : '8px'};
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          left: 50%;
          top: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: celebrationBurst ${this.isMobile ? '0.8s' : '1s'} ease-out forwards;
          will-change: transform;
          --tx: ${(Math.random() - 0.5) * (this.isMobile ? 150 : 200)}px;
          --ty: ${(Math.random() - 0.5) * (this.isMobile ? 150 : 200)}px;
        `;
        popup.appendChild(particle);
        this.particles.push(particle);
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
          const index = this.particles.indexOf(particle);
          if (index > -1) {
            this.particles.splice(index, 1);
          }
        }, this.isMobile ? 800 : 1000);
      }, i * delay);
    }
  }

  playSound(type: string) {
    // Disable sounds on mobile by default (can be annoying)
    if (this.isMobile) return;

    const sounds: any = {
      open: 'data:audio/wav;base64,UklGRlQFAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTAFAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA',
      click: 'data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAA',
      hover: 'data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAA',
      success: 'data:audio/wav;base64,UklGRhQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAAA'
    };

    try {
      const audio = new Audio(sounds[type] || sounds.click);
      audio.volume = 0.1; // Reduced volume
      audio.play().catch(() => {});
    } catch (e) {}
  }

  // Close the demo popup
  closeDemo() {
    this.isDemoOpen = false;
    this.isFullscreen = false;
    this.isLocked = false;
    this.unlockPin = '';
    this.showUnlockPrompt = false;

    // Restore body scroll on mobile
    if (this.isMobile) {
      document.body.style.overflow = '';
    }

    // Clean up particles
    this.cleanupParticles();
  }

  // Toggle fullscreen mode
  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;

    if (this.isFullscreen) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    const elem = document.getElementById('demo-browser');
    if (elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  // Browser navigation
  navigateToUrl(url: string, addToHistory = true) {
    if (this.isLocked) return;

    this.isLoading = true;
    this.currentUrl = url;
    this.searchQuery = '';
    this.searchResults = [];

    // Add to history
    if (addToHistory) {
      // Remove any forward history when navigating to new page
      this.browserHistory = this.browserHistory.slice(0, this.historyIndex + 1);
      this.browserHistory.push(url);
      this.historyIndex++;
    }

    // Update navigation buttons
    this.canGoBack = this.historyIndex > 0;
    this.canGoForward = this.historyIndex < this.browserHistory.length - 1;

    // Update current site based on URL
    if (url.includes('apple')) {
      this.currentSite = { name: 'Apple Store', icon: '🍎', content: 'apple', data: null };
    } else if (url.includes('google')) {
      this.currentSite = { name: 'Google Search', icon: '🔍', content: 'google', data: null };
      // Check if it's a search query
      const searchMatch = url.match(/[?&]q=([^&]+)/);
      if (searchMatch) {
        this.searchQuery = decodeURIComponent(searchMatch[1]);
        this.performSearch(this.searchQuery);
      }
    } else if (url.includes('kahoot') || url.includes('quiz')) {
      this.currentSite = { name: 'Quiz Portal', icon: '📝', content: 'quiz', data: null };
      this.currentQuizIndex = 0;
      this.quizScore = 0;
      this.showQuizResult = false;
    } else if (url.includes('ces') || url.includes('trade')) {
      this.currentSite = { name: 'Trade Show Site', icon: '🎭', content: 'tradeshow', data: null };
    } else if (url.includes('khan')) {
      this.currentSite = { name: 'Khan Academy', icon: '🎓', content: 'education', data: null };
    } else if (url.includes('mapplock')) {
      this.currentSite = { name: 'MappLock', icon: '🔒', content: 'mapplock', data: null };
    } else {
      // Try to extract domain name for display
      const domainMatch = url.match(/\/\/([^/]+)/);
      const domain = domainMatch ? domainMatch[1] : 'Web Page';
      this.currentSite = { name: domain, icon: '🌐', content: 'generic', data: { url, domain } };
    }

    // Simulate loading
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  loadUrl(url: string) {
    this.navigateToUrl(url);
  }

  navigateToSite(url: string) {
    if (!this.isLocked) {
      this.navigateToUrl(url);
    }
  }

  // Search functionality
  performSearch(query: string) {
    if (!query.trim()) {
      this.searchResults = [];
      return;
    }

    const lowerQuery = query.toLowerCase();

    // Filter search database based on query
    this.searchResults = this.searchDatabase.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const descMatch = item.description.toLowerCase().includes(lowerQuery);
      const keywordMatch = item.keywords.some(k => k.includes(lowerQuery));
      return titleMatch || descMatch || keywordMatch;
    });

    // If no results, show some default results
    if (this.searchResults.length === 0) {
      this.searchResults = [
        {
          title: `No results found for "${query}"`,
          url: '#',
          description: 'Try different keywords or check your spelling.'
        },
        {
          title: 'Search Tips',
          url: '#',
          description: 'Use specific keywords, check spelling, or try related terms.'
        }
      ];
    }

    // Add some random suggested results
    if (this.searchResults.length < 5) {
      const suggestions = this.searchDatabase
        .filter(item => !this.searchResults.includes(item))
        .slice(0, 3);
      this.searchResults = [...this.searchResults, ...suggestions];
    }
  }

  handleSearchSubmit(query: string) {
    if (this.isLocked) return;

    this.searchQuery = query;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    this.navigateToUrl(searchUrl);
  }

  // Quiz functionality
  selectQuizAnswer(optionIndex: number) {
    if (this.isLocked) return;

    const currentQuestion = this.quizQuestions[this.currentQuizIndex];
    if (optionIndex === currentQuestion.correct) {
      this.quizScore++;
    }

    if (this.currentQuizIndex < this.quizQuestions.length - 1) {
      this.currentQuizIndex++;
    } else {
      this.showQuizResult = true;
    }
  }

  restartQuiz() {
    this.currentQuizIndex = 0;
    this.quizScore = 0;
    this.showQuizResult = false;
  }

  // Handle clicks on search results
  clickSearchResult(url: string) {
    if (this.isLocked || url === '#') return;
    this.navigateToUrl(url);
  }

  goBack() {
    if (this.canGoBack && !this.isLocked) {
      this.historyIndex--;
      const previousUrl = this.browserHistory[this.historyIndex];
      this.navigateToUrl(previousUrl, false);
    }
  }

  goForward() {
    if (this.canGoForward && !this.isLocked) {
      this.historyIndex++;
      const nextUrl = this.browserHistory[this.historyIndex];
      this.navigateToUrl(nextUrl, false);
    }
  }

  refreshPage() {
    if (!this.isLocked) {
      this.isLoading = true;
      // Re-run any searches if on Google search results
      if (this.currentSite.content === 'google' && this.searchQuery) {
        this.performSearch(this.searchQuery);
      }
      setTimeout(() => {
        this.isLoading = false;
      }, 300);
    }
  }

  // Handle Enter key in URL bar
  handleUrlSubmit() {
    if (this.isLocked) return;

    let url = this.currentUrl.trim();

    // Add https:// if no protocol specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check if it looks like a search query rather than URL
      if (!url.includes('.') || url.includes(' ')) {
        // Treat as search query
        this.handleSearchSubmit(url);
        return;
      }
      url = 'https://' + url;
    }

    this.navigateToUrl(url);
  }

  // Lock functionality
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Only work when demo is open
    if (!this.isDemoOpen) return;

    // Command+L or Ctrl+L to lock
    if ((event.metaKey || event.ctrlKey) && event.key === 'l') {
      event.preventDefault();
      if (!this.isLocked) {
        this.lockBrowser();
      }
    }

    // Command+Option+U or Ctrl+Alt+U to unlock
    if ((event.metaKey || event.ctrlKey) && event.altKey && event.key === 'u') {
      event.preventDefault();
      if (this.isLocked) {
        this.showUnlockPrompt = true;
      }
    }

    // Escape to close demo (when not locked)
    if (event.key === 'Escape' && !this.isLocked) {
      this.closeDemo();
    }
  }

  lockBrowser() {
    this.isLocked = true;

    if (this.isMobile) {
      this.lockMessage = '🔒 Browser locked! Tap unlock button or swipe up from bottom.';
    } else {
      this.lockMessage = '🔒 Browser is now locked in kiosk mode!';
    }

    // Simulate lock effects
    this.disableInteractions();

    // Play lock sound effect (optional)
    this.playLockSound();

    // Add haptic feedback on mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }

  disableInteractions() {
    // In real MappLock, this would prevent all interactions
    console.log('All browser interactions disabled');
  }

  playLockSound() {
    // Optional: Add a lock sound effect
    const audio = new Audio('data:audio/wav;base64,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Uqff8LllGAU7k9/yvnElBCiAzPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCmA0O7TgjAHHm/A7+OaSw0OUqzj8rhiGgU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OU6ff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/yvnElBCh+zPDaiTAIHWq+8OicTg0OUqff8LllGAU7k9/w');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  showLockHint() {
    if (this.isMobile) {
      this.lockMessage = '💡 Tap the Lock button in the toolbar to secure the browser';
    } else {
      this.lockMessage = '💡 Press ⌘L (Mac) or Ctrl+L (PC) to lock the browser';
    }
  }

  attemptUnlock() {
    if (this.unlockPin === this.correctPin) {
      this.unlock();
    } else {
      this.wrongPinAttempts++;
      this.unlockPin = '';

      if (this.wrongPinAttempts >= 3) {
        this.lockMessage = '⚠️ Too many attempts. Please wait...';
        setTimeout(() => {
          this.wrongPinAttempts = 0;
          this.lockMessage = '🔒 Browser is locked';
        }, 5000);
      } else {
        this.lockMessage = `❌ Wrong PIN. ${3 - this.wrongPinAttempts} attempts remaining`;
      }
    }
  }

  unlock() {
    this.isLocked = false;
    this.showUnlockPrompt = false;
    this.unlockPin = '';
    this.wrongPinAttempts = 0;
    this.lockMessage = '✅ Browser unlocked successfully!';

    // Add haptic feedback on mobile
    if (this.isMobile && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }

    setTimeout(() => {
      if (this.isMobile) {
        this.lockMessage = '✨ Tap Lock button to try again';
      } else {
        this.lockMessage = '✨ Try locking again with ⌘L';
      }
    }, 2000);
  }

  cancelUnlock() {
    this.showUnlockPrompt = false;
    this.unlockPin = '';
  }

  // Handle PIN input
  handlePinKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.attemptUnlock();
    }
  }

  // Minimize the popup
  minimizeDemo() {
    // Could implement minimize to dock/taskbar simulation
    this.isDemoOpen = false;
  }

  // Touch event handlers for mobile
  onTouchStart(event: TouchEvent) {
    if (!this.isMobile) return;

    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
  }

  onTouchEnd(event: TouchEvent) {
    if (!this.isMobile) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    const deltaTime = Date.now() - this.touchStartTime;

    // Handle swipe gestures
    if (Math.abs(deltaX) > this.swipeThreshold || Math.abs(deltaY) > this.swipeThreshold) {
      if (deltaTime < 500) { // Quick swipe
        this.handleSwipe(deltaX, deltaY);
      }
    } else if (deltaTime < this.tapThreshold) {
      // Handle tap
      this.handleTap(event);
    }
  }

  handleSwipe(deltaX: number, deltaY: number) {
    if (!this.isDemoOpen) return;

    // Swipe down to close demo
    if (deltaY > this.swipeThreshold) {
      this.closeDemo();
    }

    // Swipe left/right for browser navigation
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > this.swipeThreshold && this.canGoBack) {
        this.goBack();
      } else if (deltaX < -this.swipeThreshold && this.canGoForward) {
        this.goForward();
      }
    }
  }

  handleTap(event: TouchEvent) {
    const currentTime = Date.now();
    const tapInterval = currentTime - this.lastTap;

    // Double tap detection
    if (tapInterval < 300 && tapInterval > 0) {
      this.handleDoubleTap(event);
    }

    this.lastTap = currentTime;
  }

  handleDoubleTap(event: TouchEvent) {
    // Double tap to lock/unlock on mobile
    if (!this.isDemoOpen) return;

    if (this.isLocked) {
      this.showUnlockPrompt = true;
    } else {
      this.lockBrowser();
    }
  }

  // Mobile-specific lock button
  mobileLockToggle() {
    if (!this.isMobile) return;

    if (this.isLocked) {
      this.showUnlockPrompt = true;
    } else {
      this.lockBrowser();
    }
  }

  startLiveDemo() {
    this.openDemo();
  }

  resetDemo() {
    this.closeDemo();
    setTimeout(() => this.openDemo(), 100);
  }
}