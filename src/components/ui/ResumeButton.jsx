import { useEffect, useRef, useState } from 'react';
import { fetchResumeStats } from '../../services/api.js';
import { downloadResume } from '../../services/resume.js';

const FORMAT_LABELS = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'TXT',
  md: 'MD',
};

function isCustomizableFormat(format) {
  return format === 'txt' || format === 'md';
}

export default function ResumeButton({
  label = 'Download Resume',
  icon = '📄',
  placement = 'unknown',
  variant = 'primary',
  className = '',
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [format, setFormat] = useState('pdf');
  const [includeFullResume, setIncludeFullResume] = useState(true);
  const [includeSkillsMatrix, setIncludeSkillsMatrix] = useState(true);
  const [includeContactDetails, setIncludeContactDetails] = useState(false);

  useEffect(() => {
    let active = true;
    fetchResumeStats()
      .then((value) => {
        if (!active) return;
        setStats(Number(value?.totalDownloads || 0));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  const onDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await downloadResume({
        format,
        placement,
        include: {
          fullResume: includeFullResume,
          skillsMatrix: includeSkillsMatrix,
          contactDetails: includeContactDetails,
        },
      });
      setStats((prev) => (typeof prev === 'number' ? prev + 1 : prev));
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass =
    variant === 'secondary'
      ? 'resume-btn resume-btn-secondary'
      : variant === 'tertiary'
        ? 'resume-btn resume-btn-tertiary'
        : 'resume-btn resume-btn-primary';

  const customEnabled = isCustomizableFormat(format);

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="resume-menu theme-surface absolute right-0 top-[calc(100%+0.6rem)] z-50 w-[320px] rounded-2xl p-4"
          role="dialog"
          aria-label="Resume download options"
        >
          <h3 className="theme-text-primary text-sm font-semibold">Download Resume</h3>

          <div className="mt-3">
            <p className="theme-text-soft text-[11px] uppercase tracking-wide">Format</p>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {Object.keys(FORMAT_LABELS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormat(key)}
                  className={`resume-chip ${format === key ? 'resume-chip-active' : ''}`}
                >
                  {FORMAT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <p className="theme-text-soft text-[11px] uppercase tracking-wide">Customization</p>
            <div className="mt-2 space-y-1 text-sm">
              <label className={`resume-check ${!customEnabled ? 'opacity-60' : ''}`}>
                <input
                  type="checkbox"
                  checked={includeFullResume}
                  disabled={!customEnabled}
                  onChange={(event) => setIncludeFullResume(event.target.checked)}
                />
                <span>Full resume</span>
              </label>
              <label className={`resume-check ${!customEnabled ? 'opacity-60' : ''}`}>
                <input
                  type="checkbox"
                  checked={includeSkillsMatrix}
                  disabled={!customEnabled}
                  onChange={(event) => setIncludeSkillsMatrix(event.target.checked)}
                />
                <span>Skills matrix</span>
              </label>
              <label className={`resume-check ${!customEnabled ? 'opacity-60' : ''}`}>
                <input
                  type="checkbox"
                  checked={includeContactDetails}
                  disabled={!customEnabled}
                  onChange={(event) => setIncludeContactDetails(event.target.checked)}
                />
                <span>Contact details</span>
              </label>
            </div>
            {!customEnabled && (
              <p className="theme-text-soft mt-1 text-xs">
                PDF and DOCX use the official static files.
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              className="resume-btn resume-btn-primary w-full justify-center"
              onClick={onDownload}
              disabled={isLoading}
            >
              <span aria-hidden="true">⬇</span>
              <span>{isLoading ? 'Preparing...' : `Download ${FORMAT_LABELS[format]}`}</span>
            </button>
          </div>

          <p className="theme-text-soft mt-3 text-xs">
            Downloaded {typeof stats === 'number' ? stats : '--'} times
          </p>
        </div>
      )}
    </div>
  );
}
