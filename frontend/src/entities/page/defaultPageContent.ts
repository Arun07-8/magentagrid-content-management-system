import type { HomePageSections, AboutPageSections, NotFoundPageSections } from './types';

export const DEFAULT_HOME_SECTIONS: HomePageSections = {
  hero: {
    badgeText: 'Modern Editorial Publication',
    heading: 'We Solve',
    highlightWord: 'Problems',
    description:
      'A purpose-built digital publishing platform and creative editorial publication. We craft stories, ideas, and content architectures that elevate digital impact.',
    primaryButtonText: 'Our Services',
    primaryButtonLink: 'services',
    secondaryButtonText: 'About',
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
        title: 'Development & Publishing',
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
    badgeText: 'OUR METHODOLOGY',
    heading: 'How We Do',
    description:
      'A structured, repeatable approach to managing, formatting, and publishing digital content with uncompromising craft.',
    steps: [
      {
        num: '01',
        title: 'Ideate',
        items: [
          'Content Strategy',
          'Topic Research',
          'Audience Needs',
          'Editorial Planning',
        ],
      },
      {
        num: '02',
        title: 'Design',
        items: [
          'Visual Systems',
          'Typography Hierarchy',
          'Interaction Design',
          'Multi-device Preview',
        ],
      },
      {
        num: '03',
        title: 'Frontend & Publish',
        items: [
          'Headless API',
          'Instant Distribution',
          'Real-time WebSocket',
          'High Performance',
        ],
      },
    ],
  },
  testimonials: {
    badgeText: 'TESTIMONIALS',
    heading: 'What Our Readers & Editors Say About Us',
    items: [
      {
        quote:
          'This platform transformed our digital publishing workflow. The reading experience is exceptionally clean, typography is gorgeous, and our editorial team publishes dispatches 3x faster without touching boilerplate code.',
        author: 'Lawrence Gallagher',
        role: 'Senior Editorial Director',
        image:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      },
      {
        quote:
          'A truly modern platform that prioritizes reader clarity and developer peace of mind. The real-time updates and seamless media handling make it an indispensable tool for our publication.',
        author: 'Elena Rostova',
        role: 'Head of Content, Horizon Media',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      },
    ],
  },
  cta: {
    badgeText: 'SAY HI TO US',
    heading: "LET'S CONNECT",
    description:
      'Have an editorial dispatch, platform inquiry, or story pitch? Reach out directly to our publishing team.',
    contactEmail: 'contact@grido.io',
    workingHours: 'Monday – Friday : 08 AM – 06 PM',
    location: 'New York & Global Remote',
  },
};

export const DEFAULT_ABOUT_SECTIONS: AboutPageSections = {
  header: {
    badgeText: 'ABOUT US',
    heading: 'We believe good content should',
    highlightWord: 'move people',
    description:
      'A modern publishing platform and digital publication engineered for writers, publishers, and creative thinkers who prioritize craft, speed, and reader-first presentation.',
    pillars: [
      'Editorial Integrity',
      'Lightweight Core',
      'Structured Taxonomies',
      'Real-time Distribution',
    ],
    image:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  },
  philosophy: {
    badgeText: 'OUR PHILOSOPHY',
    heading: 'Built by teams who value writing, precision, and visual craft.',
    paragraphs: [
      'Modern digital publishing often gets weighed down by excessive configuration, convoluted plugin ecosystems, and cluttered administrative dashboards that pull attention away from the actual content.',
      'We built this platform to bring simplicity and dignity back to digital publishing. By focusing strictly on the essential requirements of content creation—writing, editing, categorizing, and distributing—we provide writers and editors with a calm, predictable environment.',
      'Whether publishing industry analysis, technical essays, or daily dispatches, our publication platform ensures every article looks polished and remains comfortable to read across every device.',
    ],
    image:
      'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
  },
  capabilities: {
    badgeText: 'PLATFORM CAPABILITIES',
    heading: 'Streamlining the entire editorial lifecycle.',
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
};

export const DEFAULT_NOT_FOUND_SECTIONS: NotFoundPageSections = {
  general: {
    badgeCode: '404',
    heading: 'PAGE NOT FOUND',
    line1: 'We looked everywhere for this page.',
    line2: 'Are you sure the website URL is correct?',
    line3: 'Get in touch with the site owner.',
    buttonText: 'Go Back Home',
    buttonLink: '/',
  },
};

