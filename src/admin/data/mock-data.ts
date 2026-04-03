// ─── Admin Studio Mock Data ─────────────────────────────────

export type AdminRole = "super_admin" | "manager" | "viewer";
export type MemberStatus = "active" | "invited" | "inactive";
export type MemberRole = "learner" | "manager" | "admin";
export type CourseType = "nexi_preloaded" | "custom" | "commissioned";
export type CourseStatus = "active" | "draft" | "archived";

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  department: string;
  status: MemberStatus;
  dateJoined: string;
  coursesEnrolled: number;
  lastActive: string;
  avatar?: string;
  masteryAchieved: number;
}

export interface AdminCourseItem {
  id: string;
  name: string;
  type: CourseType;
  status: CourseStatus;
  enrolledCount: number;
  masteryRate: number;
  dateDeployed: string;
  masteryDefinition: string;
  department: string;
}

export interface Department {
  id: string;
  name: string;
  memberCount: number;
  coursesAssigned: number;
  manager: string;
  description: string;
}

export interface ActivityEvent {
  id: string;
  text: string;
  time: string;
  type: "completion" | "join" | "deploy" | "mastery";
}

export interface Announcement {
  id: string;
  title: string;
  audience: string;
  sentDate: string;
  sentBy: string;
  body: string;
}

export interface ContentItem {
  id: string;
  fileName: string;
  fileType: "pdf" | "video" | "slides" | "doc" | "link";
  linkedCourse: string;
  uploadDate: string;
  uploaderName: string;
  fileSize: string;
}

// ─── Organization ───────────────────────────────────────────

export const organization = {
  name: "Meridian Institute",
  industry: "Education & Training",
  contactEmail: "admin@meridian.edu",
  timezone: "America/New_York",
  logo: null as string | null,
  accentColor: "#e67e22",
  welcomeMessage: "Welcome to Meridian Institute's learning platform. Your journey to mastery starts here.",
};

export const currentAdmin = {
  name: "Jordan Reeves",
  email: "j.reeves@meridian.edu",
  role: "super_admin" as AdminRole,
  avatar: null as string | null,
};

// ─── Departments ────────────────────────────────────────────

export const departments: Department[] = [
  { id: "dept-1", name: "Engineering", memberCount: 5, coursesAssigned: 3, manager: "Priya Sharma", description: "Software engineering and infrastructure team" },
  { id: "dept-2", name: "Product", memberCount: 4, coursesAssigned: 2, manager: "Marcus Chen", description: "Product management and design team" },
  { id: "dept-3", name: "Operations", memberCount: 3, coursesAssigned: 2, manager: "Elena Vasquez", description: "Operations, HR, and administration" },
];

// ─── Members ────────────────────────────────────────────────

export const members: AdminMember[] = [
  { id: "m-1", name: "Aisha Patel", email: "a.patel@meridian.edu", role: "learner", department: "Engineering", status: "active", dateJoined: "2025-09-15", coursesEnrolled: 3, lastActive: "2 hours ago", masteryAchieved: 2 },
  { id: "m-2", name: "James Liu", email: "j.liu@meridian.edu", role: "learner", department: "Engineering", status: "active", dateJoined: "2025-10-02", coursesEnrolled: 2, lastActive: "1 day ago", masteryAchieved: 1 },
  { id: "m-3", name: "Priya Sharma", email: "p.sharma@meridian.edu", role: "manager", department: "Engineering", status: "active", dateJoined: "2025-08-20", coursesEnrolled: 2, lastActive: "3 hours ago", masteryAchieved: 2 },
  { id: "m-4", name: "Marcus Chen", email: "m.chen@meridian.edu", role: "manager", department: "Product", status: "active", dateJoined: "2025-08-15", coursesEnrolled: 2, lastActive: "5 hours ago", masteryAchieved: 1 },
  { id: "m-5", name: "Elena Vasquez", email: "e.vasquez@meridian.edu", role: "manager", department: "Operations", status: "active", dateJoined: "2025-07-30", coursesEnrolled: 1, lastActive: "1 day ago", masteryAchieved: 1 },
  { id: "m-6", name: "David Okafor", email: "d.okafor@meridian.edu", role: "learner", department: "Engineering", status: "active", dateJoined: "2025-11-01", coursesEnrolled: 2, lastActive: "4 hours ago", masteryAchieved: 0 },
  { id: "m-7", name: "Sophie Turner", email: "s.turner@meridian.edu", role: "learner", department: "Product", status: "active", dateJoined: "2025-10-15", coursesEnrolled: 1, lastActive: "6 hours ago", masteryAchieved: 1 },
  { id: "m-8", name: "Raj Krishnamurthy", email: "r.krishnamurthy@meridian.edu", role: "learner", department: "Product", status: "active", dateJoined: "2025-11-10", coursesEnrolled: 2, lastActive: "12 hours ago", masteryAchieved: 0 },
  { id: "m-9", name: "Lena Hoffmann", email: "l.hoffmann@meridian.edu", role: "learner", department: "Operations", status: "invited", dateJoined: "2026-03-20", coursesEnrolled: 0, lastActive: "Never", masteryAchieved: 0 },
  { id: "m-10", name: "Carlos Rivera", email: "c.rivera@meridian.edu", role: "learner", department: "Operations", status: "active", dateJoined: "2025-12-05", coursesEnrolled: 2, lastActive: "8 days ago", masteryAchieved: 1 },
  { id: "m-11", name: "Yuki Tanaka", email: "y.tanaka@meridian.edu", role: "learner", department: "Engineering", status: "inactive", dateJoined: "2025-09-01", coursesEnrolled: 1, lastActive: "30 days ago", masteryAchieved: 0 },
  { id: "m-12", name: "Amara Diallo", email: "a.diallo@meridian.edu", role: "admin", department: "Operations", status: "active", dateJoined: "2025-07-15", coursesEnrolled: 0, lastActive: "1 hour ago", masteryAchieved: 0 },
];

