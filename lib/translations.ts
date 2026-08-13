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
      description: "From custom precision stencils to industrial DTF film rolls, exposed screen printing, and traditional batik stamps — explore our specialized print technology store.",
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
    }
  }
};
