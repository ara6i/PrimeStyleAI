"use client";

import { Ruler } from "@phosphor-icons/react";
import type {
  PrimeStylePresetProfile,
  PrimeStyleTryonProps,
} from "@primestyleai/tryon-shop/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import {
  ATELIER_OUTFIT_LOOKS,
  ATELIER_OUTFIT_RESULTS,
  ATELIER_PRODUCT_ID,
  ATELIER_PRODUCT_IMAGE,
  ATELIER_PRODUCT_NAME,
  ATELIER_RAW_MODEL_PHOTO,
  ATELIER_RESULT_ASSET_ROOT,
} from "./atelierSdkDemo.data";
import {
  ATELIER_JACKET_SIZE_ROWS,
  ATELIER_JACKET_SIZES,
  type AtelierJacketSize,
} from "./atelierJacketSizeGuide";
import { MerchantSizeGuideModal } from "./MerchantSizeGuideModal";
import styles from "./merchantPdpSdk.module.css";

const PrimeStyleTryon = dynamic<PrimeStyleTryonProps>(
  () =>
    import("@primestyleai/tryon-shop/react").then(
      (module) => module.PrimeStyleTryon,
    ),
  {
    ssr: false,
    loading: () => (
      <div className={styles.sdkLoading} aria-live="polite">
        Loading AI fitting…
      </div>
    ),
  },
);

type WomenPresetProfile = PrimeStylePresetProfile & {
  braSizeRegion: string;
  bandSize: string;
  cupSize: string;
};
const WOMEN_PRESET_PROFILE: WomenPresetProfile = {
  id: "atelier-coat-demo-model",
  gender: "female",
  photoUrl: ATELIER_RAW_MODEL_PHOTO,
  height: 168,
  weight: 59,
  heightUnit: "cm",
  weightUnit: "kg",
  age: 29,
  braSizeRegion: "US",
  bandSize: "34",
  cupSize: "B",
};
const PRODUCT_COLOUR = {
  name: "Rich aubergine",
  hex: "#4b263c",
  ink: "#ffffff",
} as const;

const SIZE_GUIDE = {
  title: "Aubergine Tailored Wool Coat size guide",
  unit: "cm",
  headers: [
    "Size",
    "Chest",
    "Waist",
    "Hip",
    "Shoulder",
    "Back length",
    "Sleeve",
  ],
  rows: ATELIER_JACKET_SIZE_ROWS.map((row) => [
    row.size,
    `${row.chest[0]}–${row.chest[1]}`,
    `${row.waist[0]}–${row.waist[1]}`,
    `${row.hip[0]}–${row.hip[1]}`,
    String(row.shoulder),
    String(row.length),
    String(row.sleeve),
  ]),
};

type MerchantPdpSdkSectionProps = {
  productUrl?: string;
};

