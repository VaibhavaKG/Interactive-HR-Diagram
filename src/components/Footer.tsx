import React from 'react';

interface FooterProps {
  onOpenProjectStory?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProjectStory }) => {
  return (
    <footer className="relative z-10 border-t border-slate-800/50 bg-slate-950/90 backdrop-blur-md">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Dataset description */}
          <p className="text-[11px] text-slate-600 text-center sm:text-left max-w-lg leading-relaxed">
            <span className="text-slate-500 font-medium">Dataset: </span>
            5,000+ stellar objects spanning Main Sequence, Red Giants, Supergiants, and White Dwarfs.
            Stellar colours computed via blackbody temperature interpolation.
          </p>

          {/* Tech stack */}
          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap justify-center font-mono text-[10px]">
            <span className="text-slate-700">Built with</span>
            {[
              { label: 'React 19',    color: '#22d3ee' },
              { label: 'TypeScript',  color: '#818cf8' },
              { label: 'D3.js',       color: '#fb923c' },
              { label: 'Tailwind',    color: '#38bdf8' },
              { label: 'Vite',        color: '#a78bfa' },
            ].map(({ label, color }) => (
              <span key={label} style={{ color }} className="transition-opacity hover:opacity-80">
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-3 pt-3 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-700">
          <span>© 2026 Interactive H–R Diagram. All observation data is simulated for educational use.</span>

          <div className="flex items-center gap-3">
            {/* Project note link */}
            {onOpenProjectStory && (
              <button
                onClick={onOpenProjectStory}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
                id="project-note-trigger"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-3 h-3"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>About this project</span>
              </button>
            )}

            {/* Separator */}
            {onOpenProjectStory && (
              <span className="text-slate-800 hidden sm:inline" aria-hidden="true">·</span>
            )}

            {/* Developer credit */}
            <a
              href="https://github.com/VaibhavaKG"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 transition-colors group"
              aria-label="VaibhavaKG on GitHub"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3 h-3 group-hover:text-slate-300 transition-colors"
                aria-hidden="true"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Designed &amp; Developed by @VaibhavaKG</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
