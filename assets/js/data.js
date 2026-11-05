/* =========================================================
   MaisonPRO · بيانات الموقع / Site data
   ⚠️ جميع العقارات والأسعار توضيحية (نسخة تجريبية).
   عدّل SITE_CONFIG لرقم واتساب الحقيقي قبل النشر.
   ========================================================= */

const SITE_CONFIG = {
  brand: 'MaisonPRO',
  whatsapp: '25377690223',          // ← الرقم بالصيغة الدولية بدون + ولا مسافات
  whatsappDisplay: '+253 77 69 02 23',
  phone: '+253 21 35 12 34',
  email: 'contact@maisonpro.dj',
  addressAr: 'شارع بورقيبة، وسط المدينة، جيبوتي',
  addressFr: 'Boulevard Bourguiba, Centre-ville, Djibouti',
  mapsUrl: 'https://maps.google.com/?q=Djibouti+Centre+ville',
  djfPerUsd: 177.721,
  djfPerEur: 192.5,
  maxImages: 6,
  pageSize: 6
};

/* الأحياء / quartiers */
const DISTRICTS = [
  { id: 'heron',    ar: 'حيرون',         fr: 'Héron',           en: 'Heron' },
  { id: 'haramous', ar: 'حرموس',         fr: 'Haramous',        en: 'Haramous' },
  { id: 'saudi',    ar: 'سيتي سعودي',    fr: 'Cité Saoudienne', en: 'Saudi City' },
  { id: 'wadjir',   ar: 'سيتي ودجير',    fr: 'Cité Wadjir',     en: 'Wadjir City' },
  { id: 'centre',   ar: 'وسط المدينة',   fr: 'Centre-ville',    en: 'Downtown' },
  { id: 'gabode',   ar: 'غابوديه',       fr: 'Gabode',          en: 'Gabode' },
  { id: 'balbala',  ar: 'بلبالة',        fr: 'Balbala',         en: 'Balbala' },
  { id: 'ambouli',  ar: 'أمبولي',        fr: 'Ambouli',         en: 'Ambouli' },
  { id: 'boulaos',  ar: 'بولوس',         fr: 'Boulaos',         en: 'Boulaos' },
  { id: 'salines',  ar: 'سالين غرب',     fr: 'Salines Ouest',   en: 'Salines West' },
  { id: 'arta',     ar: 'أرتا',          fr: 'Arta',            en: 'Arta' },
  { id: 'douda',    ar: 'دودة',          fr: 'Douda',           en: 'Douda' }
];

/* أنواع العقارات */
const TYPES = [
  { id: 'apartment', ar: 'شقة',        fr: 'Appartement', en: 'Apartment' },
  { id: 'villa',     ar: 'فيلا',       fr: 'Villa',       en: 'Villa' },
  { id: 'house',     ar: 'منزل',       fr: 'Maison',      en: 'House' },
  { id: 'office',    ar: 'مكتب',       fr: 'Bureau',      en: 'Office' },
  { id: 'studio',    ar: 'استوديو',    fr: 'Studio',      en: 'Studio' }
];

/* المرافق — الأساسيات أولاً (ماء/كهرباء/مولّد/تكييف) */
const AMENITIES = {
  water:     { ar: 'ماء على مدار الساعة', fr: 'Eau 24h/24',        en: 'Water 24/7',   key: true },
  power:     { ar: 'كهرباء مستقرة',       fr: 'Électricité stable', en: 'Stable power', key: true },
  generator: { ar: 'مولّد كهرباء',        fr: 'Groupe électrogène', en: 'Generator',    key: true },
  ac:        { ar: 'تكييف',               fr: 'Climatisation',      en: 'Air conditioning', key: true },
  tank:      { ar: 'خزان مياه',           fr: 'Réservoir d’eau',    en: 'Water tank' },
  internet:  { ar: 'إنترنت ألياف',        fr: 'Fibre optique',      en: 'Fibre internet' },
  parking:   { ar: 'موقف سيارة',          fr: 'Parking',            en: 'Parking' },
  security:  { ar: 'حراسة',               fr: 'Gardiennage',        en: 'Security' },
  furnished: { ar: 'مفروش',               fr: 'Meublé',             en: 'Furnished' },
  elevator:  { ar: 'مصعد',                fr: 'Ascenseur',          en: 'Elevator' },
  balcony:   { ar: 'شرفة',                fr: 'Balcon',             en: 'Balcony' },
  garden:    { ar: 'حديقة',               fr: 'Jardin',             en: 'Garden' },
  seaview:   { ar: 'إطلالة بحرية',        fr: 'Vue mer',            en: 'Sea view' },
  beach:     { ar: 'قريب من الشاطئ',      fr: 'Près de la plage',   en: 'Near the beach' },
  airport:   { ar: 'قريب من المطار',      fr: 'Près de l’aéroport', en: 'Near the airport' },
  solar:     { ar: 'طاقة شمسية',          fr: 'Solaire',            en: 'Solar power' }
};

