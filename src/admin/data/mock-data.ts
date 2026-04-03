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
  industry: "Education & Research",
  contactEmail: "admin@meridian.edu",
  timezone: "America/Los_Angeles",
  logo: null as string | null,
  accentColor: "#e67e22",
  welcomeMessage: "Welcome to Meridian Institute's learning platform. Your journey to mastery starts here.",
};

export const currentAdmin = {
  name: "Dr. Sarah Mitchell",
  email: "s.mitchell@meridian.edu",
  role: "super_admin" as AdminRole,
  avatar: null as string | null,
};

// ─── Departments ────────────────────────────────────────────
// Aligned with the course subjects used in the learner workspace

export const departments: Department[] = [
  { id: "dept-1", name: "Computer Science", memberCount: 5, coursesAssigned: 2, manager: "Dr. Sarah Mitchell", description: "Machine learning, data science, and computational methods" },
  { id: "dept-2", name: "Mathematics & Statistics", memberCount: 4, coursesAssigned: 2, manager: "Priya Sharma", description: "Statistical methods, linear algebra, and applied mathematics" },
  { id: "dept-3", name: "Humanities & Cognitive Science", memberCount: 3, coursesAssigned: 2, manager: "Marcus Johnson", description: "Philosophy of mind, cognitive psychology, and social science research" },
];

// ─── Members ────────────────────────────────────────────────
// Alex Chen (the learner persona) is included as a member

export const members: AdminMember[] = [
  { id: "m-1", name: "Alex Chen", email: "alex@meridian.edu", role: "learner", department: "Computer Science", status: "active", dateJoined: "2025-09-01", coursesEnrolled: 3, lastActive: "2 min ago", masteryAchieved: 1 },
  { id: "m-2", name: "Jordan Chen", email: "jordan.chen@meridian.edu", role: "learner", department: "Computer Science", status: "active", dateJoined: "2025-09-15", coursesEnrolled: 2, lastActive: "1 day ago", masteryAchieved: 1 },
  { id: "m-3", name: "Priya Sharma", email: "priya.s@meridian.edu", role: "manager", department: "Mathematics & Statistics", status: "active", dateJoined: "2025-08-20", coursesEnrolled: 2, lastActive: "3 hours ago", masteryAchieved: 2 },
  { id: "m-4", name: "Marcus Johnson", email: "m.johnson@meridian.edu", role: "manager", department: "Humanities & Cognitive Science", status: "active", dateJoined: "2025-08-15", coursesEnrolled: 2, lastActive: "5 hours ago", masteryAchieved: 1 },
  { id: "m-5", name: "Yuki Tanaka", email: "yuki.t@meridian.edu", role: "learner", department: "Computer Science", status: "active", dateJoined: "2025-10-02", coursesEnrolled: 3, lastActive: "4 hours ago", masteryAchieved: 0 },
  { id: "m-6", name: "David Okafor", email: "d.okafor@meridian.edu", role: "learner", department: "Mathematics & Statistics", status: "active", dateJoined: "2025-11-01", coursesEnrolled: 2, lastActive: "4 hours ago", masteryAchieved: 0 },
  { id: "m-7", name: "Sophie Turner", email: "s.turner@meridian.edu", role: "learner", department: "Humanities & Cognitive Science", status: "active", dateJoined: "2025-10-15", coursesEnrolled: 2, lastActive: "6 hours ago", masteryAchieved: 1 },
  { id: "m-8", name: "Raj Krishnamurthy", email: "r.krishnamurthy@meridian.edu", role: "learner", department: "Mathematics & Statistics", status: "active", dateJoined: "2025-11-10", coursesEnrolled: 2, lastActive: "12 hours ago", masteryAchieved: 0 },
  { id: "m-9", name: "Lena Hoffmann", email: "l.hoffmann@meridian.edu", role: "learner", department: "Humanities & Cognitive Science", status: "invited", dateJoined: "2026-03-20", coursesEnrolled: 0, lastActive: "Never", masteryAchieved: 0 },
  { id: "m-10", name: "Carlos Rivera", email: "c.rivera@meridian.edu", role: "learner", department: "Computer Science", status: "active", dateJoined: "2025-12-05", coursesEnrolled: 2, lastActive: "8 days ago", masteryAchieved: 1 },
  { id: "m-11", name: "Aisha Patel", email: "a.patel@meridian.edu", role: "learner", department: "Mathematics & Statistics", status: "inactive", dateJoined: "2025-09-01", coursesEnrolled: 1, lastActive: "30 days ago", masteryAchieved: 0 },
  { id: "m-12", name: "Elena Vasquez", email: "e.vasquez@meridian.edu", role: "admin", department: "Humanities & Cognitive Science", status: "active", dateJoined: "2025-07-15", coursesEnrolled: 0, lastActive: "1 hour ago", masteryAchieved: 0 },
];

// ─── Courses ────────────────────────────────────────────────
// Same courses as the learner workspace sees

