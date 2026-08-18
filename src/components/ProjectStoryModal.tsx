import React, { useEffect, useCallback, useRef } from 'react';

interface ProjectStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectStoryModal: React.FC<ProjectStoryModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement;

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      // Move focus into the modal
      requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // Restore focus to previously focused element
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-story-title"
    >
      {/* Modal card */}
      <div
        ref={modalRef}
        className="animate-modal-in relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl border border-slate-700/60 bg-slate-950 shadow-2xl overflow-hidden"
      >
        {/* Subtle corner glow — matches InfoModal style */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/4 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/4 blur-3xl rounded-full pointer-events-none" />

        {/* ── Header ────────────────────────────────────────── */}
        <div className="relative flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-800/60 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-block h-1.5 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500" />
              <span className="font-mono text-[9px] font-bold text-cyan-400/80 uppercase tracking-widest">
                Project Note
              </span>
            </div>
            <h2
              id="project-story-title"
              className="text-lg font-extrabold text-white tracking-tight leading-snug"
            >
              From Coursework to Visualization
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Why I built this interactive H–R diagram
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close project note"
            className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer flex-shrink-0 ml-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Article Body ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <article className="px-6 py-5 space-y-4 text-[12.5px] text-slate-400 leading-[1.75]">
            <p>
              The Hertzsprung–Russell diagram was one of the topics covered during my astrophysics
              coursework. After studying how stellar temperature, luminosity, spectral class, and
              evolutionary stages are represented, I wanted to turn that concept into an interactive
              visualization rather than leave it as a static diagram.
            </p>

            <p>
              I built this project to explore how an H–R diagram can be presented clearly through
              real stellar data, interactive filtering, search, tooltips, and visual exploration. I
              also focused on getting the scientific conventions right, from the reversed temperature
              axis and logarithmic luminosity scale to the placement and appearance of different
              stellar populations.
            </p>

            <p>
              This started as a small implementation and gradually became an attempt to make the
              diagram both scientifically meaningful and visually intuitive. The goal is simple: make
              something that helps you explore the H–R diagram rather than just look at it.
            </p>

            {/* Closing signature */}
            <p className="text-[11.5px] text-slate-500 font-medium pt-2 border-t border-slate-800/40">
              <strong className="text-slate-400">
                Built as a visualization project following my coursework in astrophysics.
              </strong>
            </p>
          </article>
        </div>

        {/* ── Footer ────────────────────────────────────────── */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800/60 bg-slate-950/70 flex-shrink-0">
          <button
            onClick={onClose}
            className="rounded-lg bg-cyan-950/50 text-cyan-400 hover:bg-cyan-900/40 border border-cyan-900/40 hover:border-cyan-700/50 px-4 py-1.5 text-xs font-bold cursor-pointer transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
