export type Language = 'en' | 'si';

export interface Translations {
  nav: {
    home: string;
    products: string;
    designStudio: string;
    howItWorks: string;
    portfolio: string;
    about: string;
    contact: string;
    stencil: string;
    batikStamp: string;
    downloads: string;
    materials: string;
    toolkit: string;
    community: string;
    allStencils: string;
    handPainting: string;
    saree: string;
    toteBags: string;
    batik: string;
    wallDecoration: string;
    titanium: string;
    allScreenPrinting: string;
    screenExposed: string;
    tracingPrintouts: string;
    positivePrintouts: string;
    cmykHalftone: string;
    allDtfPrinting: string;
    tshirtDesign: string;
    dtfSticker: string;
    dtfCloth: string;
    allBatikStamps: string;
    capBatik: string;
    allLaserCutting: string;
    acrylicCutEngrave: string;
    woodEngraving: string;
    customProfiles: string;
  };
  subNav: {
    dtfPrinting: string;
    screenPrinting: string;
    laserCutting: string;
    engraving: string;
    canvasBuilder: string;
    mockupStudio: string;
    sizeGuide: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    description: string;
    btnCreate: string;
    btnBrowse: string;
    stats: {
      accuracyTitle: string;
      accuracySub: string;
      turnaroundTitle: string;
      turnaroundSub: string;
      ordersTitle: string;
      ordersSub: string;
      ratingTitle: string;
      ratingSub: string;
    };
    previewBadge: string;
    previewBtn: string;
  };
  heroCards?: {
    customStencils: { title: string; desc: string };
    dtfFilmRolls: { title: string; desc: string };
    screenPrinting: { title: string; desc: string };
    batikStamps: { title: string; desc: string };
    laserEngraving: { title: string; desc: string };
    toolkitStudio: { title: string; desc: string };
  };
  downloadsPage?: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
    searchPlaceholder: string;
    sortByLabel: string;
    sortFeatured: string;
    sortPriceLow: string;
    sortPriceHigh: string;
    sortName: string;
    catAll: string;
    catBatik: string;
    catVector: string;
    catDtf: string;
    catWall: string;
    instantAccess: string;
    buyNow: string;
    whyTitle: string;
    why1Title: string;
    why1Desc: string;
    why2Title: string;
    why2Desc: string;
    why3Title: string;
    why3Desc: string;
    perfectTitle: string;
    laserCutters: string;
    dtfPrinters: string;
    screenPrinting: string;
    cncRouting: string;
    vinylPlotters: string;
    printOnDemand: string;
    customVectorTitle: string;
    customVectorDesc: string;
    requestCustomBtn: string;
  };
  toolkitPage?: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
    studioHeader: string;
    syncNote: string;
    frontView: string;
    backView: string;
    frontHint: string;
    backHint: string;
    addToCartBtn: string;
  };
  canvasPage?: {
    breadcrumbHome: string;
    breadcrumbCurrent: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
  };
  homeSections?: {
    trustedStrip: string;
    howBadge: string;
    howTitle: string;
    steps: {
      s1Title: string; s1Desc: string;
      s2Title: string; s2Desc: string;
      s3Title: string; s3Desc: string;
      s4Title: string; s4Desc: string;
    };
    catalogBadge: string;
    catalogTitle: string;
    catalogDesc: string;
    categories: {
      stencilsTitle: string; stencilsDesc: string; stencilsBadge: string;
      screenTitle: string; screenDesc: string; screenBadge: string;
      dtfTitle: string; dtfDesc: string; dtfBadge: string;
      batikTitle: string; batikDesc: string; batikBadge: string;
      laserTitle: string; laserDesc: string; laserBadge: string;
      consumablesTitle: string; consumablesDesc: string; consumablesBadge: string;
      tutorialsTitle: string; tutorialsDesc: string; tutorialsBadge: string;
      feedbacksTitle: string; feedbacksDesc: string; feedbacksBadge: string;
      browseBtn: string;
    };
    whyBadge: string;
    whyTitle: string;
    benefits: {
      b1Title: string; b1Desc: string;
      b2Title: string; b2Desc: string;
      b3Title: string; b3Desc: string;
      b4Title: string; b4Desc: string;
      b5Title: string; b5Desc: string;
    };
    galleryBadge: string;
    galleryTitle: string;
    viewCatalogueBtn: string;
    dtfShowcaseBadge: string;
    dtfShowcaseTitle1: string;
    dtfShowcaseTitle2: string;
    dtfShowcaseDesc: string;
    dtfShowcaseBtnCreate: string;
    dtfShowcaseBtnBrowse: string;
    dtfShowcaseCardTitle: string;
    dtfShowcaseCardSub: string;
    reviewsBadge: string;
    reviewsTitle: string;
    testimonialsList: Array<{ name: string; role: string; rating: number; text: string; avatar: string }>;
    faqBadge: string;
    faqTitle1: string;
    faqTitle2: string;
    faqDesc: string;
    faqSupportBtn: string;
    faqs: Array<{ q: string; a: string }>;
    ctaBadge: string;
    ctaTitle1: string;
    ctaTitle2: string;
    ctaDesc: string;
    ctaBtn: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      products: "Our Products",
      designStudio: "Design Studio",
      howItWorks: "How It Works",
      portfolio: "Portfolio",
      about: "About Us",
      contact: "Contact Us",
      stencil: "Stencils",
      batikStamp: "Batik Stamps",
      downloads: "Downloads",
      materials: "Materials / Consumables",
      toolkit: "Toolkit",
      community: "Community Hub",
      allStencils: "All Stencils",
      handPainting: "Hand Painting",
      saree: "Saree Border",
      toteBags: "Tote Bags",
      batik: "Batik Patterns",
      wallDecoration: "Wall Decor",
      titanium: "Titanium",
      allScreenPrinting: "All Screen Printing",
      screenExposed: "Screen Exposed",
      tracingPrintouts: "Tracing Printouts",
      positivePrintouts: "Positive Printouts",
      cmykHalftone: "CMYK Halftone",
      allDtfPrinting: "All DTF Printing",
      tshirtDesign: "T-Shirt Design",
      dtfSticker: "DTF Sticker",
      dtfCloth: "DTF Cloth Transfers",
      allBatikStamps: "All Batik Stamps",
      capBatik: "Cap Batik Stamps",
      allLaserCutting: "All Laser Cutting",
      acrylicCutEngrave: "Acrylic Cut & Engrave",
      woodEngraving: "Wood Engraving",
      customProfiles: "Custom Profiles"
    },
    subNav: {
      dtfPrinting: "DTF Printing",
      screenPrinting: "Screen Printing",
      laserCutting: "Laser Cutting",
      engraving: "Engraving",
      canvasBuilder: "Canvas Builder",
      mockupStudio: "3D Mockup Studio",
      sizeGuide: "Size Guide"
    },
    hero: {
      badge: "Professional Grade Stencil, Screen & DTF Printing",
      titlePrefix: "High-Definition ",
      titleHighlight: "Print Solutions",
      titleSuffix: " & Equipment",
      description: "From custom precision stencils to industrial DTF film rolls, exposed screen printing, and traditional batik stamps - explore our specialized print technology store.",
      btnCreate: "Launch DTF Canvas",
      btnBrowse: "Browse Catalog",
      stats: {
        accuracyTitle: "99% Print Accuracy",
        accuracySub: "Vibrant & Durable",
        turnaroundTitle: "24h Turnaround",
        turnaroundSub: "Fast Production",
        ordersTitle: "10,000+ Orders",
        ordersSub: "Happy Customers",
        ratingTitle: "5★ Satisfaction",
        ratingSub: "Top-Rated Support"
      },
      previewBadge: "3D Preview Ready",
      previewBtn: "View in 3D"
    },
    heroCards: {
      customStencils: {
        title: "Custom Stencils",
        desc: "Precision laser-cut stencils for every creative need."
      },
      dtfFilmRolls: {
        title: "DTF Film Rolls",
        desc: "High-quality film rolls for vibrant and durable prints."
      },
      screenPrinting: {
        title: "Screen Printing",
        desc: "Professional screen printing materials and accessories."
      },
      batikStamps: {
        title: "Batik Stamps",
        desc: "Traditional batik stamps crafted to perfection."
      },
      laserEngraving: {
        title: "Laser Engraving",
        desc: "Precision CNC laser cutting and engraving solutions."
      },
      toolkitStudio: {
        title: "Toolkit Studio",
        desc: "Interactive 3D mockup studio and gang sheet canvas builder."
      }
    },
    downloadsPage: {
      breadcrumbHome: "Home",
      breadcrumbCurrent: "Digital Downloads",
      titleMain: "Digital Designs & ",
      titleHighlight: "Downloads",
      description: "High-resolution vector files, batik layouts, laser cut paths, and DTF gang sheets with instant Google Drive delivery upon payment.",
      searchPlaceholder: "Search vector designs, SVG, stencils, tags...",
      sortByLabel: "Sort by:",
      sortFeatured: "Featured",
      sortPriceLow: "Price: Low to High",
      sortPriceHigh: "Price: High to Low",
      sortName: "Alphabetical (A-Z)",
      catAll: "All Designs",
      catBatik: "Traditional Batik",
      catVector: "Vector & SVG",
      catDtf: "DTF Sheets",
      catWall: "Wall Decor",
      instantAccess: "Instant Access",
      buyNow: "Buy Now",
      whyTitle: "Why choose our digital assets?",
      why1Title: "Clean Vector Geometry",
      why1Desc: "Optimized paths without broken nodes for seamless CNC & laser cuts.",
      why2Title: "Instant Google Drive Access",
      why2Desc: "Automated secure fulfillment delivers download links immediately.",
      why3Title: "Commercial License Included",
      why3Desc: "Full commercial usage rights for end-products and apparel prints.",
      perfectTitle: "Perfect for",
      laserCutters: "Laser Cutters",
      dtfPrinters: "DTF Printers",
      screenPrinting: "Screen Printing",
      cncRouting: "CNC Routing",
      vinylPlotters: "Vinyl Plotters",
      printOnDemand: "Print-on-Demand",
      customVectorTitle: "Need a custom vector?",
      customVectorDesc: "We can digitize and vector convert any physical motif, photo, or sketch into clean cut paths.",
      requestCustomBtn: "Request Custom Artwork"
    },
    toolkitPage: {
      breadcrumbHome: "Home",
      breadcrumbCurrent: "3D Mockup Studio",
      titleMain: "3D Mockup ",
      titleHighlight: "Studio",
      description: "Visualize your custom artwork on apparel in real-time with our interactive 3D studio viewer. Upload artwork, adjust garment colors, and test print finishes.",
      studioHeader: "Interactive Mockup Studio",
      syncNote: "Both canvases update color in sync",
      frontView: "Front View",
      backView: "Back View",
      frontHint: "Drag · Resize · Rotate the logo on the T-shirt",
      backHint: "Drag · Resize · Rotate the back graphic",
      addToCartBtn: "Add Custom Design to Cart"
    },
    canvasPage: {
      breadcrumbHome: "Home",
      breadcrumbCurrent: "Canvas Builder",
      titleMain: "Canvas ",
      titleHighlight: "Builder",
      description: "Arrange, scale, duplicate, and optimize your print files onto high-resolution DTF sheets with instant AI background removal and resolution upscaling tools."
    },
    homeSections: {
      trustedStrip: "Trusted by 1,000+ Apparel Brands, Studios & Manufacturers",
      howBadge: "Process",
      howTitle: "How It Works",
      steps: {
        s1Title: "Upload Your Design", s1Desc: "Upload artwork in PNG, JPG, or PDF format. We support all major file types.",
        s2Title: "Arrange Your Sheet", s2Desc: "Resize and organize your designs on the gang sheet for maximum efficiency.",
        s3Title: "Preview in 3D", s3Desc: "See your design on realistic apparel before you commit to printing.",
        s4Title: "We Print & Ship", s4Desc: "Premium quality printing delivered to your door within 24–48 hours."
      },
      catalogBadge: "Catalog",
      catalogTitle: "Shop Our Printing Solutions",
      catalogDesc: "Explore our full range of custom stencils, industrial DTF transfers, traditional Cap Batik stamps, precision cutting, and print consumables.",
      categories: {
        stencilsTitle: "Stencils", stencilsDesc: "Laser-cut Mylar stencils for saree work, hand painting, and wall art — cut clean, every time.", stencilsBadge: "6 Categories",
        screenTitle: "Screen Printing", screenDesc: "Exposed screens, vectorized artwork, and positive tracing films, made to your exact specs.", screenBadge: "Professional Grade",
        dtfTitle: "DTF Printing", dtfDesc: "Custom sheet layouts, anime sticker packs, and cloth transfers — our most popular category.", dtfBadge: "Hot Seller",
        batikTitle: "Batik Stamps", batikDesc: "Traditional copper and hand-carved wood Cap Batik stamps, made the way they've always been made.", batikBadge: "Traditional Art",
        laserTitle: "Laser Cutting", laserDesc: "Precision CO2 laser cutting for acrylic, wood, and custom profiles — built to your file, not a template.", laserBadge: "CNC Precision",
        consumablesTitle: "Consumables", consumablesDesc: "Inks, hot melt powder, film rolls, emulsions, and wash chemicals — the supplies that keep your shop running.", consumablesBadge: "Industrial Grade",
        tutorialsTitle: "Video Tutorials", tutorialsDesc: "Learn how to master Screen & DTF printing with our step-by-step video guides.", tutorialsBadge: "Learn & Master",
        feedbacksTitle: "Customer Feedbacks", feedbacksDesc: "See what our existing customers have to say about Bitium Technology Products.", feedbacksBadge: "Real Stories",
        browseBtn: "Browse Products"
      },
      whyBadge: "Benefits",
      whyTitle: "The Bitium Advantage",
      benefits: {
        b1Title: "Premium Quality", b1Desc: "Top-grade materials and advanced printing technology for lasting results.",
        b2Title: "Vibrant Colors", b2Desc: "High-opacity, ultra-vibrant inks that stand out on any fabric color.",
        b3Title: "No Minimum Order", b3Desc: "Order one sheet or thousands — no minimums, ever.",
        b4Title: "Expert Support", b4Desc: "Our team is here to help at every step of your order.",
        b5Title: "Satisfaction Guarantee", b5Desc: "If you're not happy, we make it right. No questions asked."
      },
      galleryBadge: "Gallery",
      galleryTitle: "See Our Work",
      viewCatalogueBtn: "View full catalogue",
      dtfShowcaseBadge: "Professional DTF Printing",
      dtfShowcaseTitle1: "Custom ",
      dtfShowcaseTitle2: "Transfers Made Simple.",
      dtfShowcaseDesc: "Upload your artwork, arrange your gang sheet, preview your final print in 3D, and order professional-quality transfers in minutes.",
      dtfShowcaseBtnCreate: "Create Your DTF Sheet",
      dtfShowcaseBtnBrowse: "Browse Products",
      dtfShowcaseCardTitle: "3D Preview Ready",
      dtfShowcaseCardSub: "6 designs on sheet",
      reviewsBadge: "Reviews",
      reviewsTitle: "What Our Customers Say",
      testimonialsList: [
        { name: "Kavinda P.", role: "Apparel Brand Owner", rating: 5, text: '"Bitium Technology provided the cleanest DTF prints I\'ve ever seen. The colors popped instantly."', avatar: "KP" },
        { name: "Design Studio X", role: "Interior Designers", rating: 5, text: '"The custom laser cut stencils for our mural project were flawless. Exceeded expectations!"', avatar: "DS" },
        { name: "Sahan M.", role: "Local Screen Printer", rating: 5, text: '"Fastest screen exposing service in the city. Really appreciate the quick turnarounds."', avatar: "SM" }
      ],
      faqBadge: "SUPPORT HUB",
      faqTitle1: "Frequently Asked ",
      faqTitle2: "Questions",
      faqDesc: "Need help with your design, files, or custom sheets? Find answers to commonly asked questions here, or reach out directly to our printing experts.",
      faqSupportBtn: "Contact Support",
      faqs: [
        { q: "What is DTF printing?", a: "DTF (Direct-to-Film) printing is a modern transfer method where designs are printed onto a special film and then heat-pressed onto garments. It produces vibrant, full-color prints on virtually any fabric." },
        { q: "What file formats do you accept?", a: "We accept PNG (preferred for transparency), JPG, PDF, AI, and PSD files. For best results, submit artwork at 300 DPI or higher with a transparent background." },
        { q: "How long does shipping take?", a: "Standard production takes 24 hours from order confirmation. Domestic shipping typically adds 2–5 business days. Express overnight options are available at checkout." },
        { q: "Do you offer bulk discounts?", a: "Yes! Orders over 50 sheets receive 10% off, over 100 sheets get 20% off, and custom pricing is available for enterprise and wholesale customers. Contact us for a quote." }
      ],
      ctaBadge: "Ready to get started?",
      ctaTitle1: "Ready to Print",
      ctaTitle2: "Your Design?",
      ctaDesc: "Create your DTF sheet now and see your design come to life before printing. No minimums, 24-hour turnaround.",
      ctaBtn: "Start Your Design Now"
    }
  },
  si: {
    nav: {
      home: "මුල් පිටුව",
      products: "අපගේ නිෂ්පාදන",
      designStudio: "නිර්මාණ මැදිරිය",
      howItWorks: "ක්‍රියාත්මක වන ආකාරය",
      portfolio: "අපගේ නිමවුම්",
      about: "අප පිළිබඳව",
      contact: "අප හා සම්බන්ධ වන්න",
      stencil: "ස්ටෙන්සිල්",
      batikStamp: "බතික් මුද්‍රා",
      downloads: "බාගත කිරීම්",
      materials: "ද්‍රව්‍ය හා අමුද්‍රව්‍ය",
      toolkit: "මෙවලම් කට්ටලය",
      community: "ප්‍රජා පුවරුව",
      allStencils: "සියලුම ස්ටෙන්සිල්",
      handPainting: "හෑන්ඩ්",
      saree: "සාරි මෝස්තර",
      toteBags: "ටෝට් බෑග්",
      batik: "බතික් මෝස්තර",
      wallDecoration: "බිත්ති සැරසිලි",
      titanium: "ටයිටේනියම්",
      allScreenPrinting: "සියලුම ස්ක්‍රීන් මුද්‍රණ",
      screenExposed: "එක්ස්පෝස් කළ ස්ක්‍රීන්",
      tracingPrintouts: "ට්‍රේසිං ප්‍රින්ට්-අවුට්",
      positivePrintouts: "පොසිටිව් ප්‍රින්ට්-අවුට්",
      cmykHalftone: "CMYK හාෆ්ටෝන්",
      allDtfPrinting: "සියලුම DTF මුද්‍රණ",
      tshirtDesign: "ටී-ෂර්ට් නිර්මාණ",
      dtfSticker: "DTF ස්ටිකර්",
      dtfCloth: "DTF රෙදි මුද්‍රණ",
      allBatikStamps: "සියලුම බතික් මුද්‍රා",
      capBatik: "කැප් බතික්",
      allLaserCutting: "සියලුම ලේසර් කැපුම්",
      acrylicCutEngrave: "ඇක්‍රිලික් කැපුම් සහ කැටයම්",
      woodEngraving: "ලී කැටයම්",
      customProfiles: "විශේෂ ඇණවුම් කැපුම්"
    },
    subNav: {
      dtfPrinting: "DTF මුද්‍රණය",
      screenPrinting: "ස්ක්‍රීන් මුද්‍රණය",
      laserCutting: "ලේසර් කැපුම්",
      engraving: "කැටයම් කිරීම්",
      canvasBuilder: "කැන්වස් නිර්මාණකරණය",
      mockupStudio: "3D මොකප් ස්ටුඩියෝ",
      sizeGuide: "ප්‍රමාණ මඟපෙන්වීම"
    },
    hero: {
      badge: "වෘත්තීය මට්ටමේ ස්ටෙන්සිල්, ස්ක්‍රීන් සහ DTF මුද්‍රණය",
      titlePrefix: "උසස් තත්වයේ ",
      titleHighlight: "DTF සහ මුද්‍රණ",
      titleSuffix: " සේවාවන්, දැන් ඉතා පහසුවෙන්.",
      description: "ඔබේ නිර්මාණය අප වෙත ලබාදී, 3D තාක්ෂණයෙන් පෙරදසුනක් පරීක්ෂා කර, මිනිත්තු කිහිපයක් ඇතුළත උසස් තත්වයේ මුද්‍රණ සහ ලේසර් කැපුම් සේවා සඳහා ඇණවුම් කරන්න.",
      btnCreate: "ඔබේ නිර්මාණය අරඹන්න",
      btnBrowse: "අපගේ සේවාවන්",
      stats: {
        accuracyTitle: "99% මුද්‍රණ නිරවද්‍යතාවය",
        accuracySub: "දීප්තිමත් සහ කල්පවතින",
        turnaroundTitle: "පැය 24ක් තුළ නිමාව",
        turnaroundSub: "වේගවත් නිෂ්පාදනය",
        ordersTitle: "10,000+ ඇණවුම්",
        ordersSub: "තෘප්තිමත් පාරිභෝගිකයින්",
        ratingTitle: "5★ තෘප්තිය",
        ratingSub: "ඉහළම පාරිභෝගික සේවාව"
      },
      previewBadge: "3D පෙරදසුන සූදානම්",
      previewBtn: "3D තාක්ෂණයෙන් බලන්න"
    },
    heroCards: {
      customStencils: {
        title: "විශේෂ ස්ටෙන්සිල් ඇණවුම්",
        desc: "ඔබේ නිර්මාණාත්මක අවශ්‍යතා සඳහා ලේසර්-කට් ස්ටෙන්සිල්."
      },
      dtfFilmRolls: {
        title: "DTF ෆිල්ම් රෝල්",
        desc: "වර්ණවත් සහ කල් පවතින මුද්‍රණ සඳහා උසස් තත්ත්වයේ ෆිල්ම් රෝල්."
      },
      screenPrinting: {
        title: "ස්ක්‍රීන් ප්‍රින්ටින්",
        desc: "වෘත්තීය ස්ක්‍රීන් ප්‍රින්ටින් අමුද්‍රව්‍ය සහ උපාංග."
      },
      batikStamps: {
        title: "බාතික් අච්චු",
        desc: "මනාව නිමවන ලද සාම්ප්‍රදායික බාතික් අච්චු."
      },
      laserEngraving: {
        title: "ලේසර් කැටයම්",
        desc: "සූක්ෂ්ම CNC ලේසර් කැපුම් සහ කැටයම් විසඳුම්."
      },
      toolkitStudio: {
        title: "ටූල්කිට් ස්ටුඩියෝ",
        desc: "අන්තර්ක්‍රියාකාරී 3D මොකප් ස්ටුඩියෝ සහ කැන්වස් බිල්ඩර්."
      }
    },
    downloadsPage: {
      breadcrumbHome: "මුල් පිටුව",
      breadcrumbCurrent: "බාගත කිරීම්",
      titleMain: "ඩිජිටල් මෝස්තර සහ ",
      titleHighlight: "බාගත කිරීම්",
      description: "උසස් තත්ත්වයේ වෙනස් කළ හැකි වෙක්ටර් ගොනු, බාතික් මෝස්තර, ලේසර් කැපුම් පත්, සහ DTF ගෑං ෂීට් - ගෙවීම් කළ සැනින් Google Drive හරහා ලබාගැනීමට.",
      searchPlaceholder: "වෙක්ටර් මෝස්තර, SVG, ස්ටෙන්සිල් සොයන්න...",
      sortByLabel: "තෝරන්න:",
      sortFeatured: "විශේෂාංග",
      sortPriceLow: "මිල: අඩු සිට වැඩි",
      sortPriceHigh: "මිල: වැඩි සිට අඩු",
      sortName: "අකාරාදී ලෙස (A-Z)",
      catAll: "සියලුම නිර්මාණ",
      catBatik: "සාම්ප්‍රදායික බාතික්",
      catVector: "වෙක්ටර් & SVG",
      catDtf: "DTF ෂීට්",
      catWall: "බිත්ති සැරසිලි",
      instantAccess: "ක්‍ෂණික ප්‍රවේශය",
      buyNow: "දැන් මිලදී ගන්න",
      whyTitle: "අපගේ ඩිජිටල් නිර්මාණ තෝරාගත යුත්තේ ඇයි?",
      why1Title: "පිරිසිදු වෙක්ටර් ජ්‍යාමිතිය",
      why1Desc: "CNC සහ ලේසර් කැපුම් සඳහා බිඳීම් නොමැතිව ප්‍රශස්ත කළ පත්.",
      why2Title: "ක්‍ෂණික Google Drive ප්‍රවේශය",
      why2Desc: "ගෙවීමෙන් පසු ස්වයංක්‍රීයව බාගත කිරීමේ ලින්ක් ලැබෙනු ඇත.",
      why3Title: "වාණිජ බලපත්‍රය ඇතුළත්",
      why3Desc: "නිෂ්පාදන සහ ඇඳුම් මුද්‍රණ සඳහා පූර්ණ වාණිජ භාවිත අයිතිය.",
      perfectTitle: "ගැළපෙන ක්ෂේත්‍ර",
      laserCutters: "ලේසර් කැපුම්",
      dtfPrinters: "DTF මුද්‍රණ",
      screenPrinting: "ස්ක්‍රීන් මුද්‍රණ",
      cncRouting: "CNC කැටයම්",
      vinylPlotters: "විනයිල් ප්ලෝටර්",
      printOnDemand: "Print-on-Demand",
      customVectorTitle: "විශේෂිත වෙක්ටර් නිර්මාණයක් අවශ්‍යද?",
      customVectorDesc: "ඕනෑම ඡායාරූපයක් හෝ මෝස්තරයක් පිරිසිදු ලේසර් කැපුම් පත් බවට පරිවර්තනය කරගත හැක.",
      requestCustomBtn: "විශේෂ නිර්මාණ ඉල්ලුම් කරන්න"
    },
    toolkitPage: {
      breadcrumbHome: "මුල් පිටුව",
      breadcrumbCurrent: "මෙවලම් කට්ටලය",
      titleMain: "3D මොකප් ",
      titleHighlight: "මෙවලම් කට්ටලය",
      description: "අපගේ අන්තර්ක්‍රියාකාරී 3D ස්ටුඩියෝව හරහා ඔබේ ඇඳුම් මුද්‍රණ නිර්මාණ තථ්‍ය කාලීනව (real-time) පෙරදසුන් බලන්න. ඔබේ නිර්මාණය එක් කරන්න, රෙදි වල පාට වෙනස් කරන්න සහ මුද්‍රණ මාදිලි පරීක්ෂා කරන්න.",
      studioHeader: "අන්තර්ක්‍රියාකාරී මොකප් ස්ටුඩියෝ",
      syncNote: "කැන්වස් දෙකෙහිම වර්ණ එකවර යාවත්කාලීන වේ",
      frontView: "ඉදිරිපස දසුන",
      backView: "පසුපස දසුන",
      frontHint: "ටී-ෂර්ට් එක මත ලාංඡනය ඇදගෙන යන්න · ප්‍රමාණය වෙනස් කරන්න · කරකවන්න",
      backHint: "පසුපස මුද්‍රණය ඇදගෙන යන්න · ප්‍රමාණය වෙනස් කරන්න · කරකවන්න",
      addToCartBtn: "කාට් එකට එකතු කරන්න"
    },
    canvasPage: {
      breadcrumbHome: "මුල් පිටුව",
      breadcrumbCurrent: "කැන්වස් බිල්ඩර්",
      titleMain: "කැන්වස් ",
      titleHighlight: "බිල්ඩර්",
      description: "AI පසුබිම් ඉවත් කිරීමේ සහ විභේදන ඉහළ නැංවීමේ මෙවලම් සමඟින් ඔබේ මුද්‍රණ ගොනු උසස් තත්ත්වයේ DTF ෂීට් මත පහසුවෙන් සකස් කරන්න, ප්‍රමාණය වෙනස් කරන්න, සහ ප්‍රශස්ත කරන්න."
    },
    homeSections: {
      trustedStrip: "ඇඟලුම් සන්නාම, ස්ටුඩියෝ සහ නිෂ්පාදකයින් 1,000+ කට වැඩි පිරිසකගේ විශ්වාසය දිනූ",
      howBadge: "ක්‍රියාවලිය",
      howTitle: "ක්‍රියාත්මක වන ආකාරය",
      steps: {
        s1Title: "ඔබේ නිර්මාණය එකතු කරන්න", s1Desc: "PNG, JPG, හෝ PDF ආකාරයෙන් ඔබේ මෝස්තරය අප වෙත එවන්න. සියලුම ගොනු මාදිලි සඳහා සහාය දක්වයි.",
        s2Title: "ෂීට් එක සකස් කරගන්න", s2Desc: "අපගේ කැන්වස් බිල්ඩරය මගින් මෝස්තර ප්‍රමාණය සහ පිහිටීම පහසුවෙන් සකස් කරන්න.",
        s3Title: "3D තාක්ෂණයෙන් පෙරදසුන බලන්න", s3Desc: "මුද්‍රණයට පෙර ඔබේ නිර්මාණය ඇඳුම මත පෙනෙන ආකාරය 3D තාක්ෂණයෙන් පරීක්ෂා කරන්න.",
        s4Title: "මුද්‍රණය කර නිවසටම ගෙන්වා ගන්න", s4Desc: "පැය 24-48ක් ඇතුළත උසස්ම ගුණාත්මක භාවයෙන් මුද්‍රණය කර ඔබේ නිවසටම එවීම."
      },
      catalogBadge: "සේවා නාමාවලිය",
      catalogTitle: "අපගේ මුද්‍රණ සහ තාක්ෂණික විසඳුම්",
      catalogDesc: "විශේෂිත ස්ටෙන්සිල්, කාර්මික DTF මුද්‍රණ, සාම්ප්‍රදායික බාතික් අච්චු, ලේසර් කැපුම් සහ මුද්‍රණ අමුද්‍රව්‍ය සියල්ල එකම තැනකින් ලබාගන්න.",
      categories: {
        stencilsTitle: "ස්ටෙන්සිල්", stencilsDesc: "සාරි මෝස්තර, බිත්ති සැරසිලි සහ අතින් කරනු ලබන චිත්‍ර නිර්මාණ සඳහා සුදුසු ලේසර්-කට් මයිලාර් ස්ටෙන්සිල්.", stencilsBadge: "කාණ්ඩ 6ක්",
        screenTitle: "ස්ක්‍රීන් මුද්‍රණය", screenDesc: "ඔබේ අවශ්‍යතාවයට ගැලපෙන එක්ස්පෝස් කළ ස්ක්‍රීන්, වෙක්ටර් මෝස්තර සහ උපාංග.", screenBadge: "වෘත්තීය මට්ටමේ",
        dtfTitle: "DTF මුද්‍රණය", dtfDesc: "වර්ණවත් ඇඳුම් මුද්‍රණ, DTF ස්ටිකර් සහ ෆිල්ම් ෂීට් - අපගේ ජනප්‍රියතම සේවාව.", dtfBadge: "ඉහළම ඉල්ලුම",
        batikTitle: "බාතික් අච්චු", batikDesc: "තඹ සහ අතින් කැටයම් කළ ලීයෙන් නිමවූ සාම්ප්‍රදායික බාතික් අච්චු (Cap Batik Stamps).", batikBadge: "සාම්ප්‍රදායික කලා",
        laserTitle: "ලේසර් කැපුම්", laserDesc: "ඇක්‍රිලික්, ලී සහ විශේෂිත ආකෘති සඳහා සූක්ෂ්ම CO2 CNC ලේසර් කැපුම් විසඳුම්.", laserBadge: "CNC නිරවද්‍යතාව",
        consumablesTitle: "මුද්‍රණ අමුද්‍රව්‍ය", consumablesDesc: "උසස් තත්ත්වයේ තීන්ත, පවුඩර්, ෆිල්ම් රෝල් සහ රසායනික ද්‍රව්‍ය.", consumablesBadge: "කාර්මික ශ්‍රේණියේ",
        tutorialsTitle: "වීඩියෝ මාර්ගෝපදේශ", tutorialsDesc: "ස්ක්‍රීන් සහ DTF මුද්‍රණ ශිල්පය මුල සිට ඉගෙනගැනීමට අපගේ වීඩියෝ බලන්න.", tutorialsBadge: "ඉගෙනගන්න",
        feedbacksTitle: "පාරිභෝගික අදහස්", feedbacksDesc: "අපගේ නිෂ්පාදන භාවිත කළ පාරිභෝගිකයින්ගේ අත්දැකීම් සහ අදහස්.", feedbacksBadge: "සත්‍ය කතා",
        browseBtn: "නිෂ්පාදන බලන්න"
      },
      whyBadge: "විශේෂත්වයන්",
      whyTitle: "Bitium Technology තෝරාගත යුත්තේ ඇයි?",
      benefits: {
        b1Title: "උසස්ම ගුණාත්මකභාවය", b1Desc: "කල්පවතින නිමාවක් සඳහා උසස්ම තත්ත්වයේ අමුද්‍රව්‍ය සහ නවීන යන්ත්‍ර සූත්‍ර.",
        b2Title: "දීප්තිමත් වර්ණ", b2Desc: "ඕනෑම වර්ණයක රෙදි මත කැපී පෙනෙන ඉහළ දීප්තියකින් යුත් තීන්ත.",
        b3Title: "අවම ඇණවුම් සීමා නැත", b3Desc: "එක් ෂීට් එකක් හෝ දහස් ගණනක් - කැමති ප්‍රමාණයකින් ඇණවුම් කරන්න.",
        b4Title: "විශේෂඥ සහාය", b4Desc: "ඔබේ ඇණවුමේ සෑම පියවරකදීම සහාය වීමට අපගේ තාක්ෂණික කණ්ඩායම සූදානම්.",
        b5Title: "100% තෘප්තිමත්භාවය", b5Desc: "අපගේ සේවාව පිළිබඳ පූර්ණ විශ්වාසය සහ වගකීම."
      },
      galleryBadge: "අපගේ නිර්මාණ",
      galleryTitle: "අපගේ පෙර මුද්‍රණ සාම්පල",
      viewCatalogueBtn: "සම්පූර්ණ නාමාවලිය නරඹන්න",
      dtfShowcaseBadge: "වෘත්තීය DTF මුද්‍රණ සේවාව",
      dtfShowcaseTitle1: "ඔබේම ",
      dtfShowcaseTitle2: "DTF මුද්‍රණ ඉතා පහසුවෙන්.",
      dtfShowcaseDesc: "ඔබේ මෝස්තරය එක් කරන්න, ෂීට් එක මත සකස් කරගන්න, 3D මගින් පෙරදසුන බලන්න, සහ මිනිත්තු කිහිපයකින් ඇණවුම් කරන්න.",
      dtfShowcaseBtnCreate: "ඔබේ DTF ෂීට් එක සාදන්න",
      dtfShowcaseBtnBrowse: "නිෂ්පාදන නරඹන්න",
      dtfShowcaseCardTitle: "3D පෙරදසුන සූදානම්",
      dtfShowcaseCardSub: "ෂීට් එක මත මෝස්තර 6ක්",
      reviewsBadge: "පාරිභෝගික අදහස්",
      reviewsTitle: "අපගේ පාරිභෝගිකයින් පවසන දේ",
      testimonialsList: [
        { name: "කවින්ද පී.", role: "ඇඟලුම් සන්නාම හිමිකරු", rating: 5, text: '"Bitium Technology වෙතින් ලැබුණු DTF මුද්‍රණ අතිශය පැහැදිලි සහ උසස් තත්ත්වයෙන් යුක්තයි. වර්ණ ඉතා දීප්තිමත්ව පෙනෙනවා."', avatar: "KP" },
        { name: "ඩිසයින් ස්ටුඩියෝ X", role: "අභ්‍යන්තර නිර්මාණ ශිල්පීන්", rating: 5, text: '"අපගේ බිත්ති සැරසිලි ව්‍යාපෘතිය සඳහා ලබාගත් ලේසර්-කට් ස්ටෙන්සිල් ඉතා සූක්ෂ්මව නිම කර තිබුණා. අප බලාපොරොත්තු වූවාටත් වඩා විශිෂ්ටයි!"', avatar: "DS" },
        { name: "සහන් එම්.", role: "ස්ක්‍රීන් මුද්‍රණ ශිල්පී", rating: 5, text: '"නගරයේ වේගවත්ම ස්ක්‍රීන් එක්ස්පෝසිං සේවාව. ඉතා ඉක්මනින් ඇණවුම භාරදීම පිළිබඳව ස්තුතියි."', avatar: "SM" }
      ],
      faqBadge: "සහායක මධ්‍යස්ථානය",
      faqTitle1: "නිතර අසන ",
      faqTitle2: "ප්‍රශ්න",
      faqDesc: "ඔබේ නිර්මාණය හෝ ඇණවුම පිළිබඳ ගැටලු තිබේද? පහත නිතර අසන ප්‍රශ්න බලන්න, නැතහොත් අපගේ තාක්ෂණික කණ්ඩායම අමතන්න.",
      faqSupportBtn: "තාක්ෂණික සහාය ලබාගන්න",
      faqs: [
        { q: "DTF මුද්‍රණය යනු කුමක්ද?", a: "DTF (Direct-to-Film) මුද්‍රණය යනු නවීන තාක්ෂණික ක්‍රමයක් වන අතර එහිදී මෝස්තර විශේෂිත ෆිල්ම් එකකට මුද්‍රණය කර පසුව ඇඳුම් මතට තාපය මගින් තද කරනු ලැබේ. එය ඕනෑම රෙදි වර්ගයක් මත දීප්තිමත්, පූර්ණ වර්ණ මුද්‍රණ ලබා දෙයි." },
        { q: "ඔබ භාරගන්නා ගොනු මාදිලි මොනවාද?", a: "අපි PNG (පසුබිම් රහිත ගොනු සඳහා වඩාත් සුදුසුයි), JPG, PDF, AI සහ PSD ගොනු භාර ගනිමු. හොඳම ප්‍රතිඵල සඳහා 300 DPI හෝ ඊට වැඩි විභේදනයක් සහිත පසුබිම් රහිත නිර්මාණ එවන්න." },
        { q: "බෙදාහැරීමට කොපමණ කාලයක් ගතවේද?", a: "ඇණවුම තහවුරු කර පැය 24ක් ඇතුළත මුද්‍රණය නිම කරනු ලැබේ. දිවයින පුරා බෙදාහැරීමට සාමාන්‍යයෙන් වැඩකරන දින 2-5ක් ගතවේ. ඉක්මන් බෙදාහැරීමේ ක්‍රමද ඇත." },
        { q: "තොග ඇණවුම් සඳහා වට්ටම් ලැබේද?", a: "ඔව්! ෂීට් 50කට වැඩි ඇණවුම් සඳහා 10%ක වට්ටමක්ද, ෂීට් 100කට වැඩි ඇණවුම් සඳහා 20%ක වට්ටමක්ද හිමිවේ. විශාල තොග ඇණවුම් සඳහා විශේෂ මිල ගණන් ලබාගත හැක." }
      ],
      ctaBadge: "ඇණවුම ලබාදීමට සූදානම්ද?",
      ctaTitle1: "ඔබේ නිර්මාණය",
      ctaTitle2: "මුද්‍රණය කරගමුද?",
      ctaDesc: "දැනම ඔබේ DTF ෂීට් එක සකස් කර 3D තාක්ෂණයෙන් බලන්න. අවම ඇණවුම් සීමා නැත, පැය 24ක් ඇතුළත නිමාව.",
      ctaBtn: "දැනම ඔබේ නිර්මාණය අරඹන්න"
    }
  }
};
