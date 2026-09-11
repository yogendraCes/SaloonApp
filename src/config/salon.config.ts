export interface SalonConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    googleMapsLink: string;
    googleMapsEmbedUrl: string;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsappNumber: string; // international format without +
    email: string;
    instagram: string;
    facebook: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
    closedOn: string;
    startHour: number; // 24h format for open/closed calculation e.g. 10
    endHour: number; // 24h format e.g. 21
  };
  stats: {
    rating: number;
    reviewsCount: number;
    happyClients: string;
    yearsOfExperience: number;
    stylistsCount: number;
  };
  media: {
    heroImage: string;
    ambianceVideoThumb: string;
    ambianceVideoUrl: string;
    interiorPhotos: { url: string; title: string; caption: string }[];
    lookbook: { url: string; title: string; category: string }[];
  };
  testimonials: {
    name: string;
    initials: string;
    rating: number;
    review: string;
    serviceTaken: string;
    date: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const SALON_CONFIG: SalonConfig = {
  name: "Zenyme hair Studio & Spa",
  shortName: "Zenyme Studio",
  tagline: "Bespoke Hair Artistry, Grooming & Luxury Wellness",
  description:
    "Experience world-class salon luxury in Indiranagar. From precision scissor cuts and bespoke balayage to restorative scalp spas and royal beard grooming — our master stylists curate an unforgettable transformation.",

  address: {
    street: "Plot 42, 100 Feet Road",
    area: "HAL 2nd Stage, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    googleMapsLink: "https://maps.google.com/?q=100+Feet+Road+Indiranagar+Bengaluru",
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.985552309192!2d77.6406987!3d12.9727448!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16a70e303e91%3A0x28bc3a5e8fbf3816!2s100%20Feet%20Rd%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  },

  contact: {
    phone: "+91 98765 43210",
    phoneRaw: "919876543210",
    whatsappNumber: "919876543210",
    email: "concierge@zenymestudio.com",
    instagram: "https://instagram.com/zenymestudio",
    facebook: "https://facebook.com/zenymestudio",
  },

  hours: {
    weekdays: "10:00 AM – 09:00 PM",
    weekends: "09:00 AM – 09:30 PM",
    closedOn: "Every Monday",
    startHour: 10,
    endHour: 21,
  },

  stats: {
    rating: 4.9,
    reviewsCount: 520,
    happyClients: "18,000+",
    yearsOfExperience: 8,
    stylistsCount: 6,
  },

  media: {
    heroImage:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80",
    ambianceVideoThumb:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    ambianceVideoUrl: "https://www.youtube-nocookie.com/embed/gU9yS1oR-nI", // Aesthetic salon interior & haircut experience
    interiorPhotos: [
      {
        url: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=800&q=80",
        title: "Styling Stations",
        caption: "Custom leather hydraulic chairs with ergonomic Italian mirrors",
      },
      {
        url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
        title: "The Wash Lounge",
        caption: "Aromatherapy head-spa massage recliners with ambient lighting",
      },
      {
        url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
        title: "VIP Grooming Suite",
        caption: "Private booth for executive beard sculpting and skin care",
      },
      {
        url: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80",
        title: "Color & Treatment Lab",
        caption: "Ammonia-free organic toners and premium Olaplex hair bars",
      },
    ],
    lookbook: [
      {
        url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
        title: "Textured Crop & Low Fade",
        category: "Men's Styling",
      },
      {
        url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
        title: "Caramel Honey Balayage",
        category: "Hair Coloring",
      },
      {
        url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=600&q=80",
        title: "Royal Beard Sculpt & Hot Towel",
        category: "Beard Craft",
      },
      {
        url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
        title: "Glass Hair Blowout & Cut",
        category: "Women's Styling",
      },
      {
        url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80",
        title: "Detox Scalp & Facial Revival",
        category: "Spa & Skin",
      },
      {
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
        title: "Classic Pompadour & Taper",
        category: "Classic Barbering",
      },
    ],
  },

  testimonials: [
    {
      name: "Rohan Verma",
      initials: "RV",
      rating: 5,
      review:
        "The best haircut experience in Bangalore. Aisha took the time to understand my face structure before cutting. The online booking made it effortless — zero waiting time when I arrived.",
      serviceTaken: "Signature Scissor Haircut & Styling",
      date: "2 days ago",
    },
    {
      name: "Pooja Hegde",
      initials: "PH",
      rating: 5,
      review:
        "Got my balayage done here by Marcus. The color blend is so smooth and natural. The ambiance is pure luxury and the coffee while you wait is amazing!",
      serviceTaken: "Sun-Kissed Balayage & Olaplex Spa",
      date: "1 week ago",
    },
    {
      name: "Vikramaditya Rao",
      initials: "VR",
      rating: 5,
      review:
        "The Royal Beard Grooming with the charcoal steam towel is next level. Loved that I could book my exact 6:30 PM slot from my phone and get a WhatsApp confirmation immediately.",
      serviceTaken: "Royal Beard Grooming & Face Spa",
      date: "2 weeks ago",
    },
  ],

  faqs: [
    {
      question: "Do I need to book in advance or do you accept walk-ins?",
      answer:
        "We welcome walk-ins based on chair availability, but we strongly recommend booking online in advance to guarantee your preferred stylist and eliminate waiting time.",
    },
    {
      question: "How do I know my booking is confirmed?",
      answer:
        "As soon as you choose your slot online, you receive an instant confirmation on your screen and can send it directly to our WhatsApp concierge with 1 tap.",
    },
    {
      question: "Can I choose my specific stylist?",
      answer:
        "Yes! When booking, you can browse all our master stylists, see their specialties and ratings, and pick the artist who best matches your desired look.",
    },
    {
      question: "What products do you use?",
      answer:
        "We exclusively use premium, certified professional salon brands including L'Oréal Professionnel, Olaplex, Moroccanoil, and Dyson Pro styling tools.",
    },
  ],
};
