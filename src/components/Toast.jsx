// src/components/Toast.jsx
// A message that slides in over the page and disappears on its own.
//
// This replaces the old inline error line. In React we do not reach into
// the DOM with getElementById and add classes by hand — we describe what
// should be on screen and let React put it there. Motion then animates
// the element appearing and leaving.
//
// Animation reference:
// https://motion.dev/docs/react

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import "./Toast.css";

// How long the message stays before hiding itself.
const AUTO_DISMISS_MS = 6000;

// toast is either null (nothing showing) or { id, message }.
//
// The id matters: if the user submits the same wrong password twice, the
// message text is identical, and React would see no change and skip the
// animation. A new id each time makes it a genuinely new element, so it
// slides in again.
function Toast({ toast, onDismiss, tone = "error" }) {
  // True when the visitor has asked their system to reduce animation.
  const prefersReducedMotion = useReducedMotion();

  // Start the hide timer whenever a new toast appears, and clear it if the
  // toast changes or the page unmounts first. Without the cleanup, an old
  // timer could hide a newer message early.
  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  // Slide down from above, unless reduced motion is requested — then just
  // fade, with no movement.
  const hidden = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, y: -24 };

  const visible = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };

  return (
    // AnimatePresence keeps the element on screen just long enough to play
    // its exit animation before React removes it.
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className={`toast toast-${tone}`}
          initial={hidden}
          animate={visible}
          exit={hidden}
          transition={{ duration: 0.25, ease: "easeOut" }}
          // role="alert" makes screen readers announce the message as soon
          // as it appears, which a plain styled div would not do.
          role="alert"
          aria-live="assertive"
        >
          <span className="toast-message">{toast.message}</span>

          {/* Auto-hiding alone is not enough: someone reading slowly needs
              to be able to dismiss it themselves. */}
          <button
            type="button"
            className="toast-close"
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;
