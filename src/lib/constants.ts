import {
  MapPin, Shield, HeadphonesIcon, Package, Star, Award, Users, Hotel,
  Heart, Camera, TreePine, Utensils, Car, Palmtree, Mountain, Compass,
  Sun, Sunrise, Sunset, Wind, Bird, BookOpen, Coffee, Tent, Ship, Plane,
  Landmark, Globe, Briefcase, Church, Filter, TreeDeciduous, Waves,
  Building2, Sparkles, Megaphone, type LucideIcon
} from "lucide-react";

export const COMPANY = {
  name: "Ready Set Go Tours & Travel",
  shortName: "Ready Set Go Tours",
  tagline: "Extraordinary African Safaris & Travel Experiences",
  description:
    "Premier luxury tour operator based in Nairobi, Kenya, specializing in bespoke safaris and travel experiences across Kenya and Tanzania.",
  copyright: "© 2026 Ready Set Go Tours & Travel. All rights reserved.",
  phone: "+254 797 867 411",
  email: "readysetgotoursandtravel43@gmail.com",
  whatsapp: "+254797867411",
  address: "Nairobi, Kenya",
  hours: "Mon–Sat: 8:00 AM – 6:00 PM (EAT)",
  social: {
    facebook: "https://facebook.com/readysetgotours",
    instagram: "https://instagram.com/readysetgotours",
    twitter: "https://twitter.com/readysetgotours",
    youtube: "https://youtube.com/@readysetgotours",
    tiktok: "https://tiktok.com/@readysetgotours",
    linkedin: "https://linkedin.com/company/readysetgotours",
  },
};

export const USD_TO_KES = 130;

export const CONTACT_INFO = {
  phone: COMPANY.phone,
  email: COMPANY.email,
  address: COMPANY.address,
  hours: COMPANY.hours,
  whatsapp: COMPANY.whatsapp,
};

