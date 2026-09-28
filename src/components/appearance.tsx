import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type AppearancePreference = "light" | "dark" | "auto";
type EffectiveAppearance = Exclude<AppearancePreference, "auto">;
type AppearanceContextValue = {
  preference: AppearancePreference;
  effective: EffectiveAppearance;
  setPreference: (preference: AppearancePreference) => void;
};

const APPEARANCE_STORAGE_KEY = "xwc-appearance";
const AppearanceContext = createContext<AppearanceContextValue | null>(null);
const isPreference = (value: unknown): value is AppearancePreference =>
  value === "light" || value === "dark" || value === "auto";

function resolveEffective(
  preference: AppearancePreference,
  media: MediaQueryList,
): EffectiveAppearance {
  return preference === "auto" ? (media.matches ? "dark" : "light") : preference;
}

function applyAppearance(preference: AppearancePreference, media: MediaQueryList) {
  const effective = resolveEffective(preference, media);
  const root = document.documentElement;
  root.classList.toggle("dark", preference === "dark");
  root.dataset["appearance"] = preference;
  root.dataset["theme"] = effective;
  root.style.colorScheme = effective;
  return effective;
}

export function AppearanceProvider({
  children,
  initialPreference,
  hasSavedCookie,
}: {
  children: React.ReactNode;
  initialPreference: AppearancePreference;
  hasSavedCookie: boolean;
}) {
  const [preference, setPreferenceState] = useState<AppearancePreference>(initialPreference);
  const [effective, setEffective] = useState<EffectiveAppearance>(
    initialPreference === "dark" ? "dark" : "light",
  );
  const preferenceRef = useRef<AppearancePreference>(initialPreference);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    let initial = initialPreference;
    if (!hasSavedCookie) {
      try {
        const saved = window.localStorage.getItem(APPEARANCE_STORAGE_KEY);
        if (isPreference(saved)) initial = saved;
        else if (saved !== null) window.localStorage.removeItem(APPEARANCE_STORAGE_KEY);
      } catch {
        // Auto remains usable when storage is blocked.
      }
    }
    preferenceRef.current = initial;
    setPreferenceState(initial);
    setEffective(applyAppearance(initial, media));

    const onMediaChange = () => {
      if (preferenceRef.current === "auto") setEffective(applyAppearance("auto", media));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key !== APPEARANCE_STORAGE_KEY) return;
      const next = isPreference(event.newValue) ? event.newValue : "auto";
      preferenceRef.current = next;
      setPreferenceState(next);
      setEffective(applyAppearance(next, media));
    };
    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [hasSavedCookie, initialPreference]);

  function setPreference(next: AppearancePreference) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    preferenceRef.current = next;
    setPreferenceState(next);
    setEffective(applyAppearance(next, media));
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, next);
    } catch {
      // The selected mode remains active for this page when storage is blocked.
    }
    document.cookie = `${APPEARANCE_STORAGE_KEY}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  const value = useMemo(() => ({ preference, effective, setPreference }), [preference, effective]);
  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error("useAppearance must be used inside AppearanceProvider");
  return value;
}

const options: { value: AppearancePreference; label: string; note: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", note: "Use the light appearance", icon: Sun },
  { value: "dark", label: "Dark", note: "Use the dark appearance", icon: Moon },
  { value: "auto", label: "Auto", note: "Follows your device", icon: Laptop },
];

export function AppearanceControl({ mobile = false }: { mobile?: boolean }) {
  const { preference, effective, setPreference } = useAppearance();
  const ActiveIcon = preference === "dark" ? Moon : preference === "light" ? Sun : Laptop;

  if (mobile)
    return (
      <fieldset className="mt-6 border-t border-border pt-5">
        <legend className="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Appearance
        </legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {options.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={preference === value}
              onClick={() => setPreference(value)}
              className="flex min-h-12 items-center justify-center gap-2 border border-border bg-background px-3 text-sm font-medium hover:border-primary aria-pressed:border-primary aria-pressed:bg-secondary"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
          {preference === "auto"
            ? `Auto · ${effective}`
            : `${preference[0]?.toUpperCase()}${preference.slice(1)}`}
        </p>
      </fieldset>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={`Appearance: ${preference}${preference === "auto" ? `, currently ${effective}` : ""}`}
        >
          <ActiveIcon aria-hidden="true" /> <span className="hidden xl:inline">Appearance</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) => {
            if (isPreference(value)) setPreference(value);
          }}
        >
          {options.map(({ value, label, note, icon: Icon }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="min-h-12 items-start py-2.5"
            >
              <Icon className="mt-0.5 size-4" aria-hidden="true" />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-muted-foreground">{note}</span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
