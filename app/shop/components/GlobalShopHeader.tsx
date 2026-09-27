"use client";

import {
  ArrowUpRight,
  Handbag,
  List,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "radix-ui";
import { useRef, useState, useSyncExternalStore } from "react";
import { ShopMenuNavigation } from "./ShopMenuNavigation";
import styles from "./globalShop.module.css";

const GOOGLE_BOOKING_URL = "https://calendar.app.google/4LeitboKs5KzemWL7";
const PRODUCTION_HOSTS = new Set(["primestyleai.com", "www.primestyleai.com"]);

export function shouldShowShopMenu(hostname: string) {
  return !PRODUCTION_HOSTS.has(hostname.trim().toLowerCase());
}

function subscribeToHostname() {
  return () => undefined;
}

function getClientMenuEnabled() {
  return shouldShowShopMenu(window.location.hostname);
}

function getServerMenuEnabled() {
  return false;
}

type GlobalShopHeaderProps = {
  bagCount: number;
  onOpenBag: () => void;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export function GlobalShopHeader({
  bagCount,
  onOpenBag,
  searchTerm,
  onSearchTermChange,
}: GlobalShopHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const afterMenuClose = useRef<(() => void) | null>(null);
  const menuEnabled = useSyncExternalStore(
    subscribeToHostname,
    getClientMenuEnabled,
    getServerMenuEnabled,
  );

  function closeMenuThen(action: () => void) {
    afterMenuClose.current = action;
    setMenuOpen(false);
  }

  return (
    <Dialog.Root
      open={menuOpen}
      onOpenChange={(open) => {
        if (open) afterMenuClose.current = null;
        setMenuOpen(open);
      }}
    >
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="PrimeStyleAI shop home"
        >
          <Image
            src="/media/partner-landing/primestyleai-new-mark.png"
            alt="PrimeStyleAI"
            width={1254}
            height={1254}
            sizes="38px"
            priority
          />
          <span>
            <strong>PrimeStyleAI</strong>
            <small>Global shop</small>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Shop navigation">
          <Link href="/category/women">Women</Link>
          <Link href="/category/men">Men</Link>
          <Link href="/creators">For Creators</Link>
          <Link href="/merchants">For Merchants</Link>
          <Link href="/suppliers">For Suppliers</Link>
        </nav>

        <div className={styles.headerActions}>
          <a
            className={styles.headerDemoLink}
            href={GOOGLE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="Opens in a new tab"
          >
            Book a Demo
            <ArrowUpRight size={15} weight="bold" />
          </a>
          <button
            type="button"
            className={styles.bagAction}
            aria-label={`Saved look with ${bagCount} items`}
            onClick={onOpenBag}
          >
            <Handbag size={20} weight="regular" />
            <span>{bagCount}</span>
          </button>
          {menuEnabled ? (
            <Dialog.Trigger asChild>
              <button
                type="button"
                className={styles.menuButton}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setSearchOpen(false)}
              >
                {menuOpen ? <X size={22} /> : <List size={22} />}
              </button>
            </Dialog.Trigger>
          ) : null}
        </div>

        {searchOpen ? (
          <div className={styles.searchBar}>
            <MagnifyingGlass size={18} />
            <input
              autoFocus
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Search products, brands, categories"
              aria-label="Search the global shop"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
        ) : null}
      </header>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.menuSplash} />
        <Dialog.Content
          className={styles.menuOverlay}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            const action = afterMenuClose.current;
            afterMenuClose.current = null;
            if (action) {
              event.preventDefault();
              action();
            }
          }}
        >
          <Dialog.Title className={styles.menuAccessibleTitle}>
            PrimeStyleAI site menu
          </Dialog.Title>
          <button
            type="button"
            className={styles.menuClose}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={48} weight="thin" />
          </button>

          <Link
            className={styles.menuWordmark}
            href="/"
            aria-label="PrimeStyleAI shop home"
            target="_blank"
            rel="noopener noreferrer"
            title="Opens in a new tab"
            prefetch={false}
          >
            <span
              className={styles.menuLogo}
              role="img"
              aria-label="PrimeStyleAI — Shopping Network"
            >
              <span className={styles.menuLogoMark} aria-hidden="true">
                <Image
                  src="/media/partner-landing/primestyleai-new-mark.png"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="(max-width: 760px) 120px, 230px"
                  quality={90}
                  loading="eager"
                />
              </span>
              <span className={styles.menuLogoText} aria-hidden="true">
                <span className={styles.menuLogoName}>PrimeStyleAI</span>
                <span className={styles.menuLogoTagline}>Shopping Network</span>
              </span>
            </span>
          </Link>

          <div className={styles.menuSearchUtility}>
            <button
              type="button"
              onClick={() => closeMenuThen(() => setSearchOpen(true))}
            >
              Search
            </button>
          </div>

          <nav className={styles.menuUtilityLinks} aria-label="Shop utilities">
            <button type="button" onClick={() => closeMenuThen(onOpenBag)}>
              Saved look <span>[ {bagCount} ]</span>
            </button>
            <Link
              href="/customer/login"
              target="_blank"
              rel="noopener noreferrer"
              title="Opens in a new tab"
              prefetch={false}
            >
              Log in
            </Link>
            <a href="mailto:support@primestyleai.com">Help</a>
          </nav>

          <ShopMenuNavigation />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
