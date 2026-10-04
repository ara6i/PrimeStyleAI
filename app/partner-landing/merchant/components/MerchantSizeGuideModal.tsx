"use client";

import { Ruler, X } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import {
  ATELIER_JACKET_SIZE_ROWS,
  formatJacketMeasurement,
  formatJacketRange,
  type AtelierJacketSize,
  type AtelierJacketSizeUnit,
} from "./atelierJacketSizeGuide";
import styles from "./merchantSizeGuideModal.module.css";

const CLOSE_ANIMATION_MS = 320;

type MerchantSizeGuideModalProps = {
  open: boolean;
  selectedSize: AtelierJacketSize;
  onClose: () => void;
  onSelectSize: (size: AtelierJacketSize) => void;
};

export function MerchantSizeGuideModal({
  open,
  selectedSize,
  onClose,
  onSelectSize,
}: MerchantSizeGuideModalProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [unit, setUnit] = useState<AtelierJacketSizeUnit>("cm");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const activeRow =
    ATELIER_JACKET_SIZE_ROWS.find((row) => row.size === selectedSize) ??
    ATELIER_JACKET_SIZE_ROWS[2];

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    let frame: number | undefined;
    let visibilityFrame: number | undefined;
    let timeout: number | undefined;

    if (open) {
      frame = window.requestAnimationFrame(() => {
        setMounted(true);
        visibilityFrame = window.requestAnimationFrame(() => setVisible(true));
      });
    } else {
      frame = window.requestAnimationFrame(() => setVisible(false));
      timeout = window.setTimeout(() => setMounted(false), CLOSE_ANIMATION_MS);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (visibilityFrame) window.cancelAnimationFrame(visibilityFrame);
      if (timeout) window.clearTimeout(timeout);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus();
    };
  }, [open]);

  const keepFocusInside = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      data-visible={visible}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        id="atelier-jacket-size-guide-dialog"
        className={styles.modal}
        data-visible={visible}
        role="dialog"
        aria-modal="true"
        aria-labelledby="atelier-jacket-size-guide-title"
        onKeyDown={keepFocusInside}
      >
        <header className={styles.header}>
          <span aria-hidden="true">01 / Fit guide</span>
          <p>Aubergine Tailored Coat / Size Info</p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
          >
            <X size={20} weight="regular" aria-hidden="true" />
          </button>
        </header>

        <div className={styles.content}>
          <figure className={styles.diagram}>
            <Image
              src="/media/global-shop/atelier-sdk-v2/anchor/aubergine-tailored-wool-coat.webp"
              alt="Aubergine tailored wool coat shown from the front for the size guide"
              width={1024}
              height={1536}
              sizes="(max-width: 820px) 94vw, 45vw"
              quality={90}
              loading="eager"
            />
            <figcaption>
              Compare body measurements over a light shirt or fine knit.
            </figcaption>
          </figure>

          <div className={styles.guide}>
            <div className={styles.intro}>
              <p>Women&apos;s tailored coat</p>
              <h2 id="atelier-jacket-size-guide-title">
                Explore the sample coat chart.
              </h2>
              <span>
                Illustrative demo data. Check the brand’s verified chart before
                buying; body ranges and finished-garment dimensions differ.
              </span>
            </div>

            <div className={styles.guideToolbar}>
              <p>Sample body ranges & garment lengths</p>
              <div className={styles.unitToggle} aria-label="Measurement unit">
                {(["cm", "in"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={unit === value ? styles.unitActive : undefined}
                    onClick={() => setUnit(value)}
                    aria-pressed={unit === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Size</th>
                    <th scope="col">Body bust</th>
                    <th scope="col">Body waist</th>
                    <th scope="col">Shoulder</th>
                    <th scope="col">Sleeve</th>
                    <th scope="col">Back length</th>
                  </tr>
                </thead>
                <tbody>
                  {ATELIER_JACKET_SIZE_ROWS.map((row) => (
                    <tr
                      key={row.size}
                      className={
                        row.size === selectedSize
                          ? styles.selectedRow
                          : undefined
                      }
                    >
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => onSelectSize(row.size)}
                          aria-pressed={row.size === selectedSize}
                        >
                          {row.size}
                        </button>
                      </th>
                      <td>{formatJacketRange(row.chest, unit)}</td>
                      <td>{formatJacketRange(row.waist, unit)}</td>
                      <td>{formatJacketMeasurement(row.shoulder, unit)}</td>
                      <td>{formatJacketMeasurement(row.sleeve, unit)}</td>
                      <td>{formatJacketMeasurement(row.length, unit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.fitProfile} aria-live="polite">
              <span>Sample body range for {selectedSize}</span>
              <div>
                <p>
                  <strong>Chest</strong>
                  {formatJacketRange(activeRow.chest, unit)} {unit}
                </p>
                <p>
                  <strong>Waist</strong>
                  {formatJacketRange(activeRow.waist, unit)} {unit}
                </p>
              </div>
            </div>

            <div className={styles.bodyInputs}>
              <p>
                <Ruler size={17} weight="regular" aria-hidden="true" />
                Body measurements used for fitting
              </p>
              <span>
                Chest · Waist · Shoulder breadth · Arm length · Height
              </span>
            </div>

            <p className={styles.note}>
              Chest and waist are body-fit ranges. Shoulder, sleeve, and back
              length are sample finished-garment measurements. Coats need room
              for movement and layers; that allowance depends on the brand’s
              pattern and cannot be inferred from these body ranges.
            </p>

            <footer className={styles.footer}>
              <span>Selected size: {selectedSize}</span>
              <button type="button" onClick={onClose}>
                Use size {selectedSize}
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