export const SOCIAL_LINKS = [
  { name: "facebook", href: COMPANY.social.facebook, icon: "facebook" },
  { name: "instagram", href: COMPANY.social.instagram, icon: "instagram" },
  { name: "twitter", href: COMPANY.social.twitter, icon: "twitter" },
  { name: "youtube", href: COMPANY.social.youtube, icon: "youtube" },
  { name: "tiktok", href: COMPANY.social.tiktok, icon: "tiktok" },
  { name: "linkedin", href: COMPANY.social.linkedin, icon: "linkedin" },
];

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Destinations",
    href: "/kenya-tours",
    children: [
      { label: "Kenya", href: "/kenya-tours" },
      { label: "Tanzania", href: "/tanzania-tours" },
      { label: "Beach Holidays", href: "/beach-holidays" },
    ],
  },
  {
    label: "Tours",
    href: "/holiday-packages",
    children: [
      { label: "Beach Holidays", href: "/beach-holidays" },
      { label: "Mountain Treks", href: "/mountain-trekking" },

      { label: "Honeymoon Packages", href: "/honeymoon-packages" },
      { label: "Luxury Getaways", href: "/holiday-packages?type=luxury" },
      { label: "Group Safaris", href: "/holiday-packages?type=group" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Hotel Bookings", href: "/services/hotel-bookings" },
      { label: "Air Ticketing", href: "/services/air-ticketing" },
      { label: "Massage & Wellness", href: "/services/massage-wellness" },
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/travel-guide" },
  { label: "Deals", href: "/deals" },
  { label: "Contact", href: "/contact" },
];

interface Destination {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  rating: number;
  bestTime: string;
  duration: string;
  startingPrice: number;
  highlights: string[];
}

export const DESTINATIONS: { kenya: Destination[]; tanzania: Destination[] } = {
  kenya: [
    {
      id: 1,
      name: "Masai Mara National Reserve",
      slug: "masai-mara",
      image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
      description: "The crown jewel of Kenya's wildlife parks, famous for the Great Migration and the Big Five. Endless golden savannahs dotted with acacia trees host Africa's densest predator population.",
      rating: 4.9,
      bestTime: "July - October",
      duration: "3-5 days",
      startingPrice: 1800,
      highlights: ["Great Migration (Jul-Oct)", "Big Five safaris", "Hot air balloon rides", "Maasai village visits", "Night game drives"],
    },
    {
      id: 2,
      name: "Amboseli National Park",
      slug: "amboseli",
      image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
      description: "Home to Africa's highest elephant density with breathtaking views of Mount Kilimanjaro. The park's swamps and dry lake beds create surreal photographic landscapes.",
      rating: 4.8,
      bestTime: "June - October",
      duration: "2-3 days",
      startingPrice: 1200,
      highlights: ["Large elephant herds", "Mt Kilimanjaro backdrop", "Observation Hill views", "Maasai community visits", "Birdwatching paradise"],
    },
    {
      id: 3,
      name: "Samburu National Reserve",
      slug: "samburu",
      image: "https://i.pinimg.com/736x/71/0b/61/710b61bf0912e6ab85f91ad0dcd24ba6.jpg",
      description: "A rugged, semi-arid reserve in northern Kenya known for rare northern specialist species and rich Samburu culture. The Ewaso Ng'iro River sustains remarkable wildlife.",
      rating: 4.7,
      bestTime: "June - October",
      duration: "2-3 days",
      startingPrice: 1400,
      highlights: ["Grevy's zebra", "Reticulated giraffe", "Beisa oryx", "Samburu cultural immersion", "Ewaso Ng'iro river walks"],
    },
    {
      id: 4,
      name: "Lake Nakuru National Park",
      slug: "lake-nakuru",
      image: "https://i.pinimg.com/736x/fd/ef/a9/fdefa997b495bcc9246ad44e644be087.jpg",
      description: "A soda lake park famed for its flamingo flocks and rhino sanctuary. The lake's alkaline waters and surrounding woodlands create a vibrant ecosystem.",
      rating: 4.6,
      bestTime: "June - March",
      duration: "1-2 days",
      startingPrice: 800,
      highlights: ["Flamingo flocks", "White & black rhinos", "Baboon cliff viewpoints", "Makalia Falls", "Waterbuck & lion encounters"],
    },
    {
      id: 5,
      name: "Tsavo National Park",
      slug: "tsavo",
      image: "https://images.unsplash.com/photo-1670349202857-f4615ee3c977?q=80&w=1080",
      description: "One of the world's largest game sanctuaries, split into Tsavo East and West. Known for its red elephants, lava landscapes, and the legendary man-eaters.",
      rating: 4.5,
      bestTime: "June - October",
      duration: "2-4 days",
      startingPrice: 1000,
      highlights: ["Red-dusted elephants", "Mzima Springs hippos", "Chyulu Hills vistas", "Shetani lava flows", "Man-eater history"],
    },
    {
      id: 6,
      name: "Laikipia Plateau",
      slug: "laikipia",
      image: "https://i.pinimg.com/736x/cc/76/4a/cc764a89a26b9322634b91a51d58248f.jpg",
      description: "A conservation powerhouse offering exclusive, low-impact tourism across vast private ranches and community conservancies. Laikipia is a model for sustainable wildlife management.",
      rating: 4.8,
      bestTime: "January - March",
      duration: "3-4 days",
      startingPrice: 2200,
      highlights: ["Wild dog sightings", "Lewa Wildlife Conservancy", "Ol Pejeta chimpanzees", "Horseback safaris", "Star-bed sleepouts"],
    },
    {
      id: 7,
      name: "Nairobi National Park",
      slug: "nairobi-national-park",
      image: "https://images.unsplash.com/photo-1598403531581-5c4940efd249?q=80&w=1080",
      description: "The world's only wildlife park within a capital city. Nairobi skyline forms a surreal backdrop to grazing zebras, lions, and rhinos just minutes from the airport.",
      rating: 4.4,
      bestTime: "Year-round",
      duration: "1 day",
      startingPrice: 400,
      highlights: ["City safari experience", "Nairobi Animal Orphanage", "Ivory burning site", "Walking trails", "Photographic hide"],
    },
    {
      id: 8,
      name: "Mount Kenya Region",
      slug: "mount-kenya",
      image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg",
      description: "Africa's second-highest peak surrounded by lush montane forests and wildlife-rich foothills. A paradise for trekkers and nature enthusiasts.",
      rating: 4.7,
      bestTime: "January - February",
      duration: "5-7 days",
      startingPrice: 1600,
      highlights: ["Peak climbing", "Equatorial glaciers", "Moorland hiking", "Mountain lodge stays", "Colobus monkey spotting"],
    },
  ],
  tanzania: [
    {
      id: 9,
      name: "Serengeti National Park",
      slug: "serengeti",
      image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
      description: "The iconic Serengeti hosts the Great Migration of over 1.5 million wildebeest and countless zebras across endless plains. Unmatched game viewing year-round.",
      rating: 4.9,
      bestTime: "June - October",
      duration: "4-6 days",
      startingPrice: 2500,
      highlights: ["Great Migration river crossings", "Big Five", "Seronera River valley", "Kopje lion prides", "Balloon safaris"],
    },
    {
      id: 10,
      name: "Ngorongoro Crater",
      slug: "ngorongoro",
      image: "https://i.pinimg.com/736x/cf/84/28/cf84284d13def04c4c914812cd35d269.jpg",
      description: "A UNESCO World Heritage Site and the world's largest intact volcanic caldera. The crater floor hosts an extraordinary density of wildlife including the rare black rhino.",
      rating: 4.9,
      bestTime: "June - September",
      duration: "2-3 days",
      startingPrice: 2000,
      highlights: ["Crater floor game drives", "Black rhino sightings", "Empakaai Crater views", "Maasai pastoralists", "Ol Doinyo Lengai views"],
    },
    {
      id: 11,
      name: "Mount Kilimanjaro",
      slug: "kilimanjaro",
      image: "https://i.pinimg.com/736x/b2/f4/00/b2f400bc6a7eeed46f69d6e8e3591f75.jpg",
      description: "Africa's highest peak at 5,895m, rising majestically from the plains. Climbing Kilimanjaro is a bucket-list adventure through five distinct climate zones.",
      rating: 4.8,
      bestTime: "January - March",
      duration: "6-8 days",
      startingPrice: 2800,
      highlights: ["Summit at Uhuru Peak", "Five climate zones", "Machame Route", "Shira Plateau", "Glacier views"],
    },
    {
      id: 12,
      name: "Tarangire National Park",
      slug: "tarangire",
      image: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg",
      description: "Known for its massive baobab trees and large elephant herds. The Tarangire River draws spectacular concentrations of wildlife during the dry season.",
      rating: 4.6,
      bestTime: "June - October",
      duration: "2-3 days",
      startingPrice: 1500,
      highlights: ["Baobab forests", "Elephant gathering", "Tree-climbing pythons", "Silale Swamp birds", "Maasai cultural visits"],
    },
    {
      id: 13,
      name: "Lake Manyara National Park",
      slug: "lake-manyara",
      image: "https://i.pinimg.com/736x/f9/70/19/f97019de628aac44821bd272040ce313.jpg",
      description: "Famous for tree-climbing lions and vast soda lake hosting thousands of flamingos. The groundwater forest and rift valley escarpment create breathtaking scenery.",
      rating: 4.5,
      bestTime: "June - February",
      duration: "1-2 days",
      startingPrice: 900,
      highlights: ["Tree-climbing lions", "Flamingo flocks", "Groundwater forest", "Rift Valley views", "Canoeing adventures"],
    },
    {
      id: 14,
      name: "Selous Game Reserve",
      slug: "selous",
      image: "https://i.pinimg.com/736x/04/6b/cc/046bcc76edc63cbbabec83bc7c6162a7.jpg",
      description: "Africa's largest game reserve, with pristine wilderness, boat safaris along the Rufiji River, and exceptional walking safaris. Far fewer tourists than northern parks.",
      rating: 4.7,
      bestTime: "June - October",
      duration: "3-4 days",
      startingPrice: 1900,
      highlights: ["Boat safaris", "Walking safaris", "Rufiji River hippos", "Wild dog packs", "Remote wilderness"],
    },
  ],
};

export const ALL_DESTINATIONS: Destination[] = [
  ...DESTINATIONS.kenya,
  ...DESTINATIONS.tanzania,
];

interface TourPackage {
  id: number;
  name: string;
  slug: string;
  type: string;
  image: string;
  price: number;
  priceKES?: number;
  duration: string;
  accommodation: string;
  meals: string;
  transport: string;
  activities: string[];
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
}

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: 1,
    name: "3 Days Maasai Mara Group Safari",
    slug: "maasai-mara-3-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
    price: 650,
    priceKES: 29500,
    duration: "3 Days / 2 Nights",
    accommodation: "Budget-friendly camp in Maasai Mara",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Photography", "Guided nature walks"],
    description: "Daily group joining safari in the Maasai Mara — the most affordable way to experience Kenya's premier wildlife reserve. Enjoy scenic game drives through the wilderness, spot the Big Five, and camp under the stars. High season (July to December).",
    highlights: ["Daily group joining safari", "Scenic game drives", "Big Five spotting", "Maasai Mara wilderness", "Budget-friendly"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 13,
    name: "4 Days Mara & Lake Nakuru Group Safari",
    slug: "mara-nakuru-4-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/fd/ef/a9/fdefa997b495bcc9246ad44e644be087.jpg",
    price: 780,
    priceKES: 44550,
    duration: "4 Days / 3 Nights",
    accommodation: "Budget-friendly camps in Maasai Mara & Lake Nakuru",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Lake Nakuru flamingos", "Photography"],
    description: "Extend your safari to include both the Maasai Mara and Lake Nakuru. Witness the Great Migration in the Mara and thousands of flamingos at Lake Nakuru — all on a budget-friendly daily group joining safari. High season (July to December).",
    highlights: ["Maasai Mara game drives", "Lake Nakuru flamingo viewing", "Daily group joining", "Scenic wilderness drives", "Budget-friendly"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 14,
    name: "5 Days Mara, Lake Nakuru & Naivasha Group Safari",
    slug: "mara-nakuru-naivasha-5-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg",
    price: 930,
    priceKES: 51000,
    duration: "5 Days / 4 Nights",
    accommodation: "Budget-friendly camps in Maasai Mara, Lake Nakuru & Lake Naivasha",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Lake Nakuru flamingos", "Naivasha boat ride", "Photography"],
    description: "A 5-day group safari covering three iconic Kenyan destinations: Maasai Mara, Lake Nakuru, and Lake Naivasha. Enjoy scenic game drives, boat rides, and incredible wildlife — all at an unbeatable group rate. High season (July to December).",
    highlights: ["Maasai Mara game drives", "Lake Nakuru flamingos", "Naivasha boat safari", "Scenic wilderness drives", "Budget-friendly"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 15,
    name: "6 Days Mara, Nakuru & Amboseli Group Safari",
    slug: "mara-nakuru-amboseli-6-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/0d/a3/ed/0da3eda4778cbd2bf6ea063f677a2964.jpg",
    price: 1040,
    priceKES: 62000,
    duration: "6 Days / 5 Nights",
    accommodation: "Budget-friendly camps in Maasai Mara, Lake Nakuru & Amboseli",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Lake Nakuru flamingos", "Amboseli elephant herds", "Photography"],
    description: "Experience Kenya's greatest safari circuit on a budget-friendly group tour. From the Maasai Mara to Lake Nakuru and Amboseli beneath Mount Kilimanjaro — this 6-day journey delivers incredible wildlife and scenery. High season (July to December).",
    highlights: ["Maasai Mara wilderness", "Lake Nakuru flamingos", "Amboseli & Kilimanjaro views", "Scenic game drives", "Budget-friendly"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 16,
    name: "7 Days Mara, Nakuru, Naivasha & Amboseli Group Safari",
    slug: "mara-nakuru-naivasha-amboseli-7-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/21/2b/24/212b2433f246414a170ec177d76168f2.jpg",
    price: 1170,
    priceKES: 72500,
    duration: "7 Days / 6 Nights",
    accommodation: "Budget-friendly camps across Maasai Mara, Lake Nakuru, Lake Naivasha & Amboseli",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Lake Nakuru flamingos", "Naivasha boat ride", "Amboseli elephant herds", "Photography"],
    description: "The ultimate 7-day group safari covering Kenya's four most iconic destinations. Traverse the Maasai Mara, Lake Nakuru, Lake Naivasha, and Amboseli — with scenic game drives, boat safaris, and breathtaking landscapes throughout. High season (July to December).",
    highlights: ["Maasai Mara game drives", "Lake Nakuru flamingos", "Naivasha boat safari", "Amboseli & Kilimanjaro", "Scenic wilderness drives"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 17,
    name: "8 Days Mara, Nakuru, Naivasha & Amboseli Group Safari",
    slug: "mara-nakuru-naivasha-amboseli-8-days-group",
    type: "group",
    image: "https://i.pinimg.com/736x/f5/e3/99/f5e3997c40125ec8b26b9e3687de6d36.jpg",
    price: 1450,
    priceKES: 83000,
    duration: "8 Days / 7 Nights",
    accommodation: "3 nights Mara, 1 night Nakuru, 1 night Naivasha, 2 nights Amboseli",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Scenic game drive through the wilderness", "Lake Nakuru flamingos", "Naivasha boat ride", "Amboseli elephant herds", "Photography"],
    description: "The most comprehensive budget-friendly group safari covering Kenya's top four destinations with extended stays. Enjoy 3 nights in the Maasai Mara for maximum game viewing, plus Lake Nakuru, Lake Naivasha, and 2 nights in Amboseli. High season (July to December).",
    highlights: ["3 nights in Maasai Mara", "Lake Nakuru flamingos", "Naivasha boat safari", "2 nights Amboseli", "Complete Kenya circuit"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Budget-friendly accommodation",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 2,
    name: "7 Days Ultimate Kenya Safari",
    slug: "ultimate-kenya-safari",
    type: "luxury",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
    price: 3919,
    priceKES: 473000,
    duration: "7 Days / 6 Nights",
    accommodation: "Maasai Mara - Mara Sopa | L. Nakuru - Lake Nakuru Lodge | L. Naivasha - Naivasha Sopa | Amboseli - Penety Resort",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Great Migration viewing", "Lake Nakuru flamingos", "Naivasha boat ride", "Amboseli elephant herds", "Maasai cultural visit"],
    description: "Experience Kenya's finest safari circuit covering Masai Mara, Lake Nakuru, Lake Naivasha, and Amboseli. From the Great Migration to iconic elephant herds beneath Kilimanjaro, this is the complete Kenyan safari experience.",
    highlights: ["Masai Mara game drives", "Lake Nakuru flamingos", "Naivasha hippo boat ride", "Amboseli & Kilimanjaro views", "Maasai cultural experience"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "6 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit, nature walks)",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
      "Travel insurance",
      "Anything not mentioned under inclusions",
    ],
  },
  {
    id: 3,
    name: "6 Days Tanzania Northern Circuit Safari",
    slug: "tanzania-northern-circuit",
    type: "safari",
    image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
    price: 2800,
    duration: "6 Days / 5 Nights",
    accommodation: "Tarangire - Ngare Lodge | Manyara - Kankari | Serengeti - Engiterata Adventure Camp | Ngorongoro - Ngorongoro Wild Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Ngorongoro Crater tour", "Serengeti migration viewing", "Tarangire baobabs", "Manyara tree-climbing lions", "Birdwatching"],
    description: "Explore Tanzania's legendary Northern Circuit through Tarangire, Lake Manyara, Serengeti, and the Ngorongoro Crater. Witness the Great Migration, descend into the Crater, and discover diverse wildlife across four iconic destinations.",
    highlights: ["Serengeti Great Migration", "Ngorongoro Crater descent", "Tarangire baobab trees", "Manyara tree-climbing lions", "Lake Manyara flamingos"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "5 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit, nature walks)",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
      "Travel insurance",
      "Anything not mentioned under inclusions",
    ],
  },
  {
    id: 4,
    name: "Kenya & Tanzania Combo Package",
    slug: "kenya-tanzania-combo",
    type: "safari",
    image: "https://i.pinimg.com/736x/0d/a3/ed/0da3eda4778cbd2bf6ea063f677a2964.jpg",
    price: 5500,
    duration: "12 Days / 11 Nights",
    accommodation: "Maasai Mara - Jambo Mara Lodge | L. Nakuru - Sarova Woodlands | L. Naivasha - Lake Naivasha Resort | Amboseli - Amboseli Sopa Lodge | Arusha - Tulia Boutique | Tarangire - Ngare Lodge | Manyara - Kankari | Serengeti - Engiterata Adventure Camp | Ngorongoro - Ngorongoro Wild Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Great Migration viewing", "Ngorongoro Crater tour", "Lake Naivasha boat ride", "Balloon safari", "Cultural visits"],
    description: "The ultimate cross-border East African safari combining Kenya and Tanzania's greatest parks and reserves. From the Masai Mara to the Serengeti, from Amboseli's elephants beneath Kilimanjaro to the Ngorongoro Crater — this is the definitive East African adventure.",
    highlights: ["Masai Mara & Serengeti migration", "Ngorongoro Crater", "Amboseli & Kilimanjaro", "Lake Naivasha hippos", "Cross-border safari experience"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "11 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
      "Kenya and Tanzania visa",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit, nature walks)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
      "Travel insurance",
      "Anything not mentioned under inclusions",
    ],
  },
  {
    id: 5,
    name: "Amboseli Tsavo Gateway Luxury Safari",
    slug: "amboseli-tsavo-gateway",
    type: "luxury",
    image: "https://images.unsplash.com/photo-1670349202857-f4615ee3c977?q=80&w=1080",
    price: 2100,
    priceKES: 264000,
    duration: "5 Days / 4 Nights",
    accommodation: "Amboseli - Penety Resort | Tsavo East - Voi Safari Lodge | Tsavo West - Ngulia Safari Lodge",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Game drives", "Amboseli elephant herds", "Tsavo red elephants", "Photography", "Guided nature walks"],
    description: "Experience Kenya's most spectacular southern safari circuit in luxury and comfort. From Amboseli's legendary elephant herds beneath the majestic Mount Kilimanjaro to the iconic red elephants of Tsavo, this 5-day gateway safari combines world-class game viewing with premium lodge accommodation. Price: $2,400 USD per person sharing.",
    highlights: ["Amboseli & Mount Kilimanjaro views", "Tsavo East red elephants", "Tsavo West Mzima Springs", "Lugard Falls", "Premium lodge accommodation"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "4 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit, nature walks)",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
      "Travel insurance",
      "Anything not mentioned under inclusions",
      "Amboseli National Park entrance fees",
    ],
  },
  {
    id: 6,
    name: "Hells Gate & Lake Naivasha Luxury Safari",
    slug: "hells-gate-naivasha",
    type: "luxury",
    image: "https://i.pinimg.com/1200x/a9/97/b2/a997b2816cf63d1fb82c4e27d2ae02ed.jpg",
    price: 900,
    priceKES: 97000,
    duration: "2 Days / 1 Night",
    accommodation: "Lake Naivasha Sopa Resort or similar",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Cycling safari", "Hiking through gorges", "Lake Naivasha boat ride", "Crescent Island walking safari", "Birdwatching", "Photography"],
    description: "Discover the dramatic beauty of Hells Gate National Park in style — cycle among zebras and giraffes against towering cliffs and volcanic gorges, then retreat to the tranquil shores of Lake Naivasha for a luxury lakeside stay. Hike Fischer's Tower, explore geothermal steam plumes, and enjoy a sunset boat ride spotting hippos. Price: $320 USD per person sharing.",
    highlights: ["Cycling through wildlife", "Fischer's Tower hike", "Gorge walking", "Lake Naivasha luxury boat safari", "Crescent Island walking safari"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "1 night accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park entrance fees",
      "Bicycle hire at Hells Gate",
      "Lake Naivasha boat ride",
      "Bottled drinking water during the tour",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
      "Travel insurance",
      "Anything not mentioned under inclusions",
    ],
  },
  {
    id: 7,
    name: "3 Days Mount Kenya Trekking Adventure",
    slug: "mount-kenya-trekking-3-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/12/e4/0e/12e40e23d242acb64f74c7aebec11fc2.jpg",
    price: 1200,
    duration: "3 Days / 2 Nights",
    accommodation: "Old Moses Camp & Shipton's Hut",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private shuttle from Nairobi",
    activities: ["Mountain trekking", "Summit Point Lenana", "Wildlife viewing", "Birdwatching", "Photography"],
    description: "Conquer Africa's second-highest mountain on this 3-day Mount Kenya trekking adventure via the scenic Sirimon Route. Traverse lush forests, alpine meadows, and dramatic valleys, ending with a sunrise summit at Point Lenana (4,985m) — an unforgettable moment above the clouds.",
    highlights: ["Sunrise summit at Point Lenana (4,985m)", "Sirimon Route", "Mackinder Valley views", "Giant lobelia and groundsel", "Equator crossing"],
    included: [
      "Expert mountain guides throughout the trek",
      "Support from porters during the climb",
      "Airport pick-up and transfer arrangements",
      "Professional driver-guide",
      "Game drives as outlined (where applicable)",
    ],
    excluded: [
      "Personal attire and individual climbing gear",
      "Optional tips for guides and porters",
      "Beverages and drinks not included on the trek",
    ],
  },
  {
    id: 8,
    name: "4 Days Mount Kenya Trek: Lake Rutundu – Lake Alice – Lake Ellis",
    slug: "mount-kenya-lakes-trek-4-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/ba/bb/5c/babb5cc8d6dcd417d9d13bd97ea3af74.jpg",
    price: 1500,
    duration: "4 Days / 3 Nights",
    accommodation: "Campsites at Lake Rutundu, Lake Alice & Lake Ellis",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private 4x4 from Nanyuki",
    activities: ["Lake trekking", "Alpine hiking", "Birdwatching", "Photography", "Nature walks"],
    description: "Embark on an unforgettable 4-day Mount Kenya trekking adventure exploring the tranquil alpine lakes of Rutundu, Alice, and Ellis. Journey through rugged highlands, peaceful forest trails, and breathtaking mountain landscapes with expert local guides.",
    highlights: ["Lake Rutundu scenic hike", "Lake Alice crater lake", "Lake Ellis panoramic views", "Mugi Hill viewpoint", "Nithi Waterfall"],
    included: [
      "Airport pick-up and drop-off services",
      "Accommodation in mountain huts or campsites",
      "All meals during the trek",
      "Professional guiding services",
      "Transfers to and from the mountain",
      "Porter assistance",
      "Park entry fees",
    ],
    excluded: [
      "Personal hiking apparel and gear",
      "Tips for guides and porters",
      "Drinks not provided on the mountain",
    ],
  },
  {
    id: 9,
    name: "5 Days Mount Kenya Trek – Sirimon Up, Chogoria Down",
    slug: "mount-kenka-sirimon-chogoria-5-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/54/b5/2b/54b52beffeaf61266a2c770869472c2d.jpg",
    price: 1800,
    duration: "5 Days / 4 Nights",
    accommodation: "Old Moses Camp, Shipton's Camp & Mt. Kenya Bandas",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private shuttle from Nairobi",
    activities: ["Mountain trekking", "Summit Point Lenana", "Gorges Valley descent", "Wildlife viewing", "Photography"],
    description: "Combine two of Mount Kenya's most scenic routes — Sirimon and Chogoria — for a diverse and breathtaking climbing experience. Ascend via the drier western side and descend through lush bamboo forests, waterfalls, and stunning valleys. Summit Point Lenana (4,985m) at sunrise.",
    highlights: ["Sirimon & Chogoria routes combined", "Summit Point Lenana sunrise", "Gorges Valley views", "Lake Michaelson", "Mount Kenya Bandas"],
    included: [
      "Airport transfers for arrival and departure",
      "Transportation according to the itinerary",
      "Accommodation as listed in the itinerary",
      "Meals as indicated (B = Breakfast, L = Lunch, D = Dinner)",
    ],
    excluded: [
      "Personal hiking gear and clothing",
      "Gratuities for guides and porters",
      "Beverages not provided on the mountain",
    ],
  },
  {
    id: 10,
    name: "4 Days Masai Mara Luxury Safari",
    slug: "masai-mara-luxury-safari-4-days",
    type: "luxury",
    image: "https://i.pinimg.com/736x/ed/5e/84/ed5e84d0bc072559589602eedc7fec09.jpg",
    price: 2800,
    duration: "4 Days / 3 Nights",
    accommodation: "&Beyond Kichwa Tembo Tented Camp / Mara Bush Tops Luxury Camp / PrideInn Mara Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Big Five game drives", "Sundowners", "Bush breakfast", "Photography", "Wildlife viewing"],
    description: "Experience the Masai Mara in uncompromised luxury. Stay at &Beyond Kichwa Tembo Tented Camp or equivalent, set on a private concession overlooking the Mara plains. Enjoy premium service, gourmet dining, and exceptional game viewing.",
    highlights: ["Private concession game drives", "Choice of top luxury camps", "Mara River views", "Big Five sightings", "All-inclusive service"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "3 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
      "Kenya visa",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit, nature walks)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 12,
    name: "Tanzania Luxury Safari – Serengeti & Ngorongoro",
    slug: "tanzania-luxury-serengeti-ngorongoro",
    type: "luxury",
    image: "https://i.pinimg.com/736x/bc/e3/6f/bce36f5f91a9170667cbbaeaa9b8ea52.jpg",
    price: 2000,
    duration: "4 Days / 3 Nights",
    accommodation: "Serengeti - Mayo Luxury Camp / Serengeti Serena Safari Lodge | Ngorongoro - Acacia Farm Lodge / Ngorongoro Serena Lodge",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Custom safari tour 4x4 Land Cruiser",
    activities: ["Serengeti game drives", "Ngorongoro Crater descent", "Big Five", "Photography", "Sundowners"],
    description: "Discover Tanzania's finest wildlife destinations in luxury. Explore the endless plains of the Serengeti, descend into the Ngorongoro Crater — the world's largest intact caldera — and stay at premium lodges with world-class service.",
    highlights: ["Serengeti Great Migration", "Ngorongoro Crater floor", "Big Five sightings", "Premium luxury lodges", "Tanzania visa included"],
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "3 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
      "Tanzania visa",
    ],
    excluded: [
      "International and domestic flights",
      "Drinks (alcoholic & soft drinks)",
      "Optional activities (Maasai village visit)",
      "Hot air balloon safari",
      "Tips and gratuities",
      "Personal expenses (laundry, souvenirs, phone calls)",
    ],
  },
  {
    id: 11,
    name: "6 Days Machame Route – Mount Kilimanjaro Trekking Adventure",
    slug: "kilimanjaro-machame-6-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
    price: 2000,
    duration: "6 Days / 5 Nights",
    accommodation: "Mountain camps: Machame, Shira, Barranco, Barafu, Mweka",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private shuttle from Arusha to Machame Gate",
    activities: ["Mountain trekking", "Rainforest hiking", "Summit Uhuru Peak", "Glacier views", "Wildlife spotting"],
    description: "The 6 Days Machame Route — known as the Whiskey Route — is one of the most scenic and popular ways to climb Mount Kilimanjaro. Traverse lush rainforest, alpine desert, and icy glaciers on your way to Uhuru Peak (5,895m), the highest point in Africa.",
    highlights: ["Summit Uhuru Peak (5,895m)", "Machame scenic trail", "Shira Plateau views", "Lava Tower acclimatization", "Barranco Wall scramble"],
    included: [
      "Round-trip transport from Arusha to Kilimanjaro",
      "Licensed and experienced mountain guides",
      "Porters and professional cook",
      "Park entrance, camping, and rescue fees",
      "All meals during the trek (Breakfast, Lunch, Dinner)",
      "Accommodation in mountain camps",
      "Boiled drinking water daily",
      "Certificate of Achievement",
    ],
    excluded: [
      "Personal trekking gear (sleeping bag, hiking poles, etc.)",
      "Travel or medical insurance",
      "Tips for guides, porters, and cook",
      "Alcoholic and soft drinks",
      "Optional activities before or after the trek",
    ],
  },
  {
    id: 12,
    name: "7 Days Mount Kilimanjaro Trek – Machame Route",
    slug: "kilimanjaro-machame-7-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg",
    price: 2300,
    duration: "7 Days / 6 Nights",
    accommodation: "Mountain camps: Machame, Shira, Barranco, Karanga, Barafu, Mweka",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private shuttle from Arusha to Machame Gate",
    activities: ["Mountain trekking", "Rainforest hiking", "Summit Uhuru Peak", "Barranco Wall climb", "Photography"],
    description: "The Machame Route, famously called the Whiskey Route, is one of the most scenic and successful paths to the summit of Mount Kilimanjaro (5,895m). Over seven days, journey through lush rainforest, vast moorlands, and alpine desert before standing atop Uhuru Peak.",
    highlights: ["Uhuru Peak summit (5,895m)", "Barranco Wall", "Shira Plateau crossing", "Lava Tower (4,600m)", "Stella Point sunrise"],
    included: [
      "Round-trip transport between Arusha & Kilimanjaro",
      "All park entry, camping, and rescue fees",
      "Professional guides, cook, and porters",
      "Accommodation in mountain camps",
      "All meals (B, L, D) + clean drinking water",
      "Certificate of Achievement",
    ],
    excluded: [
      "Personal climbing gear (boots, sleeping bag, etc.)",
      "Tips for guides and porters",
      "Travel & medical insurance",
      "Drinks and personal expenses",
    ],
  },
  {
    id: 13,
    name: "8 Days Kilimanjaro Climb via Lemosho Route",
    slug: "kilimanjaro-lemosho-8-days",
    type: "mountain",
    image: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg",
    price: 2800,
    duration: "8 Days / 7 Nights",
    accommodation: "Hotel in Arusha + mountain camps: Mti Mkubwa, Shira, Barranco, Karanga, Barafu, Mweka",
    meals: "Full board (breakfast, lunch & dinner)",
    transport: "Private airport transfer + shuttle to trailhead",
    activities: ["Mountain trekking", "Rainforest hiking", "Summit Uhuru Peak", "Alpine photography", "Wildlife viewing"],
    description: "The 8 Days Kilimanjaro Climb via the Lemosho Route is the most scenic and rewarding way to reach Uhuru Peak. Beginning on the quieter western slopes, this route leads through montane forests, across the vast Shira Plateau, and past Lava Tower to the Roof of Africa.",
    highlights: ["Highest summit success rate route", "Shira Plateau crossing", "Lava Tower acclimatization", "Barranco Wall", "Uhuru Peak sunrise (5,895m)"],
    included: [
      "All park fees & government taxes",
      "Professional English-speaking mountain guides, cook & porters",
      "Full-board meals on the mountain",
      "Accommodation in tents as per itinerary",
      "Drinking water & rescue fees",
      "Airport transfers (Arrival & Departure)",
    ],
    excluded: [
      "International flights",
      "Tanzania visa fees",
      "Personal climbing gear & clothing",
      "Travel insurance & medical coverage",
      "Tips for guides & porters",
      "Extra meals & beverages not listed",
    ],
  },
];

interface BeachDestination {
  id: number;
  name: string;
  image: string;
  description: string;
  rating: number;
  price: number;
  duration: string;
  accommodation: string;
  highlights: string[];
  location: string;
}

export const BEACH_DESTINATIONS: BeachDestination[] = [
  {
    id: 1,
    name: "Diani Beach",
    image: "https://i.pinimg.com/736x/d6/38/6b/d6386bfb23f6e51f7d020e0e4546def5.jpg",
    description: "Kenya's premier beach destination with 17km of powdery white sand, turquoise waters, and lush tropical vegetation. Rated among Africa's best beaches.",
    rating: 4.9,
    price: 2200,
    duration: "5 Days / 4 Nights",
    accommodation: "Almanara Luxury Resort or similar",
    highlights: ["White sand beaches", "Coral reefs", "Kite surfing", "Deep-sea fishing", "Colobus monkeys"],
    location: "South Coast, Kenya",
  },
  {
    id: 2,
    name: "Zanzibar Island",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    description: "The Spice Island offers crystal-clear waters, historic Stone Town, and pristine beaches like Nungwi and Kendwa. A perfect cultural-beach fusion.",
    rating: 4.8,
    price: 2500,
    duration: "6 Days / 5 Nights",
    accommodation: "Zuri Zanzibar or similar",
    highlights: ["Stone Town UNESCO", "Spice plantations", "Mnemba Atoll", "Sunset dhow cruises", "Prison Island"],
    location: "Zanzibar, Tanzania",
  },
  {
    id: 3,
    name: "Watamu Marine Park",
    image: "https://i.pinimg.com/736x/56/3f/b5/563fb5f6b888c428e9063ed8bfb86128.jpg",
    description: "A protected marine reserve with pristine coral gardens, sea turtles, and the famous Mida Creek. One of Kenya's best snorkeling destinations.",
    rating: 4.7,
    price: 1800,
    duration: "4 Days / 3 Nights",
    accommodation: "Watamu Treehouse or similar",
    highlights: ["Coral gardens", "Sea turtles", "Mida Creek", "Snorkeling", "Birdwatching"],
    location: "North Coast, Kenya",
  },
  {
    id: 4,
    name: "Mombasa North Coast",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    description: "Vibrant beach resorts along Nyali, Bamburi, and Shanzu beaches. Close to Mombasa's historic Old Town and Fort Jesus with excellent water sports.",
    rating: 4.6,
    price: 1600,
    duration: "4 Days / 3 Nights",
    accommodation: "PrideInn Paradise Beach Resort or similar",
    highlights: ["Water sports", "Fort Jesus", "Haller Park", "Nightlife", "Beach resorts"],
    location: "Mombasa, Kenya",
  },
  {
    id: 5,
    name: "Malindi & Watamu",
    image: "https://i.pinimg.com/736x/56/3f/b5/563fb5f6b888c428e9063ed8bfb86128.jpg",
    description: "Historic Swahili town with Italian flair, offering beautiful beaches, the Malindi Marine Park, and the stunning Arabuko Sokoke Forest.",
    rating: 4.5,
    price: 1700,
    duration: "5 Days / 4 Nights",
    accommodation: "Malaika Beach Resort or similar",
    highlights: ["Malindi Marine Park", "Vasco da Gama pillar", "Arabuko Sokoke", "Italian cuisine", "Deep-sea fishing"],
    location: "Malindi, Kenya",
  },
  {
    id: 6,
    name: "Lamu Archipelago",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    description: "A UNESCO World Heritage Site, Lamu is Kenya's oldest living town with winding streets, dhows, and car-free tranquility. Shela Beach is world-class.",
    rating: 4.8,
    price: 2600,
    duration: "5 Days / 4 Nights",
    accommodation: "Peponi Hotel or The Majlis",
    highlights: ["Lamu Old Town", "Dhow safaris", "Shela Beach", "Swahili culture", "Lamo Fort"],
    location: "Lamu, Kenya",
  },
  {
    id: 7,
    name: "Pemba Island",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    description: "Zanzibar's quieter sister island with lush green hills, clove plantations, and world-class diving at the Pemba Channel. Undiscovered paradise.",
    rating: 4.7,
    price: 2300,
    duration: "5 Days / 4 Nights",
    accommodation: "The Manta Resort or similar",
    highlights: ["Pemba Channel diving", "Clove plantations", "Misali Island", "Snorkeling", "Remote beaches"],
    location: "Pemba, Tanzania",
  },
  {
    id: 8,
    name: "Mafia Island",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    description: "Tanzania's best-kept secret with the Mafia Island Marine Park, whale sharks, and untouched coral reefs. A diver's paradise.",
    rating: 4.6,
    price: 2400,
    duration: "6 Days / 5 Nights",
    accommodation: "Mafia Island Lodge or Kinasi Lodge",
    highlights: ["Whale shark snorkeling", "Mafia Marine Park", "Chole Bay", "Deep-sea fishing", "Eco-lodges"],
    location: "Mafia, Tanzania",
  },
];

interface Experience {
  id: number;
  name: string;
  icon: string;
  description: string;
  image: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    name: "Hot Air Balloon Safari",
    icon: "Sunrise",
    description: "Float silently over the Mara at dawn, witnessing the savannah come alive from above. End with a champagne bush breakfast.",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
  },
  {
    id: 2,
    name: "Bush Dining Under the Stars",
    icon: "Utensils",
    description: "Candlelit gourmet dinners in the wilderness with the sounds of the African bush as your soundtrack.",
    image: "https://i.pinimg.com/736x/d2/1f/86/d21f86305bc5df0128814c1a93b7515a.jpg",
  },
  {
    id: 3,
    name: "Walking Safaris",
    icon: "Compass",
    description: "Explore the bush on foot with armed guides, learning tracking skills and discovering the small wonders of the ecosystem.",
    image: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg",
  },
  {
    id: 4,
    name: "Horseback Safaris",
    icon: "Wind",
    description: "Ride alongside zebras and giraffes on private conservancies in Laikipia, an unforgettable equestrian adventure.",
    image: "https://i.pinimg.com/736x/02/86/22/02862248476996fc5de9e9aff97979ad.jpg",
  },
  {
    id: 5,
    name: "Dhow Sunset Cruises",
    icon: "Ship",
    description: "Sail along the Indian Ocean coast on traditional dhows, watching the sun dip below the horizon.",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
  },
  {
    id: 6,
    name: "Maasai Village Visits",
    icon: "Users",
    description: "Immerse yourself in Maasai culture with village walks, traditional dances, and beadwork workshops.",
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
  },
  {
    id: 7,
    name: "Mountain Trekking",
    icon: "Mountain",
    description: "Summit Africa's highest peaks with expert guides, from Kilimanjaro to Mount Kenya.",
    image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg",
  },
  {
    id: 8,
    name: "Photography Safaris",
    icon: "Camera",
    description: "Dedicated photographic expeditions with professional guides who know animal behavior and the best lighting.",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
  },
  {
    id: 9,
    name: "Spice Tours",
    icon: "Coffee",
    description: "Explore Zanzibar's spice farms, tasting fresh vanilla, cloves, nutmeg, and learning centuries-old trade secrets.",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
  },
  {
    id: 10,
    name: "Conservation Experiences",
    icon: "TreePine",
    description: "Visit rhino sanctuaries, elephant orphanages, and participate in conservation activities with wildlife experts.",
    image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
  },
];

