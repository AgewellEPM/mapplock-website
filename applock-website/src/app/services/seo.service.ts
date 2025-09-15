import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  twitterCard?: string;
  structuredData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultConfig: SeoConfig = {
    title: 'MappLock - Mac Kiosk Mode & App Lock Software',
    description: 'Transform your Mac into kiosk mode. Lock down apps on macOS Sequoia & Sonoma. Perfect for schools, retail, exhibitions.',
    keywords: 'apple kiosk mode, mac kiosk mode, lock app on mac, guided access mac, single app mode mac',
    image: 'https://mapplock.com/og-image.png',
    url: 'https://mapplock.com',
    type: 'website',
    author: 'MappLock',
    twitterCard: 'summary_large_image'
  };

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateTags(config: SeoConfig): void {
    // Merge with defaults
    const seoConfig = { ...this.defaultConfig, ...config };

    // Update title
    if (seoConfig.title) {
      this.title.setTitle(seoConfig.title);
      this.meta.updateTag({ property: 'og:title', content: seoConfig.title });
      this.meta.updateTag({ property: 'twitter:title', content: seoConfig.title });
      this.meta.updateTag({ name: 'title', content: seoConfig.title });
    }

    // Update description
    if (seoConfig.description) {
      this.meta.updateTag({ name: 'description', content: seoConfig.description });
      this.meta.updateTag({ property: 'og:description', content: seoConfig.description });
      this.meta.updateTag({ property: 'twitter:description', content: seoConfig.description });
    }

    // Update keywords
    if (seoConfig.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seoConfig.keywords });
    }

    // Update image
    if (seoConfig.image) {
      this.meta.updateTag({ property: 'og:image', content: seoConfig.image });
      this.meta.updateTag({ property: 'twitter:image', content: seoConfig.image });
    }

    // Update URL
    if (seoConfig.url) {
      this.meta.updateTag({ property: 'og:url', content: seoConfig.url });
      this.meta.updateTag({ property: 'twitter:url', content: seoConfig.url });
      this.updateCanonicalUrl(seoConfig.url);
    }

    // Update type
    if (seoConfig.type) {
      this.meta.updateTag({ property: 'og:type', content: seoConfig.type });
    }

    // Update author
    if (seoConfig.author) {
      this.meta.updateTag({ name: 'author', content: seoConfig.author });
    }

    // Update Twitter card
    if (seoConfig.twitterCard) {
      this.meta.updateTag({ property: 'twitter:card', content: seoConfig.twitterCard });
    }

    // Add structured data if provided
    if (seoConfig.structuredData) {
      this.setStructuredData(seoConfig.structuredData);
    }
  }

  private updateCanonicalUrl(url: string): void {
    const head = document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = document.querySelector(`link[rel='canonical']`);

    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', 'canonical');
      head.appendChild(element);
    }

    element.setAttribute('href', url);
  }

  private setStructuredData(data: any): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  // Page-specific SEO configurations
  setHomePage(): void {
    this.updateTags({
      title: 'MappLock - Mac Kiosk Mode Software | Lock Apps on macOS Sequoia & Sonoma',
      description: 'Professional kiosk mode for Mac. Lock down any app, block websites, create single app mode. Perfect guided access for MacBook, iMac, Mac Mini. Works with macOS Sequoia.',
      keywords: 'mac kiosk mode, apple kiosk mode, lock app on mac, guided access mac, macos sequoia kiosk, macos sonoma kiosk, single app mode mac, mac app locker, kiosk software mac, lock down mac',
      url: 'https://mapplock.com'
    });
  }

  setFeaturesPage(): void {
    this.updateTags({
      title: 'Features - MappLock Mac Kiosk Mode | Single App Mode, Website Blocking',
      description: 'Powerful features for Mac kiosk mode: Single app lock, website blocking, time limits, remote management, multi-display support. Create guided access on any Mac.',
      keywords: 'mac single app mode features, kiosk mode features, block websites mac, mac app restrictions, guided access features, mac parental controls, mac focus mode',
      url: 'https://mapplock.com/features'
    });
  }

  setPricingPage(): void {
    this.updateTags({
      title: 'Pricing - MappLock Mac Kiosk Software | Plans from $29',
      description: 'Affordable Mac kiosk mode software. One-time purchase, no subscriptions. Personal $29, Professional $49, Business $199. Educational discounts available.',
      keywords: 'mac kiosk software pricing, kiosk mode cost, apple kiosk mode price, guided access mac price, affordable mac lock software',
      url: 'https://mapplock.com/pricing'
    });
  }

  setEducationPage(): void {
    this.updateTags({
      title: 'Education - MappLock for Schools | Mac Exam Mode & Student Lockdown',
      description: 'Mac kiosk mode for education. Create exam mode, lock students into apps, prevent cheating, manage classroom Macs. 50% education discount for schools.',
      keywords: 'mac exam mode, student mac lockdown, school kiosk mode, classroom mac management, education kiosk software, mac test mode, guided access school',
      url: 'https://mapplock.com/education'
    });
  }

  setTradeshowPage(): void {
    this.updateTags({
      title: 'Trade Shows - MappLock Exhibition Mode | Mac Display Kiosk',
      description: 'Professional Mac kiosk mode for trade shows and exhibitions. Lock display Macs, create interactive demos, prevent tampering. Perfect for retail displays.',
      keywords: 'trade show kiosk mac, exhibition mode mac, mac retail display, mac demo mode, interactive kiosk mac, mac digital signage',
      url: 'https://mapplock.com/tradeshow'
    });
  }

  setBlogPage(): void {
    this.updateTags({
      title: 'Blog - Mac Kiosk Mode Tips & Guides | MappLock Resources',
      description: 'Learn how to set up kiosk mode on Mac, create guided access, lock apps, and more. Expert tips for macOS Sequoia and Sonoma kiosk configuration.',
      keywords: 'mac kiosk mode guide, how to lock app on mac, guided access tutorial, kiosk mode tips, mac security blog',
      url: 'https://mapplock.com/blog'
    });
  }

  setBlogPost(post: { title: string; excerpt: string; slug: string; tags: string[] }): void {
    this.updateTags({
      title: `${post.title} | MappLock Blog`,
      description: post.excerpt,
      keywords: post.tags.join(', '),
      url: `https://mapplock.com/blog/${post.slug}`,
      type: 'article'
    });
  }
}