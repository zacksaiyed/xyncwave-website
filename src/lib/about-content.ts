// About page data. Replace any image by changing its import below — no component edits required.
import founderImg from "@/assets/about/portraits/founder.jpg";
import t1 from "@/assets/about/portraits/bhavya.jpg";
import t2 from "@/assets/about/portraits/aman-siddiqui.jpg";
import t3 from "@/assets/about/portraits/mizba-siddiqui.jpg";
import t4 from "@/assets/about/portraits/haziq-hasan.jpg";
import t5 from "@/assets/about/portraits/omkar-sawant.jpg";
import t6 from "@/assets/about/portraits/aadil-gugarman.jpg";
import t7 from "@/assets/about/portraits/ghufran-khan.jpg";
import t8 from "@/assets/about/portraits/furqan-khan.jpg";
import t9 from "@/assets/about/portraits/umar-uddin.jpg;
import n1 from "@/assets/about/news-1.jpg";
import n2 from "@/assets/about/news-2.jpg";
import n3 from "@/assets/about/news-3.jpg";

export type FounderMedia = { type: "image" | "video"; imageSrc: string; videoSrc?: string; posterSrc?: string; alt: string };

export const founder = {
  name: "Aasiya Saiyed",
  role: "Founder",
  media: { type: "image", imageSrc: founderImg, alt: "Portrait of Aasiya Saiyed, Founder of Xyncwave" } as FounderMedia,
  paragraphs: [
    "Xyncwave was founded by Aasiya Saiyed around a simple operating principle: understand how the business works, where friction is building, and what needs to change before deciding which technology should be introduced.",
    "As Founder, Aasiya shapes Xyncwave's direction across customer problems, partnerships and growth. The focus is on building a technology company that connects business context with engineering execution — whether the requirement involves digitalization, modernization, data, cloud platforms or additional delivery capability.",
    "The goal is not to sell technology for its own sake. It is to help organizations make practical technology decisions that improve how work moves, information flows and teams deliver.",
  ],
  principles: ["Business-first technology", "Long-term partnerships", "Accountable delivery"],
};

export type TeamShape = "portrait" | "circle" | "square";
export type TeamMember = { name: string; role: string; image: string; shape: TeamShape; focalPoint: string };

export const teamMembers: TeamMember[] = [
  { name: "Bhavya", role: "Head of Growth & Strategic Partnerships", image: t1, shape: "portrait", focalPoint: "center 30%" },
  { name: "Aman Siddiqui", role: "Data Engineer", image: t2, shape: "circle", focalPoint: "center 30%" },
  { name: "Mizba Siddiqui", role: "Transformation Delivery Manager", image: t3, shape: "portrait", focalPoint: "center 25%" },
  { name: "Haziq Hasan", role: "Application Modernization Engineer", image: t4, shape: "square", focalPoint: "center 30%" },
  { name: "Omkar Sawant", role: "Data Engineer", image: t5, shape: "circle", focalPoint: "center 30%" },
  { name: "Aadil Gugarman", role: "Growth & Outreach Specialist", image: t6, shape: "portrait", focalPoint: "center 30%" },
  { name: "Ghufran Khan", role: "Data Engineer", image: t7, shape: "square", focalPoint: "center 30%" },
  { name: "Furqan Kahn", role: "Data Engineer", image: t8, shape: "portrait", focalPoint: "center 30%" },
  { name: "Umar Uddin", role: "Cloud & Emerging Technologies Engineer", image: t9, shape: "square", focalPoint: "center 30%" },
];

export type NewsItem = { date: string; category: string; title: string; excerpt: string; image: string; href: string | null };

export const companyNews: NewsItem[] = [
  { date: "September 2026", category: "Company", title: "Xyncwave expands its case study library", excerpt: "New case studies are bringing more delivery experience across healthcare, data engineering, modernization and operational digitalization into view.", image: n1, href: "/case-studies" },
  { date: "September 2026", category: "Digital presence", title: "A refreshed Xyncwave website is taking shape", excerpt: "The Xyncwave website is evolving into a clearer platform for business problems, engineering expertise, case studies and practical technology insight.", image: n2, href: null },
  { date: "September 2026", category: "Capabilities", title: "Expanding our focus across data, cloud and modernization", excerpt: "Xyncwave continues to strengthen how its engineering capabilities are presented across data platforms, cloud delivery and application modernization.", image: n3, href: null },
];
