"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@/i18n/navigation";

export function MobileNavMenu({
  links,
  ctaLabel,
}: {
  links: { href: string; label: string }[];
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={ctaLabel}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border-glass bg-white/5"
      >
        <span className="relative block h-3 w-4">
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 5 : 0 }}
            className="absolute left-0 top-0 h-[1.5px] w-4 bg-foreground"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="absolute left-0 top-[5px] h-[1.5px] w-4 bg-foreground"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -5 : 0 }}
            className="absolute left-0 top-[10px] h-[1.5px] w-4 bg-foreground"
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-4 top-[72px] z-50 rounded-2xl border border-border-glass bg-background-elevated p-4 shadow-2xl"
          >
            <nav className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-[#04140a]"
              >
                {ctaLabel}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
