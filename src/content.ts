export const clinic = {
  name: "Recreo",
  fullName: "Recreo Development and Therapy Center",
  city: "Cabanatuan City",
  hours: "Monday–Friday · 9:00 AM–5:00 PM",
  facebook: "https://www.facebook.com/recreo.dev/",
};

// Service names and durations are demonstration fixtures, not verified offerings.
export const services = [
  {
    id: "introduction",
    name: "Introductory consultation",
    duration: 45,
    category: "A place to begin",
    description:
      "A first conversation to share your questions and explore a starting point.",
    color: "green",
    icon: "heart",
  },
  {
    id: "development",
    name: "Development session",
    duration: 60,
    category: "Space for discovery",
    description:
      "Set aside time for focused activities, discovery, and the next steps in development.",
    color: "blue",
    icon: "blocks",
  },
  {
    id: "followup",
    name: "Follow-up conversation",
    duration: 30,
    category: "The next small step",
    description:
      "A little time to reconnect, discuss questions, and look ahead.",
    color: "yellow",
    icon: "message",
  },
] as const;
export type ServiceId = (typeof services)[number]["id"];
export function getService(id: ServiceId) {
  return services.find((service) => service.id === id) ?? services[0];
}

export const faqs = [
  {
    id: "appointments",
    title: "How can I arrange a visit?",
    description:
      "Visits are by appointment only. Contact Recreo through its official Facebook page to confirm a service, available times, and the details of your visit.",
  },
  {
    id: "hours",
    title: "What are the center’s office hours?",
    description:
      "Office hours are Monday to Friday, 9:00 AM to 5:00 PM, Philippine time. Please arrange your visit with the center in advance.",
  },
  {
    id: "location",
    title: "Where is Recreo located?",
    description:
      "Recreo Development and Therapy Center is in Cabanatuan City, Philippines. Contact the center for the exact address and directions before your visit.",
  },
  {
    id: "services",
    title: "How do I find the right service?",
    description:
      "Connect with the center to ask about its current services and care team. The session options shown here are illustrative; Recreo can confirm which services are available.",
  },
];