interface WhyChooseUs {
  id: number;
  icon: string;
  title: string;
  description: string;
}

export const WHY_CHOOSE_US: WhyChooseUs[] = [
  {
    id: 1,
    icon: "Shield",
    title: "Safe & Secure Travel",
    description: "Your safety is our priority. We partner with vetted operators, provide comprehensive travel insurance, and maintain 24/7 support throughout your journey.",
  },
  {
    id: 2,
    icon: "Award",
    title: "Award-Winning Service",
    description: "Recognized as Kenya's Leading Tour Operator 2024, with over 2,000 five-star reviews. Our commitment to excellence is unmatched.",
  },
  {
    id: 3,
    icon: "Users",
    title: "Expert Local Guides",
    description: "Our guides are passionate wildlife experts, naturalists, and cultural ambassadors with years of field experience and deep local knowledge.",
  },
  {
    id: 4,
    icon: "Heart",
    title: "Sustainable Tourism",
    description: "We are committed to responsible travel. We support conservation projects, employ local communities, and operate with minimal environmental impact.",
  },
  {
    id: 5,
    icon: "Package",
    title: "Bespoke Itineraries",
    description: "Every traveler is unique. We craft personalized itineraries tailored to your interests, budget, and travel style.",
  },
  {
    id: 6,
    icon: "HeadphonesIcon",
    title: "24/7 Concierge Support",
    description: "From booking to return, our concierge team is available around the clock to assist with any questions or needs.",
  },
  {
    id: 7,
    icon: "Car",
    title: "Premium Fleet",
    description: "Travel in comfort with our modern fleet of 4x4 Land Cruisers, equipped with Wi-Fi, charging ports, and refreshments.",
  },
  {
    id: 8,
    icon: "MapPin",
    title: "Off-the-Beaten-Path",
    description: "We take you beyond the standard tourist routes to hidden gems and authentic experiences most travelers never see.",
  },
];

interface Statistic {
  icon: string;
  value: string;
  label: string;
}

export const STATISTICS: Statistic[] = [
  { icon: "Users", value: "15,000+", label: "Happy Travelers" },
  { icon: "MapPin", value: "50+", label: "Destinations" },
  { icon: "Star", value: "2,000+", label: "5-Star Reviews" },
  { icon: "Award", value: "15+", label: "Years Experience" },
  { icon: "Car", value: "25+", label: "Safari Vehicles" },
  { icon: "Globe", value: "95%", label: "Client Satisfaction" },
  { icon: "Hotel", value: "200+", label: "Partner Lodges" },
  { icon: "Heart", value: "12", label: "Conservation Projects" },
];

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "London, UK",
    image: "https://i.pinimg.com/736x/14/4b/48/144b48e269001cb629981818a2106848.jpg",
    rating: 5,
    text: "The trip of a lifetime! Ready Set Go organized an incredible 10-day safari across Kenya and Tanzania. Our guide David was phenomenal - his knowledge of wildlife and ability to spot animals was extraordinary. The Great Migration river crossing we witnessed will stay with us forever.",
    date: "August 2024",
  },
  {
    id: 2,
    name: "James & Emily Chen",
    location: "Sydney, Australia",
    image: "https://i.pinimg.com/736x/18/5e/68/185e68ec47122de363158cdbf26d66cd.jpg",
    rating: 5,
    text: "We booked our honeymoon with Ready Set Go and it exceeded every expectation. From a private dinner in the Masai Mara to a luxurious beach villa in Diani, every detail was perfect. The team handled everything so we could just relax and enjoy.",
    date: "March 2024",
  },
  {
    id: 3,
    name: "Michael O'Brien",
    location: "New York, USA",
    image: "https://i.pinimg.com/736x/79/54/21/7954216e62016c2b0b95a2df26561c7d.jpg",
    rating: 5,
    text: "Climbing Kilimanjaro was the hardest thing I've ever done, but Ready Set Go's team made it achievable. The guides were experienced, encouraging, and safety-focused. Reaching Uhuru Peak at sunrise was the most emotional moment of my life.",
    date: "January 2024",
  },
  {
    id: 4,
    name: "Amara Osei",
    location: "Accra, Ghana",
    image: "https://i.pinimg.com/736x/6f/f7/17/6ff71747e4a30f06691bfd86cb1345c5.jpg",
    rating: 5,
    text: "As a solo female traveler, I was a bit nervous, but the team made me feel completely safe and welcome. The Maasai cultural immersion was a highlight - staying in the village, learning beadwork, and dancing with the women was magical.",
    date: "June 2024",
  },
  {
    id: 5,
    name: "Robert & Linda Anderson",
    location: "Stockholm, Sweden",
    image: "https://i.pinimg.com/736x/dc/a3/da/dca3da8b3f2e450bfa03ea1e601084f4.jpg",
    rating: 5,
    text: "This was our third safari in Africa and by far the best. Ready Set Go arranged exclusive access to private conservancies in Laikipia where we saw wild dogs hunting and slept under the stars on a fly-camp. Absolutely magical.",
    date: "September 2024",
  },
  {
    id: 6,
    name: "Priya Sharma",
    location: "Mumbai, India",
    image: "https://i.pinimg.com/736x/14/4b/48/144b48e269001cb629981818a2106848.jpg",
    rating: 5,
    text: "The photography safari was amazing! Our guide knew exactly where to position the vehicle for the best light, and we got incredible shots of lions, cheetahs, and even a leopard with her cub. A photographer's dream come true.",
    date: "November 2023",
  },
  {
    id: 7,
    name: "Thomas Wagner",
    location: "Berlin, Germany",
    image: "https://i.pinimg.com/736x/41/d1/e5/41d1e5c78d1b73924f0c9c65172d96c8.jpg",
    rating: 5,
    text: "I've traveled to over 40 countries, but Kenya stole my heart. Ready Set Go organized everything flawlessly - from airport pickup to daily game drives. The bush breakfast in Amboseli with Kilimanjaro in the background was surreal.",
    date: "February 2024",
  },
  {
    id: 8,
    name: "Olivia & Jack Thompson",
    location: "Toronto, Canada",
    image: "https://i.pinimg.com/736x/79/54/21/7954216e62016c2b0b95a2df26561c7d.jpg",
    rating: 5,
    text: "Our family of five (kids aged 8-14) had the most amazing time. Ready Set Go catered perfectly to our children, with special game drive kits, junior ranger programs, and a kid-friendly guide who made wildlife fun and educational.",
    date: "July 2024",
  },
  {
    id: 9,
    name: "Fatima Al-Rashid",
    location: "Dubai, UAE",
    image: "https://i.pinimg.com/736x/dc/a3/da/dca3da8b3f2e450bfa03ea1e601084f4.jpg",
    rating: 5,
    text: "The luxury Zanzibar package was pure perfection. Our private villa had a plunge pool overlooking the ocean, the spice tour was fascinating, and the dhow sunset cruise was romantic beyond words. We are already planning our return.",
    date: "October 2024",
  },
  {
    id: 10,
    name: "David Kim",
    location: "Seoul, South Korea",
    image: "https://i.pinimg.com/736x/41/d1/e5/41d1e5c78d1b73924f0c9c65172d96c8.jpg",
    rating: 5,
    text: "From the first email to the farewell airport transfer, the service was impeccable. I made a last-minute change to my itinerary and they accommodated it without any hassle. The Mara balloon safari is worth every penny.",
    date: "April 2024",
  },
];

