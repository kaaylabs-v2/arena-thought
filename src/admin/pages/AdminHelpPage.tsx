import { HelpCircle, BookOpen, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const faqs = [
  { q: "How do I add a new course?", a: "Navigate to Courses, click 'Deploy Course', then choose from preloaded courses or create a custom one. You can also commission a course built to your specifications." },
  { q: "How do I invite members?", a: "Go to Members, click 'Invite Member', fill in their details including name, email, role, and department. They'll receive an email invitation to join." },
  { q: "What is a mastery definition?", a: "A mastery definition describes the specific knowledge and skills a learner must demonstrate to be considered proficient in a course topic. It guides assessment and outcomes tracking." },
  { q: "Can I track individual learner activity?", a: "Nexus² follows a 'zero surveillance' principle. We track mastery outcomes and engagement metrics at an aggregate level, but do not provide granular activity monitoring of individual learners." },
  { q: "How do departments work?", a: "Departments let you organize members into logical groups. You can assign courses to entire departments, filter analytics by department, and send targeted announcements." },
  { q: "How do I export analytics data?", a: "Analytics export functionality is coming in a future update. Currently, you can view all metrics directly in the Analytics dashboard." },
];

const resources = [
  { icon: BookOpen, title: "Documentation", desc: "Comprehensive guides and tutorials", url: "#" },
  { icon: MessageCircle, title: "Community Forum", desc: "Connect with other administrators", url: "#" },
  { icon: Mail, title: "Email Support", desc: "support@nexus-squared.com", url: "mailto:support@nexus-squared.com" },
];

export default function AdminHelpPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Help</h1>
      <p className="text-sm mt-0.5 mb-8" style={{ color: "rgba(0,0,0,0.45)" }}>Documentation and support resources</p>

      {/* Resources */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {resources.map((r, i) => (
          <a key={i} href={r.url} style={cardStyle} className="p-5 block transition-shadow hover:shadow-md group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
                <r.icon className="h-4 w-4" style={{ color: "#C9963A" }} />
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <h3 className="font-medium text-sm" style={{ color: "rgba(0,0,0,0.8)" }}>{r.title}</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>{r.desc}</p>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="font-serif text-lg mb-4" style={{ color: "rgba(0,0,0,0.75)" }}>Frequently Asked Questions</h2>
      <div style={cardStyle} className="p-2">
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
              <AccordionTrigger className="text-sm px-3 py-3 hover:no-underline" style={{ color: "rgba(0,0,0,0.75)" }}>
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm px-3 pb-3 leading-relaxed" style={{ color: "rgba(0,0,0,0.5)" }}>
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Contact */}
      <div style={cardStyle} className="p-6 mt-6 text-center">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
          <HelpCircle className="h-5 w-5" style={{ color: "#C9963A" }} />
        </div>
        <h3 className="font-serif text-base mb-1" style={{ color: "rgba(0,0,0,0.75)" }}>Still need help?</h3>
        <p className="text-sm mb-4" style={{ color: "rgba(0,0,0,0.4)" }}>Our support team typically responds within 24 hours</p>
        <a href="mailto:support@nexus-squared.com" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: "#C9963A" }}>
          <Mail className="h-4 w-4" /> Contact Support
        </a>
      </div>
    </div>
  );
}
