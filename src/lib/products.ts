// Single product registry. Add new products here; navigation, hub and sitemap read from it.
export type Product = {
  slug: string;
  name: string;
  category: string;
  summary: string;
  navNote: string;
  appUrl?: string;
  appLabel?: string;
};

export const products: Product[] = [
  {
    slug: "tripops",
    name: "TripOps",
    category: "Logistics & fleet operations",
    summary: "A Xyncwave product for keeping trip records, trip-related expenses, budgets and reconciliation in one operational workflow.",
    navNote: "Trips, expenses, budgets and reconciliation in one place",
    appUrl: "https://tripops.xyncwave.com/sign-in",
    appLabel: "Sign In to TripOps",
  },
];

// Points of View: content type prepared for future approved publications. Empty until approved.
export type PointOfView = { slug: string; title: string; summary: string };
export const pointsOfView: PointOfView[] = [];
