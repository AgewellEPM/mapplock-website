import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private seoService: SeoService) {}

  ngOnInit() {
    // Set SEO tags for features page
    this.seoService.setFeaturesPage();
    this.initCounterAnimations();
  }

  ngAfterViewInit() {
    this.initScrollAnimations();
    this.setupParallaxEffect();
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animate-visible');

          // Add premium stagger animation for children
          const children = entry.target.querySelectorAll('.scroll-animate-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('scroll-animate-visible');
              // Add premium entrance effects
              (child as HTMLElement).style.transform = 'translateY(0) scale(1)';
              (child as HTMLElement).style.opacity = '1';
            }, index * 150 + 100);
          });

          // Add special effects for feature cards
          if (entry.target.classList.contains('features-grid')) {
            this.initFeatureCardAnimations();
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  initFeatureCardAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('premium-entrance');
      }, index * 100);
    });
  }

  setupParallaxEffect() {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;

      const smokeContainer = document.querySelector('.smoke-container') as HTMLElement;
      if (smokeContainer) {
        smokeContainer.style.transform = `translateY(${scrolled * 0.3}px)`;
      }

      const orbContainer = document.querySelector('.orb-container') as HTMLElement;
      if (orbContainer) {
        orbContainer.style.transform = `translateY(${scrolled * 0.2}px)`;
      }

      const particlesContainer = document.querySelector('.particles-container') as HTMLElement;
      if (particlesContainer) {
        particlesContainer.style.transform = `translateY(${scrolled * 0.5}px)`;
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick);
  }

  initCounterAnimations() {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0');
        const increment = target / 100;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target.toString();
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current).toString();
          }
        }, 20);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });

    const counterSection = document.querySelector('.stats-section');
    if (counterSection) {
      observer.observe(counterSection);
    }
  }

  navigateToDemo() {
    this.router.navigate(['/'], { fragment: 'demo' });
  }

  selectPlan(planType: string) {
    console.log('Selected plan:', planType);
    // Add plan selection logic here
  }

  startFreeTrial() {
    console.log('🚀 Starting Free Trial Demo from Features...');
    this.openDemoBrowser();
  }

  scheduleDemo() {
    console.log('📞 Starting Schedule Demo from Features...');
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
}