interface GalleryCategory {
  categories: string[];
  images: {
    id: number;
    src: string;
    alt: string;
    category: string;
    width: number;
    height: number;
  }[];
}

export const GALLERY: GalleryCategory = {
  categories: ["All", "Safari", "Beach", "Luxury", "Wildlife", "Landscape", "Mountain", "Group"],
  images: [
    { id: 1, src: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg", alt: "Daily group joining safari in the Maasai Mara — affordable wildlife experience", category: "Safari", width: 800, height: 600 },
    { id: 2, src: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg", alt: "Ultimate Kenya safari covering Masai Mara, Lake Nakuru, Lake Naivasha, and Amboseli", category: "Safari", width: 800, height: 600 },
    { id: 3, src: "https://i.pinimg.com/736x/fd/ef/a9/fdefa997b495bcc9246ad44e644be087.jpg", alt: "Group safari to Maasai Mara and Lake Nakuru with Great Migration views", category: "Group", width: 800, height: 600 },
    { id: 4, src: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg", alt: "Tanzania Northern Circuit through Tarangire, Lake Manyara, Serengeti, and Ngorongoro", category: "Wildlife", width: 800, height: 600 },
    { id: 5, src: "https://i.pinimg.com/736x/0d/a3/ed/0da3eda4778cbd2bf6ea063f677a2964.jpg", alt: "Cross-border East African safari combining Kenya and Tanzania's greatest parks", category: "Safari", width: 800, height: 600 },
    { id: 6, src: "https://images.unsplash.com/photo-1670349202857-f4615ee3c977?q=80&w=1080", alt: "Amboseli Tsavo southern safari circuit with red elephants and Kilimanjaro views", category: "Wildlife", width: 800, height: 600 },
    { id: 7, src: "https://i.pinimg.com/1200x/a9/97/b2/a997b2816cf63d1fb82c4e27d2ae02ed.jpg", alt: "Hells Gate National Park cycling among zebras and giraffes against towering cliffs", category: "Safari", width: 800, height: 600 },
    { id: 8, src: "https://i.pinimg.com/736x/ed/5e/84/ed5e84d0bc072559589602eedc7fec09.jpg", alt: "Masai Mara luxury safari at &Beyond Kichwa Tembo Tented Camp", category: "Luxury", width: 800, height: 600 },
    { id: 9, src: "https://i.pinimg.com/736x/bc/e3/6f/bce36f5f91a9170667cbbaeaa9b8ea52.jpg", alt: "Serengeti and Ngorongoro Crater luxury safari in Tanzania", category: "Luxury", width: 800, height: 600 },
    { id: 10, src: "https://i.pinimg.com/736x/12/e4/0e/12e40e23d242acb64f74c7aebec11fc2.jpg", alt: "Mount Kenya trekking adventure via Sirimon Route to Point Lenana summit", category: "Mountain", width: 800, height: 600 },
    { id: 11, src: "https://i.pinimg.com/736x/54/b5/2b/54b52beffeaf61266a2c770869472c2d.jpg", alt: "Mount Kenya Sirimon Up and Chogoria Down trek combining two scenic routes", category: "Mountain", width: 800, height: 600 },
    { id: 12, src: "https://i.pinimg.com/736x/ba/bb/5c/babb5cc8d6dcd417d9d13bd97ea3af74.jpg", alt: "Mount Kenya alpine lakes trek visiting Lakes Rutundu, Alice, and Ellis", category: "Landscape", width: 800, height: 600 },
    { id: 13, src: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg", alt: "Kilimanjaro Lemosho Route — the most scenic climb to Uhuru Peak", category: "Mountain", width: 800, height: 600 },
    { id: 14, src: "https://i.pinimg.com/736x/e4/d5/7f/e4d57f9f504d405977711abd9469c591.jpg", alt: "Romantic safari and beach escape with private game drives in Masai Mara", category: "Luxury", width: 800, height: 600 },
    { id: 15, src: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg", alt: "Zanzibar honeymoon with turquoise waters, spice tours, and beach villas", category: "Beach", width: 800, height: 600 },
    { id: 16, src: "https://i.pinimg.com/736x/fb/fe/cc/fbfecc1741f23134a323bbc5bf57c414.jpg", alt: "Diani Beach honeymoon with dolphin spotting and Kisite Marine Park snorkeling", category: "Beach", width: 800, height: 600 },
    { id: 17, src: "https://i.pinimg.com/736x/b2/f4/00/b2f400bc6a7eeed46f69d6e8e3591f75.jpg", alt: "Zanzibar beach paradise with powder-white sand and turquoise waters", category: "Beach", width: 800, height: 600 },
    { id: 18, src: "https://i.pinimg.com/736x/d6/38/6b/d6386bfb23f6e51f7d020e0e4546def5.jpg", alt: "Diani Beach along Kenya's Swahili coast with pristine white sands", category: "Beach", width: 800, height: 600 },
    { id: 19, src: "https://i.pinimg.com/736x/21/2b/24/212b2433f246414a170ec177d76168f2.jpg", alt: "Group safari covering Maasai Mara, Lake Nakuru, Lake Naivasha, and Amboseli", category: "Group", width: 800, height: 600 },
    { id: 20, src: "https://i.pinimg.com/736x/f5/e3/99/f5e3997c40125ec8b26b9e3687de6d36.jpg", alt: "Extended group safari to Kenya's top four wildlife destinations", category: "Group", width: 800, height: 600 },
    { id: 21, src: "https://i.pinimg.com/736x/71/0b/61/710b61bf0912e6ab85f91ad0dcd24ba6.jpg", alt: "Safari adventure across Kenya's wilderness with expert guides", category: "Safari", width: 800, height: 600 },
    { id: 22, src: "https://i.pinimg.com/736x/d2/1f/86/d21f86305bc5df0128814c1a93b7515a.jpg", alt: "Elephant herds in Amboseli with Mount Kilimanjaro as the backdrop", category: "Wildlife", width: 800, height: 600 },
    { id: 23, src: "https://i.pinimg.com/736x/cc/76/4a/cc764a89a26b9322634b91a51d58248f.jpg", alt: "Wildlife viewing on safari across Kenya's national parks", category: "Wildlife", width: 800, height: 600 },
    { id: 24, src: "https://i.pinimg.com/736x/3c/be/06/3cbe06e589f1241676162d275364fc94.jpg", alt: "Amboseli and Tsavo safari circuit with diverse landscapes", category: "Landscape", width: 800, height: 600 },
    { id: 25, src: "https://i.pinimg.com/736x/cf/84/28/cf84284d13def04c4c914812cd35d269.jpg", alt: "Safari vehicle crossing the vast plains of East Africa", category: "Landscape", width: 800, height: 600 },
    { id: 26, src: "https://i.pinimg.com/736x/04/6b/cc/046bcc76edc63cbbabec83bc7c6162a7.jpg", alt: "Cultural village visits offering authentic Maasai experiences", category: "Safari", width: 800, height: 600 },
  ],
};

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "James Mwangi",
    role: "Founder & CEO",
    image: "https://i.pinimg.com/736x/79/54/21/7954216e62016c2b0b95a2df26561c7d.jpg",
    bio: "With 20 years in the tourism industry, James founded Ready Set Go with a vision to showcase Kenya's beauty to the world. Former safari guide and wildlife photographer.",
  },
  {
    id: 2,
    name: "Grace Akinyi",
    role: "Head of Operations",
    image: "https://i.pinimg.com/736x/dc/a3/da/dca3da8b3f2e450bfa03ea1e601084f4.jpg",
    bio: "Grace ensures every trip runs seamlessly. With a background in logistics and hospitality management, she coordinates our network of lodges, drivers, and guides.",
  },
  {
    id: 3,
    name: "David Ole Tipis",
    role: "Lead Safari Guide",
    image: "https://i.pinimg.com/736x/41/d1/e5/41d1e5c78d1b73924f0c9c65172d96c8.jpg",
    bio: "Born and raised in a Maasai community, David has 15 years of guiding experience. His tracking skills and wildlife knowledge are unmatched in the industry.",
  },
  {
    id: 4,
    name: "Sarah Wanjiku",
    role: "Client Relations Manager",
    image: "https://i.pinimg.com/736x/14/4b/48/144b48e269001cb629981818a2106848.jpg",
    bio: "Sarah is our clients' best friend from first inquiry to post-trip follow-up. Her warmth and attention to detail have earned us countless repeat clients.",
  },
  {
    id: 5,
    name: "Patrick Kamau",
    role: "Marketing Director",
    image: "https://i.pinimg.com/736x/18/5e/68/185e68ec47122de363158cdbf26d66cd.jpg",
    bio: "Patrick brings 10 years of digital marketing expertise to tell our brand story. He's passionate about showcasing authentic African travel experiences.",
  },
  {
    id: 6,
    name: "Maria Hassan",
    role: "Tour Consultant - Tanzania",
    image: "https://i.pinimg.com/736x/6f/f7/17/6ff71747e4a30f06691bfd86cb1345c5.jpg",
    bio: "Based in Arusha, Maria specializes in Tanzanian itineraries. Her deep knowledge of Serengeti, Zanzibar, and Kilimanjaro routes ensures perfect trip planning.",
  },
];

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  date: string;
  category: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "best-time-to-visit-masai-mara",
    title: "Best Time to Visit Masai Mara: A Complete Month-by-Month Guide",
    excerpt: "Planning your Masai Mara safari? Discover the best months for Great Migration viewing, calving season, and photography conditions.",
    content: [
      "The Masai Mara National Reserve offers exceptional wildlife viewing year-round, but the best time to visit depends entirely on what you want to see. The reserve's location in the Great Rift Valley creates distinct wet and dry seasons that dramatically influence animal behavior and concentration. Understanding these seasonal patterns is key to planning your dream safari.",
      "The Great Migration reaches the Mara between July and October, when over 1.5 million wildebeest and 200,000 zebras cross the Mara River in search of fresh grazing. This is the peak tourist season, offering the most dramatic wildlife spectacles but also the highest prices and largest crowds. The river crossings, while unpredictable, are among nature's most thrilling events.",
      "For photographers, the dry season from June to October provides excellent visibility and animals concentrated around water sources. January and February offer the calving season, with abundant predator action as lions and cheetahs target vulnerable newborns. The green season (November-May) brings lower rates, fewer tourists, and stunning landscapes, though some roads may be impassable after heavy rains.",
    ],
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
    author: "David Ole Tipis",
    date: "December 15, 2024",
    category: "Safari Tips",
  },
  {
    id: 2,
    slug: "kilimanjaro-climbing-tips",
    title: "Essential Kilimanjaro Climbing Tips for First-Time Summiteers",
    excerpt: "Everything you need to know before climbing Mount Kilimanjaro - training, gear, route selection, and altitude sickness prevention.",
    content: [
      "Standing at 5,895 meters (19,341 feet), Mount Kilimanjaro is Africa's highest peak and the world's tallest free-standing mountain. Despite its formidable height, Kilimanjaro is considered one of the most accessible high-altitude treks, requiring no technical climbing skills. However, proper preparation is essential for a successful summit attempt.",
      "Route selection is perhaps the most important decision you will make. The Marangu Route (Coca-Cola Route) is the only route with hut accommodation and is popular for its relative comfort. The Machame Route (Whiskey Route) offers more scenic variety and higher success rates due to better acclimatization. For those seeking solitude, the Lemosho and Northern Circuit routes provide longer, more gradual ascents with stunning landscapes.",
      "Altitude sickness is the biggest challenge facing climbers. The golden rule is to climb high and sleep low, allowing your body time to acclimatize. Most successful climbers spend 6-8 days on the mountain - any shorter significantly reduces your chances. Proper hydration, a slow pace (pole pole in Swahili), and awareness of AMS symptoms are critical. Diamox medication can help, but consult your doctor before the climb.",
    ],
    image: "https://i.pinimg.com/736x/b2/f4/00/b2f400bc6a7eeed46f69d6e8e3591f75.jpg",
    author: "James Mwangi",
    date: "November 28, 2024",
    category: "Adventure",
  },
  {
    id: 3,
    slug: "zanzibar-travel-guide",
    title: "Zanzibar Travel Guide: Beaches, Culture & Spice Island Adventures",
    excerpt: "Discover the magic of Zanzibar - from Stone Town's ancient alleys to the pristine beaches of Nungwi. Your complete island guide.",
    content: [
      "Zanzibar, the Spice Island of Tanzania, is a dream destination that blends pristine tropical beaches with a rich tapestry of history and culture. Located just 40 kilometers off the Tanzanian coast, this semi-autonomous archipelago offers something for every type of traveler - from history buffs to beach lovers to adventure seekers.",
      "Stone Town, a UNESCO World Heritage Site, is the cultural heart of Zanzibar. Its labyrinthine alleys reveal centuries of Swahili, Arab, Indian, and European influences. Visit the House of Wonders, the Old Fort, and the former slave market. Don't miss the Forodhani Night Market, where you can sample Zanzibar pizza, fresh seafood, and sugar cane juice as the sun sets over the Indian Ocean.",
      "Zanzibar's beaches are world-class. Nungwi and Kendwa on the north coast offer powdery white sand and spectacular sunsets. Paje and Jambiani on the east coast are perfect for kitesurfing thanks to consistent trade winds. Mnemba Atoll, a private island off the northeast coast, offers some of the best snorkeling and diving in East Africa, with sea turtles, reef sharks, and vibrant coral gardens.",
    ],
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    author: "Maria Hassan",
    date: "October 10, 2024",
    category: "Destinations",
  },
  {
    id: 4,
    slug: "kenya-safari-packing-list",
    title: "Ultimate Kenya Safari Packing List: What to Bring on Safari",
    excerpt: "Don't forget these essential items on your Kenyan safari. Expert packing tips for game drives, bush walks, and beach stays.",
    content: [
      "Packing for a Kenyan safari requires thoughtful preparation. The key is to be prepared for varying temperatures - early morning game drives can be surprisingly cold, while midday temperatures often exceed 30°C (86°F). Neutral-colored clothing (khaki, beige, olive) is recommended for game drives, though comfort should be your priority.",
      "Essentials include a good-quality wide-brimmed hat, polarized sunglasses, high-SPF sunscreen, and insect repellent containing DEET. Binoculars are absolutely essential - a good pair (8x or 10x magnification) will transform your wildlife viewing experience. A lightweight rain jacket is useful even in dry season, as afternoon showers can occur.",
      "For photography, a DSLR or mirrorless camera with a zoom lens (200-400mm is ideal) will capture wildlife at a distance. Bring extra memory cards and batteries - charging opportunities may be limited at bush camps. Don't forget a headlamp or flashlight, a reusable water bottle with a filter, and a small daypack for game drives. Leave dark clothing and camouflage at home, as these are reserved for military and rangers.",
    ],
    image: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg",
    author: "Sarah Wanjiku",
    date: "September 5, 2024",
    category: "Travel Tips",
  },
  {
    id: 5,
    slug: "great-migration-facts",
    title: "The Great Migration: Fascinating Facts About Nature's Greatest Spectacle",
    excerpt: "Over 1.5 million wildebeest, 200,000 zebras, and the predators that follow. Learn incredible facts about the Great Migration.",
    content: [
      "The Great Migration is often called the greatest wildlife show on Earth, and for good reason. Each year, roughly 1.5 million wildebeest, 200,000 zebras, and 300,000 Thomson's gazelles undertake a circular journey spanning over 1,800 miles through Tanzania's Serengeti and Kenya's Masai Mara. This ancient migration has been ongoing for over two million years.",
      "The migration is driven by rainfall and the search for fresh grazing. Calving season (January-March) takes place in the southern Serengeti, where approximately 500,000 wildebeest calves are born within a three-week window. This synchronized birthing is a survival strategy - predators can only eat so many, ensuring enough calves survive. It is also prime time for lion and cheetah viewing.",
      "The Mara River crossings (July-October) are the migration's dramatic climax. Crocodiles as long as five meters lie in wait as herds gather nervously on the riverbanks. Only about 250 of the 3,000 crossings each year involve the main migration herds. The rest are smaller groups testing the waters. Remarkably, scientists have found that wildebeest can sense the presence of crocodiles through pheromones in the water.",
    ],
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg?w=800&q=80",
    author: "David Ole Tipis",
    date: "August 20, 2024",
    category: "Wildlife",
  },
  {
    id: 6,
    slug: "luxury-safari-lodges-kenya",
    title: "Top 10 Luxury Safari Lodges in Kenya for an Unforgettable Stay",
    excerpt: "From private villas in Laikipia to tented camps in the Mara, discover Kenya's most exclusive and luxurious safari accommodations.",
    content: [
      "Kenya has long been synonymous with luxury safari travel, offering some of the world's most exclusive and elegant wilderness accommodations. From the golden plains of the Masai Mara to the private conservancies of Laikipia, these lodges redefine the safari experience with world-class service, exceptional cuisine, and breathtaking locations.",
      "Angama Mara, perched on the edge of the Great Rift Valley, offers perhaps the most spectacular setting in all of Africa. Its name means suspended in mid-air in Swahili, perfectly describing the feeling of floating above the Mara Triangle. Each suite features floor-to-ceiling canvas walls that open to uninterrupted views of the savannah below. The lodge's interior is a celebration of East African design, with handmade Maasai blankets and locally sourced materials.",
      "In Laikipia, Segera Retreat combines conservation with ultra-luxury. This 50,000-acre private ranch offers six unique villas, each with its own private plunge pool and outdoor living area. Guests can participate in conservation activities including rhino tracking and elephant monitoring. The lodge is entirely solar-powered and sources its organic produce from an on-site farm, making it one of Kenya's most sustainable luxury properties.",
    ],
    image: "https://i.pinimg.com/736x/d2/1f/86/d21f86305bc5df0128814c1a93b7515a.jpg?w=800&q=80",
    author: "Grace Akinyi",
    date: "July 12, 2024",
    category: "Luxury Travel",
  },
  {
    id: 7,
    slug: "maasai-culture-guide",
    title: "Maasai Culture: Traditions, Customs & Visiting Etiquette",
    excerpt: "Respectful cultural tourism guide to the Maasai people - their history, traditions, and how to visit communities responsibly.",
    content: [
      "The Maasai people are one of Africa's most recognizable and culturally distinct ethnic groups, with a history spanning centuries across Kenya and Tanzania. Known for their vibrant red shuka (blankets), intricate beadwork, and proud pastoralist traditions, the Maasai have maintained their cultural identity despite modernization pressures. Understanding and respecting their customs is essential for any meaningful cultural visit.",
      "When visiting a Maasai village, always ask for permission before taking photographs. The Maasai believe photographs can capture part of a person's spirit, and many elders prefer not to be photographed. If photography is allowed, a small donation or gift is customary. Dress modestly, covering shoulders and knees, and avoid public displays of affection. The traditional Maasai greeting, \"Sopa,\" is always appreciated.",
      "Maasai society is organized around age sets (olaji) that progress through life stages together. Young warriors (moran) are responsible for protecting the community and livestock. Contrary to popular belief, the traditional lion-hunting rite of passage has largely been replaced by modern conservation-focused ceremonies in partnership with wildlife organizations. Many communities now earn income through eco-tourism and cultural villages.",
    ],
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg?w=800&q=80",
    author: "James Mwangi",
    date: "June 8, 2024",
    category: "Culture",
  },
  {
    id: 8,
    slug: "diani-beach-guide",
    title: "Diani Beach Guide: Kenya's Tropical Paradise",
    excerpt: "Everything you need to know about Diani Beach - best resorts, restaurants, activities, and why it's consistently voted Africa's best beach.",
    content: [
      "Diani Beach, located on Kenya's south coast approximately 30 kilometers south of Mombasa, has been voted Africa's Leading Beach Destination multiple times at the World Travel Awards. This 17-kilometer stretch of powder-white sand fringed by lush tropical vegetation and washed by turquoise Indian Ocean waters is the ultimate tropical paradise on Kenya's coast.",
      "Accommodation options in Diani range from backpacker-friendly guesthouses to ultra-luxury resorts. The Sands at Nomad, a boutique hotel set in tropical gardens, offers the perfect balance of sophistication and laid-back beach charm. For families, the Diani Sea Resort provides excellent amenities including multiple pools and kids' clubs. Eco-conscious travelers should consider the Ocean Village Club, which supports local marine conservation.",
      "Beyond the beach, Diani offers exceptional activities. The Colobus Conservation Centre protects the region's native Angolan colobus monkeys and offers walking tours through the coastal forest. Wasini Island, a short boat ride away, provides incredible snorkeling at the Kisite-Mpunguti Marine National Park, where dolphins, sea turtles, and vibrant coral reefs await. The Ali Barbour Cave Restaurant, set in a natural coral cave, offers an unforgettable dining experience.",
    ],
    image: "https://i.pinimg.com/736x/d6/38/6b/d6386bfb23f6e51f7d020e0e4546def5.jpg",
    author: "Patrick Kamau",
    date: "May 3, 2024",
    category: "Destinations",
  },
  {
    id: 9,
    slug: "amboseli-vs-masai-mara",
    title: "Amboseli vs Masai Mara: Which Kenyan Safari Destination Is Right for You?",
    excerpt: "Compare Kenya's two most famous parks. Amboseli's Kilimanjaro views or Mara's Big Five density? We help you decide.",
    content: [
      "Choosing between Amboseli National Park and the Masai Mara National Reserve is one of the most common dilemmas facing safari travelers to Kenya. Both are world-class destinations, but they offer fundamentally different experiences. Your choice depends on what you want to see, when you want to travel, and what kind of landscape inspires you.",
      "Amboseli's crown jewel is the view of Mount Kilimanjaro, Africa's highest peak. The park is famous for its large elephant herds - over 1,500 individuals - and the dry, open landscape makes wildlife easy to spot. Amboseli is compact (392 km² compared to the Mara's 1,510 km²), meaning game drives are shorter and you can see a lot in a few days. The park is also significantly less expensive, with lower entry fees and more affordable accommodation options.",
      "The Masai Mara, by contrast, is about the density and diversity of wildlife. As part of the greater Serengeti ecosystem, the Mara hosts the Big Five in impressive numbers and is the stage for the Great Migration from July to October. The rolling savannah grasslands are more scenic and varied than Amboseli's plains. However, the Mara is more expensive, more crowded during peak season, and requires more travel time from Nairobi (5-6 hours versus 3-4 hours for Amboseli).",
    ],
    image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg?w=800&q=80",
    author: "David Ole Tipis",
    date: "April 15, 2024",
    category: "Safari Tips",
  },
  {
    id: 10,
    slug: "sustainable-tourism-kenya",
    title: "How to Travel Responsibly: Sustainable Tourism in Kenya",
    excerpt: "Tips for eco-conscious travelers visiting Kenya. Support conservation, choose green lodges, and make a positive impact.",
    content: [
      "Sustainable tourism in Kenya is not just a trend - it is essential for preserving the country's extraordinary wildlife and ecosystems for future generations. As climate change and population growth put increasing pressure on natural resources, travelers have a critical role to play in supporting conservation efforts and local communities.",
      "Choosing eco-certified accommodation is one of the most impactful decisions you can make. Look for lodges and camps with Silver, Gold, or Platinum Eco-Rating Certification from Eco-Tourism Kenya. Properties like Campi ya Kanzi in the Chyulu Hills and Saruni Samburu in northern Kenya are models of sustainable luxury, using solar power, harvesting rainwater, and employing local staff with fair wages and benefits.",
      "Responsible wildlife viewing means keeping a minimum distance of 20 meters from animals, never disturbing feeding or breeding behaviors, and never feeding wildlife. Choose tour operators who follow ethical guidelines and avoid any activity that involves captive wildlife or cultural performances that exploit local communities. Offset your carbon footprint by supporting organizations like the Kenya Forest Service's tree-planting initiatives or the Sheldrick Wildlife Trust's elephant orphanage.",
    ],
    image: "https://i.pinimg.com/736x/02/86/22/02862248476996fc5de9e9aff97979ad.jpg?w=800&q=80",
    author: "Grace Akinyi",
    date: "March 22, 2024",
    category: "Travel Tips",
  },
];

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 1,
    question: "When is the best time to go on a safari in Kenya?",
    answer: "The best time for wildlife viewing is during the dry season from late June to October. This is when animals congregate around water sources and the Great Migration is in full swing. However, Kenya offers excellent game viewing year-round, with the green season (November-May) offering lush landscapes, newborn animals, and fewer tourists.",
  },
  {
    id: 2,
    question: "Do I need a visa to visit Kenya?",
    answer: "Most nationalities require an e-visa to enter Kenya. You can apply online at evisa.go.ke at least two weeks before travel. The cost is approximately $51 for a single-entry visa. Tanzania also requires a visa for most visitors, available online or upon arrival.",
  },
  {
    id: 3,
    question: "What vaccinations do I need for East Africa?",
    answer: "Recommended vaccinations include Yellow Fever (mandatory if arriving from endemic countries), Hepatitis A & B, Typhoid, and Tetanus. Anti-malarial medication is strongly recommended. Consult your travel doctor 4-6 weeks before departure.",
  },
  {
    id: 4,
    question: "Is Kenya safe for tourists?",
    answer: "Yes, Kenya is safe for tourists who follow standard travel precautions. Our safari destinations are well-established tourist areas with excellent security. We provide 24/7 support and all our partners meet strict safety standards. Always follow your guide's instructions, especially in wildlife areas.",
  },
  {
    id: 5,
    question: "What should I pack for a safari?",
    answer: "Pack neutral-colored clothing (khaki, beige, olive), a warm jacket for early morning game drives, comfortable walking shoes, a wide-brimmed hat, sunglasses, sunscreen, insect repellent, binoculars, and a camera with extra batteries. Most lodges provide laundry services.",
  },
  {
    id: 6,
    question: "What type of accommodation can I expect?",
    answer: "We offer everything from luxury tented camps with en-suite bathrooms and plunge pools to comfortable lodges and budget-friendly camps. Accommodation is chosen based on your preferences and budget. All options meet high cleanliness and safety standards.",
  },
  {
    id: 7,
    question: "How do I get to Kenya?",
    answer: "Kenya's main international airport is Jomo Kenyatta International Airport (NBO) in Nairobi, with direct flights from major cities worldwide including London, New York, Dubai, Frankfurt, Amsterdam, and Doha. Tanzania's main entry is Kilimanjaro International Airport (JRO) or Julius Nyerere International Airport (DAR).",
  },
  {
    id: 8,
    question: "Can I customize my safari itinerary?",
    answer: "Absolutely! We specialize in bespoke itineraries. You can choose your destinations, accommodation level, duration, and activities. Our consultants will work with you to create the perfect trip matching your interests, budget, and travel style.",
  },
  {
    id: 9,
    question: "What currency is used in Kenya and Tanzania?",
    answer: "Kenya uses the Kenyan Shilling (KES) and Tanzania uses the Tanzanian Shilling (TZS). US Dollars are widely accepted at lodges, hotels, and national park fees. We recommend carrying some US dollars in cash for incidentals, and using credit cards for larger payments.",
  },
  {
    id: 10,
    question: "Are children allowed on safari?",
    answer: "Yes, children are welcome on safari! Many lodges and camps accept children of all ages. We recommend private game drives for families and can arrange kid-friendly activities, junior ranger programs, and special meals. Some parks have age restrictions for certain activities like walking safaris.",
  },
  {
    id: 11,
    question: "What happens if I need to cancel my trip?",
    answer: "Our cancellation policy varies by booking package. We offer flexible booking options including free cancellation up to 30 days before departure for most packages. We strongly recommend comprehensive travel insurance that covers cancellation, medical emergencies, and trip interruption.",
  },
  {
    id: 12,
    question: "How many people will be in my safari vehicle?",
    answer: "Private safaris include just you and your party in a 4x4 vehicle. For group safaris, we limit groups to a maximum of 6 guests per vehicle to ensure window seats for everyone and a comfortable experience.",
  },
  {
    id: 13,
    question: "What food is served on safari?",
    answer: "Lodges and camps serve a mix of international and local cuisine. Expect fresh fruits, vegetables, grilled meats, vegetarian options, and African specialties like nyama choma (grilled meat), ugali, and chapati. Dietary requirements are accommodated with advance notice.",
  },
  {
    id: 14,
    question: "Will I see the Big Five on safari?",
    answer: "The Big Five (lion, leopard, elephant, buffalo, rhino) are all present in Kenya and Tanzania. While we cannot guarantee sightings as animals are wild, our experienced guides know the best locations and animal behavior patterns to maximize your chances. Masai Mara and Ngorongoro offer excellent Big Five viewing.",
  },
  {
    id: 15,
    question: "Do I need travel insurance?",
    answer: "Yes, comprehensive travel insurance is mandatory for all our tours. It must cover medical evacuation, trip cancellation, baggage loss, and emergency expenses. We can recommend reputable insurance providers if needed.",
  },
  {
    id: 16,
    question: "What is the tipping etiquette in Kenya?",
    answer: "Tipping is appreciated but not mandatory. Recommended guidelines: safari guide $10-20 per person per day, lodge staff $5-10 per person per day, drivers $5-10 per day. Tips can be given in US dollars or local currency.",
  },
  {
    id: 17,
    question: "Can I combine a safari with a beach holiday?",
    answer: "Yes! This is one of our most popular combinations. After your safari, unwind on Kenya's coast (Diani, Watamu) or in Zanzibar. We offer seamless transfers and can arrange packages that combine wildlife adventures with beach relaxation. The Kenya-Tanzania Combo package with Zanzibar extension is a favorite.",
  },
  {
    id: 18,
    question: "How fit do I need to be for a safari?",
    answer: "Regular game drives require no special fitness level. For walking safaris and mountain climbing, reasonable fitness is required. Kilimanjaro climbers should be in good physical condition and ideally start training 3-4 months in advance. Consult with us to choose activities matching your fitness level.",
  },
  {
    id: 19,
    question: "What technology is available on safari?",
    answer: "Most lodges and camps offer Wi-Fi (though speeds vary), and our safari vehicles have charging ports for your devices. Mobile coverage is available in most populated areas. We recommend bringing a power bank and universal adapter.",
  },
  {
    id: 20,
    question: "How far in advance should I book my safari?",
    answer: "We recommend booking 6-12 months in advance for peak season (July-October) and popular lodges. For other seasons, 3-6 months ahead is sufficient. Last-minute bookings (within 30 days) are sometimes possible depending on availability.",
  },
  {
    id: 21,
    question: "Do you offer airport transfers?",
    answer: "Yes, airport transfers are included with all our safari packages. Our driver will meet you at the airport with a sign, help with luggage, and transfer you to your starting accommodation. We also offer meet-and-greet services at Nairobi and Kilimanjaro airports.",
  },
  {
    id: 22,
    question: "What languages do your guides speak?",
    answer: "Our guides are fluent in English and Swahili. We also have guides who speak German, French, Spanish, Italian, Mandarin, and Arabic. Please let us know your language preference when booking.",
  },
  {
    id: 23,
    question: "Are solo travelers accommodated?",
    answer: "Absolutely! We welcome solo travelers and offer single occupancy options with no single supplement on select packages. Group safaris are a great way for solo travelers to meet like-minded people while enjoying an affordable safari experience.",
  },
  {
    id: 24,
    question: "What is the altitude like on Kilimanjaro?",
    answer: "Mount Kilimanjaro stands at 5,895 meters (19,341 feet) at Uhuru Peak. Our itineraries include proper acclimatization days and follow the 'climb high, sleep low' principle. Our guides are trained to recognize and treat altitude sickness symptoms. About 85% of our clients successfully summit.",
  },
];

