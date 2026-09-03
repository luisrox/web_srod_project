import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

class ImmediateIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  private callback: IntersectionObserverCallback;

  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          time: 0,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
        },
      ],
      this,
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  ImmediateIntersectionObserver as typeof IntersectionObserver;

afterEach(() => {
  cleanup();
});
