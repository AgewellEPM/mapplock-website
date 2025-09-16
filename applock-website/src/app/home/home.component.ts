import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { AiChatbotComponent } from '../ai-chatbot/ai-chatbot.component';
import { InteractiveDemoComponent } from '../interactive-demo/interactive-demo.component';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CheckoutModalComponent, AiChatbotComponent, InteractiveDemoComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor(private seoService: SeoService) {}

  title = 'MappLock - Focus Without Limits';
  typedText = 'Your Rules.';
  isYearly = false;
  billingPeriod = 'monthly';
  showCheckoutModal = false;
  selectedPlanForCheckout = '';

  floatingCards = [
    { icon: 'icon-lock', text: 'Secure', delay: '0s' },
    { icon: 'icon-focus', text: 'Focused', delay: '2s' },
    { icon: 'icon-shield', text: 'Protected', delay: '4s' }
  ];

  recentUsers = [
    { avatar: 'https://i.pravatar.cc/40?img=1' },
    { avatar: 'https://i.pravatar.cc/40?img=2' },
    { avatar: 'https://i.pravatar.cc/40?img=3' },
    { avatar: 'https://i.pravatar.cc/40?img=4' },
    { avatar: 'https://i.pravatar.cc/40?img=5' }
  ];

  features = [
    {
      title: 'Smart Lock',
      description: 'Instantly lock any app with intelligent overlay protection',
      icon: '🔒'
    },
    {
      title: 'PIN Security',
      description: 'Secure PIN-based unlock system with failsafe mechanisms',
      icon: '🔐'
    },
    {
      title: 'Multi-Screen',
      description: 'Support for multiple displays and dynamic layouts',
      icon: '🖥️'
    },
    {
      title: 'Presenter Mode',
      description: 'Professional kiosk and presentation capabilities',
      icon: '📊'
    },
    {
      title: 'Time Limits',
      description: 'Set automatic unlock timers for controlled sessions',
      icon: '⏰'
    },
    {
      title: 'Custom Branding',
      description: 'Personalize with your own backgrounds and themes',
      icon: '🎨'
    }
  ];

  ngOnInit() {
    // Set SEO tags for home page
    this.seoService.setHomePage();

    this.startTypewriter();
  }

  ngAfterViewInit() {
    this.setupScrollAnimations();
    this.setupParallaxEffect();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animate-visible');

          // For staggered animations on children
          const children = entry.target.querySelectorAll('.scroll-animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('scroll-animate-visible');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(element => {
      observer.observe(element);
    });

    // Special observer for feature cards with staggered animation
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.feature-glass-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('pop-in');
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    const featuresRow = document.querySelector('.features-cards-row');
    if (featuresRow) {
      featureObserver.observe(featuresRow);
    }

    // Observer for dual cards
    const dualCardsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.sensei-glass-card-split');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('slide-in');
            }, index * 200);
          });
        }
      });
    }, observerOptions);

    const dualCards = document.querySelector('.dual-cards-wrapper');
    if (dualCards) {
      dualCardsObserver.observe(dualCards);
    }
  }

  setupParallaxEffect() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      // Move smoke at different speeds
      const smokeContainer = document.querySelector('.smoke-container') as HTMLElement;
      if (smokeContainer) {
        smokeContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      // Move orbs slower
      const orbContainer = document.querySelector('.orb-container') as HTMLElement;
      if (orbContainer) {
        orbContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
      }

      // Move particles fastest
      const particlesContainer = document.querySelector('.particles-container') as HTMLElement;
      if (particlesContainer) {
        particlesContainer.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      // Scale hero image slightly on scroll
      const heroScreenshot = document.querySelector('.hero-screenshot') as HTMLElement;
      if (heroScreenshot && scrolled < 500) {
        const scale = 1 + (scrolled * 0.0002);
        heroScreenshot.style.transform = `scale(${scale})`;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  startTypewriter() {
    const texts = ['Your Rules.', 'Your Focus.', 'Your Control.'];
    let index = 0;

    setInterval(() => {
      index = (index + 1) % texts.length;
      this.typedText = texts[index];
    }, 3000);
  }

  smoothScroll(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleBilling() {
    this.billingPeriod = this.isYearly ? 'yearly' : 'monthly';
  }

  startTrial() {
    console.log('🚀 Starting MappLock Demo from Home...');
    this.openDemoBrowser();
  }

  playDemo() {
    console.log('🎬 Playing MappLock Demo from Home...');
    this.openDemoBrowser();
  }

  openDemoBrowser() {
    console.log('🔒 Opening MappLock Demo Browser...');

    const demoWindow = window.open('', '_blank',
      'fullscreen=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=' + screen.width + ',height=' + screen.height);

    if (demoWindow && !demoWindow.closed) {
      console.log('✅ Demo window opened successfully!');
      this.setupDemoContent(demoWindow);
    } else {
      console.log('❌ Popup blocked or failed to open');
      this.showPopupBlockedMessage();
    }
  }

  setupDemoContent(demoWindow: Window) {
    demoWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MappLock Demo - Locked Browser</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            position: relative;
          }
          .demo-header {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255,255,255,0.1);
            padding: 10px 20px;
            border-radius: 25px;
            backdrop-filter: blur(10px);
          }
          .lock-icon {
            font-size: 120px;
            margin-bottom: 30px;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          .demo-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .demo-subtitle {
            font-size: 24px;
            opacity: 0.9;
            margin-bottom: 40px;
          }
          .features-list {
            list-style: none;
            font-size: 18px;
            line-height: 2;
          }
          .feature-item {
            margin: 10px 0;
            opacity: 0;
            animation: slideIn 0.5s forwards;
          }
          .feature-item:nth-child(1) { animation-delay: 0.2s; }
          .feature-item:nth-child(2) { animation-delay: 0.4s; }
          .feature-item:nth-child(3) { animation-delay: 0.6s; }
          .feature-item:nth-child(4) { animation-delay: 0.8s; }
          .feature-item:nth-child(5) { animation-delay: 1.0s; }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .exit-hint {
            position: absolute;
            bottom: 30px;
            font-size: 14px;
            opacity: 0.7;
          }
        </style>
      </head>
      <body>
        <div class="demo-header">
          🔒 MappLock Demo Active
        </div>

        <div class="lock-icon">🔐</div>

        <h1 class="demo-title">Welcome to MappLock</h1>
        <p class="demo-subtitle">Experience Locked Browser Mode</p>

        <ul class="features-list">
          <li class="feature-item">✨ Complete Browser Lock</li>
          <li class="feature-item">🛡️ Kiosk Mode Security</li>
          <li class="feature-item">🎯 Focus Enhancement</li>
          <li class="feature-item">📊 Usage Analytics</li>
          <li class="feature-item">⚡ Instant Control</li>
        </ul>

        <div class="exit-hint">
          Press Alt+Tab or Cmd+Tab to exit demo
        </div>
      </body>
      </html>
    `);

    // Block common shortcuts and navigation
    demoWindow.document.addEventListener('keydown', (e) => {
      // Block F11, Escape, Ctrl+W, Ctrl+T, etc.
      if (e.key === 'F11' || e.key === 'Escape' ||
          (e.ctrlKey && (e.key === 'w' || e.key === 't' || e.key === 'n'))) {
        e.preventDefault();
        // Prevent default
      }
      // Allow default
    });

    // Block right-click context menu
    demoWindow.document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      // Prevent default
    });

    console.log('🎯 Demo browser locked and configured!');
  }

  showPopupBlockedMessage() {
    alert(`🔒 MappLock Demo Notice

Your browser blocked the demo popup. This is actually a perfect demonstration of MappLock's security capabilities!

MappLock can:
✨ Override popup blockers when authorized
🛡️ Create truly locked browser experiences
🎯 Bypass browser security restrictions
📊 Control user interaction completely

To see the full demo, please:
1. Allow popups for this site
2. Click the demo button again

This popup blocking is exactly what MappLock prevents in kiosk environments!`);
  }

  selectPlan(plan: string) {
    console.log('selectPlan called with:', plan);
    // Open checkout modal with selected plan
    this.selectedPlanForCheckout = plan;
    this.showCheckoutModal = true;
    console.log('showCheckoutModal set to:', this.showCheckoutModal);
  }

  closeCheckoutModal() {
    this.showCheckoutModal = false;
    this.selectedPlanForCheckout = '';
  }

  contactSales() {
    window.location.href = 'mailto:sales@mapplock.com';
  }

  contactEducation() {
    window.location.href = 'mailto:education@mapplock.com?subject=Education%20Pricing%20Request';
  }

  playIOSDemo() {
    // Create popup with iOS app preview
    const popup = window.open('', 'iosDemo', 'width=800,height=600,scrollbars=no,resizable=no');

    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>MappLock iOS Demo</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .demo-container {
              text-align: center;
              color: white;
            }
            .demo-title {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 20px;
            }
            .demo-description {
              font-size: 18px;
              margin-bottom: 30px;
              opacity: 0.9;
            }
            .github-link {
              display: inline-block;
              background: rgba(255, 255, 255, 0.2);
              padding: 16px 32px;
              border-radius: 12px;
              color: white;
              text-decoration: none;
              font-weight: 600;
              backdrop-filter: blur(20px);
              border: 1px solid rgba(255, 255, 255, 0.3);
              transition: all 0.3s ease;
            }
            .github-link:hover {
              background: rgba(255, 255, 255, 0.3);
              transform: translateY(-2px);
            }
            .features {
              margin-top: 40px;
              text-align: left;
              max-width: 600px;
            }
            .feature {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 16px;
              font-size: 16px;
            }
            .feature-icon {
              font-size: 20px;
              width: 32px;
            }
          </style>
        </head>
        <body>
          <div class="demo-container">
            <h1 class="demo-title">🎨 Beautiful MappLock for iOS</h1>
            <p class="demo-description">
              Experience the same powerful kiosk functionality on iOS with our stunning new app featuring glass morphism UI, haptic feedback, and smooth animations.
            </p>

            <div class="features">
              <div class="feature">
                <span class="feature-icon">🌈</span>
                <span>Animated gradient backgrounds with glass morphism UI</span>
              </div>
              <div class="feature">
                <span class="feature-icon">📱</span>
                <span>Haptic feedback and smooth spring animations</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⏱️</span>
                <span>Session management with progress tracking</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🔒</span>
                <span>Apple Store compliant kiosk mode integration</span>
              </div>
              <div class="feature">
                <span class="feature-icon">🎯</span>
                <span>Focus, Study, and Work session modes</span>
              </div>
              <div class="feature">
                <span class="feature-icon">⚙️</span>
                <span>Customizable duration settings (15min - 2hrs)</span>
              </div>
            </div>

            <a href="https://github.com/AgewellEPM/MappLock-iOS" target="_blank" class="github-link">
              ⬇️ Download Source Code on GitHub
            </a>

            <p style="margin-top: 30px; font-size: 14px; opacity: 0.7;">
              Build the app with Xcode and run on your iOS device or simulator
            </p>
          </div>
        </body>
        </html>
      `);
      popup.document.close();
    } else {
      alert('Please allow popups to view the iOS demo. The iOS app source code is available at: https://github.com/AgewellEPM/MappLock-iOS');
    }
  }
}