interface TrustItem {
  icon: string;
  label: string;
}

export const TRUST_ITEMS: TrustItem[] = [
  { icon: "Shield", label: "Licensed Tour Operator" },
  { icon: "Award", label: "Kenya Tourism Board Approved" },
  { icon: "Star", label: "2,000+ 5-Star Reviews" },
  { icon: "Globe", label: "15+ Years Experience" },
  { icon: "Building2", label: "Nairobi-Based Office" },
  { icon: "HeadphonesIcon", label: "24/7 Customer Support" },
];

interface BookingStep {
  icon: string;
  title: string;
  description: string;
}

export const BOOKING_STEPS: BookingStep[] = [
  { icon: "MessageCircle", title: "Inquiry", description: "Reach out via phone, email, or our contact form. Share your travel dreams and preferences." },
  { icon: "ClipboardCheck", title: "Consultation", description: "Our expert consultants craft a personalized itinerary tailored to your interests and budget." },
  { icon: "FileCheck", title: "Confirm", description: "Review and approve your itinerary. We handle all bookings, permits, and logistics." },
  { icon: "Plane", title: "Travel", description: "Enjoy your handcrafted adventure with 24/7 support, expert guides, and seamless coordination." },
  { icon: "Heart", title: "Memories", description: "Return home with unforgettable experiences and stories that last a lifetime." },
];

