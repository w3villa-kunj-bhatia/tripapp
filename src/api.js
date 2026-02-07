const API_KEY = import.meta.env.VITE_PIXABAY_KEY;
console.log("DEBUG: The Key is:", API_KEY); // <--- Add this line

const MOCK_DATA = [
  {
    id: 1,
    city: "Paris",
    desc: "City of Lights",
    image:
      "https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg",
  },
  {
    id: 2,
    city: "New York",
    desc: "The Big Apple",
    image:
      "https://cdn.pixabay.com/photo/2016/10/28/13/09/usa-1777986_1280.jpg",
  },
  {
    id: 3,
    city: "Tokyo",
    desc: "Neon & Temples",
    image:
      "https://cdn.pixabay.com/photo/2013/11/28/10/03/river-219972_1280.jpg",
  },
  {
    id: 4,
    city: "London",
    desc: "Royalty & History",
    image:
      "https://cdn.pixabay.com/photo/2014/11/13/23/34/palace-530055_1280.jpg",
  },
  {
    id: 5,
    city: "Pune",
    desc: "Oxford of the East",
    image:
      "https://cdn.pixabay.com/photo/2018/01/24/09/27/travel-3103437_1280.jpg",
  },
  {
    id: 6,
    city: "Mumbai",
    desc: "City of Dreams",
    image:
      "https://cdn.pixabay.com/photo/2016/10/21/14/50/mumbai-1758181_1280.jpg",
  },
  {
    id: 7,
    city: "Dubai",
    desc: "Luxury & Desert",
    image:
      "https://cdn.pixabay.com/photo/2017/08/29/09/26/dubai-2693054_1280.jpg",
  },
  {
    id: 8,
    city: "Sydney",
    desc: "Harbour Views",
    image:
      "https://cdn.pixabay.com/photo/2014/05/26/09/58/sydney-opera-house-354375_1280.jpg",
  },
];

export const searchDestinations = async (query) => {
  console.log(`Searching for: "${query}"`);

  // 1. If query is empty, return all MOCK_DATA
  if (!query || query.trim() === "") {
    return MOCK_DATA;
  }

  // 2. If API Key is obviously missing/fake, skip fetch to avoid errors
  if (!API_KEY || API_KEY === "undefined" || API_KEY.length < 10) {
    console.warn("Using MOCK DATA (Key missing or invalid).");
    return MOCK_DATA.filter((d) =>
      d.city.toLowerCase().includes(query.toLowerCase()),
    );
  }

  try {
    // 3. Try to fetch from Real API
    const response = await fetch(
      `https://pixabay.com/api/?key=${API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=10`,
    );

    // 4. If API says "No" (e.g., Invalid Key 400), throw error to trigger catch block
    if (!response.ok) {
      throw new Error(
        `Pixabay API Error: ${response.status} (Likely Invalid Key)`,
      );
    }

    const data = await response.json();

    // 5. If no hits found in API, check if we have it in MOCK_DATA as backup
    if (!data.hits || data.hits.length === 0) {
      console.log("No API results, checking mock data...");
      return MOCK_DATA.filter((d) =>
        d.city.toLowerCase().includes(query.toLowerCase()),
      );
    }

    // 6. Return Real API results
    console.log("Found real data from Pixabay!");
    return data.hits.map((hit) => ({
      id: hit.id,
      city: query.charAt(0).toUpperCase() + query.slice(1), // Use query as city name
      image: hit.webformatURL,
      desc: hit.tags,
    }));
  } catch (e) {
    // 7. Catch-all: If anything fails, use MOCK DATA
    console.error(e.message);
    return MOCK_DATA.filter((d) =>
      d.city.toLowerCase().includes(query.toLowerCase()),
    );
  }
};
