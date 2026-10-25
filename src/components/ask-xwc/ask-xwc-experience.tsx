import { useRouterState } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { streamAskXwc } from "../../lib/ask-xwc/client";
import {
  askXwcReducer,
  getOrCreateThreadId,
  getPageContext,
  initialAskXwcState,
} from "../../lib/ask-xwc/state";
import type { AskXwcRunInput } from "../../lib/ask-xwc/types";
import { IntelligenceDeck } from "./intelligence-deck";
import { IntelligenceSeam } from "./intelligence-seam";
import "./ask-xwc.css";

type AskXwcExperienceProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function useDesktopBoundary(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function useMobilePageLock(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia("(max-width: 1023px)");
    const body = document.body;
    const siteFrame = document.querySelector<HTMLElement>(".xwc-site-frame");
    let restore: (() => void) | null = null;

    const lock = () => {
      if (restore || !query.matches) return;
      const scrollY = window.scrollY;
      const previousStyle = body.getAttribute("style");
      const previousAriaHidden = siteFrame?.getAttribute("aria-hidden") ?? null;
      body.style.position = "fixed";
      body.style.inset = `${-scrollY}px 0 0`;
      body.style.width = "100%";
      body.style.overflow = "hidden";
      if (siteFrame) {
        siteFrame.inert = true;
        siteFrame.setAttribute("aria-hidden", "true");
      }
      restore = () => {
        if (previousStyle === null) body.removeAttribute("style");
        else body.setAttribute("style", previousStyle);
        if (siteFrame) {
          siteFrame.inert = false;
          if (previousAriaHidden === null) siteFrame.removeAttribute("aria-hidden");
          else siteFrame.setAttribute("aria-hidden", previousAriaHidden);
        }
        window.scrollTo({ top: scrollY, behavior: "auto" });
        restore = null;
      };
    };

    const update = () => {
      if (query.matches) lock();
      else restore?.();
    };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      restore?.();
    };
  }, [open]);
}

export function AskXwcExperience({ open, onOpenChange }: AskXwcExperienceProps) {
  const pathname = useRouterState({ select: (routerState) => routerState.location.pathname });
  const pageContext = useMemo(() => getPageContext(pathname), [pathname]);
  const [state, dispatch] = useReducer(askXwcReducer, initialAskXwcState);
  const [value, setValue] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const isMobile = useDesktopBoundary();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seamRef = useRef<HTMLButtonElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const pendingTextRef = useRef("");
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenRef = useRef(open);

  useMobilePageLock(open);

  const flushText = useCallback(() => {
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = null;
    const text = pendingTextRef.current;
    pendingTextRef.current = "";
    if (text) dispatch({ type: "append_text", text });
  }, []);

  useEffect(() => {
    if (open) {
      dispatch({ type: "open" });
      wasOpenRef.current = true;
      const focusTimer = window.setTimeout(
        () => headingRef.current?.focus({ preventScroll: true }),
        0,
      );
      return () => window.clearTimeout(focusTimer);
    }
    dispatch({ type: "close" });
    if (wasOpenRef.current) {
      const focusTimer = window.setTimeout(
        () => seamRef.current?.focus({ preventScroll: true }),
        0,
      );
      wasOpenRef.current = open;
      return () => window.clearTimeout(focusTimer);
    }
    wasOpenRef.current = open;
    return undefined;
  }, [open]);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    },
    [],
  );

  const runExploration = useCallback(
    async (rawIntent: string) => {
      const intent = rawIntent.trim();
      if (!intent) return;
      controllerRef.current?.abort();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
      pendingTextRef.current = "";

      let storage: Storage | null = null;
      try {
        storage = typeof window === "undefined" ? null : window.sessionStorage;
      } catch {
        storage = null;
      }
      const threadId = state.threadId ?? getOrCreateThreadId(storage);
      const runId = crypto.randomUUID();
      const messageId = crypto.randomUUID();
      if (!state.threadId) dispatch({ type: "set_thread", threadId });
      dispatch({ type: "start", intent, runId });
      setValue("");
      setAnnouncement("Ask XWC is preparing a response.");

      const controller = new AbortController();
      controllerRef.current = controller;
      const input: AskXwcRunInput = {
        threadId,
        runId,
        messages: [{ id: messageId, role: "user", content: intent }],
        tools: [],
        context: [],
        forwardedProps: {},
      };

      try {
        await streamAskXwc(input, controller.signal, {
          onTextStarted: () => dispatch({ type: "stream_started" }),
          onTextDelta: (delta) => {
            dispatch({ type: "stream_started" });
            pendingTextRef.current += delta;
            if (pendingTextRef.current.length >= 160 || pendingTextRef.current.includes("\n\n")) {
              flushText();
            } else if (!flushTimerRef.current) {
              flushTimerRef.current = setTimeout(flushText, 72);
            }
          },
          onSources: (sources) => dispatch({ type: "set_sources", sources }),
          onHandoff: (handoff) => dispatch({ type: "set_handoff", handoff }),
          onFinished: () => {
            flushText();
            dispatch({ type: "complete" });
            setAnnouncement("Response available.");
          },
        });
      } catch {
        if (controller.signal.aborted) return;
        flushText();
        dispatch({
          type: "fail",
          message: "Please try again, or continue browsing the XWC website.",
        });
        setAnnouncement("Ask XWC is temporarily unavailable.");
      } finally {
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [flushText, state.threadId],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runExploration(value);
  };

  const handleClose = () => {
    const busy = state.status === "connecting" || state.status === "streaming";
    if (busy) {
      controllerRef.current?.abort();
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
      pendingTextRef.current = "";
      setValue(state.currentIntent);
      dispatch({ type: "cancel_current" });
    }
    onOpenChange(false);
  };

  if (!open)
    return (
      <>
        <IntelligenceSeam ref={seamRef} onOpen={() => onOpenChange(true)} />
        <span className="sr-only" aria-live="polite">
          {announcement}
        </span>
      </>
    );

  return (
    <>
      <IntelligenceDeck
        state={state}
        value={value}
        pageContext={pageContext}
        isMobile={isMobile}
        headingRef={headingRef}
        inputRef={inputRef}
        onValueChange={setValue}
        onSubmit={handleSubmit}
        onRetry={() => void runExploration(state.currentIntent)}
        onClose={handleClose}
        onNavigate={handleClose}
      />
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </>
  );
}