interface DestinationInfo {
  name: string;
  image: string;
  description: string;
  highlights: string[];
  bestTime: string;
  activities: string[];
  accommodation: string[];
}

export const KENYA_DESTINATIONS_INFO: DestinationInfo[] = [
  {
    name: "Masai Mara National Reserve",
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg?w=800&q=80",
    description: "Spanning 1,510 square kilometers of rolling savannah, the Masai Mara is Kenya's most celebrated wildlife reserve. It forms the northern extension of the Serengeti ecosystem and is the stage for the Great Migration, where over 1.5 million wildebeest, 200,000 zebras, and thousands of gazelles make their annual circuit. The Mara hosts the highest concentration of predators in Africa, including lions, leopards, cheetahs, and hyenas. The Mara River, with its infamous crocodile-filled crossings, is the dramatic centerpiece of the migration. Beyond wildlife, the reserve offers hot air balloon safaris, Maasai cultural experiences, and stunning photographic opportunities at every turn.",
    highlights: [
      "Great Migration river crossings (July-October)",
      "Highest lion density in Africa",
      "Hot air balloon safaris with champagne breakfast",
      "Maasai village cultural visits",
      "Excellent year-round game viewing",
      "Mara River hippo and crocodile populations",
    ],
    bestTime: "July to October for migration; January-February for calving season",
    activities: [
      "Game drives (day and night)",
      "Hot air balloon safaris",
      "Guided nature walks",
      "Maasai village visits",
      "Photography expeditions",
      "Bush dining and sundowners",
    ],
    accommodation: [
      "Angama Mara (ultra-luxury)",
      "&Beyond Kichwa Tembo Tented Camp",
      "Mara Serena Safari Lodge",
      "Governors' Camp (mobile migration camp)",
      "Sarova Mara Game Camp",
      "Mara Intrepids Luxury Tented Camp",
    ],
  },
  {
    name: "Amboseli National Park",
    image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg?w=800&q=80",
    description: "Amboseli National Park, covering 392 square kilometers, is famous for its large elephant herds and breathtaking views of Mount Kilimanjaro, Africa's highest peak. The park's ecosystem is dominated by swamps fed by meltwater from Kilimanjaro, creating a stark contrast between lush wetlands and dry plains. Amboseli offers some of the most iconic photographic opportunities in Africa, with elephants silhouetted against Kilimanjaro at sunrise. The park is also home to lions, cheetahs, giraffes, zebras, and over 400 bird species. Observation Hill provides panoramic views of the entire park and the mountain beyond.",
    highlights: [
      "Large elephant herds (over 1,500 individuals)",
      "Iconic Kilimanjaro backdrop photographs",
      "Observation Hill panoramic viewpoints",
      "Lake Amboseli birdwatching (400+ species)",
      "Maasai community conservation projects",
      "Swamp ecosystems with hippos and waterfowl",
    ],
    bestTime: "June to October and January to February",
    activities: [
      "Game drives in search of elephants and big cats",
      "Photography sessions at sunrise/sunset",
      "Visit to Maasai villages",
      "Observation Hill climb",
      "Birdwatching at the swamps",
      "Nature walks with armed guides",
    ],
    accommodation: [
      "Amboseli Serena Safari Lodge",
      "Tawi Lodge (eco-luxury)",
      "Ol Tukai Lodge",
      "Amboseli Sopa Lodge",
      "Kibo Safari Camp",
      "Sentrim Amboseli Lodge",
    ],
  },
  {
    name: "Samburu National Reserve",
    image: "https://i.pinimg.com/736x/71/0b/61/710b61bf0912e6ab85f91ad0dcd24ba6.jpg?w=800&q=80",
    description: "Samburu National Reserve is a rugged, semi-arid paradise in northern Kenya, known for rare wildlife species found nowhere else in the country. The Ewaso Ng'iro River cuts through the reserve, attracting abundant wildlife to its banks. Samburu is famous for the 'Samburu Special Five' - the Grevy's zebra, reticulated giraffe, Beisa oryx, Somali ostrich, and gerenuk. The reserve offers a more exclusive, less crowded safari experience with dramatic landscapes of acacia-dotted plains and rocky hillsides.",
    highlights: [
      "Samburu Special Five endemic species",
      "Ewaso Ng'iro River game viewing",
      "Samburu cultural immersion experiences",
      "Leopard and cheetah sightings",
      "Birdlife including Somali bee-eater and vulturine guineafowl",
      "Less crowded than southern parks",
    ],
    bestTime: "June to October and January to March",
    activities: [
      "Game drives in open vehicles",
      "Samburu village visits and cultural tours",
      "Guided bush walks along the river",
      "Sundowner cocktails on the riverbank",
      "Photography expeditions",
      "Visit to neighboring Buffalo Springs Reserve",
    ],
    accommodation: [
      "Saruni Samburu (luxury)",
      "Sasaab Lodge",
      "Elephant Bedroom Camp",
      "Samburu Sopa Lodge",
      "Ashnil Samburu Camp",
      "Larsen's Tented Camp",
    ],
  },
  {
    name: "Lake Nakuru National Park",
    image: "https://i.pinimg.com/736x/fd/ef/a9/fdefa997b495bcc9246ad44e644be087.jpg",
    description: "Lake Nakuru National Park is a world-famous soda lake park nestled in the Great Rift Valley. The lake's alkaline waters once hosted millions of flamingos, creating a spectacular pink shoreline. While water level changes have affected flamingo numbers, the park remains a vital rhino sanctuary, home to both black and white rhinos. The surrounding acacia woodlands and cliffs support lions, leopards, waterbucks, and over 450 bird species. Baboon Cliff offers stunning views over the lake and the park below.",
    highlights: [
      "Flamingo flocks (seasonal)",
      "Black and white rhino sanctuary",
      "Baboon Cliff viewpoints",
      "Makalia Falls during rainy season",
      "Acacia woodland birdwatching",
      "Rift Valley escarpment scenery",
    ],
    bestTime: "June to March, especially during dry season",
    activities: [
      "Game drives for rhino tracking",
      "Hiking to Makalia Falls",
      "Baboon Cliff photography",
      "Birdwatching tours",
      "Picnic at scenic viewpoints",
      "Visit to Lake Naivasha nearby",
    ],
    accommodation: [
      "Sarova Lion Hill Game Lodge",
      "Lake Nakuru Sopa Lodge",
      "Flamingo Hill Tented Camp",
      "Mbweha Camp (eco-camp)",
      "Lanet Matfam Resort",
      "The Cliff Lake Nakuru",
    ],
  },
  {
    name: "Tsavo National Park",
    image: "https://images.unsplash.com/photo-1670349202857-f4615ee3c977?q=80&w=1080",
    description: "Tsavo National Park, split into Tsavo East and Tsavo West, is one of the world's largest game sanctuaries covering over 22,000 square kilometers. Tsavo East features vast open plains, red-dusted elephants, and the Galana River. Tsavo West offers diverse landscapes including volcanic lava flows, Mzima Springs with underwater hippo viewing, and the Chyulu Hills. The park is renowned for the legendary Tsavo man-eaters and stunning volcanic scenery.",
    highlights: [
      "Red-dusted 'Tsavo elephants'",
      "Mzima Springs underwater hippo viewing",
      "Shetani lava flow volcanic landscapes",
      "Chyulu Hills hiking and views",
      "Galana River crocodile populations",
      "Historical man-eater sites and museum",
    ],
    bestTime: "June to October for wildlife viewing",
    activities: [
      "Game drives in Tsavo East and West",
      "Mzima Springs nature walk and viewing",
      "Shetani lava flow exploration",
      "Birdwatching (over 500 species)",
      "Photography of red elephants",
      "Visit to Lugard Falls and Mudanda Rock",
    ],
    accommodation: [
      "Sarova Salt Lick Game Lodge",
      "Severin Safari Camp",
      "Voyager Ziwani Safari Camp",
      "Ashnil Aruba Lodge",
      "Kilaguni Serena Safari Lodge",
      "Ngulia Safari Lodge",
    ],
  },
  {
    name: "Laikipia Plateau",
    image: "https://i.pinimg.com/736x/d2/1f/86/d21f86305bc5df0128814c1a93b7515a.jpg?w=800&q=80",
    description: "Laikipia is Kenya's most exciting conservation success story, a vast plateau of private and community-owned conservancies covering over 4,000 square kilometers. This region offers exclusive, low-impact tourism with unrivaled privacy. Laikipia is a stronghold for endangered species including the black rhino, Grevy's zebra, and African wild dog. Activities like horseback safaris, camel treks, walking safaris, and fly-camping provide immersive wilderness experiences unavailable in public parks.",
    highlights: [
      "African wild dog tracking",
      "Horseback and camel safaris",
      "Lewa Wildlife Conservancy rhinos",
      "Ol Pejeta chimpanzee sanctuary",
      "Star-bed sleepouts under the sky",
      "Exclusive private conservancy access",
    ],
    bestTime: "January to March and July to October",
    activities: [
      "Horseback riding safaris",
      "Guided walking safaris",
      "Night game drives",
      "Fly-camping in the bush",
      "Conservation talks and tracking experiences",
      "Visit to Ol Pejeta and Lewa Conservancies",
    ],
    accommodation: [
      "Segera Retreat (ultra-luxury)",
      "Loisaba Tented Camp",
      "Ol Pejeta Bush Camp",
      "Saruni Rhino",
      "Elephant Watch Camp",
      "Lion's Bluff Lodge",
    ],
  },
  {
    name: "Nairobi National Park",
    image: "https://images.unsplash.com/photo-1598403531581-5c4940efd249?q=80&w=1080",
    description: "Nairobi National Park is a unique wildlife reserve located just 7 kilometers from Kenya's capital city center. The park's backdrop of the Nairobi skyline creates surreal photographic compositions. Despite its proximity to the city, the park hosts healthy populations of lions, rhinos, giraffes, zebras, cheetahs, and over 400 bird species. It's one of the best places in Kenya to see the endangered black rhino. The Nairobi Animal Orphanage and the Ivory Burning Site monument are located within the park.",
    highlights: [
      "City skyline safari backdrop",
      "Black rhino sanctuary",
      "Nairobi Animal Orphanage",
      "Historical ivory burning site",
      "Walking trails in the hippo pools",
      "Accessible half-day safari from Nairobi",
    ],
    bestTime: "Year-round, with best wildlife viewing during dry season (June-October)",
    activities: [
      "Half-day game drives",
      "Visit to Animal Orphanage",
      "Walking safaris at designated trails",
      "Birdwatching in the dry forest",
      "Photography of city-meets-wild scenes",
      "Picnic at hippo pools viewpoint",
    ],
    accommodation: [
      "Emakoko (luxury lodge)",
      "Nairobi Tented Camp",
      "Ololo Safari Lodge",
      "Karen Gables (nearby Karen area)",
      "House of Waine (nearby Karen)",
      "The Talisman (boutique nearby)",
    ],
  },
  {
    name: "Mount Kenya Region",
    image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg?w=800&q=80",
    description: "Mount Kenya, Africa's second-highest peak at 5,199 meters, is a UNESCO World Heritage Site surrounded by lush montane forests, bamboo zones, and alpine moorlands. The mountain is an ancient extinct volcano with dramatic glaciers, jagged peaks, and crystal-clear tarns. The surrounding foothills are home to wildlife including elephants, buffaloes, colobus monkeys, and diverse birdlife. Several routes lead to the summit, with Point Lenana (4,985m) being the most popular trekking destination.",
    highlights: [
      "Summit at Point Lenana (4,985m) or Batian (5,199m)",
      "Equatorial glaciers and unique alpine zones",
      "Colobus monkey and mountain wildlife",
      "Mountain lodge and camp accommodation",
      "Scenic trekking through five climate zones",
      "Sirimon and Chogoria scenic routes",
    ],
    bestTime: "January-February and August-September",
    activities: [
      "Mountain trekking and peak climbing",
      "Guided nature walks in the forest zone",
      "Birdwatching (including sunbirds and raptors)",
      "Photography of glaciers and tarns",
      "Visit to mountain lodges and tea plantations",
      "Trout fishing in mountain streams",
    ],
    accommodation: [
      "Fairmont Mount Kenya Safari Club",
      "Serena Mountain Lodge",
      "Naro Moru River Lodge",
      "Mountain Rock Lodge",
      "Bantu Lodge Nanyuki",
      "Ol Pejeta Bush Camp (nearby)",
    ],
  },
];