export function MerchantPdpSdkSection({
  productUrl = "/#ai-fitting",
}: MerchantPdpSdkSectionProps = {}) {
  const [selectedSize, setSelectedSize] = useState<AtelierJacketSize>("M");
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  return (
    <section
      id="ai-fitting"
      className={styles.section}
      aria-labelledby="merchant-sdk-product-title"
    >
      <header className={styles.sectionIntro}>
        <div>
          <span>AI fitting, built into the look</span>
          <h2 id="merchant-sdk-section-title">
            Try it. Size it. Style the whole look.
          </h2>
        </div>
        <div
          className={styles.sectionDemoCue}
          aria-label="See the Aubergine Coat AI fitting demo below"
        >
          <span>See a demo!</span>
          <svg viewBox="0 0 220 130" aria-hidden="true">
            <path d="M10 24c58-18 154 4 181 77" />
            <path d="m173 88 19 14 4-24" />
            <path
              className={styles.sectionDemoCueEcho}
              d="M12 28c58-17 150 5 178 74"
            />
          </svg>
        </div>
      </header>

      <div
        className={styles.productStage}
        style={
          {
            "--product-accent": PRODUCT_COLOUR.hex,
            "--product-accent-ink": PRODUCT_COLOUR.ink,
          } as CSSProperties
        }
      >
        <div className={styles.productCanvas}>
          <aside
            className={styles.controls}
            aria-label="Aubergine coat options"
          >
            <fieldset className={styles.optionGroup}>
              <legend>Select size</legend>
              <div className={styles.sizeList}>
                {ATELIER_JACKET_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={
                      size === selectedSize ? styles.sizeActive : undefined
                    }
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={size === selectedSize}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.sizeGuideTrigger}
                onClick={() => setSizeGuideOpen(true)}
                aria-haspopup="dialog"
                aria-controls="atelier-jacket-size-guide-dialog"
                aria-expanded={sizeGuideOpen}
              >
                <Ruler size={15} weight="regular" aria-hidden="true" />
                Size guide
              </button>
            </fieldset>

            <fieldset className={styles.optionGroup}>
              <legend>Select colour</legend>
              <span className={styles.selectedColour}>
                {PRODUCT_COLOUR.name}
              </span>
              <div className={styles.colourList}>
                <button
                  type="button"
                  className={styles.colourActive}
                  style={{ "--swatch": PRODUCT_COLOUR.hex } as CSSProperties}
                  aria-label={`Select ${PRODUCT_COLOUR.name}`}
                  aria-pressed="true"
                />
              </div>
            </fieldset>

            <span className={styles.scrollCue} aria-hidden="true">
              Scroll down
            </span>
          </aside>

          <div className={styles.productVisual}>
            <Image
              src={ATELIER_PRODUCT_IMAGE}
              alt="Deep aubergine tailored wool coat with notched lapels and tonal buttons"
              fill
              loading="eager"
              quality={90}
              sizes="(max-width: 760px) 92vw, 50vw"
            />
          </div>

          <article className={styles.productDetails}>
            <p className={styles.productType}>Women&apos;s tailored coat</p>
            <h2 id="merchant-sdk-product-title">{ATELIER_PRODUCT_NAME}</h2>
            <p className={styles.productPrice}>$248</p>
            <p className={styles.productDescription}>
              A deep aubergine wool coat with graceful notched lapels, natural
              shoulders, and a softly tailored shape.
            </p>

            <div className={styles.aiFitCopy}>
              <strong>AI sizing + virtual try-on</strong>
              <span>Upload one photo. See your size and try-on.</span>
              <small>
                This interactive demo uses a prepared model photo. AI sizing and
                virtual try-on are estimates and illustrations, not guarantees
                of actual fit or appearance. Live photo processing requires
                separate consent.
              </small>
            </div>

            <div className={styles.sdkCtaWrap}>
              <div className={styles.sdkPrompt}>
                <span>Try it now!</span>
                <svg viewBox="0 0 78 38" aria-hidden="true">
                  <path d="M3 7c23-8 48 2 64 24" />
                  <path d="M58 28l10 4-2-11" />
                  <path
                    className={styles.sdkPromptEcho}
                    d="M4 9c22-7 46 2 62 23"
                  />
                </svg>
              </div>

              <PrimeStyleTryon
                apiUrl={
                  process.env.NEXT_PUBLIC_API_BASE_URL ||
                  process.env.NEXT_PUBLIC_API_URL ||
                  "http://localhost:4000"
                }
                productId={ATELIER_PRODUCT_ID}
                productImage={ATELIER_PRODUCT_IMAGE}
                productImages={[
                  ATELIER_PRODUCT_IMAGE,
                  `${ATELIER_RESULT_ASSET_ROOT}/look-01.webp`,
                  `${ATELIER_RESULT_ASSET_ROOT}/look-02.webp`,
                ]}
                garmentReferenceImage={`${ATELIER_RESULT_ASSET_ROOT}/look-01.webp`}
                garmentDetailImage={ATELIER_PRODUCT_IMAGE}
                productTitle={ATELIER_PRODUCT_NAME}
                productCategory="Women's coats"
                productSubcategory="Single-breasted tailored coat"
                productGender="female"
                productType="Tailored wool coat"
                productFitType="apparel"
                productVendor="Merchant Store"
                productTags={[
                  "women",
                  "womenswear",
                  "coat",
                  "tailored",
                  "wool",
                  "aubergine",
                ]}
                productDescription="Deep aubergine single-breasted wool coat with graceful notched lapels, natural shoulders, tonal buttons, and a softly tailored A-line shape."
                productMaterial="68% wool, 22% recycled polyester, 10% cashmere."
                sizeGuideData={SIZE_GUIDE}
                outfitBuilderSource="ai-stylist"
                instantOutfitLooks={ATELIER_OUTFIT_LOOKS}
                instantOutfitResults={ATELIER_OUTFIT_RESULTS}
                guidedDemoAutoplay
                usePresetProfileOnly
                showHeaderControls={false}
                presetProfile={WOMEN_PRESET_PROFILE}
                productUrl={productUrl}
                buttonText="Find my size & try it on"
                buttonIcon={<Ruler size={18} weight="bold" />}
                showPoweredBy
                className={styles.sdkRoot}
                classNames={{ button: styles.sdkButton }}
              />
            </div>
          </article>
        </div>
      </div>
      <MerchantSizeGuideModal
        open={sizeGuideOpen}
        selectedSize={selectedSize}
        onSelectSize={setSelectedSize}
        onClose={() => setSizeGuideOpen(false)}
      />
    </section>
  );
}
