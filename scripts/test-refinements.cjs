/* Targeted source-level regressions. Not a replacement for React/browser integration tests.
 * Run: node --test scripts/test-refinements.cjs (uses the existing TypeScript devDependency).
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");

function load(relative, dependencies = {}, globals = {}, suffix = "") {
  const source = fs.readFileSync(path.join(root, relative), "utf8") + suffix;
  const result = ts.transpileModule(source.replaceAll("import.meta.env.DEV", "false"), {
    fileName: relative,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    reportDiagnostics: true,
  });
  assert.equal(result.diagnostics?.length ?? 0, 0, `Syntax: ${relative}`);
  const exports = {};
  vm.runInNewContext(result.outputText, {
    exports,
    require(name) {
      if (name in dependencies) return dependencies[name];
      throw new Error(`Unexpected dependency in isolated test: ${name}`);
    },
    ...globals,
  }, { filename: relative });
  return exports;
}
const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }), Fragment: "Fragment" };

function appearanceFixture({ stored = null, dark = false, cookieBlocked = false } = {}) {
  const effects = [], events = new Map(), states = [], cookieWrites = [];
  const storage = {
    getItem: () => stored,
    setItem: (_key, value) => { stored = value; },
    removeItem: () => { stored = null; },
  };
  const rootElement = { classList: { toggle: (name, value) => { rootElement[name] = value; } }, dataset: {}, style: {} };
  const media = { matches: dark, addEventListener: (key, fn) => events.set(`media:${key}`, fn), removeEventListener() {} };
  const document = { documentElement: rootElement };
  Object.defineProperty(document, "cookie", { set(value) { if (cookieBlocked) throw new Error("blocked"); cookieWrites.push(value); } });
  const react = {
    createContext: () => ({ Provider: "Provider" }),
    useContext: () => null,
    useState: (value) => [value, (next) => states.push(next)],
    useRef: (value) => ({ current: value }),
    useEffect: (effect) => effects.push(effect),
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
  };
  const module = load("src/components/appearance.tsx", {
    react,
    "react/jsx-runtime": jsx,
    "lucide-react": {},
    "./ui/button": {},
    "./ui/dropdown-menu": {},
  }, {
    document,
    window: { localStorage: storage, matchMedia: () => media, location: { protocol: "https:" }, addEventListener: (key, fn) => events.set(key, fn), removeEventListener() {} },
  });
  function mount(preference = "auto", hasSavedCookie = false) {
    const node = module.AppearanceProvider({ children: null, initialPreference: preference, hasSavedCookie });
    effects.forEach((effect) => effect());
    return node.props.value;
  }
  return { mount, storage, media, rootElement, events, states, cookieWrites };
}

test("Auto applies both semantic colours and dark utility class", () => {
  const fixture = appearanceFixture({ dark: true });
  fixture.mount();
  assert.equal(fixture.rootElement.dark, true);
  assert.equal(fixture.rootElement.dataset.appearance, "auto");
  assert.equal(fixture.rootElement.dataset.theme, "dark");
});
test("Auto follows a later device change", () => {
  const fixture = appearanceFixture(); fixture.mount();
  fixture.media.matches = true; fixture.events.get("media:change")();
  assert.equal(fixture.rootElement.dark, true);
});
test("manual Light overrides dark device preference", () => {
  const fixture = appearanceFixture({ dark: true }); fixture.mount("light", true);
  assert.equal(fixture.rootElement.dark, false);
});
test("migrated local preference synchronises the SSR cookie", () => {
  const fixture = appearanceFixture({ stored: "dark" }); fixture.mount();
  assert.equal(fixture.rootElement.dark, true);
  assert.match(fixture.cookieWrites.at(-1), /^xwc-appearance=dark;/);
});
test("blocked cookies do not throw or prevent a mode change", () => {
  const fixture = appearanceFixture({ cookieBlocked: true });
  const context = fixture.mount();
  assert.doesNotThrow(() => context.setPreference("dark"));
  assert.equal(fixture.rootElement.dark, true);
});
test("localStorage.clear() resets Auto and synchronises the cookie", () => {
  const fixture = appearanceFixture(); fixture.mount("dark", true);
  fixture.events.get("storage")({ key: null, newValue: null, storageArea: fixture.storage });
  assert.equal(fixture.rootElement.dataset.appearance, "auto");
  assert.match(fixture.cookieWrites.at(-1), /^xwc-appearance=auto;/);
});
test("sessionStorage and unrelated keys do not change appearance", () => {
  const fixture = appearanceFixture(); fixture.mount("light", true);
  fixture.events.get("storage")({ key: "xwc-appearance", newValue: "dark", storageArea: {} });
  fixture.events.get("storage")({ key: "other", newValue: "dark", storageArea: fixture.storage });
  assert.equal(fixture.rootElement.dataset.appearance, "light");
});
test("cross-tab mode change synchronises the SSR cookie", () => {
  const fixture = appearanceFixture(); fixture.mount();
  fixture.events.get("storage")({ key: "xwc-appearance", newValue: "dark", storageArea: fixture.storage });
  assert.equal(fixture.rootElement.dark, true);
  assert.match(fixture.cookieWrites.at(-1), /^xwc-appearance=dark;/);
});

function searchFixture() {
  const solution = (title) => ({ slug: "answer", title, short: "Helpful explanation", eyebrow: "Topic", openingTitle: "Topic", capabilities: [] });
  return load("src/lib/search-index.ts", {
    "./content": {
      solutions: [solution("Unique answer"), solution("Unique alternative")],
      industries: [],
      articles: [
        { slug: "paid", title: "Paid operations", excerpt: "Paid reporting", category: "Operations" },
        { slug: "ai", title: "AI automation", excerpt: "Bounded automation", category: "AI" },
        { slug: "integration", title: "System integration", excerpt: "Connected workflows", category: "Integration" },
      ],
    },
    "./case-studies": { caseStudies: [] },
  });
}
test("de-duplication retains the highest-scoring route", () => {
  const results = searchFixture().searchContent("Unique answer");
  assert.equal(results.find((item) => item.route === "/solutions/answer").title, "Unique answer");
  assert.equal(results.filter((item) => item.route === "/solutions/answer").length, 1);
});
test("short AI query does not match the substring in paid", () => {
  const results = searchFixture().searchContent("ai");
  assert.ok(results.some((item) => item.route === "/insights/ai"));
  assert.ok(!results.some((item) => item.route === "/insights/paid"));
});
test("empty and punctuation-only search safely return no results", () => {
  const { searchContent } = searchFixture();
  assert.equal(searchContent("  ").length, 0);
  assert.equal(searchContent("<>!?").length, 0);
});
test("type filter and a single missing character remain supported", () => {
  const results = searchFixture().searchContent("integratio", "Insight");
  assert.ok(results.some((item) => item.route === "/insights/integration"));
  assert.ok(results.every((item) => item.type === "Insight"));
});

function menuFixture() {
  let focused = false, closed = false, dismissed = false;
  const document = { activeElement: { tag: "link" } };
  const react = { useRef: () => ({ current: { focus: () => { focused = true; } } }), useEffect() {}, useState: () => [false, () => {}] };
  const module = load("src/components/site-shell.tsx", {
    "./app-link": {}, "@tanstack/react-router": {}, "lucide-react": {}, react,
    "react/jsx-runtime": jsx, "./ui/button": {}, "./ui/sheet": {}, "./appearance": {},
    "../assets/Header_logo_XWC.png.asset.json": {}, "../assets/Footer_logo_XWC.png.asset.json": {},
  }, { document }, "\nexport { NavMenu as TestNavMenu };\n");
  const node = module.TestNavMenu({ label: "Solutions", href: "/solutions", groups: [], open: true, suppressed: false, onOpen() {}, onClose() {}, onDismiss() { dismissed = true; }, onLeave() { closed = true; } });
  return { node, document, result: () => ({ focused, closed, dismissed }) };
}
test("Escape dismisses submenu and restores its disclosure trigger", () => {
  const fixture = menuFixture();
  fixture.node.props.onKeyDown({ key: "Escape", preventDefault() {}, stopPropagation() {} });
  assert.equal(fixture.result().dismissed, true);
  assert.equal(fixture.result().focused, true);
});
test("pointer leaving cannot hide keyboard-focused submenu content", () => {
  const fixture = menuFixture();
  fixture.node.props.onPointerLeave({ currentTarget: { contains: () => true } });
  assert.equal(fixture.result().closed, false);
});
test("tabbing outside the navigation disclosure closes it", () => {
  const fixture = menuFixture();
  fixture.node.props.onBlur({ currentTarget: { contains: () => false }, relatedTarget: {} });
  assert.equal(fixture.result().closed, true);
});
test("mobile and desktop use the same 1280px breakpoint", () => {
  const source = fs.readFileSync(path.join(root, "src/components/site-shell.tsx"), "utf8");
  assert.equal((source.match(/min-width: 1280px/g) || []).length, 2);
  assert.ok(!source.includes("min-width: 1024px"));
  assert.ok(source.includes('className="xl:hidden" aria-label="Open menu"'));
});
