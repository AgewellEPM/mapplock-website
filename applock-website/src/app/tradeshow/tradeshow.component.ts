import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-tradeshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tradeshow.component.html',
  styleUrls: ['./tradeshow.component.css']
})
export class TradeshowComponent implements OnInit, AfterViewInit {

  constructor(private seoService: SeoService) {}

  kioskFeatures = [
    {
      icon: '🖥️',
      title: 'Full Screen Lock',
      description: 'Transform any device into a secure kiosk with complete screen control',
      benefits: ['Prevents unauthorized access', 'Maintains brand consistency', 'Ensures user focus']
    },
    {
      icon: '🔐',
      title: 'Application Restriction',
      description: 'Lock devices to specific applications for trade show demonstrations',
      benefits: ['Single-app mode', 'Custom app collections', 'Time-based sessions']
    },
    {
      icon: '⚡',
      title: 'Auto-Reset Sessions',
      description: 'Automatically reset demo sessions between visitors',
      benefits: ['Fresh experience per visitor', 'Prevents data persistence', 'Seamless transitions']
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track visitor engagement and demo performance',
      benefits: ['Real-time metrics', 'Session duration tracking', 'Popular feature analysis']
    },
    {
      icon: '🎯',
      title: 'Remote Management',
      description: 'Control all kiosk devices from a central dashboard',
      benefits: ['Bulk updates', 'Remote troubleshooting', 'Content synchronization']
    },
    {
      icon: '🛡️',
      title: 'Security Hardening',
      description: 'Enterprise-grade security for public-facing devices',
      benefits: ['Malware protection', 'Network isolation', 'Tamper detection']
    }
  ];

  demoScenarios = [
    {
      title: 'Product Showcase Kiosks',
      description: 'Interactive product catalogs with touch-friendly interfaces',
      image: '📱',
      features: ['Touch navigation', 'Product videos', 'Spec comparisons', 'Lead capture']
    },
    {
      title: 'Registration Stations',
      description: 'Streamlined visitor check-in and badge printing',
      image: '📋',
      features: ['QR code scanning', 'Digital forms', 'Badge printing', 'CRM integration']
    },
    {
      title: 'Interactive Demos',
      description: 'Hands-on software demonstrations in controlled environments',
      image: '🎮',
      features: ['Guided tutorials', 'Feature highlights', 'Live simulations', 'Progress tracking']
    },
    {
      title: 'Feedback Collection',
      description: 'Capture visitor feedback and contact information',
      image: '💬',
      features: ['Survey forms', 'Rating systems', 'Contact capture', 'Real-time analytics']
    }
  ];

  tradeshowBenefits = [
    {
      metric: '85%',
      label: 'Increase in Booth Engagement',
      description: 'Interactive kiosks draw more visitors and keep them engaged longer'
    },
    {
      metric: '3x',
      label: 'More Qualified Leads',
      description: 'Capture detailed visitor information through interactive experiences'
    },
    {
      metric: '60%',
      label: 'Reduction in Staff Workload',
      description: 'Automated demos free up staff for high-value conversations'
    },
    {
      metric: '99.9%',
      label: 'Uptime Reliability',
      description: 'Enterprise-grade stability ensures your demos never fail'
    }
  ];

  ngOnInit() {
    // Set SEO tags for trade show page
    this.seoService.setTradeshowPage();
    this.initScrollAnimations();
  }

  ngAfterViewInit() {
    this.setupParallaxEffect();
    this.initInteractiveElements();
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    }, 100);
  }

  setupParallaxEffect() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-element');

      parallaxElements.forEach((element: any) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  initInteractiveElements() {
    // Add hover effects and interactions
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('hovered');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('hovered');
      });
    });
  }

  requestDemo() {
    console.log('🚀 Starting MappLock Demo from Tradeshow...');
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

  scheduleConsultation() {
    console.log('Scheduling consultation...');
    // Add consultation scheduling logic here
  }

  downloadGuide() {
    console.log('Downloading trade show guide...');
    // Add guide download logic here
  }
}