import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { BOOK_A_DEMO_URL } from "../../bookDemo";
import styles from "./merchantLanding.module.css";

export function MerchantHeader({ mobileMenuOpen, onMenuToggle, onMenuClose, onPrimaryAction }: {
  mobileMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onPrimaryAction: () => void;
}) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink} aria-label="PrimeStyleAI home">
        <Image
          src="/media/partner-landing/optimized/primestyleai-mark-256.webp"
          alt="PrimeStyleAI"
          width={1254}
          height={1254}
          sizes="42px"
          preload
        />
        <span>Prime Style AI</span>
      </Link>
      <nav className={styles.desktopNav} aria-label="Merchant navigation">
        <Link href="/merchants" aria-current="page">Merchants</Link>
        <a href="#shopping-network">Your store</a>
        <a href="#influencer-network">Creators</a>
        <a href="#merchant-dashboard">Dashboard</a>
        <a href="#pdp-studio-feature">PDP Studio</a>
      </nav>
      <div className={styles.headerActions}>
        <button type="button" className={styles.headerWaitlistCta} onClick={onPrimaryAction}>
          Join the waitlist
        </button>
        <a className={styles.headerCta} href={BOOK_A_DEMO_URL} target="_blank" rel="noopener noreferrer">
          Book a Demo <ArrowUpRight size={15} weight="bold" />
        </a>
        <button type="button" className={styles.menuButton} onClick={onMenuToggle} aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X size={24} /> : <List size={24} />}</button>
      </div>
      {mobileMenuOpen ? (
        <nav className={styles.mobileNav} aria-label="Mobile merchant navigation">
          <a href="#shopping-network" onClick={onMenuClose}>Your storefront</a>
          <a href="#influencer-network" onClick={onMenuClose}>Creator showcase</a>
          <a href="#creator-discovery" onClick={onMenuClose}>Find creators</a>
          <a href="#merchant-dashboard" onClick={onMenuClose}>Merchant dashboard</a>
          <a href="#pdp-studio-feature" onClick={onMenuClose}>PDP Studio</a>
          <button type="button" onClick={() => { onMenuClose(); onPrimaryAction(); }}>Join the waitlist</button>
          <a className={styles.mobileCta} href={BOOK_A_DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={onMenuClose}>
            Book a Demo <ArrowUpRight size={15} weight="bold" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