export const adminCourses: AdminCourseItem[] = [
  { id: "c-1", name: "Foundations of Machine Learning", type: "nexi_preloaded", status: "active", enrolledCount: 8, masteryRate: 62, dateDeployed: "2025-10-01", masteryDefinition: "Learner can independently explain and apply core supervised/unsupervised learning algorithms, optimization techniques, and neural network architectures.", department: "Computer Science" },
  { id: "c-2", name: "Advanced Statistical Methods", type: "custom", status: "active", enrolledCount: 6, masteryRate: 45, dateDeployed: "2025-11-15", masteryDefinition: "Learner demonstrates proficiency in Bayesian inference, hypothesis testing, and multivariate analysis techniques.", department: "Mathematics & Statistics" },
  { id: "c-3", name: "Philosophy of Mind", type: "nexi_preloaded", status: "active", enrolledCount: 5, masteryRate: 55, dateDeployed: "2025-09-20", masteryDefinition: "Learner can articulate key arguments around consciousness, intentionality, and the mind-body problem.", department: "Humanities & Cognitive Science" },
  { id: "c-4", name: "Linear Algebra for Data Science", type: "nexi_preloaded", status: "active", enrolledCount: 7, masteryRate: 70, dateDeployed: "2025-08-15", masteryDefinition: "Learner can perform matrix operations, compute eigenvalues/SVD, and apply dimensionality reduction techniques.", department: "Mathematics & Statistics" },
  { id: "c-5", name: "Cognitive Psychology", type: "custom", status: "active", enrolledCount: 5, masteryRate: 48, dateDeployed: "2025-10-20", masteryDefinition: "Learner understands core models of memory, attention, perception, and decision-making from a cognitive science perspective.", department: "Humanities & Cognitive Science" },
  { id: "c-6", name: "Research Methods in Social Science", type: "commissioned", status: "draft", enrolledCount: 0, masteryRate: 0, dateDeployed: "2026-03-01", masteryDefinition: "Learner can design and evaluate qualitative and quantitative research methodologies with ethical considerations.", department: "Humanities & Cognitive Science" },
];

// ─── Activity Feed ──────────────────────────────────────────

export const recentActivity: ActivityEvent[] = [
  { id: "a-1", text: "Alex Chen completed Foundations of Machine Learning Module 2", time: "2 hours ago", type: "completion" },
  { id: "a-2", text: "2 new members joined from Mathematics & Statistics", time: "5 hours ago", type: "join" },
  { id: "a-3", text: "New course deployed: Research Methods in Social Science", time: "1 day ago", type: "deploy" },
  { id: "a-4", text: "Jordan Chen achieved mastery in Advanced Statistical Methods", time: "1 day ago", type: "mastery" },
  { id: "a-5", text: "Yuki Tanaka started Foundations of Machine Learning", time: "2 days ago", type: "completion" },
  { id: "a-6", text: "Priya Sharma achieved mastery in Linear Algebra for Data Science", time: "3 days ago", type: "mastery" },
  { id: "a-7", text: "Sophie Turner completed Philosophy of Mind", time: "4 days ago", type: "completion" },
];

// ─── Announcements ──────────────────────────────────────────

export const announcements: Announcement[] = [
  { id: "ann-1", title: "Q2 Learning Goals Update", audience: "All Members", sentDate: "2026-03-28", sentBy: "Dr. Sarah Mitchell", body: "We're excited to share our updated Q2 learning objectives. Focus areas include data literacy and research methodology." },
  { id: "ann-2", title: "New Course Available: Research Methods", audience: "Humanities & Cognitive Science", sentDate: "2026-03-15", sentBy: "Dr. Sarah Mitchell", body: "A new Research Methods in Social Science course is now available in your library. Please review and provide feedback." },
  { id: "ann-3", title: "Welcome New Team Members", audience: "All Members", sentDate: "2026-03-01", sentBy: "Elena Vasquez", body: "Please welcome our newest team members joining this quarter. We're thrilled to have you on board!" },
];

// ─── Content Library ────────────────────────────────────────

export const contentLibrary: ContentItem[] = [
  { id: "cl-1", fileName: "Neural Networks Handbook.pdf", fileType: "pdf", linkedCourse: "Foundations of Machine Learning", uploadDate: "2025-09-28", uploaderName: "Dr. Sarah Mitchell", fileSize: "2.4 MB" },
  { id: "cl-2", fileName: "Backpropagation Walkthrough.mp4", fileType: "video", linkedCourse: "Foundations of Machine Learning", uploadDate: "2025-09-29", uploaderName: "Dr. Sarah Mitchell", fileSize: "145 MB" },
  { id: "cl-3", fileName: "Bayesian Inference Slides.pptx", fileType: "slides", linkedCourse: "Advanced Statistical Methods", uploadDate: "2025-11-10", uploaderName: "Priya Sharma", fileSize: "8.1 MB" },
  { id: "cl-4", fileName: "Prior Selection Guide.docx", fileType: "doc", linkedCourse: "Advanced Statistical Methods", uploadDate: "2025-11-12", uploaderName: "Priya Sharma", fileSize: "340 KB" },
  { id: "cl-5", fileName: "The Conscious Mind Ch.1.pdf", fileType: "pdf", linkedCourse: "Philosophy of Mind", uploadDate: "2025-09-18", uploaderName: "Marcus Johnson", fileSize: "1.8 MB" },
  { id: "cl-6", fileName: "Hard Problem of Consciousness Lecture.mp4", fileType: "video", linkedCourse: "Philosophy of Mind", uploadDate: "2025-09-19", uploaderName: "Marcus Johnson", fileSize: "210 MB" },
  { id: "cl-7", fileName: "Matrix Operations Reference.pdf", fileType: "pdf", linkedCourse: "Linear Algebra for Data Science", uploadDate: "2025-08-20", uploaderName: "Priya Sharma", fileSize: "560 KB" },
  { id: "cl-8", fileName: "Optimization Lecture.mp4", fileType: "video", linkedCourse: "Foundations of Machine Learning", uploadDate: "2025-10-05", uploaderName: "Dr. Sarah Mitchell", fileSize: "198 MB" },
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
  "Backpropagation through complex architectures",
  "Bayesian prior selection strategies",
  "Qualia and the explanatory gap",
  "SVD applications in dimensionality reduction",
  "Working memory capacity models",
];

// ─── Helper ─────────────────────────────────────────────────

export const roleBadgeLabel = (role: AdminRole): string => {
  switch (role) {
    case "super_admin": return "Super Admin";
    case "manager": return "Manager";
    case "viewer": return "Viewer";
  }
};
