import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../services/seo.service';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
  image?: string;
  tags: string[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, AfterViewInit {

  featuredPost: BlogPost = {
    id: 'getting-started-mapplock',
    title: 'Getting Started with MappLock: Your Complete Guide to Professional Kiosk Mode',
    excerpt: 'Learn how to transform your Mac into a secure kiosk in just 5 minutes. Perfect for classrooms, exhibitions, and business environments.',
    content: '',
    author: 'MappLock Team',
    date: '2024-09-10',
    readTime: '8 min read',
    category: 'Guide',
    featured: true,
    image: 'assets/blog/getting-started.jpg',
    tags: ['Getting Started', 'Kiosk Mode', 'macOS']
  };

  blogPosts: BlogPost[] = [
    {
      id: 'education-success-stories',
      title: 'How Schools Use MappLock to Create Distraction-Free Learning Environments',
      excerpt: 'Discover how educational institutions worldwide are using MappLock to enhance focus and prevent cheating during digital exams.',
      content: '',
      author: 'Sarah Johnson',
      date: '2024-09-08',
      readTime: '6 min read',
      category: 'Education',
      featured: false,
      tags: ['Education', 'Case Study', 'Digital Exams']
    },
    {
      id: 'trade-show-best-practices',
      title: 'Trade Show Demo Best Practices: Keeping Visitors Engaged with Locked Displays',
      excerpt: 'Learn the secrets of creating compelling trade show experiences using MappLock to keep demo stations focused and professional.',
      content: '',
      author: 'Mike Chen',
      date: '2024-09-05',
      readTime: '5 min read',
      category: 'Business',
      featured: false,
      tags: ['Trade Shows', 'Marketing', 'Demos']
    },
    {
      id: 'security-features-deep-dive',
      title: 'MappLock Security: How We Keep Your Kiosk Mode Truly Secure',
      excerpt: 'A technical deep-dive into MappLock\'s security architecture and how it prevents unauthorized access in kiosk environments.',
      content: '',
      author: 'Alex Rodriguez',
      date: '2024-09-03',
      readTime: '10 min read',
      category: 'Technical',
      featured: false,
      tags: ['Security', 'Technical', 'Architecture']
    },
    {
      id: 'museum-interactive-displays',
      title: 'Creating Engaging Museum Experiences with Interactive Kiosk Displays',
      excerpt: 'Museums around the world are using MappLock to create immersive, educational experiences that visitors can\'t accidentally break.',
      content: '',
      author: 'Emily Davis',
      date: '2024-08-30',
      readTime: '7 min read',
      category: 'Case Study',
      featured: false,
      tags: ['Museums', 'Interactive', 'Education']
    },
    {
      id: 'performance-optimization',
      title: 'Optimizing MappLock Performance for High-Traffic Environments',
      excerpt: 'Tips and tricks for getting the best performance from MappLock in busy environments like airports, malls, and convention centers.',
      content: '',
      author: 'David Kim',
      date: '2024-08-28',
      readTime: '9 min read',
      category: 'Technical',
      featured: false,
      tags: ['Performance', 'Optimization', 'Enterprise']
    },
    {
      id: 'remote-management-guide',
      title: 'Managing Multiple MappLock Instances: A Remote Administration Guide',
      excerpt: 'Learn how to efficiently manage dozens or hundreds of MappLock installations across multiple locations from a central dashboard.',
      content: '',
      author: 'Lisa Park',
      date: '2024-08-25',
      readTime: '12 min read',
      category: 'Enterprise',
      featured: false,
      tags: ['Remote Management', 'Enterprise', 'Administration']
    }
  ];

  categories = ['All', 'Guide', 'Education', 'Business', 'Technical', 'Case Study', 'Enterprise'];
  selectedCategory = 'All';
  filteredPosts: BlogPost[] = [];

  constructor(private router: Router, private seoService: SeoService) {}

  ngOnInit() {
    // Set SEO tags for blog page
    this.seoService.setBlogPage();
    this.filteredPosts = this.blogPosts;
    this.initScrollAnimations();
  }

  ngAfterViewInit() {
    this.setupParallaxEffect();
  }

  initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animate-visible');

          // Staggered animations for blog cards
          if (entry.target.classList.contains('blog-grid')) {
            const cards = entry.target.querySelectorAll('.blog-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-in');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(element => {
      observer.observe(element);
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

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredPosts = this.blogPosts;
    } else {
      this.filteredPosts = this.blogPosts.filter(post => post.category === category);
    }
  }

  readPost(postId: string) {
    console.log('Reading post:', postId);
    // Navigate to individual post or open modal
  }

  openDemoBrowser() {
    console.log('🔒 Opening MappLock Demo Browser from Blog...');

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

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Guide': '📖',
      'Education': '🎓',
      'Business': '💼',
      'Technical': '⚙️',
      'Case Study': '📊',
      'Enterprise': '🏢'
    };
    return icons[category] || '📄';
  }

  subscribeNewsletter(email: string) {
    if (email && email.includes('@')) {
      console.log('Newsletter subscription for:', email);
      alert('Thank you for subscribing to the MappLock blog! We\'ll keep you updated with our latest insights.');
    } else {
      alert('Please enter a valid email address.');
    }
  }
}