export const TANZANIA_DESTINATIONS_INFO: DestinationInfo[] = [
  {
    name: "Serengeti National Park",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg?w=800&q=80",
    description: "The Serengeti National Park is Tanzania's most famous wildlife destination, spanning 14,763 square kilometers of pristine savannah. The name means 'endless plains' in Maasai, and the landscape truly lives up to its name. The Serengeti is the stage for the Great Migration, the largest overland animal movement on Earth. Over 1.5 million wildebeest, 200,000 zebras, and numerous gazelles traverse the ecosystem in a circular route. The park is divided into regions: the Seronera Valley (excellent year-round game viewing), the Western Corridor (river crossings), and the Northern Serengeti (migration concentrations). The park also offers exceptional predator viewing with healthy populations of lions, cheetahs, leopards, and hyenas.",
    highlights: [
      "Great Migration wildebeest crossings",
      "Seronera Valley Big Five density",
      "Mara River crocodile and crossing action",
      "Kopje lion prides on granite outcrops",
      "Hot air balloon safaris over endless plains",
      "Boulder formations in Moru Kopjes",
    ],
    bestTime: "June to October for migration; December-March for calving",
    activities: [
      "Full-day game drives with picnic lunches",
      "Hot air balloon safari with bush breakfast",
      "Guided nature walks with rangers",
      "Photographic safaris in private vehicles",
      "Visit to Serengeti Visitor Centre",
      "Sundowners at scenic kopje viewpoints",
    ],
    accommodation: [
      "Four Seasons Safari Lodge Serengeti",
      "Singita Grumeti (ultra-luxury)",
      "Serengeti Serena Safari Lodge",
      "&Beyond Klein's Camp",
      "Melia Serengeti Lodge",
      "Serengeti Pioneer Camp by Elewana",
    ],
  },
  {
    name: "Ngorongoro Conservation Area",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg?w=800&q=80",
    description: "The Ngorongoro Conservation Area is a UNESCO World Heritage Site centered around the world's largest intact volcanic caldera. The Ngorongoro Crater, formed 2-3 million years ago, spans 260 square kilometers with walls rising 600 meters. The crater floor hosts an extraordinary concentration of wildlife including the endangered black rhino, elephants, lions, hippos, and flamingos. The area is also home to the Maasai people, who live alongside wildlife in a unique multi-use landscape. Olduvai Gorge, within the conservation area, is one of the most important paleoanthropological sites in the world.",
    highlights: [
      "Ngorongoro Crater floor game drives",
      "Black rhino sightings on the crater floor",
      "Lake Magadi flamingo flocks",
      "Empakaai Crater viewpoint hike",
      "Olduvai Gorge archaeological museum",
      "Maasai pastoralist cultural encounters",
    ],
    bestTime: "June to September for crater floor; year-round available",
    activities: [
      "Crater descent game drives (half-day)",
      "Visit to Olduvai Gorge and museum",
      "Empakaai Crater hiking",
      "Maasai boma cultural visits",
      "Birdwatching at Lake Magadi",
      "Photography from crater rim viewpoints",
    ],
    accommodation: [
      "Ngorongoro Crater Lodge (Six Senses)",
      "&Beyond Ngorongoro Crater Lodge",
      "Ngorongoro Serena Safari Lodge",
      "Lemala Ngorongoro Tented Camp",
      "Ngorongoro Farm House",
      "Rhino Lodge (mid-range)",
    ],
  },
  {
    name: "Mount Kilimanjaro National Park",
    image: "https://i.pinimg.com/736x/6b/44/e7/6b44e79b5d7aa2ee44a00365a86144c0.jpg?w=800&q=80",
    description: "Mount Kilimanjaro National Park protects Africa's highest mountain and the world's tallest free-standing peak at 5,895 meters. The mountain rises from the plains of Tanzania through five distinct ecological zones: cultivated lower slopes, montane rainforest, heath and moorland, alpine desert, and the arctic summit. Climbing Kilimanjaro is a bucket-list adventure accessible to anyone with reasonable fitness and determination. The park offers multiple routes including Machame (the 'Whiskey Route'), Marangu (the 'Coca-Cola Route'), Lemosho, Rongai, and the Northern Circuit. Each route offers a different experience in terms of scenery, difficulty, and crowd levels.",
    highlights: [
      "Uhuru Peak summit at 5,895 meters",
      "Five distinct climate zones traversed",
      "Glaciers and ice fields at the summit",
      "Machame and Lemosho scenic routes",
      "Shira Plateau crater views",
      "Equatorial sunrise from the summit",
    ],
    bestTime: "January-March and June-October",
    activities: [
      "Multi-day mountain trekking and camping",
      "Summit night climb to Uhuru Peak",
      "Rainforest nature walks (lower slopes)",
      "Photography of glaciers and alpine zones",
      "Visit to Machame and Marangu gates",
      "Cultural tours of Chagga villages",
    ],
    accommodation: [
      "Mountain huts (Marangu Route only)",
      "Tented camps on other routes",
      "Keys Hotel (pre-trek, Moshi)",
      "Parkview Inn (pre-trek, Moshi)",
      "Kilimanjaro Mountain Resort (Arusha)",
      "Arusha Coffee Lodge (pre/post trek)",
    ],
  },
  {
    name: "Tarangire National Park",
    image: "https://i.pinimg.com/736x/ce/f6/d6/cef6d689ef0cdfd6df6180dee63f669c.jpg?w=800&q=80",
    description: "Tarangire National Park is a hidden gem of Tanzania's northern circuit, covering 2,850 square kilometers. The park is famous for its iconic baobab trees, which dot the landscape like ancient sentinels. During the dry season, the Tarangire River becomes the primary water source, attracting massive herds of elephants (the park has one of the highest elephant densities in Tanzania), zebras, wildebeests, and buffalo. The park is also known for tree-climbing pythons, abundant birdlife (over 550 species), and the Silale Swamp which attracts diverse water birds and wildlife.",
    highlights: [
      "Massive baobab tree forests",
      "High elephant density (over 3,000)",
      "Tree-climbing pythons in sausage trees",
      "Silale Swamp birdwatching paradise",
      "Dry season wildlife concentrations",
      "Less crowded than Serengeti",
    ],
    bestTime: "June to October (dry season)",
    activities: [
      "Game drives along Tarangire River",
      "Birdwatching at Silale Swamp",
      "Picnic at baobab viewpoint",
      "Night game drives (private concessions)",
      "Walking safaris in designated areas",
      "Photography of baobab landscapes",
    ],
    accommodation: [
      "Tarangire Treetops (unique treehouse rooms)",
      "Sanctuary Swala Camp",
      "Tarangire Sopa Lodge",
      "Oliver's Camp (Asilia)",
      "Lake Burunge Tented Camp",
      "Tarangire Safari Lodge",
    ],
  },
  {
    name: "Lake Manyara National Park",
    image: "https://i.pinimg.com/736x/f9/70/19/f97019de628aac44821bd272040ce313.jpg?w=800&q=80",
    description: "Lake Manyara National Park is a compact but diverse park at the base of the Great Rift Valley escarpment. The park's highlight is its soda lake, which attracts thousands of flamingos during certain seasons. Lake Manyara is world-famous for its tree-climbing lions, a unique behavior observed in this park's prides. The groundwater forest near the park entrance is home to troops of blue monkeys and abundant birdlife. The Rift Valley escarpment provides a dramatic backdrop and excellent viewpoints across the lake and onto the Maasai Steppe beyond.",
    highlights: [
      "Tree-climbing lion prides",
      "Flamingo flocks on the lake",
      "Groundwater forest with blue monkeys",
      "Rift Valley escarpment viewpoints",
      "Large hippo pool concentrations",
      "Excellent birdwatching (400+ species)",
    ],
    bestTime: "June to February (dry season and early wet)",
    activities: [
      "Game drives along lake shoreline",
      "Forest walks with ranger guides",
      "Canoeing on the lake (seasonal)",
      "Birdwatching in groundwater forest",
      "Photography of tree-climbing lions",
      "Visit to Maji Moto hot springs nearby",
    ],
    accommodation: [
      "Lake Manyara Serena Safari Lodge",
      "Kirurumu Manyara Lodge",
      "Lake Manyara Tree Lodge",
      "Escarpment Luxury Lodge",
      "Manyara's Secret (Migombani Camp)",
      "Twiga Lodge & Campsite",
    ],
  },
  {
    name: "Selous Game Reserve",
    image: "https://i.pinimg.com/736x/04/6b/cc/046bcc76edc63cbbabec83bc7c6162a7.jpg",
    description: "Selous Game Reserve, now part of the larger Nyerere National Park, is Africa's largest game reserve covering over 50,000 square kilometers. This UNESCO World Heritage Site offers a truly remote and wild safari experience with far fewer visitors than northern Tanzania parks. The Rufiji River, Tanzania's largest river system, flows through the reserve and is the lifeblood for its wildlife. Boat safaris along the Rufiji offer unique perspectives on hippos, crocodiles, and water birds. Walking safaris are a specialty here, led by armed rangers through pristine wilderness.",
    highlights: [
      "Rufiji River boat safaris with hippos and crocs",
      "Guided walking safaris in remote wilderness",
      "Large elephant and wild dog populations",
      "Stiegler's Gorge canyon",
      "Lake Tagalala seasonal wildlife concentrations",
      "Remote exclusive experience with few tourists",
    ],
    bestTime: "June to October (dry season)",
    activities: [
      "Boat safaris on Rufiji River",
      "Walking safaris with armed rangers",
      "Game drives in open vehicles",
      "Fly-camping in remote areas",
      "Birdwatching (440+ species)",
      "Fishing (with permits)",
    ],
    accommodation: [
      "Selous Serena Camp",
      "Sand Rivers Selous (luxury)",
      "Rufiji River Camp",
      "Lake Manze Tented Camp",
      "Mivumo River Lodge",
      "Selous Impala Camp",
    ],
  },
];

export const PACKAGE_FILTERS: string[] = [
  "All",
  "Safari",
  "Group",
  "Mountain",
  "Luxury",
];

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGES: PriceRange[] = [
  { id: "budget", label: "Budget (Under $1,000)", min: 0, max: 1000 },
  { id: "mid", label: "Mid-Range ($1,000 - $2,500)", min: 1000, max: 2500 },
  { id: "premium", label: "Premium ($2,500 - $5,000)", min: 2500, max: 5000 },
  { id: "luxury", label: "Luxury ($5,000+)", min: 5000, max: Infinity },
];

interface Deal {
  id: number;
  title: string;
  slug: string;
  description: string;
  discount: string;
  code: string;
  image: string;
  type: "early-bird" | "last-minute" | "group" | "seasonal" | "combo" | "special";
  originalPrice: number;
  dealPrice: number;
  priceKES?: number;
  validUntil: string;
  highlights: string[];
  featured: boolean;
  duration: string;
  accommodation: string;
  meals: string;
  included: string[];
  itinerary: { day: string; description: string }[];
}

export const DEALS: Deal[] = [
  {
    id: 1,
    title: "3 Days Great Wildebeest Migration Season",
    slug: "great-wildebeest-migration",
    description: "Witness one of nature's greatest spectacles — the Great Wildebeest Migration. Stay at Mara Ntulele Camp perfectly positioned for prime river crossing viewing. Non-resident: $650 USD per person. Resident: 27,000 KES per person.",
    discount: "Group Safari",
    code: "MIGRATION",
    image: "https://i.pinimg.com/736x/48/c9/f7/48c9f7d212a4a2933b84ec65c19e4628.jpg",
    type: "group",
    originalPrice: 850,
    dealPrice: 650,
    priceKES: 27000,
    validUntil: "December 31, 2026",
    highlights: ["Mara River crossings", "Wildebeest calving season", "Big Five game drives", "Expert Maasai guides", "Photography paradise"],
    featured: true,
    duration: "3 Days / 2 Nights",
    accommodation: "Mara Ntulele Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "Park fee",
      "2 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    itinerary: [
      { day: "Day 1", description: "Depart Nairobi for Masai Mara. Arrive at Mara Ntulele Camp. Afternoon game drive to spot the Great Migration herds." },
      { day: "Day 2", description: "Full-day game drive following the wildebeest migration. Picnic lunch by the Mara River. Witness dramatic river crossings." },
      { day: "Day 3", description: "Early morning game drive. Breakfast at camp. Depart for Nairobi with unforgettable migration memories." },
    ],
  },
  {
    id: 2,
    title: "7 Days Ultimate Kenya Safari",
    slug: "ultimate-kenya-safari",
    description: "Experience Kenya's finest safari circuit covering Masai Mara, Lake Nakuru, Lake Naivasha, and Amboseli. From the Great Migration to iconic elephant herds beneath Kilimanjaro. Non-resident: $2,500 USD per person.",
    discount: "Best Value",
    code: "KENYA7",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
    type: "seasonal",
    originalPrice: 3200,
    dealPrice: 2500,
    validUntil: "December 31, 2026",
    highlights: ["Masai Mara game drives", "Lake Nakuru flamingos", "Naivasha hippo boat ride", "Amboseli & Kilimanjaro views", "Maasai cultural experience"],
    featured: true,
    duration: "7 Days / 6 Nights",
    accommodation: "Maasai Mara - Mara Sopa | L. Nakuru - Lake Nakuru Lodge | L. Naivasha - Naivasha Sopa | Amboseli - Penety Resort",
    meals: "Full board (breakfast, lunch & dinner)",
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "6 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    itinerary: [
      { day: "Day 1", description: "Arrive Nairobi. Depart for Masai Mara. Afternoon game drive. Overnight at Mara Sopa Lodge." },
      { day: "Day 2", description: "Full-day Masai Mara safari. Great Migration viewing. Picnic lunch on the plains." },
      { day: "Day 3", description: "Morning game drive. Afternoon depart for Lake Nakuru. Evening game drive at Lake Nakuru Lodge." },
      { day: "Day 4", description: "Morning game drive at Lake Nakuru. Proceed to Lake Naivasha. Boat ride to Crescent Island. Overnight at Naivasha Sopa." },
      { day: "Day 5", description: "Depart for Amboseli via Nairobi. Afternoon game drive with Kilimanjaro backdrop. Overnight at Penety Resort." },
      { day: "Day 6", description: "Full-day Amboseli game drives. Giant elephant herds. Visit observation hill." },
      { day: "Day 7", description: "Early morning game drive. Breakfast. Depart for Nairobi." },
    ],
  },
  {
    id: 3,
    title: "6 Days Tanzania Northern Circuit Safari",
    slug: "tanzania-northern-circuit",
    description: "Explore Tanzania's legendary Northern Circuit through Tarangire, Lake Manyara, Serengeti, and the Ngorongoro Crater. The ultimate Tanzanian safari experience. Non-resident: $2,800 USD per person.",
    discount: "Popular Choice",
    code: "TANZANIA6",
    image: "https://i.pinimg.com/736x/11/56/82/1156825aa06be3206b2a1454ada4af1b.jpg",
    type: "seasonal",
    originalPrice: 3600,
    dealPrice: 2800,
    validUntil: "December 31, 2026",
    highlights: ["Serengeti Great Migration", "Ngorongoro Crater descent", "Tarangire baobab trees", "Manyara tree-climbing lions", "Lake Manyara flamingos"],
    featured: true,
    duration: "6 Days / 5 Nights",
    accommodation: "Tarangire - Ngare Lodge | Manyara - Kankari | Serengeti - Engiterata Adventure Camp | Ngorongoro - Ngorongoro Wild Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "5 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    itinerary: [
      { day: "Day 1", description: "Arrive Arusha. Depart for Tarangire National Park. Afternoon game drive among baobab trees. Overnight at Ngare Lodge." },
      { day: "Day 2", description: "Morning drive to Lake Manyara. Game drive spotting tree-climbing lions. Overnight at Kankari." },
      { day: "Day 3", description: "Depart for Serengeti National Park. Scenic game drive en route. Overnight at Engiterata Adventure Camp." },
      { day: "Day 4", description: "Full-day Serengeti game drive following the Great Migration. Picnic lunch on the plains." },
      { day: "Day 5", description: "Morning game drive. Depart for Ngorongoro Crater. Afternoon descent into the Crater floor. Overnight at Ngorongoro Wild Camp." },
      { day: "Day 6", description: "Early morning Crater floor game drive. Depart for Arusha after lunch." },
    ],
  },
  {
    id: 4,
    title: "Kenya & Tanzania Combo Package",
    slug: "kenya-tanzania-combo",
    description: "The ultimate cross-border East African safari combining Kenya and Tanzania's greatest parks. From the Masai Mara to the Serengeti and the Ngorongoro Crater. Non-resident: $5,500 USD per person.",
    discount: "Ultimate Adventure",
    code: "COMBO",
    image: "https://i.pinimg.com/736x/0d/a3/ed/0da3eda4778cbd2bf6ea063f677a2964.jpg",
    type: "combo",
    originalPrice: 6800,
    dealPrice: 5500,
    validUntil: "December 31, 2026",
    highlights: ["Masai Mara & Serengeti migration", "Ngorongoro Crater", "Amboseli & Kilimanjaro", "Lake Naivasha hippos", "Cross-border safari experience"],
    featured: true,
    duration: "12 Days / 11 Nights",
    accommodation: "Maasai Mara - Jambo Mara Lodge | L. Nakuru - Sarova Woodlands | L. Naivasha - Lake Naivasha Resort | Amboseli - Amboseli Sopa Lodge | Arusha - Tulia Boutique | Tarangire - Ngare Lodge | Manyara - Kankari | Serengeti - Engiterata Adventure Camp | Ngorongoro - Ngorongoro Wild Camp",
    meals: "Full board (breakfast, lunch & dinner)",
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "11 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Park Entrance fee",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
      "Kenya and Tanzania visa",
    ],
    itinerary: [
      { day: "Day 1", description: "Arrive Nairobi. Transfer to Jambo Mara Lodge for overnight." },
      { day: "Day 2", description: "Full-day Masai Mara game drive. Great Migration viewing." },
      { day: "Day 3", description: "Morning game drive. Depart for Lake Nakuru. Overnight at Sarova Woodlands." },
      { day: "Day 4", description: "Morning at Lake Nakuru. Proceed to Lake Naivasha. Boat ride. Overnight at Lake Naivasha Resort." },
      { day: "Day 5", description: "Depart for Amboseli via Nairobi. Afternoon game drive. Overnight at Amboseli Sopa Lodge." },
      { day: "Day 6", description: "Full-day Amboseli safari with Kilimanjaro backdrop." },
      { day: "Day 7", description: "Cross into Tanzania. Arrive Arusha. Overnight at Tulia Boutique." },
      { day: "Day 8", description: "Depart for Tarangire. Game drive. Overnight at Ngare Lodge." },
      { day: "Day 9", description: "Lake Manyara game drive. Tree-climbing lions. Overnight at Kankari." },
      { day: "Day 10", description: "Depart for Serengeti. Game drive en route. Overnight at Engiterata Adventure Camp." },
      { day: "Day 11", description: "Full-day Serengeti. Great Migration. Picnic lunch." },
      { day: "Day 12", description: "Ngorongoro Crater descent. Morning game drive. Depart for Arusha." },
    ],
  },
  {
    id: 5,
    title: "Amboseli Tsavo Gateway Safari",
    slug: "amboseli-tsavo-gateway",
    description: "Explore three of Kenya's most iconic parks — Amboseli, Tsavo East, and Tsavo West. Elephant herds beneath Kilimanjaro, the legendary red elephants of Tsavo, and the stunning Mzima Springs. Non-resident: $2,400 USD per person. Resident: 282,768 KES per person.",
    discount: "Gateway Special",
    code: "TSAVO",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
    type: "seasonal",
    originalPrice: 2800,
    dealPrice: 2400,
    priceKES: 282768,
    validUntil: "December 31, 2026",
    highlights: ["Amboseli & Mount Kilimanjaro views", "Tsavo East red elephants", "Tsavo West Mzima Springs", "Lugard Falls", "Diverse landscapes"],
    featured: true,
    duration: "5 Days / 4 Nights",
    accommodation: "Amboseli - Penety Resort | Tsavo East - Voi Safari Lodge | Tsavo West - Ngulia Safari Lodge",
    meals: "Full board (breakfast, lunch & dinner)",
    included: [
      "Transport in a custom safari tour 4x4 Land Cruiser",
      "Professional English-speaking safari driver-guide",
      "4 nights accommodation as per itinerary",
      "Meals on full board basis (breakfast, lunch & dinner)",
      "Game drives as outlined",
      "Bottled drinking water during game drives",
    ],
    itinerary: [
      { day: "Day 1", description: "Depart Nairobi for Amboseli National Park. Afternoon game drive with spectacular Mount Kilimanjaro backdrop. Overnight at Penety Resort." },
      { day: "Day 2", description: "Full-day Amboseli game drives. Giant elephant herds, zebras, giraffes, and prolific birdlife against Africa's highest peak." },
      { day: "Day 3", description: "Morning game drive. Depart for Tsavo East National Park. Afternoon game drive spotting red elephants, lions, and along the Galana River. Overnight at Voi Safari Lodge." },
      { day: "Day 4", description: "Morning game drive in Tsavo East. Depart for Tsavo West. Visit Mzima Springs for hippos and crocodiles. Overnight at Ngulia Safari Lodge." },
      { day: "Day 5", description: "Early morning game drive in Tsavo West. Breakfast. Depart for Nairobi with unforgettable safari memories." },
    ],
  },
];

