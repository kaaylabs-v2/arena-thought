import { HelpCircle, BookOpen, MessageCircle, Mail, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <h1 className="font-serif text-[2rem] font-normal text-foreground">Help</h1>
      <p className="text-sm mt-0.5 mb-8 text-muted-foreground">Documentation and support resources</p>

      <div className="grid grid-cols-3 gap-4 mb-8 stagger-children">
        {resources.map((r, i) => (
          <a key={i} href={r.url} className="card-interactive p-5 block group">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-accent/10">
                <r.icon className="h-4 w-4 text-accent" />
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity duration-200 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-sm text-foreground/80">{r.title}</h3>
            <p className="text-xs mt-0.5 text-muted-foreground">{r.desc}</p>
          </a>
        ))}
      </div>

      <h2 className="font-serif text-lg mb-4 text-foreground/75">Frequently Asked Questions</h2>
      <div className="card-interactive p-2">
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b-0">
              <AccordionTrigger className="text-sm px-3 py-3 hover:no-underline text-foreground/75">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm px-3 pb-3 leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="card-interactive p-6 mt-6 text-center">
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
