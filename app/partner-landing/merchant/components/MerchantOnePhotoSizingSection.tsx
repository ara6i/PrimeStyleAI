import { DeferredVideo } from "../../components/DeferredVideo";
import styles from "./merchantOnePhotoSizing.module.css";

const VIDEO_SRC =
  "/media/partner-landing/merchant-network/one-photo-sizing/one-photo-sizing-live-actions-4k-v3.mp4";
const POSTER_SRC =
  "/media/partner-landing/merchant-network/one-photo-sizing/one-photo-sizing-storyboard-v1-lossless.webp";

export function MerchantOnePhotoSizingSection() {
  return (
    <section
      id="one-photo-fit"
      className={styles.section}
      aria-labelledby="one-photo-fit-title"
    >
      <div className={styles.layout}>
        <article className={styles.copy}>
          <p className={styles.eyebrow}>AI sizing + virtual try-on</p>
          <h2 id="one-photo-fit-title">
            One photo.
            <span>Size and try-on.</span>
          </h2>
          <p className={styles.description}>
            Your customers can see their recommended size and try on each piece
            using only a single front full-body photo.
          </p>

          <div className={styles.promise} aria-label="What customers need">
            <p>
              <span>01</span>
              One front photo
            </p>
            <p>
              <span>02</span>
              No front-and-side photo set
            </p>
            <p>
              <span>03</span>
              No visible 3D mesh
            </p>
          </div>

          <p className={styles.closing}>Simple. Accurate.</p>
        </article>

        <figure className={styles.visual}>
          <DeferredVideo
            className={styles.video}
            muted
            loop
            playsInline
            poster={POSTER_SRC}
            aria-hidden="true"
            tabIndex={-1}
            rootMargin="240px 0px"
            sources={[
              {
                src: VIDEO_SRC,
                type: "video/mp4",
                media: "(prefers-reduced-motion: no-preference)",
              },
            ]}
          />
        </figure>
      </div>
    </section>
  );
}
