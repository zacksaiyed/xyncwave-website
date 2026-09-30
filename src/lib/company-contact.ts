export const companyContact = {
  name: "Xyncwave Corporation LLP",
  email: "aasiya@xyncwave.ceo",
  phoneDisplay: "+91 9081 9081 45",
  phoneHref: "+919081908145",
  addressLines: [
    "F-19, Sharnam Fortune",
    "Race Course, Alkapuri",
    "Vadodara, Gujarat 390021, India",
  ],
  address: "F-19, Sharnam Fortune, Race Course, Alkapuri, Vadodara, Gujarat 390021, India",
} as const;

export const companyMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  companyContact.address,
)}`;
