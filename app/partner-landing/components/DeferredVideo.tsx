"use client";

import {
  useEffect,
  useRef,
  useState,
  type VideoHTMLAttributes,
} from "react";

type DeferredVideoSource = {
  media?: string;
  src: string;
  type: string;
};

type DeferredVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "autoPlay" | "children" | "preload" | "src"
> & {
  eagerPoster?: boolean;
  loadDelayMs?: number;
  rootMargin?: string;
  sources: readonly DeferredVideoSource[];
};

/**
 * Keeps off-screen films from competing with the page's images. The poster is
 * still painted immediately; video bytes are requested only when the film is
 * close to the viewport and motion is allowed.
 */
export function DeferredVideo({
  eagerPoster = false,
  loadDelayMs = 0,
  poster,
  rootMargin = "320px 0px",
  sources,
  ...videoProps
}: DeferredVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let timer: number | undefined;
    const beginLoading = () => {
      timer = window.setTimeout(() => setShouldLoad(true), loadDelayMs);
    };

    if (!("IntersectionObserver" in window)) {
      beginLoading();
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        beginLoading();
      },
      { rootMargin },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [loadDelayMs, rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    if (window.navigator.userAgent.includes("jsdom")) return;

    video.load();
    const playResult = video.play();
    if (!playResult) return;
    void playResult.catch(() => {
      // The high-resolution poster remains visible when autoplay is blocked.
    });
  }, [shouldLoad]);

  return (
    <video
      {...videoProps}
      ref={videoRef}
      autoPlay={false}
      poster={eagerPoster || shouldLoad ? poster : undefined}
      preload="none"
    >
      {shouldLoad
        ? sources.map((source) => (
            <source
              key={`${source.src}-${source.media ?? "all"}`}
              src={source.src}
              type={source.type}
              media={source.media}
            />
          ))
        : null}
    </video>
  );
}
