import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

// Types
export interface NotebookEntry {
  id: string;
  title: string;
  snippet: string;
  course: string;
  tags: string[];
  date: string;
  source: string;
  savedFrom: "nexi" | "personal" | "source";
}

export interface VocabularyEntry {
  id: string;
  term: string;
  definition: string;
  example?: string;
  course: string;
  tags: string[];
  date: string;
  savedFrom: "nexi" | "personal" | "source";
}

export interface ChatMessage {
  id: string;
  role: "user" | "nexi" | "system";
  content: string;
  citations?: string[];
}

export type SourceType = "video" | "lecture" | "reading" | "pdf" | "docx" | "txt" | "code" | "slides" | "link" | "note";

export interface SourceItem {
  id: string;
  title: string;
  type: SourceType;
  moduleName: string;
}

export type ReflectionMood = "focused" | "confused" | "energized" | "drained" | "curious" | "calm";

export interface Reflection {
  id: string;
  date: string;
  content: string;
  linkedCourse?: string;
  mood?: ReflectionMood;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  learningGoal: string;
  institution: string;
  timezone: string;
}

export type FontFamily = "default" | "sans" | "serif" | "dyslexic";

export interface AppSettings {
  compactMode: boolean;
  fontSize: "small" | "medium" | "large";
  fontFamily: FontFamily;
  language: string;
}

export type TaskPriority = "high" | "medium" | "low";

// Admin types
export interface AdminSourceItem {
  id: string;
  title: string;
  type: SourceType;
}