interface HoneymoonPackage {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  priceKES?: number;
  duration: string;
  accommodation: string;
  meals: string;
  transport: string;
  activities: string[];
  description: string;
  highlights: string[];
  included: string[];
}

export const HONEYMOON_PACKAGES: HoneymoonPackage[] = [
  {
    id: 1,
    name: "Romantic Safari & Beach Escape",
    slug: "romantic-safari-beach",
    image: "https://i.pinimg.com/736x/e4/d5/7f/e4d57f9f504d405977711abd9469c591.jpg",
    price: 8700,
    priceKES: 970200,
    duration: "12 Days / 11 Nights",
    accommodation: "Private luxury tent + beachfront villa",
    meals: "Gourmet full board & candlelit dinners",
    transport: "Private 4x4 + domestic flight",
    activities: ["Private game drives", "Sundowner bush dinner", "Couples spa", "Hot air balloon", "Dhow sunset cruise", "Snorkeling"],
    description: "The ultimate romantic journey — begin with private game drives in the Masai Mara, then unwind on Zanzibar's pristine beaches. Candlelit bush dinners under the stars and a private villa with plunge pool make this the perfect honeymoon.",
    highlights: ["Private safari vehicle & guide", "Champagne sundowner on the Mara", "Luxury beachfront villa", "Couples massage", "Floating breakfast"],
    included: ["All domestic flights", "Gourmet meals & drinks", "Park fees", "Airport transfers", "24/7 private concierge"],
  },
  {
    id: 2,
    name: "Mount Kenya Romantic Retreat",
    slug: "mount-kenya-romance",
    image: "https://i.pinimg.com/736x/32/7c/c4/327cc44ea4209390b2177bb8e670c476.jpg",
    price: 8700,
    priceKES: 970000,
    duration: "8 Days / 7 Nights",
    accommodation: "Mountain lodge & exclusive treehouse",
    meals: "Farm-to-table dining & picnic lunches",
    transport: "Private 4x4 with chauffeur",
    activities: ["Mount Kenya scenic hikes", "Ol Pejeta game drive", "Equator experience", "Couples' spa", "Bush breakfast", "Cocktail at the treehouse"],
    description: "Escape to the cool highlands of Nanyuki and Mount Kenya for an intimate retreat. Stay in a luxurious mountain lodge with sweeping views, explore Ol Pejeta Conservancy hand-in-hand, and enjoy a private treehouse dinner above the African bush.",
    highlights: ["Mount Kenya views from your suite", "Private treehouse dinner", "Ol Pejeta chimpanzee sanctuary", "Bush breakfast", "Equator line ceremony"],
    included: ["All meals & select drinks", "Park & conservancy fees", "Guide & driver", "Spa treatment for two", "Transfer from Nairobi"],
  },
  {
    id: 3,
    name: "Zanzibar Honeymoon Paradise",
    slug: "zanzibar-honeymoon",
    image: "https://i.pinimg.com/736x/ec/f9/c4/ecf9c45a7a976f4151b88235e8396c06.jpg",
    price: 2150,
    priceKES: 277350,
    duration: "7 Days / 6 Nights",
    accommodation: "Private beach villa with infinity pool",
    meals: "Half board with romantic beach dinners",
    transport: "Private transfer & dhow excursions",
    activities: ["Spice plantation tour", "Stone Town walk", "Prison Island snorkeling", "Dhow sunset cruise", "Cooking class", "Beachside massage"],
    description: "Surrender to paradise on the spice island of Zanzibar. Turquoise waters, powder-white sand, and a private villa with your own infinity pool. Days are spent snorkeling coral reefs, exploring historic Stone Town, and dining barefoot on the beach.",
    highlights: ["Private infinity pool villa", "Sunset dhow cruise", "Spice tour", "Prison Island giant tortoises", "Candlelit beach dinner"],
    included: ["All accommodation", "Breakfast & dinner daily", "Airport transfers", "One spa treatment per person", "Dhow excursion"],
  },
  {
    id: 4,
    name: "Tanzania Safari & Zanzibar",
    slug: "tanzania-safari-zanzibar",
    image: "https://i.pinimg.com/736x/1f/12/be/1f12bebda0ecf1699fa537f21112db28.jpg",
    price: 5200,
    priceKES: 670800,
    duration: "14 Days / 13 Nights",
    accommodation: "Luxury safari camps + beach resort",
    meals: "Premium full board & fine dining",
    transport: "Private 4x4, bush flights & dhow",
    activities: ["Serengeti game drives", "Ngorongoro Crater tour", "Balloon safari", "Bush dinner", "Zanzibar beach & spa", "Dhow cruise"],
    description: "The ultimate East African honeymoon crossing two countries. Witness the Great Migration in the Serengeti, descend into the Ngorongoro Crater, and end on Zanzibar's legendary beaches. Every detail is designed for romance and wonder.",
    highlights: ["Great Migration viewing", "Ngorongoro Crater descent", "Champagne balloon safari", "Private bush dinner", "Zanzibar beach villa"],
    included: ["All domestic flights", "Full board on safari", "All park & crater fees", "Balloon safari", "24/7 guide & concierge"],
  },
  {
    id: 5,
    name: "Diani Beach Honeymoon Bliss",
    slug: "diani-beach-honeymoon",
    image: "https://i.pinimg.com/736x/fb/fe/cc/fbfecc1741f23134a323bbc5bf57c414.jpg",
    price: 2100,
    priceKES: 266700,
    duration: "6 Days / 5 Nights",
    accommodation: "Boutique beach resort with private pool",
    meals: "Half board with romantic beach dinners",
    transport: "Private airport transfer",
    activities: ["Dolphin spotting", "Snorkeling at Kisite Marine Park", "Wasini Island tour", "Cave restaurant dinner", "Sunset dhow cruise", "Couples massage"],
    description: "Kenya's finest beach destination sets the stage for romantic bliss. White sands, turquoise waters, and exceptional dining at the Ali Barbour Cave Restaurant make this the ideal short honeymoon escape on the Swahili coast.",
    highlights: ["Kisite marine park snorkeling", "Dolphin encounters", "Ali Barbour Cave dinner", "Private beach dinner", "Sunset dhow cruise"],
    included: ["All accommodation", "Breakfast & dinner", "Marine park fees", "Snorkeling gear", "Airport transfers"],
  },
];

export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  benefits: { icon: string; title: string; desc: string }[];
  whyUs: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICES: Service[] = [
  {
    id: "hotel-bookings",
    slug: "hotel-bookings",
    title: "Hotel Bookings",
    tagline: "The Best Places to Stay, at the Best Rates",
    image: "https://i.pinimg.com/736x/28/31/b4/2831b4de089bea29cccc93985a7bd032.jpg",
    description:
      "From luxury safari lodges in the Masai Mara to beachfront resorts in Zanzibar and city hotels in Nairobi — we secure exclusive rates at hand-picked properties across East Africa. Whether you're after a romantic boutique hideaway or a family-friendly all-inclusive resort, our accommodation experts match you with the perfect stay.",
    features: [
      "Exclusive partner rates not available on booking platforms",
      "Hand-picked portfolio of 200+ vetted properties",
      "Luxury safari camps, beach resorts, city hotels & boutique lodges",
      "Villa and private home rentals for groups & families",
      "Last-minute bookings and flexible cancellation policies",
      "Honeymoon & special occasion packages with extras",
    ],
    benefits: [
      { icon: "Hotel", title: "Curated Selection", desc: "Every property is personally vetted for quality, location, and service standards." },
      { icon: "Shield", title: "Best Rate Guarantee", desc: "We match or beat any publicly available rate — plus unlock exclusive perks." },
      { icon: "HeadphonesIcon", title: "Dedicated Support", desc: "Your booking is managed end-to-end by our accommodation team, 24/7." },
    ],
    whyUs: [
      "We have established relationships with lodge and hotel owners across Kenya and Tanzania, giving us access to rates and availability you won't find on public booking sites.",
      "Our team personally inspects every property on our list — we don't recommend anywhere we wouldn't stay ourselves.",
      "We handle the entire process: from shortlisting and booking to check-in support and post-stay follow-up.",
      "For multi-destination trips, we coordinate check-in/check-out logistics, transfer connections, and special requests seamlessly.",
    ],
    faqs: [
      { q: "Can you book hotels that aren't on your list?", a: "Absolutely. If there's a specific property you have in mind, we'll reach out to secure the best available rate and handle the booking for you." },
      { q: "Do you charge a booking fee?", a: "No. Our accommodation booking service is free to you — we earn commission directly from the properties." },
      { q: "Can you help with group bookings?", a: "Yes. We regularly book blocks of rooms for family reunions, wedding parties, and corporate retreats at discounted group rates." },
    ],
  },
  {
    id: "air-ticketing",
    slug: "air-ticketing",
    title: "Air Ticketing",
    tagline: "Seamless Flights, Domestic & International",
    image: "https://i.pinimg.com/736x/72/1a/8a/721a8a7ea0c339e50b674b2db40e125a.jpg",
    description:
      "We handle all your flight arrangements — from international arrivals into Nairobi or Kilimanjaro to domestic bush flights connecting you to safari airstrips. Our ticketing team works with all major airlines to find the best routes, fares, and schedules for your itinerary.",
    features: [
      "International flights with all major carriers",
      "Domestic connections: Nairobi–Mombasa, Nairobi–Zanzibar, and more",
      "Bush flights to remote safari airstrips (Masai Mara, Serengeti, Amboseli)",
      "Group fare negotiation for families & corporate travel",
      "Flexible ticket options with change and cancellation coverage",
      "Airport transfer coordination and meet-and-assist service",
    ],
    benefits: [
      { icon: "Plane", title: "Full Route Planning", desc: "We map the most efficient flight routes to minimize travel time and maximize your vacation." },
      { icon: "Award", title: "Preferred Airline Rates", desc: "Our volume partnerships unlock fares that aren't always available to the public." },
      { icon: "Shield", title: "Stress-Free Changes", desc: "If your plans shift, we handle rebooking and changes so you don't have to wait on hold." },
    ],
    whyUs: [
      "Our ticketing team has years of experience navigating airline fare classes, routing rules, and stopover optimization — saving you both money and travel time.",
      "We monitor your booking for schedule changes and proactively re-accommodate you if needed, so you're never caught off guard.",
      "For multi-stop East African itineraries, we coordinate international arrivals with domestic connections to ensure seamless same-day transfers.",
      "We offer honest advice: we'll tell you when to book now and when to wait, based on fare trends and airline sales.",
    ],
    faqs: [
      { q: "Do you only book flights for safari clients?", a: "Not at all. We provide air ticketing as a standalone service — whether you're visiting for business, a family visit, or just need help finding the best fare to East Africa." },
      { q: "Can you book one-way or multi-city flights?", a: "Yes. We handle one-way, round-trip, multi-city, and open-jaw itineraries. Whatever your route, we can ticket it." },
      { q: "What happens if my flight is cancelled?", a: "We monitor your booking and will proactively rebook you on the next available option. Our support line is available 24/7 for travel disruptions." },
    ],
  },
  {
    id: "massage-wellness",
    slug: "massage-wellness",
    title: "Massage & Wellness",
    tagline: "Relax, Recharge, and Restore",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&q=80",
    description:
      "After days of game drives and adventure, treat yourself to deep relaxation. We partner with East Africa's finest spas to offer professional massage therapy, wellness treatments, and holistic retreat experiences — whether in a luxury lodge spa, a beachfront wellness center, or the privacy of your own room.",
    features: [
      "Professional in-room massage at select lodges & hotels",
      "Full-service spa days: facials, body wraps, and hydrotherapy",
      "Couples massage and romance packages",
      "Wellness retreats: yoga, meditation, and detox programs",
      "Post-safari recovery treatments",
      "Holistic therapies: reflexology, aromatherapy, hot stone massage",
    ],
    benefits: [
      { icon: "Heart", title: "Curated Wellness Experiences", desc: "We match you with the right treatment based on your needs — deep tissue, relaxation, or recovery." },
      { icon: "Sparkles", title: "Premium Partners", desc: "We work with award-winning spas and certified therapists across Kenya and Tanzania." },
      { icon: "Hotel", title: "In-Room Convenience", desc: "Many treatments can be arranged in the comfort and privacy of your own lodge or hotel room." },
    ],
    whyUs: [
      "Recovery is an essential part of any safari experience. Long game drives, early mornings, and bumpy roads take a toll — a professional massage revitalizes you for the next day's adventure.",
      "We book wellness services in advance so you don't miss out on limited spa slots at popular lodges and resorts.",
      "Our spa partners use natural African ingredients — shea butter, baobab oil, coffee scrubs — for treatments that are authentically East African.",
      "We customize packages: pre-safari jet lag relief, post-trek recovery, honeymoon romance, or full-day wellness retreats.",
    ],
    faqs: [
      { q: "Can I book a massage without staying at a partner lodge?", a: "Yes. We can arrange spa day visits at select resort spas even if you're not a guest — subject to availability." },
      { q: "Are therapists certified?", a: "Absolutely. All our partner therapists are internationally certified and trained in a range of modalities from Swedish massage to deep tissue and traditional African techniques." },
      { q: "What if I have specific health conditions?", a: "Please let us know in advance. We'll ensure your therapist is informed and treatments are adapted to your needs and medical history." },
    ],
  },
];
