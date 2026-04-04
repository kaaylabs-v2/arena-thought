import { useEffect, useState, useRef } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // The main scrollable element is the <main> sibling
    const main = document.querySelector("main");
    if (!main) return;
    scrollRef.current = main;

    const onScroll = () => {
      setVisible(main.scrollTop > 400);
    };

    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full border border-border bg-card/90 backdrop-blur-sm shadow-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
    </button>
  );
}
