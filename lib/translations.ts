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
    stencil?: string;
    batikStamp?: string;
    downloads?: string;
    materials?: string;
    toolkit?: string;
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
      stencil: "Stencil",
      batikStamp: "Batik Stamp",
      downloads: "Downloads",
      materials: "Materials / Consumables",
      toolkit: "Toolkit"
    },
    subNav: {
      dtfPrinting: "DTF Printing",
      screenPrinting: "Screen Printing",
      laserCutting: "Laser Cutting",
      engraving: "Engraving",
      canvasBuilder: "Canvas Builder",
      mockupStudio: "Mockup Studio",
      sizeGuide: "Size Guide"
    },
    hero: {
      badge: "Professional Grade Printing & Laser Technology",
      titlePrefix: "High-Definition ",
      titleHighlight: "Print Solutions",
      titleSuffix: " & Equipment",
      description: "From custom precision stencils to industrial DTF film rolls, exposed screen printing, and traditional batik stamps — explore our specialized print technology store.",
      btnCreate: "Launch DTF Canvas",
      btnBrowse: "Browse Catalog",
      stats: {
        accuracyTitle: "99% Print Accuracy",
        accuracySub: "Vibrant & Long Lasting",
        turnaroundTitle: "24h Turnaround",
        turnaroundSub: "Rapid Production",
        ordersTitle: "10,000+ Orders",
        ordersSub: "Satisfied Customers",
        ratingTitle: "5★ Satisfaction",
        ratingSub: "Top Customer Service"
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
      stencil: "ස්ටෙන්සිල් (Stencil)",
      batikStamp: "බතික් මුද්‍රා (Batik Stamp)",
      downloads: "බාගත කිරීම් (Downloads)",
      materials: "ද්‍රව්‍ය හා අමුද්‍රව්‍ය",
      toolkit: "මෙවලම් කට්ටලය"
    },
    subNav: {
      dtfPrinting: "DTF මුද්‍රණය",
      screenPrinting: "ස්ක්‍රීන් මුද්‍රණය",
      laserCutting: "ලේසර් කැපුම් (Laser Cutting)",
      engraving: "කැටයම් කිරීම් (Engraving)",
      canvasBuilder: "කැන්වස් නිර්මාණකරණය (Canvas Builder)",
      mockupStudio: "මොකප් මැදිරිය (Mockup Studio)",
      sizeGuide: "ප්‍රමාණ මඟපෙන්වීම (Size Guide)"
    },
    hero: {
      badge: "වෘත්තීය මට්ටමේ මුද්‍රණ සහ ලේසර් තාක්ෂණය",
      titlePrefix: "උසස් තත්වයේ ",
      titleHighlight: "DTF සහ මුද්‍රණ",
      titleSuffix: " සේවාවන්, දැන් ඉතා පහසුවෙන්.",
      description: "ඔබේ නිර්මාණය අප වෙත ලබාදී, 3D තාක්ෂණයෙන් පෙරදසුනක් පරීක්ෂා කර, මිනිත්තු කිහිපයක් ඇතුළත උසස් තත්වයේ මුද්‍රණ සහ ලේසර් කැපුම් සේවා සඳහා ඇණවුම් කරන්න.",
      btnCreate: "ඔබේ නිර්මාණය අරඹන්න",
      btnBrowse: "අපගේ සේවාවන්",
      stats: {
        accuracyTitle: "99%ක මුද්‍රණ නිරවද්‍යතාව",
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
