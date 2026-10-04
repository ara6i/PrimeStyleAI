"use client";

import { useMemo, useState, type ReactNode } from "react";
import { InfluencerFooter } from "@/app/partner-landing/influencer/components/InfluencerFooter";
import { InfluencerHeader } from "@/app/partner-landing/influencer/components/InfluencerHeader";
import { InfluencerInterestDialog } from "@/app/partner-landing/influencer/components/InfluencerInterestDialog";
import styles from "@/app/partner-landing/influencer/components/influencerLanding.module.css";
import { useInfluencerLandingPage } from "@/app/partner-landing/influencer/hooks/useInfluencerLandingPage";
import {
  CreatorLanguageProvider,
  localizeInfluencerLandingViewModel,
  useCreatorLanguage,
  useOptionalCreatorLanguage,
} from "@/app/partner-landing/i18n/CreatorLanguageProvider";

interface PublicPolicyChromeProps {
  children: ReactNode;
}

export function PublicPolicyChrome({ children }: PublicPolicyChromeProps) {
  const languageContext = useOptionalCreatorLanguage();

  if (!languageContext) {
    return (
      <CreatorLanguageProvider>
        <LocalizedPublicPolicyChrome>{children}</LocalizedPublicPolicyChrome>
      </CreatorLanguageProvider>
    );
  }

  return <LocalizedPublicPolicyChrome>{children}</LocalizedPublicPolicyChrome>;
}

function LocalizedPublicPolicyChrome({ children }: PublicPolicyChromeProps) {
  const { direction, language, t } = useCreatorLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { interest, viewModel } = useInfluencerLandingPage();
  const localizedViewModel = useMemo(
    () => localizeInfluencerLandingViewModel(viewModel, t),
    [t, viewModel],
  );

  return (
    <div className={styles.page} data-audience="influencer" dir={direction} lang={language}>
      <InfluencerHeader
        mobileMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((isOpen) => !isOpen)}
        onMenuClose={() => setMobileMenuOpen(false)}
        onPrimaryAction={interest.open}
        navigationBaseHref="/creators"
      />
      {children}
      <InfluencerFooter onCtaClick={interest.open} variant="legal" />
      <InfluencerInterestDialog
        viewModel={localizedViewModel}
        isOpen={interest.isOpen}
        message={t(interest.message)}
        submissionState={interest.submissionState}
        onClose={interest.close}
        onSubmit={interest.submit}
      />
    </div>
  );
}
