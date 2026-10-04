import { ArrowUpRight, List, X } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { LandingLanguageSwitcher } from "@/app/landing/i18n";
import { BOOK_A_DEMO_URL } from "../../bookDemo";
import { useCreatorLanguage } from "../../i18n/CreatorLanguageProvider";
import styles from "./influencerLanding.module.css";

interface InfluencerHeaderProps {
  mobileMenuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onPrimaryAction: () => void;
  navigationBaseHref?: string;
}

export function InfluencerHeader(props: InfluencerHeaderProps) {
  const { language, setLanguage, t } = useCreatorLanguage();
  const navigationBaseHref = props.navigationBaseHref ?? "";

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoLink} aria-label={t("Prime Style AI home")}>
        <Image
          src="/media/partner-landing/optimized/primestyleai-mark-256.webp"
          alt="Prime Style AI"
          width={1254}
          height={1254}
          sizes="42px"
          preload
        />
        <span>Prime Style AI</span>
      </Link>
      <nav className={styles.desktopNav} aria-label={t("Influencer navigation")}>
        <Link href="/creators" aria-current="page">{t("Influencers")}</Link>
        <a href={`${navigationBaseHref}#outfit-studio`}>{t("Outfit Studio")}</a>
        <a href={`${navigationBaseHref}#creator-journey`}>{t("How you earn")}</a>
        <a href={`${navigationBaseHref}#creator-commission`}>{t("Commission")}</a>
        <Link href="/merchants">{t("For merchants")}</Link>
      </nav>
      <div className={styles.headerActions}>
        <LandingLanguageSwitcher
          compact
          className={styles.headerLanguage}
          language={language}
          onLanguageChange={setLanguage}
          variant="creator"
        />
        <button type="button" className={styles.headerWaitlistCta} onClick={props.onPrimaryAction}>
          {t("Join waitlist")}
        </button>
        <a className={styles.headerCta} href={BOOK_A_DEMO_URL} target="_blank" rel="noopener noreferrer">
          {t("Book a Demo")} <ArrowUpRight size={15} weight="bold" />
        </a>
        <button type="button" className={styles.menuButton} onClick={props.onMenuToggle} aria-label={props.mobileMenuOpen ? t("Close menu") : t("Open menu")} aria-expanded={props.mobileMenuOpen}>
          {props.mobileMenuOpen ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
      {props.mobileMenuOpen ? (
        <nav className={styles.mobileNav} aria-label={t("Mobile influencer navigation")}>
          <a href={`${navigationBaseHref}#outfit-studio`} onClick={props.onMenuClose}>{t("Outfit Studio")}</a>
          <a href={`${navigationBaseHref}#creator-journey`} onClick={props.onMenuClose}>{t("How you earn")}</a>
          <a href={`${navigationBaseHref}#creator-commission`} onClick={props.onMenuClose}>{t("Commission")}</a>
          <Link href="/merchants" onClick={props.onMenuClose}>{t("For merchants")}</Link>
          <button type="button" onClick={() => { props.onMenuClose(); props.onPrimaryAction(); }}>{t("Join waitlist")}</button>
          <a className={styles.mobileCta} href={BOOK_A_DEMO_URL} target="_blank" rel="noopener noreferrer" onClick={props.onMenuClose}>
            {t("Book a Demo")} <ArrowUpRight size={15} weight="bold" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