/* ---------------------------------------------------------
   العقارات
   price   : سعر DJF — شهري للإيجار، إجمالي للبيع
   nightly : سعر الليلة DJF (للإيجار اليومي — للسياح)
   --------------------------------------------------------- */
const PROPERTIES = [
  {
    id: 'MP-1041',
    title: {
      ar: 'فيلا عصرية بإطلالة بحرية',
      fr: 'Villa contemporaine vue mer',
      en: 'Contemporary villa with sea view'
    },
    description: {
      ar: 'فيلا بتصميم عصري في حرموس، بنوافذ واسعة تفتح على البحر وحديقة خاصة. مثالية للعائلات أو للإقامة الطويلة، وقريبة من الشاطئ والمطاعم.',
      fr: 'Villa au design contemporain à Haramous, avec de grandes baies ouvertes sur la mer et un jardin privatif. Idéale pour une famille ou un long séjour, proche de la plage et des restaurants.',
      en: 'A contemporary villa in Haramous with wide sea-facing windows and a private garden. Ideal for a family or a long stay, close to the beach and restaurants.'
    },
    type: 'villa', deal: 'sale', district: 'haramous',
    price: 95000000, nightly: 0,
    rooms: 5, baths: 4, area: 420, floor: null, year: 2022,
    featured: true, isNew: true, postedDays: 3,
    images: ['villa-1', 'apt-2', 'kitchen-1', 'villa-3'],
    amenities: ['seaview', 'garden', 'parking', 'ac', 'water', 'power', 'security', 'solar'],
    owner: { name: 'عبدالقادر حسن', phone: '25377011223' }
  },
  {
    id: 'MP-1038',
    title: {
      ar: 'فيلا عائلية في حيرون',
      fr: 'Villa familiale à Héron',
      en: 'Family villa in Heron'
    },
    description: {
      ar: 'فيلا على طابقين في حي هادئ، بصالة استقبال واسعة ومطبخ مجهز بالكامل وغرف نوم بإضاءة طبيعية. حديقة مناسبة للأطفال وموقف لسيارتين.',
      fr: 'Villa sur deux niveaux dans un quartier calme : grand séjour, cuisine entièrement équipée et chambres lumineuses. Jardin adapté aux enfants et parking pour deux voitures.',
      en: 'A two-storey villa in a quiet neighbourhood with a large lounge, fully fitted kitchen and bright bedrooms. A garden suited to children and parking for two cars.'
    },
    type: 'villa', deal: 'rent', district: 'heron',
    price: 850000, nightly: 42000,
    rooms: 4, baths: 3, area: 320, floor: null, year: 2019,
    featured: true, isNew: false, postedDays: 9,
    images: ['villa-2', 'apt-3', 'kitchen-3', 'villa-4'],
    amenities: ['garden', 'parking', 'ac', 'water', 'power', 'generator', 'furnished', 'internet'],
    owner: { name: 'فاطمة أحمد', phone: '25377120345' }
  },
  {
    id: 'MP-1028',
    title: {
      ar: 'شقة مفروشة في سيتي سعودي',
      fr: 'Appartement meublé, Cité Saoudienne',
      en: 'Furnished apartment, Saudi City'
    },
    description: {
      ar: 'شقة مفروشة بالكامل بتصميم دافئ في سيتي سعودي، مع صالة واسعة ومطبخ مفتوح وشرفة. جاهزة للسكن فوراً، والإنترنت والتكييف مشمولان.',
      fr: 'Appartement entièrement meublé à la Cité Saoudienne : séjour spacieux, cuisine ouverte et balcon. Prêt à habiter, internet et climatisation inclus.',
      en: 'A fully furnished apartment in Saudi City with a spacious living room, open kitchen and balcony. Move-in ready, with internet and air conditioning included.'
    },
    type: 'apartment', deal: 'rent', district: 'saudi',
    price: 280000, nightly: 16000,
    rooms: 3, baths: 2, area: 140, floor: 3, year: 2020,
    featured: true, isNew: true, postedDays: 2,
    images: ['apt-1', 'kitchen-4', 'apt-4'],
    amenities: ['furnished', 'ac', 'water', 'power', 'internet', 'balcony', 'elevator', 'parking'],
    owner: { name: 'خديجة علي', phone: '25377455678' }
  },
  {
    id: 'MP-1025',
    title: {
      ar: 'شقة بإضاءة طبيعية — حيرون',
      fr: 'Appartement lumineux — Héron',
      en: 'Bright apartment — Heron'
    },
    description: {
      ar: 'شقة بنوافذ كبيرة وإضاءة طبيعية طوال اليوم، بغرفة نوم رئيسية بحمام خاص ومطبخ حديث. المبنى به مصعد وحراسة.',
      fr: 'Appartement très lumineux avec une suite parentale et une cuisine moderne. L’immeuble dispose d’un ascenseur et d’un gardien.',
      en: 'A bright apartment with a master suite and a modern kitchen. The building has a lift and a guard.'
    },
    type: 'apartment', deal: 'rent', district: 'heron',
    price: 350000, nightly: 19000,
    rooms: 3, baths: 2, area: 150, floor: 2, year: 2021,
    featured: false, isNew: false, postedDays: 7,
    images: ['apt-2', 'kitchen-1', 'apt-5'],
    amenities: ['ac', 'water', 'power', 'elevator', 'security', 'balcony', 'internet', 'parking'],
    owner: { name: 'إبراهيم داوود', phone: '25377566789' }
  },
  {
    id: 'MP-1031',
    title: {
      ar: 'فيلا كلاسيكية في وسط المدينة',
      fr: 'Villa classique, centre-ville',
      en: 'Classic villa, downtown'
    },
    description: {
      ar: 'فيلا بواجهة أنيقة ومدخل واسع في وسط المدينة، قريبة من السفارات والمدارس. مساحات مرتفعة وحديقة خلفية خاصة.',
      fr: 'Villa élégante à l’entrée spacieuse au centre-ville, proche des ambassades et des écoles. Belles hauteurs sous plafond et jardin arrière privatif.',
      en: 'An elegant villa with a spacious entrance downtown, close to embassies and schools. Generous ceiling heights and a private rear garden.'
    },
    type: 'villa', deal: 'sale', district: 'centre',
    price: 68000000, nightly: 0,
    rooms: 5, baths: 4, area: 380, floor: null, year: 2015,
    featured: false, isNew: false, postedDays: 21,
    images: ['villa-5', 'apt-1', 'kitchen-4'],
    amenities: ['garden', 'parking', 'security', 'ac', 'water', 'power', 'elevator'],
    owner: { name: 'سعيد عمر', phone: '25377344567' }
  },
  {
    id: 'MP-1019',
    title: {
      ar: 'شقة عائلية في بلبالة',
      fr: 'Appartement familial à Balbala',
      en: 'Family apartment in Balbala'
    },
    description: {
      ar: 'شقة بثلاث غرف نوم بسعر مناسب للعائلات، بصالة كبيرة ومطبخ مستقل وخزان مياه. المنطقة نشطة وفيها مدارس وأسواق قريبة.',
      fr: 'Appartement de trois chambres à un prix adapté aux familles : grand salon, cuisine séparée et réservoir d’eau. Quartier animé, proche des écoles et des marchés.',
      en: 'A three-bedroom apartment at a family-friendly price with a large lounge, separate kitchen and water tank. A lively area close to schools and markets.'
    },
    type: 'apartment', deal: 'rent', district: 'balbala',
    price: 165000, nightly: 9000,
    rooms: 3, baths: 2, area: 120, floor: 1, year: 2017,
    featured: false, isNew: false, postedDays: 11,
    images: ['apt-4', 'kitchen-2', 'apt-2'],
    amenities: ['water', 'power', 'generator', 'ac', 'parking'],
    owner: { name: 'علي محمود', phone: '25377788901' }
  },
  {
    id: 'MP-1013',
    title: {
      ar: 'مكتب في برج أعمال',
      fr: 'Bureau dans une tour d’affaires',
      en: 'Office in a business tower'
    },
    description: {
      ar: 'مكتب مجهز بمساحة مفتوحة قابلة للتقسيم، بتكييف مركزي وألياف بصرية ومصعدين. المبنى مؤمّن بكاميرات وحراسة، مع مواقف سيارات.',
      fr: 'Bureau aménagé avec plateau ouvert divisible, climatisation centralisée, fibre et deux ascenseurs. Immeuble sécurisé avec parking.',
      en: 'A fitted office with an open, subdividable floor plate, central air conditioning, fibre and two lifts. A secured building with parking.'
    },
    type: 'office', deal: 'rent', district: 'centre',
    price: 480000, nightly: 0,
    rooms: 3, baths: 2, area: 180, floor: 6, year: 2019,
    featured: true, isNew: false, postedDays: 5,
    images: ['office-1', 'office-2', 'office-3'],
    amenities: ['ac', 'water', 'power', 'elevator', 'security', 'internet', 'parking', 'generator'],
    owner: { name: 'شركة النيل العقارية', phone: '25377900123' }
  },
  {
    id: 'MP-1007',
    title: {
      ar: 'مكتب للبيع — حيرون',
      fr: 'Bureau à vendre — Héron',
      en: 'Office for sale — Heron'
    },
    description: {
      ar: 'مكتب بمساحة واسعة وتصميم داخلي راقٍ، مناسب لمقر شركة، مع قاعة اجتماعات ومطبخ صغير. مبنى حديث بمعايير أمنية عالية.',
      fr: 'Bureau de grande surface au design soigné, idéal comme siège social, avec salle de réunion et kitchenette. Immeuble récent et sécurisé.',
      en: 'A large, well-designed office suited to a company headquarters, with a meeting room and kitchenette. A recent, secure building.'
    },
    type: 'office', deal: 'sale', district: 'heron',
    price: 42000000, nightly: 0,
    rooms: 4, baths: 2, area: 200, floor: 3, year: 2022,
    featured: false, isNew: false, postedDays: 30,
    images: ['office-3', 'office-1'],
    amenities: ['ac', 'water', 'power', 'elevator', 'security', 'internet', 'parking', 'generator'],
    owner: { name: 'مجموعة السلام', phone: '25377123456' }
  },
  {
    id: 'MP-1016',
    title: {
      ar: 'استوديو مفروش — بولوس',
      fr: 'Studio meublé — Boulaos',
      en: 'Furnished studio — Boulaos'
    },
    description: {
      ar: 'استوديو صغير مفروش، مناسب لطالب أو موظف يبحث عن سكن اقتصادي قريب من المركز. يشمل سريراً وخزانة ومطبخاً صغيراً وحماماً خاصاً وإنترنت.',
      fr: 'Petit studio meublé, adapté à un étudiant ou un salarié cherchant un logement économique près du centre. Lit, placard, kitchenette, salle de bain privative et internet.',
      en: 'A compact furnished studio suited to a student or professional looking for affordable housing near the centre. Bed, wardrobe, kitchenette, private bathroom and internet.'
    },
    type: 'studio', deal: 'rent', district: 'boulaos',
    price: 120000, nightly: 7000,
    rooms: 1, baths: 1, area: 75, floor: 2, year: 2016,
    featured: false, isNew: false, postedDays: 18,
    images: ['apt-5', 'kitchen-4'],
    amenities: ['furnished', 'water', 'power', 'ac', 'internet'],
    owner: { name: 'حسن جامع', phone: '25377899012' }
  },
  {
    id: 'MP-1004',
    title: {
      ar: 'منزل بحديقة — أرتا',
      fr: 'Maison avec jardin — Arta',
      en: 'House with garden — Arta'
    },
    description: {
      ar: 'منزل عائلي في أرتا بعيداً عن ضجيج المدينة وقريباً من الشاطئ. حديقة أمامية وخلفية وثلاث غرف نوم وصالة واسعة.',
      fr: 'Maison familiale à Arta, loin du bruit de la ville et proche de la plage. Jardin avant et arrière, trois chambres et un grand séjour.',
      en: 'A family house in Arta, away from the city noise and close to the beach. Front and rear gardens, three bedrooms and a large lounge.'
    },
    type: 'house', deal: 'rent', district: 'arta',
    price: 450000, nightly: 24000,
    rooms: 3, baths: 2, area: 240, floor: null, year: 2014,
    featured: false, isNew: false, postedDays: 16,
    images: ['villa-4', 'apt-3', 'kitchen-2'],
    amenities: ['beach', 'garden', 'parking', 'water', 'power', 'solar', 'ac'],
    owner: { name: 'أحمد الحاج', phone: '25377234567' }
  },
  {
    id: 'MP-1010',
    title: {
      ar: 'مساحة عمل مشتركة — حرموس',
      fr: 'Espace de coworking — Haramous',
      en: 'Coworking space — Haramous'
    },
    description: {
      ar: 'مساحة عمل مشتركة حديثة مناسبة للشركات الناشئة والمستقلين، بقاعات اجتماعات وإنترنت عالي السرعة واستقبال. الإيجار يشمل الخدمات.',
      fr: 'Espace de coworking moderne pour start-up et indépendants : salles de réunion, internet haut débit et accueil. Charges incluses.',
      en: 'A modern coworking space for start-ups and freelancers: meeting rooms, high-speed internet and reception. Utilities included.'
    },
    type: 'office', deal: 'rent', district: 'haramous',
    price: 320000, nightly: 0,
    rooms: 2, baths: 1, area: 120, floor: 1, year: 2023,
    featured: false, isNew: true, postedDays: 4,
    images: ['office-2', 'office-3', 'office-1'],
    amenities: ['ac', 'water', 'power', 'internet', 'security', 'elevator', 'parking'],
    owner: { name: 'نورا إسماعيل', phone: '25377012345' }
  },
  {
    id: 'MP-1022',
    title: {
      ar: 'شقة للبيع قرب وسط المدينة',
      fr: 'Appartement à vendre près du centre',
      en: 'Apartment for sale near downtown'
    },
    description: {
      ar: 'شقة مناسبة للسكن أو الاستثمار في قلب المدينة، بتصميم داخلي مريح ومطبخ مجهز وحمامين. قريبة من الأسواق والبنوك والمواصلات.',
      fr: 'Appartement idéal pour habiter ou investir au cœur de la ville : agencement confortable, cuisine équipée et deux salles de bain. Proche des marchés, banques et transports.',
      en: 'An apartment suited to living or investment in the heart of the city: comfortable layout, fitted kitchen and two bathrooms. Close to markets, banks and transport.'
    },
    type: 'apartment', deal: 'sale', district: 'centre',
    price: 38000000, nightly: 0,
    rooms: 2, baths: 2, area: 110, floor: 4, year: 2018,
    featured: false, isNew: false, postedDays: 25,
    images: ['apt-3', 'kitchen-3', 'apt-5'],
    amenities: ['ac', 'water', 'power', 'elevator', 'security', 'internet'],
    owner: { name: 'مريم عبدالله', phone: '25377677890' }
  }
];

window.SITE_CONFIG = SITE_CONFIG;
window.DISTRICTS = DISTRICTS;
window.TYPES = TYPES;
window.AMENITIES = AMENITIES;
window.PROPERTIES = PROPERTIES;