// ─── Courses ────────────────────────────────────────────────

export const adminCourses: AdminCourseItem[] = [
  { id: "c-1", name: "Python Fundamentals", type: "nexi_preloaded", status: "active", enrolledCount: 8, masteryRate: 62, dateDeployed: "2025-10-01", masteryDefinition: "Learner can independently write, debug, and explain Python programs using core data structures, control flow, and functions.", department: "Engineering" },
  { id: "c-2", name: "Leadership Basics", type: "custom", status: "active", enrolledCount: 6, masteryRate: 45, dateDeployed: "2025-11-15", masteryDefinition: "Learner demonstrates understanding of situational leadership, active listening, and team feedback frameworks.", department: "Product" },
  { id: "c-3", name: "Data Privacy & Compliance", type: "nexi_preloaded", status: "active", enrolledCount: 12, masteryRate: 78, dateDeployed: "2025-09-20", masteryDefinition: "Learner can identify GDPR/CCPA requirements and apply data handling best practices in their work context.", department: "Operations" },
  { id: "c-4", name: "Project Management Essentials", type: "commissioned", status: "draft", enrolledCount: 0, masteryRate: 0, dateDeployed: "2026-03-01", masteryDefinition: "Learner can plan, scope, and track a project using agile or waterfall methodology appropriate to context.", department: "Product" },
];

// ─── Activity Feed ──────────────────────────────────────────

export const recentActivity: ActivityEvent[] = [
  { id: "a-1", text: "Aisha Patel completed Python Fundamentals", time: "2 hours ago", type: "completion" },
  { id: "a-2", text: "3 new members joined from Operations", time: "5 hours ago", type: "join" },
  { id: "a-3", text: "New course deployed: Leadership Basics", time: "1 day ago", type: "deploy" },
  { id: "a-4", text: "James Liu achieved mastery in Data Privacy & Compliance", time: "1 day ago", type: "mastery" },
  { id: "a-5", text: "David Okafor started Python Fundamentals", time: "2 days ago", type: "completion" },
  { id: "a-6", text: "Priya Sharma achieved mastery in Python Fundamentals", time: "3 days ago", type: "mastery" },
  { id: "a-7", text: "Sophie Turner completed Leadership Basics", time: "4 days ago", type: "completion" },
];

// ─── Announcements ──────────────────────────────────────────

export const announcements: Announcement[] = [
  { id: "ann-1", title: "Q2 Learning Goals Update", audience: "All Members", sentDate: "2026-03-28", sentBy: "Jordan Reeves", body: "We're excited to share our updated Q2 learning objectives. Focus areas include data literacy and leadership development." },
  { id: "ann-2", title: "New Compliance Course Available", audience: "Operations", sentDate: "2026-03-15", sentBy: "Jordan Reeves", body: "A new Data Privacy & Compliance course is now available in your library. Please complete it by end of month." },
  { id: "ann-3", title: "Welcome New Team Members", audience: "All Members", sentDate: "2026-03-01", sentBy: "Amara Diallo", body: "Please welcome our newest team members joining this quarter. We're thrilled to have you on board!" },
];

