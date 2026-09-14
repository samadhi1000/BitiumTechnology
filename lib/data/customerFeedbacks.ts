export interface CustomerFeedbackItem {
  id: string;
  name: string;
  nameSi?: string;
  role: string;
  roleSi?: string;
  rating: number; // 1 to 5
  text: string;
  textSi?: string;
  avatar: string; // Initials or short tag (e.g. "KP", "DS")
  avatarBg?: string; // Background color for the avatar badge (Hex/Tailwind class)
  image: string; // High-res background image of work/customer
  categoryTag?: string; // Optional badge (e.g. "DTF Printing", "Laser Cut Stencils")
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BITIUM TECHNOLOGY - CUSTOMER FEEDBACK & REVIEWS DATA
 * ─────────────────────────────────────────────────────────────────────────────
 * Customer reviews can be manually edited, added, or deleted below.
 * Each review card displays the background image, 5-star rating, review quote,
 * avatar initials, customer name, and role.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const defaultCustomerFeedbacks: CustomerFeedbackItem[] = [
  {
    id: 'review-1',
    name: 'Kavinda P.',
    nameSi: 'කවින්ද පී.',
    role: 'Apparel Brand Owner',
    roleSi: 'ඇඟලුම් සන්නාම හිමිකරු',
    rating: 5,
    text: '"Bitium Technology provided the cleanest DTF prints I\'ve ever seen. The colors popped instantly."',
    textSi: '"Bitium Technology වෙතින් ලැබුණු DTF මුද්‍රණ අතිශය පැහැදිලි සහ උසස් තත්ත්වයෙන් යුක්තයි. වර්ණ ඉතා දීප්තිමත්ව පෙනෙනවා."',
    avatar: 'KP',
    avatarBg: '#22c55e', // Vibrant green
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=80',
    categoryTag: 'DTF Printing'
  },
  {
    id: 'review-2',
    name: 'Design Studio X',
    nameSi: 'ඩිසයින් ස්ටුඩියෝ X',
    role: 'Interior Designers',
    roleSi: 'අභ්‍යන්තර නිර්මාණ ශිල්පීන්',
    rating: 5,
    text: '"The custom laser cut stencils for our mural project were flawless. Exceeded expectations!"',
    textSi: '"අපගේ බිත්ති සැරසිලි ව්‍යාපෘතිය සඳහා ලබාගත් ලේසර්-කට් ස්ටෙන්සිල් ඉතා සූක්ෂ්මව නිම කර තිබුණා. අප බලාපොරොත්තු වූවාටත් වඩා විශිෂ්ටයි!"',
    avatar: 'DS',
    avatarBg: '#8b5cf6', // Violet
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    categoryTag: 'Laser Cut Stencils'
  },
  {
    id: 'review-3',
    name: 'Sahan M.',
    nameSi: 'සහන් එම්.',
    role: 'Local Screen Printer',
    roleSi: 'ස්ක්‍රීන් මුද්‍රණ ශිල්පී',
    rating: 5,
    text: '"Fastest screen exposing service in the city. Really appreciate the quick turnarounds."',
    textSi: '"නගරයේ වේගවත්ම ස්ක්‍රීන් එක්ස්පෝසිං සේවාව. ඉතා ඉක්මනින් ඇණවුම භාරදීම පිළිබඳව ස්තුතියි."',
    avatar: 'SM',
    avatarBg: '#0284c7', // Sky blue
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80',
    categoryTag: 'Screen Printing'
  },
  {
    id: 'review-4',
    name: 'Niluka Senanayake',
    nameSi: 'නිලූකා සේනානායක',
    role: 'Batik Saree Designer',
    roleSi: 'බතික් මෝස්තර නිර්මාණ ශිල්පිනී',
    rating: 5,
    text: '"The precision of their custom Cap Batik stamps is incredible. Fine details stamped onto silk effortlessly."',
    textSi: '"බිටියම් වෙතින් ලබාගත් කැප් බතික් මුද්දරවල නිමාව ඉතා විශිෂ්ටයි. සිල්ක් රෙදි මත ඉතා පහසුවෙන් මුද්‍රණය කළ හැක."',
    avatar: 'NS',
    avatarBg: '#e11d48', // Rose red
    image: 'https://images.unsplash.com/photo-1606159068539-43f36b99d1b2?auto=format&fit=crop&w=1000&q=80',
    categoryTag: 'Batik Stamps'
  },
  {
    id: 'review-5',
    name: 'Overtime Co.',
    nameSi: 'ඕවර්ටයිම් සමාගම',
    role: 'Streetwear Merch Brand',
    roleSi: 'ස්ට්‍රීට්වෙයාර් ඇඟලුම් සන්නාමය',
    rating: 5,
    text: '"From custom gang sheets to 3D garment previews, Bitium Technology has transformed our manufacturing workflow."',
    textSi: '"DTF ගැන්ග් ෂීට් සකස් කිරීමේ සිට 3D පෙරදසුන දක්වා බිටියම් අපගේ නිෂ්පාදන ක්‍රියාවලිය වඩාත් පහසු කළා."',
    avatar: 'OC',
    avatarBg: '#eab308', // Amber / Gold
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    categoryTag: 'Custom DTF & Apparel'
  }
];
