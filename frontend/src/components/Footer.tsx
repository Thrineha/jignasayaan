export default function Footer() {
  return (
    <footer className="bg-deep-blue py-12 text-off-white/70">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="font-heading text-lg font-bold text-off-white">
            JIGNASA<span className="text-saffron">YAAN</span>
          </span>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#vision" className="hover:text-golden">About</a>
            <a href="#destinations" className="hover:text-golden">Destinations</a>
            <a href="#why-join" className="hover:text-golden">Why Join</a>
            <a href="#register" className="hover:text-golden">Register</a>
            <a href="/handbook.pdf" className="hover:text-golden">Parent Handbook</a>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-off-white/40">
          &copy; {new Date().getFullYear()} Jignasayaan. South India&apos;s Largest Student Yaan.
        </p>
      </div>
    </footer>
  );
}