// ─── Content Library ────────────────────────────────────────

export const contentLibrary: ContentItem[] = [
  { id: "cl-1", fileName: "Python Basics Handbook.pdf", fileType: "pdf", linkedCourse: "Python Fundamentals", uploadDate: "2025-09-28", uploaderName: "Jordan Reeves", fileSize: "2.4 MB" },
  { id: "cl-2", fileName: "Variables & Data Types.mp4", fileType: "video", linkedCourse: "Python Fundamentals", uploadDate: "2025-09-29", uploaderName: "Jordan Reeves", fileSize: "145 MB" },
  { id: "cl-3", fileName: "Leadership Framework Slides.pptx", fileType: "slides", linkedCourse: "Leadership Basics", uploadDate: "2025-11-10", uploaderName: "Marcus Chen", fileSize: "8.1 MB" },
  { id: "cl-4", fileName: "Active Listening Guide.docx", fileType: "doc", linkedCourse: "Leadership Basics", uploadDate: "2025-11-12", uploaderName: "Marcus Chen", fileSize: "340 KB" },
  { id: "cl-5", fileName: "GDPR Overview.pdf", fileType: "pdf", linkedCourse: "Data Privacy & Compliance", uploadDate: "2025-09-18", uploaderName: "Elena Vasquez", fileSize: "1.8 MB" },
  { id: "cl-6", fileName: "Data Handling Best Practices.mp4", fileType: "video", linkedCourse: "Data Privacy & Compliance", uploadDate: "2025-09-19", uploaderName: "Elena Vasquez", fileSize: "210 MB" },
  { id: "cl-7", fileName: "Compliance Checklist.pdf", fileType: "pdf", linkedCourse: "Data Privacy & Compliance", uploadDate: "2025-09-20", uploaderName: "Jordan Reeves", fileSize: "560 KB" },
  { id: "cl-8", fileName: "Functions & Modules Lecture.mp4", fileType: "video", linkedCourse: "Python Fundamentals", uploadDate: "2025-10-05", uploaderName: "Jordan Reeves", fileSize: "198 MB" },
];

// ─── Preloaded Course Catalog ───────────────────────────────

export interface PreloadedCourse {
  id: string;
  title: string;
  description: string;
  category: string;
}

export const preloadedCourses: PreloadedCourse[] = [
  { id: "pre-1", title: "Business Communication", description: "Professional writing, presentation skills, and stakeholder communication.", category: "Business & Leadership" },
  { id: "pre-2", title: "Strategic Thinking", description: "Frameworks for strategic analysis, decision-making, and long-term planning.", category: "Business & Leadership" },
  { id: "pre-3", title: "Cloud Computing Basics", description: "Introduction to cloud infrastructure, services, and deployment models.", category: "Technical Skills" },
  { id: "pre-4", title: "SQL & Data Analysis", description: "Query writing, data manipulation, and analytical reporting fundamentals.", category: "Technical Skills" },
  { id: "pre-5", title: "Time Management", description: "Prioritization techniques, focus strategies, and productivity systems.", category: "Professional Development" },
  { id: "pre-6", title: "Workplace Safety 101", description: "OSHA standards, hazard identification, and emergency preparedness.", category: "Compliance & Safety" },
  { id: "pre-7", title: "Healthcare Data Privacy", description: "HIPAA compliance, patient data handling, and security protocols.", category: "Industry-Specific" },
  { id: "pre-8", title: "Conflict Resolution", description: "Mediation techniques, difficult conversations, and team dynamics.", category: "Professional Development" },
];

// ─── Analytics Data ─────────────────────────────────────────

export const weeklyActiveData = [
  { week: "W1", active: 8 },
  { week: "W2", active: 9 },
  { week: "W3", active: 7 },
  { week: "W4", active: 10 },
  { week: "W5", active: 9 },
  { week: "W6", active: 11 },
  { week: "W7", active: 10 },
  { week: "W8", active: 9 },
];

export const knowledgeGaps = [
  "Recursion & recursive algorithms",
  "GDPR data subject rights",
  "Situational leadership models",
  "Error handling in Python",
  "Cross-functional stakeholder management",
];

// ─── Helper ─────────────────────────────────────────────────

export const roleBadgeLabel = (role: AdminRole): string => {
  switch (role) {
    case "super_admin": return "Super Admin";
    case "manager": return "Manager";
    case "viewer": return "Viewer";
  }
};
