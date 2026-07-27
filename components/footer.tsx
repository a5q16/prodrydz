export default function Footer() {
  return (
    <footer id="footer" className="border-t border-border/50 bg-card/50 pb-24 sm:pb-8">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <span className="text-sm font-bold text-foreground">
            ProDry <span className="text-accent">DZ</span>
          </span>

          {/* Links */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a
              href="https://wa.me/213672614917"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              تواصل معنا عبر واتساب
            </a>
            <span className="text-border">|</span>
            <span>الدفع عند الاستلام أو عبر بريدي موب</span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProDry DZ. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
