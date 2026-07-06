export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  variant?: "default" | "code-review";
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Social {
  platform: "github" | "linkedin" | "leetcode" | "email";
  url: string;
}

export const portfolio = {
  name: "Arya Shewale",
  role: "Cloud Developer (AWS) & Full Stack Web Developer",
  tagline: "Building scalable clouds & pixel-perfect experiences",
  taglineAlt: "I turn ideas into full-stack apps and deploy them to the cloud",
  photo: "/assets/arya-photo.jpg",
  resumeUrl: "/assets/resume.pdf",
  hero: {
    headline: ["Arya", "Shewale"],
    gradientWords: [0, 1],
    subtext:
      "Cloud Developer (AWS) & Full Stack Web Developer passionate about scalable infrastructure, clean code, and playful interfaces that make complex systems feel simple.",
    cta: { label: "View My Work", href: "#projects" },
    stats: [
      { value: 250, label: "LeetCode problems", suffix: "+", animate: true },
      { value: "9.1", label: "CGPA", suffix: "", animate: false },
      { value: "4", label: "Major projects", suffix: "", animate: false },
    ],
  },
  about: {
    bio: "I'm a cloud and full-stack developer who loves turning ambitious ideas into production-ready systems. From self-healing AWS architectures to AI governance SDKs and healthcare platforms, I blend creative problem-solving with rigorous engineering. When I'm not deploying to the cloud, I'm solving LeetCode challenges or experimenting with motion-rich UIs that make developers smile.",
    avatar: "/assets/arya-photo.jpg",
    education: {
      degree: "B.Tech in Computer Engineering",
      school: "K. J. Somaiya Institute of Technology (University of Mumbai)",
      period: "May 2023 – May 2027",
      cgpa: "9.1",
    },
  },
  skillCategories: [
    {
      id: "languages",
      label: "Languages",
      skills: ["C", "C++", "Java", "JavaScript"],
    },
    {
      id: "frontend",
      label: "Frontend",
      skills: ["HTML5", "CSS3", "Bootstrap", "Tailwind", "React.js", "Redux"],
    },
    {
      id: "backend",
      label: "Backend",
      skills: [
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "MySQL",
        "MongoDB",
        "PostgreSQL",
        "RESTful APIs",
        "Firebase",
        "Cloudinary",
      ],
    },
    {
      id: "cloud",
      label: "Cloud & Tools",
      skills: [
        "AWS Cloud",
        "Docker",
        "CI/CD",
        "Linux",
        "Git",
        "GitHub",
        "Postman",
        "Vite",
        "VS Code",
        "Figma",
      ],
    },
  ] satisfies SkillCategory[],
  projects: [
    {
      title: "Global Self-Healing Cloud Platform",
      description:
        "Multi-region self-healing cloud platform on AWS using EC2, ALB, Route53, Lambda, and EventBridge to detect failures and automatically shift traffic. Real-time health evaluation via CloudWatch metrics with system state exposed through S3-backed APIs. React dashboard with live status, failover visualization, historical metrics, and chaos engineering controls.",
      image: "/images/project-cloud.svg",
      tags: ["AWS", "EC2", "Lambda", "EventBridge", "CloudWatch", "React", "Route53"],
      repoUrl: "https://github.com/popeyepie1211/guardrails-sdk",
      liveUrl: "https://github.com/popeyepie1211/guardrails-sdk",
    },
    {
      title: "GuardRails - AI",
      description:
        "Real-time AI governance and auditing SDK evaluating model health across 5 vitals: Fairness, Stability, Security, Privacy, and Transparency. High-concurrency architecture with immutable audit trail for 100k+ concurrent users. WDAG tracing with dynamic statistical thresholding for automated risk detection in production AI.",
      image: "/images/project-ai.svg",
      tags: ["AI Governance", "SDK", "High-Concurrency Systems", "Auditing"],
      repoUrl: "https://github.com/popeyepie1211/guardrails-sdk",
      liveUrl: "https://github.com/popeyepie1211/guardrails-sdk",
    },
    {
      title: "MediBit — Digital Healthcare Platform",
      description:
        "Full-stack doctor appointment booking system built with Next.js, React, and PostgreSQL (via Prisma). Clerk integration for secure authentication plus remote consultations using the Vonage Video API. Credit-based transaction system and automated doctor verification workflows.",
      image: "/images/project-medibit.png",
      tags: ["Next.js", "React", "PostgreSQL", "Prisma", "Clerk", "Vonage API"],
      repoUrl: "https://github.com/popeyepie1211/doctor-app",
      liveUrl: "https://github.com/popeyepie1211/doctor-app",
    },
    {
      title: "CodeMentor AI",
      description:
        "AI-powered code review platform providing instant feedback, bug detection, performance analysis, code quality suggestions, and automated review reports. Upload code or write in a built-in editor and receive AI-generated feedback within seconds — no waiting on a senior reviewer.",
      image: "/images/project-codementor.png",
      tags: ["AI", "Code Review", "Developer Tools", "TBD — stack updating"],
      repoUrl: "#",
    },
  ],
  experience: [
    {
      role: "B.Tech Computer Engineering",
      company: "K. J. Somaiya Institute of Technology",
      period: "May 2023 – May 2027",
      description:
        "University of Mumbai · CGPA 9.1. Focus on cloud systems, full-stack development, and applied AI engineering.",
    },
  ],
  testimonials: [] as Testimonial[],
  contact: {
    email: "aryashewale18@gmail.com",
    phone: "(+91) 7700936629",
    socials: [
      { platform: "github" as const, url: "https://github.com/popeyepie1211" },
      {
        platform: "linkedin" as const,
        url: "https://www.linkedin.com/in/arya-shewale-15183a311/",
      },
      { platform: "leetcode" as const, url: "https://leetcode.com/u/Arya_Shewale" },
    ],
  },
  nav: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  terminal: {
    command: "> whoami",
    output: "Arya Shewale, Cloud + Full Stack Dev",
  },
};