export interface AdminModule {
  id: string;
  title: string;
  items: AdminSourceItem[];
}

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  status: "draft" | "published";
  modules: AdminModule[];
  assignedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StudyTask {
  id: string;
  title: string;
  course?: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export type UserRole = "learner" | "admin";

interface WorkspaceState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  notebookEntries: NotebookEntry[];
  addNotebookEntry: (entry: Omit<NotebookEntry, "id" | "date">) => void;
  updateNotebookEntry: (id: string, updates: Partial<NotebookEntry>) => void;
  deleteNotebookEntry: (id: string) => void;
  vocabulary: VocabularyEntry[];
  addVocabulary: (entry: Omit<VocabularyEntry, "id" | "date">) => void;
  updateVocabulary: (id: string, updates: Partial<VocabularyEntry>) => void;
  deleteVocabulary: (id: string) => void;
  chatMessages: Record<string, ChatMessage[]>;
  addMessage: (courseId: string, message: Omit<ChatMessage, "id">) => void;
  activeSource: SourceItem | null;
  setActiveSource: (source: SourceItem | null) => void;
  reflections: Reflection[];
  addReflection: (content: string, linkedCourse?: string, mood?: ReflectionMood) => void;
  deleteReflection: (id: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  appSettings: AppSettings;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<StudyTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  // Admin
  adminCourses: AdminCourse[];
  addAdminCourse: (course: Omit<AdminCourse, "id" | "createdAt" | "updatedAt">) => void;
  updateAdminCourse: (id: string, updates: Partial<AdminCourse>) => void;
  deleteAdminCourse: (id: string) => void;
  publishCourse: (id: string) => void;
  unpublishCourse: (id: string) => void;
}

const WorkspaceContext = createContext<WorkspaceState | null>(null);

const learnerProfile: UserProfile = {
  name: "Alex Chen",
  email: "alex@university.edu",
  bio: "Graduate student exploring the intersection of machine learning and cognitive science.",
  learningGoal: "Build deep understanding of neural network architectures and their theoretical foundations.",
  institution: "Stanford University",
  timezone: "America/Los_Angeles",
};

const adminProfile: UserProfile = {
  name: "Dr. Sarah Mitchell",
  email: "s.mitchell@university.edu",
  bio: "Associate Professor of Computer Science. Course designer and curriculum lead for the ML department.",
  learningGoal: "Develop engaging, research-informed course materials for graduate students.",
  institution: "Stanford University",
  timezone: "America/Los_Angeles",
};

const defaultProfile = learnerProfile;

// Seed data
const seedNotebookEntries: NotebookEntry[] = [
  {
    id: "n1",
    title: "Backpropagation step-by-step",
    snippet: "Forward pass computes output, backward pass computes gradients using chain rule. Each layer contributes a local gradient multiplied along the path.",
    course: "Foundations of Machine Learning",
    tags: ["neural-networks"],
    source: "Nexi response",
    date: "Just now",
    savedFrom: "nexi",
  },
  {
    id: "n2",
    title: "Key differences: SGD vs Mini-batch",
    snippet: "Batch uses full dataset, SGD uses single sample, mini-batch balances both for practical training efficiency.",
    course: "Foundations of Machine Learning",
    tags: ["optimization"],
    source: "Nexi response",
    date: "2 hours ago",
    savedFrom: "nexi",
  },
  {
    id: "n3",
    title: "Activation function comparison",
    snippet: "ReLU solves vanishing gradient but has dying neuron problem. Sigmoid squashes to 0-1 range. Tanh centers at zero.",
    course: "Foundations of Machine Learning",
    tags: ["neural-networks", "comparison"],
    source: "Personal note",
    date: "Yesterday",
    savedFrom: "personal",
  },
  {
    id: "n4",
    title: "Regularization intuition",
    snippet: "L1 promotes sparsity (feature selection), L2 promotes small weights (smoothness). Both prevent overfitting by constraining the model.",
    course: "Foundations of Machine Learning",
    tags: ["regularization"],
    source: "Nexi response",
    date: "3 days ago",
    savedFrom: "nexi",
  },
  {
    id: "n5",
    title: "Bayes' theorem intuition",
    snippet: "The posterior probability is proportional to the likelihood times the prior. This provides a principled way to update beliefs given new evidence.",
    course: "Advanced Statistical Methods",
    tags: ["bayesian", "fundamentals"],
    source: "Personal note",
    date: "4 days ago",
    savedFrom: "personal",
  },
];

const seedVocabulary: VocabularyEntry[] = [
  {
    id: "v1",
    term: "Backpropagation",
    definition: "An algorithm for training neural networks by computing gradients of the loss function with respect to each weight using the chain rule, propagating errors backward through the network.",
    example: "During backpropagation, the gradient ∂L/∂w tells us how to adjust weight w to reduce the loss.",
    course: "Foundations of Machine Learning",
    tags: ["neural-networks"],
    date: "Just now",
    savedFrom: "nexi",
  },
  {
    id: "v2",
    term: "Gradient Descent",
    definition: "An optimization algorithm that iteratively adjusts parameters in the direction that reduces the loss function, using the negative gradient as the update direction.",
    example: "w_new = w_old - learning_rate × ∂L/∂w",
    course: "Foundations of Machine Learning",
    tags: ["optimization"],
    date: "2 hours ago",
    savedFrom: "nexi",
  },
  {
    id: "v3",
    term: "Posterior Probability",
    definition: "The probability of a hypothesis after observing evidence, calculated using Bayes' theorem as proportional to the likelihood times the prior.",
    course: "Advanced Statistical Methods",
    tags: ["bayesian"],
    date: "Yesterday",
    savedFrom: "personal",
  },
];

const seedChatMessages: Record<string, ChatMessage[]> = {
  "1": [
    {
      id: "c1",
      role: "nexi",
      content:
        "Welcome to your workspace for **Neural Networks**. I'm grounded in your course materials and ready to help you build understanding.\n\nYou're currently working through backpropagation. Would you like me to explain how the chain rule enables gradient computation through network layers?",
      citations: ["Lecture: Perceptrons & MLPs", "Reading: Activation Functions"],
    },
    {
      id: "c2",
      role: "user",
      content: "Yes, explain backpropagation step by step. Start with a simple example.",
    },
    {
      id: "c3",
      role: "nexi",
      content:
        "Let me walk through backpropagation with a minimal network — a single neuron with one input, one weight, and a squared error loss.\n\n**Forward pass:**\nGiven input *x = 2*, weight *w = 0.5*, and target *y = 1*:\n- Output: ŷ = w · x = 0.5 × 2 = 1.0\n- Loss: L = (y - ŷ)² = (1 - 1)² = 0\n\n**Now suppose w = 0.3:**\n- Output: ŷ = 0.3 × 2 = 0.6\n- Loss: L = (1 - 0.6)² = 0.16\n\n**Backward pass (the gradient):**\nWe need ∂L/∂w to know how to adjust the weight.\n\nBy the chain rule:\n∂L/∂w = ∂L/∂ŷ · ∂ŷ/∂w = 2(ŷ - y) · x = 2(0.6 - 1) · 2 = **-1.6**\n\nThe negative sign tells us to *increase* w — which makes sense, since we need a larger output.\n\n**Key insight:** Backpropagation simply applies this chain rule systematically through every layer, accumulating gradients from the output back to the input. In deeper networks, each layer contributes a local gradient that gets multiplied along the path.",
      citations: ["Lecture: Backpropagation", "Lecture: Perceptrons & MLPs"],
    },
  ],
  "2": [
    {
      id: "c2-1",
      role: "nexi",
      content:
        "Welcome to your workspace for **Bayesian Inference**. I'm grounded in your course readings and ready to help clarify posterior distributions, prior selection, and likelihood functions.\n\nWhere would you like to start?",
      citations: ["Reading: Introduction to Bayesian Methods"],
    },
  ],
  "3": [
    {
      id: "c3-1",
      role: "nexi",
      content:
        "Welcome to your workspace for **Consciousness**. We're exploring Chalmers' hard problem and the limits of reductive explanation.\n\nWould you like to revisit the distinction between easy and hard problems, or explore a specific argument?",
      citations: ["Reading: The Conscious Mind, Ch. 1"],
    },
  ],
};

const seedReflections: Reflection[] = [
  {
    id: "r1",
    date: "Today",
    content: "I'm starting to see how gradient descent connects to the broader optimization landscape. The intuition about loss surfaces being high-dimensional is finally clicking — it's not about finding the single lowest point, but navigating valleys that generalize well.",
    linkedCourse: "Foundations of Machine Learning",
    mood: "focused",
  },
  {
    id: "r2",
    date: "Yesterday",
    content: "Bayesian inference feels less like a formula and more like a philosophy of knowledge. You start with what you believe, encounter evidence, and update. It mirrors how actual learning works — which is strangely recursive given what I'm studying.",
    linkedCourse: "Advanced Statistical Methods",
    mood: "curious",
  },
  {
    id: "r3",
    date: "March 15",
    content: "Chalmers' hard problem keeps returning to mind. If we can't explain why subjective experience exists, maybe the question itself reveals something about the limits of reductive explanation. There's something humbling about studying a problem that resists the tools you're using to study it.",
    linkedCourse: "Philosophy of Mind",
    mood: "calm",
  },
];

// Simulated Nexi responses
const simulatedResponses: Record<string, { content: string; citations: string[] }> = {
  "Explain simply": {
    content: "Think of backpropagation like this: imagine you're adjusting dials on a mixing board to get the perfect sound.\n\n1. You play the current mix (forward pass)\n2. You hear what's wrong (compute the loss)\n3. You figure out which dials to turn and by how much (backward pass)\n4. You adjust (update weights)\n\nThe \"backward\" part is just math telling you: *for each dial, how much did it contribute to the error?* That's the gradient — and the chain rule lets you trace that contribution through every layer, no matter how deep the network.",
    citations: ["Lecture: Backpropagation"],
  },
  "Quiz me": {
    content: "Let's test your understanding. Consider a simple network with:\n- Input x = 3\n- Weight w = 0.4\n- Target y = 2\n- Loss function: L = (y - ŷ)²\n\n**Question 1:** What is the predicted output ŷ?\n\n**Question 2:** What is the loss L?\n\n**Question 3:** What is ∂L/∂w?\n\nTake a moment to work through each step. When you're ready, share your answers and I'll walk through the solution.",
    citations: ["Lecture: Backpropagation", "Lecture: Perceptrons & MLPs"],
  },
  "Extract key ideas": {
    content: "Here are the core ideas from our discussion on backpropagation:\n\n**1. Chain rule is the foundation**\nBackpropagation is just the chain rule applied systematically across layers. Each node computes a local gradient.\n\n**2. Forward then backward**\nThe forward pass computes outputs and loss. The backward pass traces gradients from output to input.\n\n**3. Gradients point uphill**\nThe gradient tells you the direction of steepest *increase*. To minimize loss, you move in the opposite direction.\n\n**4. Local gradients compose**\nEach layer's gradient depends only on its inputs and the gradient flowing back from later layers. This modularity makes deep networks trainable.\n\n**5. The sign matters**\nA negative gradient means increasing the weight would decrease the loss — so the update rule adds to the weight.",
    citations: ["Lecture: Backpropagation", "Reading: Activation Functions"],
  },
  "Compare concepts": {
    content: "**Backpropagation vs. Numerical Differentiation**\n\n| Aspect | Backpropagation | Numerical Differentiation |\n|---|---|---|\n| Method | Analytical (chain rule) | Finite differences (f(x+h) - f(x))/h |\n| Speed | O(n) — one backward pass | O(n²) — perturb each weight |\n| Precision | Exact (up to floating point) | Approximate (depends on h) |\n| Scalability | Scales to millions of parameters | Impractical for large networks |\n\nBackpropagation is what makes training deep networks feasible. Numerical differentiation is useful primarily for **gradient checking** — verifying your backprop implementation is correct by comparing against finite differences on a small network.",
    citations: ["Lecture: Backpropagation", "Reading: Training Deep Networks"],
  },
  default: {
    content: "That's a great direction. Let me think through this carefully based on your course materials.\n\nThe key insight here connects to what we've been studying about neural network fundamentals. The mathematical framework provides a principled way to understand how information flows through the network and how errors propagate backward to update weights.\n\nWould you like me to elaborate on any particular aspect, or shall we connect this to another concept from the course?",
    citations: ["Lecture: Backpropagation"],
  },
};

const seedAdminCourses: AdminCourse[] = [
  {
    id: "1", title: "Foundations of Machine Learning",
    description: "Core concepts in supervised and unsupervised learning, optimization, and neural network architectures.",
    status: "published",
    modules: [
      { id: "m1", title: "Neural Network Basics", items: [
        { id: "s1", title: "Perceptrons & MLPs", type: "lecture" },
        { id: "s2", title: "Activation Functions", type: "reading" },
        { id: "s3", title: "Backpropagation", type: "lecture" },
      ]},
      { id: "m2", title: "Optimization", items: [
        { id: "s4", title: "Gradient Descent Variants", type: "lecture" },
        { id: "s5", title: "Training Deep Networks", type: "reading" },
      ]},
    ],
    assignedUsers: ["user-1", "user-2", "user-3"],
    createdAt: "2 months ago", updatedAt: "2 hours ago",
  },
  {
    id: "2", title: "Advanced Statistical Methods",
    description: "Deep dive into Bayesian inference, hypothesis testing, and multivariate analysis techniques.",
    status: "published",
    modules: [
      { id: "m3", title: "Bayesian Inference", items: [
        { id: "s6", title: "Introduction to Bayesian Methods", type: "reading" },
        { id: "s7", title: "Prior Selection", type: "lecture" },
      ]},
    ],
    assignedUsers: ["user-1", "user-4"],
    createdAt: "3 months ago", updatedAt: "Yesterday",
  },
  {
    id: "3", title: "Philosophy of Mind",
    description: "Exploring consciousness, intentionality, and the relationship between mind and brain.",
    status: "published",
    modules: [
      { id: "m4", title: "Consciousness", items: [
        { id: "s8", title: "The Conscious Mind, Ch. 1", type: "reading" },
        { id: "s9", title: "Hard Problem of Consciousness", type: "lecture" },
      ]},
    ],
    assignedUsers: ["user-1", "user-2"],
    createdAt: "3 months ago", updatedAt: "3 days ago",
  },
  {
    id: "4", title: "Linear Algebra for Data Science",
    description: "Matrix operations, eigenvalues, SVD, and applications in dimensionality reduction.",
    status: "published",
    modules: [
      { id: "m5", title: "Matrix Fundamentals", items: [
        { id: "s10", title: "Matrix Operations", type: "lecture" },
        { id: "s11", title: "Eigenvalues & Eigenvectors", type: "reading" },
      ]},
    ],
    assignedUsers: ["user-2", "user-3", "user-5"],
    createdAt: "4 months ago", updatedAt: "2 weeks ago",
  },
  {
    id: "5", title: "Cognitive Psychology",
    description: "Memory, attention, perception, and decision-making from a cognitive science perspective.",
    status: "published",
    modules: [
      { id: "m6", title: "Attention & Memory", items: [
        { id: "s12", title: "Working Memory Models", type: "lecture" },
      ]},
    ],
    assignedUsers: ["user-1", "user-4", "user-5"],
    createdAt: "2 months ago", updatedAt: "1 week ago",
  },
  {
    id: "6", title: "Research Methods in Social Science",
    description: "Qualitative and quantitative methodologies, experimental design, and ethical considerations.",
    status: "published",
    modules: [
      { id: "m7", title: "Research Design", items: [
        { id: "s13", title: "Experimental Methods", type: "lecture" },
        { id: "s14", title: "Qualitative Approaches", type: "reading" },
      ]},
    ],
    assignedUsers: ["user-3", "user-4"],
    createdAt: "5 months ago", updatedAt: "1 month ago",
  },
];

export const mockUsers = [
  { id: "user-1", name: "Alex Rivera", email: "alex@university.edu" },
  { id: "user-2", name: "Jordan Chen", email: "jordan.chen@university.edu" },
  { id: "user-3", name: "Priya Sharma", email: "priya.s@university.edu" },
  { id: "user-4", name: "Marcus Johnson", email: "m.johnson@university.edu" },
  { id: "user-5", name: "Yuki Tanaka", email: "yuki.t@university.edu" },
];

let idCounter = 100;
const genId = () => `gen-${++idCounter}`;

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>("learner");
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>(seedNotebookEntries);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(seedChatMessages);
  const [activeSource, setActiveSource] = useState<SourceItem | null>(null);
  const [reflections, setReflections] = useState<Reflection[]>(seedReflections);
  const [vocabulary, setVocabulary] = useState<VocabularyEntry[]>(seedVocabulary);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    setUserProfile(role === "admin" ? adminProfile : learnerProfile);
  }, []);

  const addNotebookEntry = useCallback((entry: Omit<NotebookEntry, "id" | "date">) => {
    setNotebookEntries((prev) => [
      { ...entry, id: genId(), date: "Just now" },
      ...prev,
    ]);
  }, []);

  const updateNotebookEntry = useCallback((id: string, updates: Partial<NotebookEntry>) => {
    setNotebookEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteNotebookEntry = useCallback((id: string) => {
    setNotebookEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addVocabulary = useCallback((entry: Omit<VocabularyEntry, "id" | "date">) => {
    setVocabulary((prev) => [{ ...entry, id: genId(), date: "Just now" }, ...prev]);
  }, []);

  const updateVocabulary = useCallback((id: string, updates: Partial<VocabularyEntry>) => {
    setVocabulary((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  }, []);

  const deleteVocabulary = useCallback((id: string) => {
    setVocabulary((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const addMessage = useCallback((courseId: string, message: Omit<ChatMessage, "id">) => {
    setChatMessages((prev) => ({
      ...prev,
      [courseId]: [...(prev[courseId] || []), { ...message, id: genId() }],
    }));
  }, []);

  const addReflection = useCallback((content: string, linkedCourse?: string, mood?: ReflectionMood) => {
    setReflections((prev) => [
      { id: genId(), date: "Just now", content, linkedCourse, mood },
      ...prev,
    ]);
  }, []);

  const deleteReflection = useCallback((id: string) => {
    setReflections((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  const [appSettings, setAppSettings] = useState<AppSettings>({ compactMode: false, fontSize: "medium", fontFamily: "default", language: "English" });
  const updateAppSettings = useCallback((updates: Partial<AppSettings>) => {
    setAppSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const seedTasks: StudyTask[] = [
    { id: "t1", title: "Finish backpropagation problem set", course: "Foundations of Machine Learning", priority: "high", completed: false, dueDate: "Tomorrow", createdAt: "Today" },
    { id: "t2", title: "Read Chapter 8 on MCMC methods", course: "Advanced Statistical Methods", priority: "medium", completed: false, dueDate: "Friday", createdAt: "Yesterday" },
    { id: "t3", title: "Write reflection on consciousness debate", course: "Philosophy of Mind", priority: "low", completed: false, dueDate: "Next week", createdAt: "2 days ago" },
    { id: "t4", title: "Review lecture notes on activation functions", course: "Foundations of Machine Learning", priority: "medium", completed: true, createdAt: "3 days ago" },
    { id: "t5", title: "Complete sklearn regression lab", course: "Foundations of Machine Learning", priority: "high", completed: false, dueDate: "Wednesday", createdAt: "Today" },
  ];

  const [tasks, setTasks] = useState<StudyTask[]>(seedTasks);

  const addTask = useCallback((task: Omit<StudyTask, "id" | "createdAt">) => {
    setTasks((prev) => [{ ...task, id: genId(), createdAt: "Just now" }, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<StudyTask>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }, []);

  // Admin courses
  const [adminCourses, setAdminCourses] = useState<AdminCourse[]>(seedAdminCourses);

  const addAdminCourse = useCallback((course: Omit<AdminCourse, "id" | "createdAt" | "updatedAt">) => {
    setAdminCourses((prev) => [{ ...course, id: genId(), createdAt: "Just now", updatedAt: "Just now" }, ...prev]);
  }, []);

  const updateAdminCourse = useCallback((id: string, updates: Partial<AdminCourse>) => {
    setAdminCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: "Just now" } : c)));
  }, []);

  const deleteAdminCourse = useCallback((id: string) => {
    setAdminCourses((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const publishCourse = useCallback((id: string) => {
    setAdminCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "published" as const, updatedAt: "Just now" } : c)));
  }, []);

  const unpublishCourse = useCallback((id: string) => {
    setAdminCourses((prev) => prev.map((c) => (c.id === id ? { ...c, status: "draft" as const, updatedAt: "Just now" } : c)));
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        notebookEntries,
        addNotebookEntry,
        updateNotebookEntry,
        deleteNotebookEntry,
        vocabulary,
        addVocabulary,
        updateVocabulary,
        deleteVocabulary,
        chatMessages,
        addMessage,
        activeSource,
        setActiveSource,
        reflections,
        addReflection,
        deleteReflection,
        userProfile,
        updateUserProfile,
        appSettings,
        updateAppSettings,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        adminCourses,
        addAdminCourse,
        updateAdminCourse,
        deleteAdminCourse,
        publishCourse,
        unpublishCourse,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

export { simulatedResponses };
