import type { Lang } from "./i18n";
import type { HubSectionSlug } from "./hub-content";

/**
 * Chrome strings (header, footer, section titles, page kickers, catalog
 * labels) in both languages. Content bodies live in the content files;
 * generated skill data (descriptions, origin stories, family labels) stays
 * English by design. Wording follows docs/mock/visible-grid (Thai primary).
 */

export type HubTitleSlug = Exclude<HubSectionSlug, "hero">;

export type UIStrings = {
  header: {
    navSkills: string;
    navOpenclink: string;
    navCloneSpace: string;
    navBlog: string;
  };
  footer: {
    standard: string;
    transport: string;
    designReference: string;
    repo: string;
  };
  hub: {
    heroKicker: string;
    sectionTitles: Record<HubTitleSlug, string>;
  };
  blogIndex: {
    title: string;
    intro: string;
  };
  ecosystem: {
    kicker: string;
  };
  catalog: {
    standalone: string;
    problem: string;
    attempt: string;
    effectiveness: string;
    inheritedPrefix: string;
    inheritNote: string; // contains a "{label}" placeholder
    seeWord: string;
    noStory: string;
    skillsWord: string;
    generatedNote: string;
  };
};

export const UI_STRINGS: Record<Lang, UIStrings> = {
  th: {
    header: {
      navSkills: "skills",
      navOpenclink: "openclink",
      navCloneSpace: "clone space",
      navBlog: "บล็อก",
    },
    footer: {
      standard: "มาตรฐาน",
      transport: "การรับ-ส่งข้อมูล",
      designReference: "อ้างอิงดีไซน์",
      repo: "repo",
    },
    hub: {
      heroKicker: "xeno-skills · openclink · clone space",
      sectionTitles: {
        problem: "ปัญหา",
        "four-outcomes": "ผลลัพธ์สี่ข้อ",
        "mini-architecture": "แต่ละชิ้นทำงานร่วมกันอย่างไร",
        workflow: "เวิร์กโฟลว์",
        skills: "skills",
        "multi-agent": "multi-agent",
        "t4-standard": "มาตรฐาน T4",
        hooks: "hooks และการบังคับใช้",
        research: "หลักฐาน",
        "built-on": "สร้างอยู่บน",
        install: "ติดตั้ง",
        "blog-teaser": "ล่าสุด",
      },
    },
    blogIndex: {
      title: "บล็อก",
      intro:
        "บันทึกเกี่ยวกับการสร้าง agent-first — งานวิจัย post-mortem และมาตรฐานในแบบที่เติบโตไปตามการพัฒนา",
    },
    ecosystem: {
      kicker: "ระบบนิเวศ",
    },
    catalog: {
      standalone: "อิสระ",
      problem: "ปัญหา",
      attempt: "สิ่งที่ทดลอง",
      effectiveness: "ผลลัพธ์",
      inheritedPrefix: "สืบทอดจาก ",
      inheritNote: "ไม่มีต้นเรื่องของตัวเอง — สืบทอดต้นเรื่องของ {label}",
      seeWord: "ดู",
      noStory: "ยังไม่มีต้นเรื่องถูกบันทึกไว้ — ต้นเรื่องไม่เคยถูกคิดขึ้นเอง",
      skillsWord: "skills",
      generatedNote: "สร้างจาก frontmatter ของ SKILL.md",
    },
  },
  en: {
    header: {
      navSkills: "Skills",
      navOpenclink: "openclink",
      navCloneSpace: "clone space",
      navBlog: "Blog",
    },
    footer: {
      standard: "standard",
      transport: "transport",
      designReference: "design reference",
      repo: "repo",
    },
    hub: {
      heroKicker: "xeno-skills · openclink · clone space",
      sectionTitles: {
        problem: "The problem",
        "four-outcomes": "Four outcomes",
        "mini-architecture": "How it fits together",
        workflow: "The workflow",
        skills: "The skills",
        "multi-agent": "Multi-agent",
        "t4-standard": "The T4 standard",
        hooks: "Hooks & enforcement",
        research: "Evidence",
        "built-on": "Built on",
        install: "Install",
        "blog-teaser": "Latest",
      },
    },
    blogIndex: {
      title: "Blog",
      intro:
        "Notes on building agent-first — research, post-mortems, and the standard as it evolves.",
    },
    ecosystem: {
      kicker: "Ecosystem",
    },
    catalog: {
      standalone: "Standalone",
      problem: "Problem",
      attempt: "Attempt",
      effectiveness: "Effectiveness",
      inheritedPrefix: "inherited from ",
      inheritNote: "No story of its own — inherits the {label} family's story.",
      seeWord: "See",
      noStory: "No origin story recorded yet — the story is never invented.",
      skillsWord: "skills",
      generatedNote: "generated from SKILL.md frontmatter",
    },
  },
};
