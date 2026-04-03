import { useState } from "react";
import { HelpCircle, BookOpen, MessageCircle, Mail, ExternalLink, Search } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I add a new course?", a: "Navigate to Courses, click 'Deploy Course', then choose from preloaded courses or create a custom one. You can also commission a course built to your specifications." },
  { q: "How do I invite members?", a: "Go to Members, click 'Invite Member', fill in their details including name, email, role, and department. They'll receive an email invitation to join." },
  { q: "What is a mastery definition?", a: "A mastery definition describes the specific knowledge and skills a learner must demonstrate to be considered proficient in a course topic. It guides assessment and outcomes tracking." },
  { q: "Can I track individual learner activity?", a: "Nexus² follows a 'zero surveillance' principle. We track mastery outcomes and engagement metrics at an aggregate level, but do not provide granular activity monitoring of individual learners." },
  { q: "How do departments work?", a: "Departments let you organize members into logical groups. You can assign courses to entire departments, filter analytics by department, and send targeted announcements." },
  { q: "How do I export analytics data?", a: "Go to Analytics, use the time range and department filters to narrow your view, then click the 'Export' button in the top right to download a CSV report." },
];

const docPages = [
  { title: "Getting Started", desc: "Set up your organization, invite members, and deploy your first course.", content: "Welcome to Nexus² Admin Studio. Start by going to Settings to configure your organization profile, then navigate to Members to invite your team. Once members are added, head to Courses to deploy learning content." },
  { title: "Course Management", desc: "Deploy, edit, archive, and duplicate courses.", content: "Courses can be deployed via three pathways: Nexi Preloaded (curated library), Custom Upload (your own content), or Commission (request from our team). Use the row actions to edit, archive, or duplicate existing courses." },
  { title: "Member Management", desc: "Invite members, assign roles, and manage departments.", content: "Members can be invited individually or via bulk CSV import. Each member has a role (learner, manager, admin) and belongs to a department. Use the Members page to change roles, deactivate accounts, or view member details." },
  { title: "Analytics & Outcomes", desc: "Understand engagement, mastery rates, and knowledge gaps.", content: "The Analytics page provides organization-level insights including weekly active learners, course completions, engagement trends, and department breakdowns. Filter by time range and department. Export reports as CSV." },
  { title: "Announcements", desc: "Send messages to learners and departments.", content: "Create announcements targeted to all members or specific departments. Announcements appear in learner dashboards and can be used for policy updates, course launches, or general communications." },
  { title: "Security & Settings", desc: "Configure 2FA, session timeouts, and branding.", content: "Enable two-factor authentication for admin accounts, set session timeout durations, and customize your organization's branding including accent color and logo upload." },
];

const forumThreads = [
  { title: "Best practices for mastery definitions", author: "Sarah K.", replies: 12, time: "2 days ago" },
  { title: "How to structure department hierarchies", author: "Marcus C.", replies: 8, time: "4 days ago" },
  { title: "Tips for onboarding large cohorts", author: "Priya S.", replies: 15, time: "1 week ago" },
  { title: "Custom course content guidelines", author: "Jordan R.", replies: 6, time: "1 week ago" },
  { title: "Analytics export feature discussion", author: "Elena V.", replies: 3, time: "2 weeks ago" },
];

export default function AdminHelpPage() {
  const [activeDoc, setActiveDoc] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <h1 className="font-serif text-[2rem] font-normal text-foreground">Help</h1>
      <p className="text-sm mt-0.5 mb-8 text-muted-foreground">Documentation, community, and support resources</p>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        <button onClick={() => setActiveDoc(0)} className="card-interactive p-5 text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-accent/10">
              <BookOpen className="h-4 w-4 text-accent" />
            </div>
            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity duration-200 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-sm text-foreground/80">Documentation</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">Comprehensive guides and tutorials</p>
        </button>
        <button onClick={() => {
          const el = document.getElementById("community-section");
          el?.scrollIntoView({ behavior: "smooth" });
        }} className="card-interactive p-5 text-left group">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-accent/10">
              <MessageCircle className="h-4 w-4 text-accent" />
            </div>
            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity duration-200 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-sm text-foreground/80">Community Forum</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">Connect with other administrators</p>
        </button>
        <a href="mailto:support@nexus-squared.com" className="card-interactive p-5 block group">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-accent/10">
              <Mail className="h-4 w-4 text-accent" />
            </div>
            <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity duration-200 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-sm text-foreground/80">Email Support</h3>
          <p className="text-xs mt-0.5 text-muted-foreground">support@nexus-squared.com</p>
        </a>
      </div>

      {/* Documentation Section */}
      <h2 className="font-serif text-lg mb-4 text-foreground/75">Documentation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 stagger-children">
        {docPages.map((doc, i) => (
          <button
            key={i}
            onClick={() => setActiveDoc(activeDoc === i ? null : i)}
            className="card-interactive p-4 text-left transition-all duration-200"
          >
            <h3 className="text-[13px] font-medium text-foreground/80 mb-1">{doc.title}</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{doc.desc}</p>
          </button>
        ))}
      </div>

      {activeDoc !== null && (
        <div className="card-interactive p-5 mb-8 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-serif text-base text-foreground/80">{docPages[activeDoc].title}</h3>
            <button onClick={() => setActiveDoc(null)} className="toolbar-btn p-1 rounded-md text-muted-foreground hover:text-foreground">
              <span className="text-[12px]">✕</span>
            </button>
          </div>
          <p className="text-[13px] leading-relaxed text-muted-foreground">{docPages[activeDoc].content}</p>
        </div>
      )}

      {/* FAQ Section */}
      <h2 className="font-serif text-lg mb-4 text-foreground/75">Frequently Asked Questions</h2>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="w-full h-9 pl-9 pr-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200 max-w-sm"
        />
      </div>
      <div className="card-interactive p-2 mb-8">
        <Accordion type="single" collapsible>
          {filteredFaqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
              <AccordionTrigger className="text-sm px-3 py-3 hover:no-underline text-foreground/75">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm px-3 pb-3 leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
          {filteredFaqs.length === 0 && (
            <p className="text-[13px] text-center py-6 text-muted-foreground">No matching questions found</p>
          )}
        </Accordion>
      </div>

      {/* Community Forum Section */}
      <h2 id="community-section" className="font-serif text-lg mb-4 text-foreground/75">Community Forum</h2>
      <div className="card-interactive p-2 mb-8">
        <div className="space-y-0.5">
          {forumThreads.map((thread, i) => (
            <div key={i} className="setting-row flex items-center justify-between px-3 py-3 -mx-0 rounded-lg">
              <div>
                <p className="text-[13px] font-medium text-foreground/80">{thread.title}</p>
                <p className="text-[11px] mt-0.5 text-muted-foreground">{thread.author} · {thread.time}</p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">
                {thread.replies} replies
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card-interactive p-6 text-center">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-accent/10">
          <HelpCircle className="h-5 w-5 text-accent" />
        </div>
        <h3 className="font-serif text-base mb-1 text-foreground/75">Still need help?</h3>
        <p className="text-sm mb-4 text-muted-foreground">Our support team typically responds within 24 hours</p>
        <a href="mailto:support@nexus-squared.com" className="btn-apple inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-accent text-accent-foreground hover:bg-accent/90">
          <Mail className="h-4 w-4" /> Contact Support
        </a>
      </div>
    </div>
  );
}
