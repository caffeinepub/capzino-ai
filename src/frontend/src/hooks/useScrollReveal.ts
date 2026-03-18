import { type RefObject, useEffect } from "react";

export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const parent =
              entry.target.closest("section") || entry.target.parentElement;
            if (parent) {
              for (const revealEl of parent.querySelectorAll(".reveal")) {
                revealEl.classList.add("visible");
              }
            }
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}
