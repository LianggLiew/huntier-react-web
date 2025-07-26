"use client"

// Define the ResourceData interface to ensure consistent data structure
export interface ResourceData {
  id: string;
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  image: string;
  type: "article" | "video" | "tool" | "guide";
  url: string;
  category: {
    en: string;
    zh: string;
  };
  topics: {
    en: string[];
    zh: string[];
  };
  timeToConsume: {
    en: string;
    zh: string;
  };
  isNew: boolean;
  isFeatured: boolean;
  date: string;
}

// Sample resource data with English and Chinese versions
export const resourcesData: ResourceData[] = [
  {
    id: "1",
    title: {
      en: "Mastering the Technical Interview: A Comprehensive Guide",
      zh: "掌握技术面试：综合指南"
    },
    description: {
      en: "Learn proven strategies to ace technical interviews at top tech companies with this in-depth guide covering algorithms, system design, and behavioral questions.",
      zh: "通过这份深入的指南学习在顶级科技公司技术面试中取得成功的策略，涵盖算法、系统设计和行为问题。"
    },
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&fit=crop",
    type: "guide",
    url: "#",
    category: {
      en: "Interview Prep",
      zh: "面试准备"
    },
    topics: {
      en: ["Interview", "Career Development", "Technical Skills"],
      zh: ["面试", "职业发展", "技术技能"]
    },
    timeToConsume: {
      en: "15 min read",
      zh: "15分钟阅读"
    },
    isNew: true,
    isFeatured: true,
    date: "2025-04-01"
  },
  {
    id: "2",
    title: {
      en: "How to Create an Effective Developer Portfolio",
      zh: "如何创建有效的开发者作品集"
    },
    description: {
      en: "Build a standout portfolio that showcases your skills and lands you job interviews. Learn what to include and how to present your work.",
      zh: "构建一个能展示您的技能并帮助您获得面试机会的出色作品集。了解应该包含什么内容以及如何展示您的工作。"
    },
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2055&fit=crop",
    type: "article",
    url: "#",
    category: {
      en: "Portfolio Building",
      zh: "作品集构建"
    },
    topics: {
      en: ["Web Development", "Design", "Career Development"],
      zh: ["网页开发", "设计", "职业发展"]
    },
    timeToConsume: {
      en: "8 min read",
      zh: "8分钟阅读"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-03-15"
  },
  {
    id: "3",
    title: {
      en: "Introduction to System Design Principles",
      zh: "系统设计原则介绍"
    },
    description: {
      en: "A video walkthrough of fundamental system design concepts every developer should know, with real-world examples and case studies.",
      zh: "视频讲解每个开发者都应该了解的系统设计基本概念，包含真实的例子和案例研究。"
    },
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&fit=crop",
    type: "video",
    url: "#",
    category: {
      en: "System Design",
      zh: "系统设计"
    },
    topics: {
      en: ["Architecture", "Scalability", "Technical Skills"],
      zh: ["架构", "可扩展性", "技术技能"]
    },
    timeToConsume: {
      en: "22 min watch",
      zh: "22分钟观看"
    },
    isNew: true,
    isFeatured: false,
    date: "2025-04-10"
  },
  {
    id: "4",
    title: {
      en: "Resume Builder with AI-Powered Suggestions",
      zh: "AI驱动的简历构建工具"
    },
    description: {
      en: "Create a professional resume tailored to your target role with AI-powered content suggestions and formatting tools.",
      zh: "借助AI提供的内容建议和格式化工具，为您的目标职位创建专业的简历。"
    },
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&fit=crop",
    type: "tool",
    url: "#",
    category: {
      en: "Resume Tools",
      zh: "简历工具"
    },
    topics: {
      en: ["Resume", "AI Tools", "Career Development"],
      zh: ["简历", "AI工具", "职业发展"]
    },
    timeToConsume: {
      en: "Free tool",
      zh: "免费工具"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-02-28"
  },
  {
    id: "5",
    title: {
      en: "Negotiating Your Tech Job Offer: A Practical Guide",
      zh: "技术岗位薪资谈判：实用指南"
    },
    description: {
      en: "Learn how to confidently negotiate your salary and benefits package with practical scripts and strategies.",
      zh: "学习如何自信地进行薪资和福利谈判，包含实用的谈话脚本和策略。"
    },
    image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&fit=crop",
    type: "article",
    url: "#",
    category: {
      en: "Salary Negotiation",
      zh: "薪资谈判"
    },
    topics: {
      en: ["Negotiation", "Career Development", "Soft Skills"],
      zh: ["谈判", "职业发展", "软技能"]
    },
    timeToConsume: {
      en: "12 min read",
      zh: "12分钟阅读"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-03-05"
  },
  {
    id: "6",
    title: {
      en: "Frontend Development Roadmap 2025",
      zh: "2025年前端开发路线图"
    },
    description: {
      en: "A comprehensive visual guide to becoming a frontend developer in 2025, covering essential skills, tools, and learning path.",
      zh: "2025年成为前端开发者的全面视觉指南，涵盖必要的技能、工具和学习路径。"
    },
    image: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&fit=crop",
    type: "guide",
    url: "#",
    category: {
      en: "Learning Path",
      zh: "学习路径"
    },
    topics: {
      en: ["Web Development", "Frontend", "Technical Skills"],
      zh: ["网页开发", "前端", "技术技能"]
    },
    timeToConsume: {
      en: "10 min read",
      zh: "10分钟阅读"
    },
    isNew: true,
    isFeatured: false,
    date: "2025-04-05"
  },
  {
    id: "7",
    title: {
      en: "Coding Interview Question Solver",
      zh: "编程面试题解答器"
    },
    description: {
      en: "Interactive tool to practice and solve common coding interview questions with step-by-step explanations and performance analysis.",
      zh: "交互式工具，可以练习并解决常见的编程面试问题，提供逐步讲解和性能分析。"
    },
    image: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&fit=crop",
    type: "tool",
    url: "#",
    category: {
      en: "Interview Prep",
      zh: "面试准备"
    },
    topics: {
      en: ["Interview", "Algorithms", "Technical Skills"],
      zh: ["面试", "算法", "技术技能"]
    },
    timeToConsume: {
      en: "Interactive tool",
      zh: "交互式工具"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-01-20"
  },
  {
    id: "8",
    title: {
      en: "Building a Personal Brand as a Developer",
      zh: "作为开发者构建个人品牌"
    },
    description: {
      en: "Video course on how to build your personal brand as a developer through content creation, speaking, and community involvement.",
      zh: "视频课程，讲解如何通过内容创作、演讲和社区参与构建开发者个人品牌。"
    },
    image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=2064&fit=crop",
    type: "video",
    url: "#",
    category: {
      en: "Personal Branding",
      zh: "个人品牌"
    },
    topics: {
      en: ["Career Development", "Content Creation", "Soft Skills"],
      zh: ["职业发展", "内容创作", "软技能"]
    },
    timeToConsume: {
      en: "45 min watch",
      zh: "45分钟观看"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-02-15"
  },
  {
    id: "9",
    title: {
      en: "Cloud Architecture Best Practices",
      zh: "云架构最佳实践"
    },
    description: {
      en: "Learn industry best practices for designing secure, scalable, and cost-effective cloud architectures on major platforms.",
      zh: "学习在主要平台上设计安全、可扩展和成本效益高的云架构的行业最佳实践。"
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&fit=crop",
    type: "article",
    url: "#",
    category: {
      en: "Cloud Computing",
      zh: "云计算"
    },
    topics: {
      en: ["Cloud", "Architecture", "Technical Skills"],
      zh: ["云", "架构", "技术技能"]
    },
    timeToConsume: {
      en: "18 min read",
      zh: "18分钟阅读"
    },
    isNew: true,
    isFeatured: false,
    date: "2025-04-12"
  },
  {
    id: "10",
    title: {
      en: "Soft Skills That Advance Your Tech Career",
      zh: "促进技术职业发展的软技能"
    },
    description: {
      en: "Comprehensive guide to developing the soft skills that help technical professionals advance into leadership roles.",
      zh: "全面指南，帮助技术专业人员培养软技能，晋升为领导角色。"
    },
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&fit=crop",
    type: "guide",
    url: "#",
    category: {
      en: "Career Growth",
      zh: "职业成长"
    },
    topics: {
      en: ["Leadership", "Communication", "Soft Skills"],
      zh: ["领导力", "沟通", "软技能"]
    },
    timeToConsume: {
      en: "14 min read",
      zh: "14分钟阅读"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-03-20"
  },
  {
    id: "11",
    title: {
      en: "Salary Range Calculator for Tech Jobs",
      zh: "技术岗位薪资范围计算器"
    },
    description: {
      en: "Interactive tool to determine appropriate salary ranges based on your skills, experience, location, and current market trends.",
      zh: "根据您的技能、经验、地点和当前市场趋势确定适当薪资范围的交互式工具。"
    },
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?q=80&w=2022&fit=crop",
    type: "tool",
    url: "#",
    category: {
      en: "Salary Tools",
      zh: "薪资工具"
    },
    topics: {
      en: ["Salary", "Career Development", "Market Research"],
      zh: ["薪资", "职业发展", "市场研究"]
    },
    timeToConsume: {
      en: "Free tool",
      zh: "免费工具"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-02-10"
  },
  {
    id: "12",
    title: {
      en: "How to Contribute to Open Source Projects",
      zh: "如何为开源项目做贡献"
    },
    description: {
      en: "Video walkthrough on finding and contributing to open source projects that match your skills and interests.",
      zh: "视频讲解如何寻找并为适合您技能和兴趣的开源项目做贡献。"
    },
    image: "https://images.unsplash.com/photo-1552664688-cf412ec27db2?q=80&w=2070&fit=crop",
    type: "video",
    url: "#",
    category: {
      en: "Open Source",
      zh: "开源项目"
    },
    topics: {
      en: ["Open Source", "Community", "Technical Skills"],
      zh: ["开源", "社区", "技术技能"]
    },
    timeToConsume: {
      en: "28 min watch",
      zh: "28分钟观看"
    },
    isNew: false,
    isFeatured: false,
    date: "2025-03-10"
  }
];

// Helper function to get resource data based on language
export function getLocalizedResourcesData(resources: ResourceData[], lang: string) {
  return resources.map(resource => ({
    ...resource,
    title: resource.title[lang as keyof typeof resource.title] || resource.title.en,
    description: resource.description[lang as keyof typeof resource.description] || resource.description.en,
    category: resource.category[lang as keyof typeof resource.category] || resource.category.en,
    topics: resource.topics[lang as keyof typeof resource.topics] || resource.topics.en,
    timeToConsume: resource.timeToConsume[lang as keyof typeof resource.timeToConsume] || resource.timeToConsume.en
  }));
}

// Helper to get all unique topics based on language
export function getAllTopics(resources: ResourceData[], lang: string) {
  const topicsSet = new Set<string>();
  
  resources.forEach(resource => {
    const topicsArray = resource.topics[lang as keyof typeof resource.topics] || resource.topics.en;
    topicsArray.forEach(topic => topicsSet.add(topic));
  });
  
  return Array.from(topicsSet).sort();
}

// Helper to get all unique categories based on language
export function getAllCategories(resources: ResourceData[], lang: string) {
  const categoriesSet = new Set<string>();
  
  resources.forEach(resource => {
    categoriesSet.add(resource.category[lang as keyof typeof resource.category] || resource.category.en);
  });
  
  return Array.from(categoriesSet).sort();
}
