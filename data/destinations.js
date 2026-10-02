/**
 * MYSERVICEPARK TRAVEL - CENTRAL DESTINATION DATABASE
 * Add or update destinations here. 
 * The site will automatically update search, category filters, and cards!
 */

const DESTINATIONS_DATA = [
  {
    id: "gopalpur-beach",
    title: "Gopalpur Beach",
    region: "Ganjam, Southern Odisha",
    category: "beaches",
    categoryLabel: "Beach & Coast",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A serene coastal haven featuring golden sands, historic British-era port ruins, and breathtaking sunrises.",
    readTime: "6 min read",
    articleUrl: "articles/gopalpur-beach.html",
    bestTimeToVisit: "October to March",
    idealDuration: "1 - 2 Days"
  },
  {
    id: "daringbadi",
    title: "Daringbadi Hill Station",
    region: "Kandhamal, Odisha",
    category: "hills",
    categoryLabel: "Hills & Valleys",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Popularly known as the 'Kashmir of Odisha', offering pine forests, coffee gardens, and cool mountain breezes.",
    readTime: "8 min read",
    articleUrl: "articles/daringbadi.html",
    bestTimeToVisit: "November to February",
    idealDuration: "2 - 3 Days"
  },
  {
    id: "chilika-lake",
    title: "Chilika Lake & Mangalajodi",
    region: "Puri / Khordha, Odisha",
    category: "nature",
    categoryLabel: "Wildlife & Nature",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Asia's largest brackish water lagoon, famous for Irrawaddy dolphins and migratory bird sanctuaries.",
    readTime: "7 min read",
    articleUrl: "#",
    bestTimeToVisit: "November to February",
    idealDuration: "1 - 2 Days"
  },
  {
    id: "puri-jagannath",
    title: "Puri Heritage & Golden Beach",
    region: "Puri, Odisha",
    category: "temples",
    categoryLabel: "Temple & Heritage",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Spiritual epicenter of Odisha, home to the sacred Jagannath Temple and Blue Flag certified Golden Beach.",
    readTime: "10 min read",
    articleUrl: "#",
    bestTimeToVisit: "October to March",
    idealDuration: "2 - 3 Days"
  },
  {
    id: "konark-sun-temple",
    title: "Konark Sun Temple",
    region: "Puri District, Odisha",
    category: "heritage",
    categoryLabel: "Heritage Site",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80",
    excerpt: "A UNESCO World Heritage architectural marvel shaped like a gigantic stone chariot of the Sun God.",
    readTime: "5 min read",
    articleUrl: "#",
    bestTimeToVisit: "October to March",
    idealDuration: "1 Day"
  },
  {
    id: "tara-tarini",
    title: "Tara Tarini Hill Shrine",
    region: "Ganjam, Odisha",
    category: "temples",
    categoryLabel: "Temple & Heritage",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1000&q=80",
    excerpt: "Perched atop Kumari hills on the banks of River Rushikulya, one of the major Tantric Shakti Peethas.",
    readTime: "4 min read",
    articleUrl: "#",
    bestTimeToVisit: "October to March",
    idealDuration: "1 Day"
  }
];

// Helper Function: Filter by Category or Keyword
function getFilteredDestinations(category = "all", searchQuery = "") {
  return DESTINATIONS_DATA.filter(item => {
    const matchesCategory = (category === "all") || (item.category === category);
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === "" || 
      item.title.toLowerCase().includes(query) || 
      item.region.toLowerCase().includes(query) || 
      item.excerpt.toLowerCase().includes(query);
      
    return matchesCategory && matchesSearch;
  });
}
