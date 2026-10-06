import { IPageSectionMeta, IPageSEO } from './page.model.js';

export interface DefaultPageDefinition {
  title: string;
  isSystem: boolean;
  seo: IPageSEO;
  sectionOrder: IPageSectionMeta[];
  sections: Record<string, any>;
}

export const DEFAULT_PAGE_DATA: Record<string, DefaultPageDefinition> = {
  home: {
    title: 'Home Page',
    isSystem: true,
    seo: {
      metaTitle: 'Home | Grido Publishing Platform',
      metaDescription: 'A purpose-built digital publishing platform and creative editorial studio crafting stories and content architectures.',
    },
    sectionOrder: [
      { id: 'hero', type: 'hero', name: 'Hero Section', isEnabled: true },
      { id: 'about', type: 'about', name: 'About Preview Section', isEnabled: true },
      { id: 'services', type: 'services', name: 'Services / Capabilities', isEnabled: true },
      { id: 'whyUs', type: 'whyUs', name: 'Why Choose Us / Features', isEnabled: true },
      { id: 'process', type: 'process', name: 'Editorial Process Steps', isEnabled: true },
      { id: 'testimonials', type: 'testimonials', name: 'Reader Testimonials', isEnabled: true },
      { id: 'cta', type: 'cta', name: 'Footer & CTA Section', isEnabled: true },
    ],
    sections: {
      hero: {

        heading: 'We Solve',
        highlightWord: 'Problems',
        description:
          'A purpose-built digital publishing platform and creative editorial studio. We craft stories, ideas, and content architectures that elevate digital impact.',
        primaryButtonText: 'Our Services',
        primaryButtonLink: 'services',
        secondaryButtonText: 'About Studio',
        secondaryButtonLink: 'about',
        readersCount: '2.5M+',
        readersLabel: 'Active Readers',
        readersBadgeText: '+10k',
        readersAvatars: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        ],
        showReadersStats: true,
        card1Image:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
        card2Image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      },
      services: {
        badgeText: 'WHAT WE OFFER',
        heading: 'The Services We Provide',
        description:
          'From creative concept to final publication, we engineer modern content management and editorial experiences that inspire engagement and drive digital growth.',
        items: [
          {
            title: 'Digital Publishing',
            description:
              'We create high-converting, deeply engaging content experiences engineered for modern editorial audiences.',
          },
          {
            title: 'UI/UX Design',
            description:
              'Intuitive editorial layouts, comfortable reading typography, and accessible, responsive design systems.',
          },
          {
            title: 'Development & CMS',
            description:
              'Ultra-fast headless architecture, structured REST APIs, and instant real-time publishing workflows.',
          },
        ],
      },
      whyUs: {
        badgeText: 'OUR ADVANTAGE',
        heading: 'Why You Choose Us?',
        description:
          'We eliminate technical friction from digital content management, giving writers and editors a refined environment designed strictly for impact, clarity, and speed.',
        image:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        features: [
          {
            title: 'Fully Secured',
            description:
              'Role-based governance, protected JWT authentication, and secure MongoDB data persistence.',
          },
          {
            title: 'Easy To Edit',
            description:
              'Distraction-free Markdown writing environment with instant multi-device preview support.',
          },
          {
            title: 'Fast & Real-time Publishing',
            description:
              'Sub-second API response times and live WebSocket updates across all connected clients.',
          },
        ],
      },
      process: {
        badgeText: 'HOW WE DO',
        heading: 'We Follow The Easy Steps',
        description:
          'A reliable, tested publishing methodology ensuring consistent editorial standards from concept draft to final release.',
        steps: [
          {
            num: '01',
            title: 'Idea Discovery & Brief',
            items: ['Topic ideation', 'Audience research', 'Key themes analysis'],
          },
          {
            num: '02',
            title: 'Editorial Composition',
            items: ['Structured Markdown', 'Image curation', 'Typography tuning'],
          },
          {
            num: '03',
            title: 'Review & Live Publish',
            items: ['Multi-device preview', 'Real-time broadcast', 'Archive indexing'],
          },
        ],
      },
      testimonials: {
        badgeText: 'TESTIMONIALS',
        heading: 'What Readers Are Saying',
        items: [
          {
            quote:
              'The clarity of layout and focus on long-form readability makes this our primary publication platform.',
            author: 'Elena Rostova',
            role: 'Lead Editorial Director, Apex Media',
            image:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          },
          {
            quote:
              'Publishing across devices with zero rendering friction has streamlined our team workflow dramatically.',
            author: 'Marcus Vance',
            role: 'Managing Editor, Horizon Stories',
            image:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          },
        ],
      },
      cta: {
        badgeText: 'SAY HI TO US',
        heading: "LET'S CONNECT",
        description:
          'Have a question, feedback on an editorial piece, or a proposal for our publishing platform? Reach out directly.',
        contactEmail: 'contact@grido.io',
        workingHours: 'Mon - Fri: 09:00 - 18:00 UTC',
        location: 'London · New York · San Francisco',
      },
    },
  },
  about: {
    title: 'About Page',
    isSystem: true,
    seo: {
      metaTitle: 'About Us | Grido Studio & Philosophy',
      metaDescription: 'Learn about our editorial philosophy, agency capabilities, mission and values.',
    },
    sectionOrder: [
      { id: 'header', type: 'header', name: 'Header & Pillars', isEnabled: true },
      { id: 'philosophy', type: 'philosophy', name: 'Editorial Philosophy', isEnabled: true },
      { id: 'capabilities', type: 'capabilities', name: 'Agency Capabilities', isEnabled: true },
      { id: 'missionVision', type: 'missionVision', name: 'Mission & Vision', isEnabled: true },
      { id: 'values', type: 'values', name: 'Guiding Principles', isEnabled: true },
    ],
    sections: {
      header: {
        badgeText: 'ABOUT OUR STUDIO',
        heading: 'Crafting thoughtful digital publications that endure.',
        highlightWord: 'thoughtful',
        description:
          'We are an independent digital publishing studio dedicated to building durable content architectures. We combine editorial craftsmanship, typography, and robust headless technology to give writers and organizations a publishing medium built strictly for clarity and lasting value.',
        pillars: [
          'Editorial Precision',
          'Clean Typography',
          'Headless Speed',
          'Calm Ergonomics',
        ],
      },
      philosophy: {
        badgeText: 'EDITORIAL PHILOSOPHY',
        heading: 'Why intentional publishing matters in an era of rapid noise.',
        paragraphs: [
          'The modern web moves quickly, often prioritizing fleeting algorithmic engagement over depth. We believe there is enduring value in long-form thinking, structured arguments, and deliberate editorial presentation.',
          'Our platform is designed to eliminate technical distraction from the writing process. When writers are given a focused environment and readers are offered clean typography, digital publishing becomes a durable medium rather than transient feed noise.',
          'Every component, database schema, and interface layout we design reflects this commitment: software that respects the time of authors and the focus of readers.',
        ],
      },
      capabilities: {
        badgeText: 'WHAT WE DO',
        heading: 'End-to-end editorial engineering and digital content systems.',
        description:
          'From initial notes to multi-channel distribution, the platform handles each phase of content creation with purpose-built tools.',
        items: [
          {
            title: 'Editorial Authoring',
            description:
              'A distraction-free writing environment equipped with Markdown formatting, excerpt generation, and estimated reading time calculations.',
          },
          {
            title: 'Structured Taxonomy',
            description:
              'Logical classification across topics, custom tags, and categories to keep large editorial archives organized and easily discoverable.',
          },
          {
            title: 'Role-Based Governance',
            description:
              'Granular permissions distinguishing administrators from contributing editors, with protected draft and publication workflows.',
          },
          {
            title: 'Instant Multi-Device Preview',
            description:
              'Multi-screen preview modes for desktop, tablet, and mobile displays ensuring typography and layout render correctly before going live.',
          },
        ],
      },
      missionVision: {
        missionTitle: 'Empowering creators with dependable, distraction-free tools.',
        missionDescription:
          'Our mission is to eliminate technical friction from the writing process. We believe quality thinking deserves quality presentation, and we are committed to building software that respects the time of writers and the attention of readers.',
        visionTitle: 'A calmer, more thoughtful web for long-form knowledge.',
        visionDescription:
          'We envision a publishing landscape where digital publications prioritize depth, clarity, and durability over transient algorithmic engagement. We strive to be the steady foundation upon which impactful publications are built.',
      },
      values: {
        badgeText: 'GUIDING PRINCIPLES',
        heading: 'Core values that inform every product decision.',
        description:
          'These principles guide how we structure code, design workflows, and shape the editorial tools we deliver.',
        items: [
          {
            number: '01',
            title: 'Clarity Over Complexity',
            description:
              'We believe content management should be straightforward. Every button, input, and panel serves a practical editorial purpose without unnecessary bloat.',
          },
          {
            number: '02',
            title: 'Editorial Craft & Typography',
            description:
              'Words matter. We treat typography, line height, and whitespace as foundational design elements so long-form publications remain effortless to read.',
          },
          {
            number: '03',
            title: 'Operational Reliability',
            description:
              'Content is a critical asset. We prioritize dependable data persistence, automated error handling, and robust JWT authentication across all workflows.',
          },
          {
            number: '04',
            title: 'Speed & Headless Architecture',
            description:
              'Clean semantic markup, optimized bundle sizes, and efficient database indexing provide instant page transitions for readers and editors alike.',
          },
        ],
      },
    },
  },
  '404': {
    title: '404 Not Found Page',
    isSystem: true,
    seo: {
      metaTitle: '404 Not Found | Editorial',
      metaDescription: 'The page you requested could not be found.',
    },
    sectionOrder: [
      { id: 'general', type: 'notFound', name: '404 Error Content & CTA', isEnabled: true },
    ],
    sections: {
      general: {
        badgeCode: '404',
        heading: 'PAGE NOT FOUND',
        line1: 'We looked everywhere for this page.',
        line2: 'Are you sure the website URL is correct?',
        line3: 'Get in touch with the site owner.',
        buttonText: 'Go Back Home',
        buttonLink: '/',
      },
    },
  },
  contact: {
    title: 'Contact Page',
    isSystem: true,
    seo: {
      metaTitle: 'Contact Us | Grido Studio',
      metaDescription: 'Get in touch with the editorial team, inquiries and collaboration.',
    },
    sectionOrder: [
      { id: 'cta', type: 'cta', name: 'Contact & Editorial Desk', isEnabled: true },
    ],
    sections: {
      cta: {
        badgeText: 'SAY HI TO US',
        heading: "LET'S CONNECT",
        description:
          'Have a question, feedback on an editorial piece, or a proposal for our publishing platform? Reach out directly.',
        contactEmail: 'contact@grido.io',
        workingHours: 'Mon - Fri: 09:00 - 18:00 UTC',
        location: 'London · New York · San Francisco',
      },
    },
  },
};
