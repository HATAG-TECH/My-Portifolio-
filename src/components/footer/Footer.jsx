export default function Footer() {
  return (
    <footer className="theme-navbar border-t">
      <div className="section-container theme-text-soft flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
        <p>Copyright 2026 HATAG Tech - Habtamu Shewamene</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noreferrer"
            className="interactive hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noreferrer"
            className="interactive hover:text-primary"
          >
            LinkedIn
          </a>
          <a href="mailto:your-email@example.com" className="interactive hover:text-primary">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
