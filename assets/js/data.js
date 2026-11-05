/* =========================================================
   MaisonPRO — Données de démonstration / Demo data
   ⚠️  Toutes les annonces sont fictives (démonstration).
   ========================================================= */

/* ---------------------------------------------------------
   CONFIG — modifiez ces valeurs pour mettre le site en ligne
   --------------------------------------------------------- */
const SITE_CONFIG = {
  brand: 'MaisonPRO',
  // Numéro WhatsApp de l'agence (format international, sans + ni espaces)
  whatsapp: '25377690223',
  whatsappDisplay: '+253 77 69 02 23',
  phone: '+253 21 35 12 34',
  email: 'contact@maisonpro.dj',
  addressAr: 'شارع بورقيبة، وسط المدينة، جيبوتي',
  addressFr: 'Boulevard Bourguiba, Centre-ville, Djibouti',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  tiktok: 'https://tiktok.com/',
  mapsUrl: 'https://maps.google.com/?q=Djibouti+Centre+ville',
  djfPerUsd: 177.721,
  maxImages: 6,
  pageSize: 6
};

/* ---------------------------------------------------------
   QUARTIERS / المناطق
   --------------------------------------------------------- */
const DISTRICTS = [
  { id: 'heron',      ar: 'حيرون',            fr: 'Héron',            en: 'Heron' },
  { id: 'haramous',   ar: 'حرموس',           fr: 'Haramous',         en: 'Haramous' },
  { id: 'saudi',      ar: 'سيتي سعودي',       fr: 'Cité Saoudienne',  en: 'Saudi City' },
  { id: 'wadjir',     ar: 'سيتي ودجير',       fr: 'Cité Wadjir',      en: 'Wadjir City' },
  { id: 'centre',     ar: 'وسط المدينة',      fr: 'Centre-ville',     en: 'Downtown' },
  { id: 'gabode',     ar: 'غابوديه',          fr: 'Gabode',           en: 'Gabode' },
  { id: 'balbala',    ar: 'بلبالة',           fr: 'Balbala',          en: 'Balbala' },
  { id: 'ambouli',    ar: 'أمبولي',           fr: 'Ambouli',          en: 'Ambouli' },
  { id: 'boulaos',    ar: 'بولوس',            fr: 'Boulaos',          en: 'Boulaos' },
  { id: 'salines',    ar: 'سالين غرب',        fr: 'Salines Ouest',    en: 'Salines West' },
  { id: 'arta',       ar: 'أرتا',             fr: 'Arta',             en: 'Arta' },
  { id: 'douda',      ar: 'دودة',             fr: 'Douda',            en: 'Douda' }
];

/* Types de biens */
const TYPES = [
  { id: 'apartment', ar: 'شقة',        fr: 'Appartement', en: 'Apartment' },
  { id: 'villa',     ar: 'فيلا',       fr: 'Villa',       en: 'Villa' },
  { id: 'house',     ar: 'منزل',       fr: 'Maison',      en: 'House' },
  { id: 'office',    ar: 'مكتب تجاري', fr: 'Bureau',      en: 'Office' },
  { id: 'studio',    ar: 'استوديو',    fr: 'Studio',      en: 'Studio' }
];

/* Équipements */
const AMENITIES = {
  ac:         { ar: 'تكييف مركزي',     fr: 'Climatisation',      en: 'Air conditioning' },
  parking:    { ar: 'موقف سيارات',     fr: 'Parking',            en: 'Parking' },
  garden:     { ar: 'حديقة',           fr: 'Jardin',             en: 'Garden' },
  pool:       { ar: 'مسبح',            fr: 'Piscine',            en: 'Pool' },
  furnished:  { ar: 'مفروش',           fr: 'Meublé',             en: 'Furnished' },
  security:   { ar: 'حراسة 24/7',      fr: 'Gardiennage 24/7',   en: '24/7 security' },
  elevator:   { ar: 'مصعد',            fr: 'Ascenseur',          en: 'Elevator' },
  generator:  { ar: 'مولد كهرباء',     fr: 'Groupe électrogène', en: 'Generator' },
  water:      { ar: 'خزان مياه',       fr: 'Réservoir d’eau',    en: 'Water tank' },
  internet:   { ar: 'إنترنت ألياف',    fr: 'Fibre optique',      en: 'Fibre internet' },
  balcony:    { ar: 'شرفة',            fr: 'Balcon',             en: 'Balcony' },
  seaview:    { ar: 'إطلالة بحرية',    fr: 'Vue mer',            en: 'Sea view' },
  gym:        { ar: 'صالة رياضية',     fr: 'Salle de sport',     en: 'Gym' },
  solar:      { ar: 'طاقة شمسية',      fr: 'Solaire',            en: 'Solar power' }
};

/* ---------------------------------------------------------
   ANNONCES / العقارات
   price   = prix en DJF (loyer mensuel si deal = "rent")
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
      ar: 'فيلا عصرية بتصميم معماري مميز في أرقى أحياء جيبوتي. تتميز بواجهات زجاجية واسعة تمنح إطلالة بانورامية على البحر، مع حديقة منسقة ومساحة خارجية مثالية للاستقبال. التشطيبات من أعلى مستوى والمنزل جاهز للسكن مباشرة.',
      fr: 'Villa au design architectural remarquable dans l’un des quartiers les plus prisés de Djibouti. De larges baies vitrées offrent une vue panoramique sur la mer, avec un jardin paysager et un espace extérieur idéal pour recevoir. Finitions haut de gamme, prête à habiter.',
      en: 'A striking contemporary villa in one of Djibouti’s most sought-after neighbourhoods. Full-height glazing gives a panoramic sea view, complemented by a landscaped garden and an outdoor entertaining area. Premium finishes, move-in ready.'
    },
    type: 'villa',
    deal: 'sale',
    district: 'haramous',
    price: 95000000,
    rooms: 5,
    baths: 4,
    area: 420,
    floor: null,
    year: 2022,
    featured: true,
    isNew: true,
    postedDays: 3,
    views: 1284,
    images: ['villa-1', 'apt-2', 'kitchen-1', 'villa-3'],
    amenities: ['seaview', 'garden', 'parking', 'ac', 'security', 'solar', 'water'],
    owner: { name: 'عبدالقادر حسن', phone: '25377011223' }
  },
  {
    id: 'MP-1038',
    title: {
      ar: 'فيلا عائلية فاخرة في حيرون',
      fr: 'Villa familiale de prestige à Héron',
      en: 'Prestige family villa in Heron'
    },
    description: {
      ar: 'فيلا عائلية واسعة في حي حيرون الهادئ، تتكون من طابقين مع صالة استقبال كبيرة، مطبخ مجهز بالكامل، وغرف نوم واسعة بإضاءة طبيعية. الحديقة المحيطة بالمنزل مثالية للأطفال، ويوجد موقف يتسع لسيارتين.',
      fr: 'Vaste villa familiale dans le quartier calme de Héron, sur deux niveaux, avec un grand salon de réception, une cuisine entièrement équipée et des chambres lumineuses. Le jardin est idéal pour les enfants et le parking accueille deux voitures.',
      en: 'A spacious two-storey family villa in quiet Heron, with a large reception lounge, a fully fitted kitchen and bright bedrooms. The surrounding garden is perfect for children and the driveway fits two cars.'
    },
    type: 'villa',
    deal: 'rent',
    district: 'heron',
    price: 850000,
    rooms: 4,
    baths: 3,
    area: 320,
    floor: null,
    year: 2019,
    featured: true,
    isNew: false,
    postedDays: 9,
    views: 942,
    images: ['villa-2', 'apt-3', 'kitchen-3', 'villa-4'],
    amenities: ['garden', 'parking', 'ac', 'furnished', 'security', 'internet'],
    owner: { name: 'فاطمة أحمد', phone: '25377120345' }
  },
  {
    id: 'MP-1035',
    title: {
      ar: 'فيلا حديثة بحديقة واسعة',
      fr: 'Villa moderne avec grand jardin',
      en: 'Modern villa with large garden'
    },
    description: {
      ar: 'منزل حديث في غابوديه يتميز بحديقة واسعة ومساحة مفتوحة للمعيشة. التصميم الداخلي عملي ومريح، مع مطبخ عصري مفتوح على الصالة. مناسب للعائلات التي تبحث عن الهدوء مع قربها من المرافق الأساسية.',
      fr: 'Maison moderne à Gabode avec un grand jardin et un séjour ouvert. L’agencement intérieur est pratique et confortable, avec une cuisine moderne ouverte sur le salon. Idéale pour les familles recherchant le calme, à proximité des commodités.',
      en: 'A modern home in Gabode with a generous garden and open-plan living. The layout is practical and comfortable, with a modern kitchen opening onto the lounge. Ideal for families wanting calm close to essential amenities.'
    },
    type: 'villa',
    deal: 'rent',
    district: 'gabode',
    price: 620000,
    rooms: 4,
    baths: 3,
    area: 300,
    floor: null,
    year: 2021,
    featured: false,
    isNew: false,
    postedDays: 14,
    views: 618,
    images: ['villa-3', 'apt-4', 'kitchen-2'],
    amenities: ['garden', 'parking', 'ac', 'water', 'generator'],
    owner: { name: 'محمد يوسف', phone: '25377233458' }
  },
  {
    id: 'MP-1031',
    title: {
      ar: 'فيلا كلاسيكية أنيقة',
      fr: 'Villa classique élégante',
      en: 'Elegant classic villa'
    },
    description: {
      ar: 'فيلا كلاسيكية بواجهة أنيقة ومدخل فخم، تقع في وسط المدينة على مقربة من السفارات والمدارس. مساحات واسعة وارتفاع سقف مريح، مع مسبح صغير وحديقة خلفية خاصة.',
      fr: 'Villa classique à la façade élégante et à l’entrée imposante, située au centre-ville à proximité des ambassades et des écoles. De grands volumes, une belle hauteur sous plafond, une petite piscine et un jardin arrière privatif.',
      en: 'A classic villa with an elegant facade and imposing entrance, downtown near embassies and schools. Generous volumes and high ceilings, plus a plunge pool and a private rear garden.'
    },
    type: 'villa',
    deal: 'sale',
    district: 'centre',
    price: 68000000,
    rooms: 5,
    baths: 4,
    area: 380,
    floor: null,
    year: 2015,
    featured: false,
    isNew: false,
    postedDays: 21,
    views: 733,
    images: ['villa-5', 'apt-1', 'kitchen-4'],
    amenities: ['pool', 'garden', 'parking', 'security', 'ac', 'elevator'],
    owner: { name: 'سعيد عمر', phone: '25377344567' }
  },
  {
    id: 'MP-1028',
    title: {
      ar: 'شقة مفروشة عصرية في سيتي سعودي',
      fr: 'Appartement meublé moderne, Cité Saoudienne',
      en: 'Modern furnished apartment, Saudi City'
    },
    description: {
      ar: 'شقة مفروشة بالكامل بتصميم عصري ودافئ في سيتي سعودي. تتضمن غرفة معيشة واسعة، مطبخ مفتوح مجهز، وشرفة بإطلالة مفتوحة. جاهزة للسكن فوراً وتشمل خدمة الإنترنت والتكييف.',
      fr: 'Appartement entièrement meublé au design moderne et chaleureux à la Cité Saoudienne. Il comprend un séjour spacieux, une cuisine ouverte équipée et un balcon avec vue dégagée. Prêt à habiter, internet et climatisation inclus.',
      en: 'A fully furnished apartment with a warm modern design in Saudi City. It offers a spacious living room, a fitted open kitchen and a balcony with an open view. Move-in ready, with internet and air conditioning included.'
    },
    type: 'apartment',
    deal: 'rent',
    district: 'saudi',
    price: 280000,
    rooms: 3,
    baths: 2,
    area: 140,
    floor: 3,
    year: 2020,
    featured: true,
    isNew: true,
    postedDays: 2,
    views: 1760,
    images: ['apt-1', 'kitchen-4', 'apt-4'],
    amenities: ['furnished', 'ac', 'internet', 'balcony', 'elevator', 'parking'],
    owner: { name: 'خديجة علي', phone: '25377455678' }
  },
  {
    id: 'MP-1025',
    title: {
      ar: 'شقة فاخرة بإضاءة طبيعية',
      fr: 'Appartement de standing très lumineux',
      en: 'Bright premium apartment'
    },
    description: {
      ar: 'شقة فاخرة في حيرون بنوافذ كبيرة وإضاءة طبيعية طوال اليوم. تشطيبات راقية وأرضيات خشبية، غرفة نوم رئيسية بحمام خاص، ومطبخ حديث بالكامل. المبنى يحتوي على مصعد وحراسة على مدار الساعة.',
      fr: 'Appartement de standing à Héron, très lumineux grâce à ses grandes fenêtres. Finitions soignées, parquet, suite parentale avec salle de bain privative et cuisine moderne. L’immeuble dispose d’un ascenseur et d’un gardien 24/7.',
      en: 'A premium apartment in Heron, filled with natural light all day through large windows. Refined finishes, wooden floors, a master suite with private bathroom and a modern kitchen. The building has a lift and 24/7 security.'
    },
    type: 'apartment',
    deal: 'rent',
    district: 'heron',
    price: 350000,
    rooms: 3,
    baths: 2,
    area: 150,
    floor: 2,
    year: 2021,
    featured: false,
    isNew: false,
    postedDays: 7,
    views: 884,
    images: ['apt-2', 'kitchen-1', 'apt-5'],
    amenities: ['ac', 'elevator', 'security', 'balcony', 'internet', 'parking'],
    owner: { name: 'إبراهيم داوود', phone: '25377566789' }
  },
  {
    id: 'MP-1022',
    title: {
      ar: 'شقة أنيقة قرب وسط المدينة',
      fr: 'Appartement élégant proche centre-ville',
      en: 'Elegant apartment near downtown'
    },
    description: {
      ar: 'شقة أنيقة للبيع في قلب المدينة، مناسبة للسكن أو الاستثمار. تصميم داخلي مريح، مطبخ مجهز، وحمامان. المبنى قريب من الأسواق والبنوك والمواصلات العامة.',
      fr: 'Appartement élégant à vendre au cœur de la ville, idéal pour habiter ou investir. Agencement confortable, cuisine équipée et deux salles de bain. À proximité des marchés, banques et transports.',
      en: 'An elegant apartment for sale in the heart of the city, suited to living or investment. Comfortable layout, fitted kitchen and two bathrooms. Close to markets, banks and public transport.'
    },
    type: 'apartment',
    deal: 'sale',
    district: 'centre',
    price: 38000000,
    rooms: 2,
    baths: 2,
    area: 110,
    floor: 4,
    year: 2018,
    featured: false,
    isNew: false,
    postedDays: 25,
    views: 507,
    images: ['apt-3', 'kitchen-3', 'apt-5'],
    amenities: ['ac', 'elevator', 'security', 'water', 'internet'],
    owner: { name: 'مريم عبدالله', phone: '25377677890' }
  },
  {
    id: 'MP-1019',
    title: {
      ar: 'شقة عائلية واسعة في بلبالة',
      fr: 'Grand appartement familial à Balbala',
      en: 'Large family apartment in Balbala'
    },
    description: {
      ar: 'شقة عائلية واسعة بثلاث غرف نوم في بلبالة، بسعر مناسب للعائلات. تتضمن صالة كبيرة ومطبخاً مستقلاً وخزان مياه. المنطقة نشطة وفيها مدارس وأسواق قريبة.',
      fr: 'Grand appartement familial de trois chambres à Balbala, à un prix adapté aux familles. Il comprend un grand salon, une cuisine séparée et un réservoir d’eau. Quartier dynamique, proche des écoles et des marchés.',
      en: 'A large three-bedroom family apartment in Balbala at a family-friendly price. Includes a big lounge, separate kitchen and water tank. A lively area close to schools and markets.'
    },
    type: 'apartment',
    deal: 'rent',
    district: 'balbala',
    price: 165000,
    rooms: 3,
    baths: 2,
    area: 120,
    floor: 1,
    year: 2017,
    featured: false,
    isNew: false,
    postedDays: 11,
    views: 1120,
    images: ['apt-4', 'kitchen-2', 'apt-2'],
    amenities: ['water', 'ac', 'parking', 'generator'],
    owner: { name: 'علي محمود', phone: '25377788901' }
  },
  {
    id: 'MP-1016',
    title: {
      ar: 'استوديو مفروش للطلاب والموظفين',
      fr: 'Studio meublé pour étudiants',
      en: 'Furnished studio for students'
    },
    description: {
      ar: 'استوديو صغير ومفروش في بولوس، مناسب للطلاب أو الموظفين الباحثين عن سكن اقتصادي قريب من المركز. يشمل سريراً وخزانة ومطبخاً صغيراً وحماماً خاصاً، مع إنترنت.',
      fr: 'Petit studio meublé à Boulaos, adapté aux étudiants ou salariés cherchant un logement économique près du centre. Lit, placard, kitchenette, salle de bain privative et internet inclus.',
      en: 'A compact furnished studio in Boulaos, suited to students or professionals looking for affordable housing near the centre. Bed, wardrobe, kitchenette, private bathroom and internet included.'
    },
    type: 'studio',
    deal: 'rent',
    district: 'boulaos',
    price: 120000,
    rooms: 1,
    baths: 1,
    area: 75,
    floor: 2,
    year: 2016,
    featured: false,
    isNew: false,
    postedDays: 18,
    views: 1642,
    images: ['apt-5', 'kitchen-4'],
    amenities: ['furnished', 'internet', 'ac', 'water'],
    owner: { name: 'حسن جامع', phone: '25377899012' }
  },
  {
    id: 'MP-1013',
    title: {
      ar: 'مكتب تجاري في برج أعمال',
      fr: 'Bureau dans une tour d’affaires',
      en: 'Office in a business tower'
    },
    description: {
      ar: 'مكتب تجاري مجهز في برج أعمال بوسط المدينة، بمساحة مفتوحة قابلة للتقسيم. يشمل تكييفاً مركزياً، اتصالاً بالألياف البصرية، ومصعدين. المبنى مؤمّن بكاميرات وحراسة، مع مواقف للسيارات.',
      fr: 'Bureau aménagé dans une tour d’affaires du centre-ville, avec un plateau ouvert divisible. Climatisation centralisée, fibre optique et deux ascenseurs. Immeuble sécurisé avec vidéosurveillance, gardien et parking.',
      en: 'A fitted office in a downtown business tower with an open, subdividable floor plate. Central air conditioning, fibre connectivity and two lifts. The building is covered by CCTV and security, with parking.'
    },
    type: 'office',
    deal: 'rent',
    district: 'centre',
    price: 480000,
    rooms: 3,
    baths: 2,
    area: 180,
    floor: 6,
    year: 2019,
    featured: true,
    isNew: false,
    postedDays: 5,
    views: 596,
    images: ['office-1', 'office-2', 'office-3'],
    amenities: ['ac', 'elevator', 'security', 'internet', 'parking', 'generator'],
    owner: { name: 'شركة النيل العقارية', phone: '25377900123' }
  },
  {
    id: 'MP-1010',
    title: {
      ar: 'مساحة عمل مشتركة في حرموس',
      fr: 'Espace de travail partagé à Haramous',
      en: 'Shared workspace in Haramous'
    },
    description: {
      ar: 'مساحة عمل مشتركة حديثة في حرموس، مناسبة للشركات الناشئة والمستقلين. تشمل قاعات اجتماعات، إنترنت عالي السرعة، واستقبالاً. الإيجار يشمل الخدمات والكهرباء.',
      fr: 'Espace de coworking moderne à Haramous, adapté aux start-up et indépendants. Salles de réunion, internet haut débit et accueil. Le loyer inclut les charges et l’électricité.',
      en: 'A modern coworking space in Haramous for start-ups and freelancers. Meeting rooms, high-speed internet and a reception desk. Rent includes utilities and electricity.'
    },
    type: 'office',
    deal: 'rent',
    district: 'haramous',
    price: 320000,
    rooms: 2,
    baths: 1,
    area: 120,
    floor: 1,
    year: 2023,
    featured: false,
    isNew: true,
    postedDays: 4,
    views: 402,
    images: ['office-2', 'office-3', 'office-1'],
    amenities: ['ac', 'internet', 'security', 'elevator', 'parking'],
    owner: { name: 'نورا إسماعيل', phone: '25377012345' }
  },
  {
    id: 'MP-1007',
    title: {
      ar: 'مكتب فاخر للشركات',
      fr: 'Bureau haut de gamme pour entreprises',
      en: 'Premium office for companies'
    },
    description: {
      ar: 'مكتب فاخر للبيع في حيرون، مناسب لمقر شركة. مساحة واسعة بتصميم داخلي راقٍ، قاعات اجتماعات، ومطبخ صغير. المبنى حديث وبمعايير أمنية عالية.',
      fr: 'Bureau haut de gamme à vendre à Héron, idéal comme siège d’entreprise. Grand plateau au design soigné, salles de réunion et kitchenette. Immeuble récent aux normes de sécurité élevées.',
      en: 'A premium office for sale in Heron, ideal as a company headquarters. A generous floor plate with refined interiors, meeting rooms and a kitchenette. A recent building with high security standards.'
    },
    type: 'office',
    deal: 'sale',
    district: 'heron',
    price: 42000000,
    rooms: 4,
    baths: 2,
    area: 200,
    floor: 3,
    year: 2022,
    featured: false,
    isNew: false,
    postedDays: 30,
    views: 311,
    images: ['office-3', 'office-1'],
    amenities: ['ac', 'elevator', 'security', 'internet', 'parking', 'generator'],
    owner: { name: 'مجموعة السلام', phone: '25377123456' }
  },
  {
    id: 'MP-1004',
    title: {
      ar: 'منزل عائلي بحديقة في أرتا',
      fr: 'Maison familiale avec jardin à Arta',
      en: 'Family house with garden in Arta'
    },
    description: {
      ar: 'منزل عائلي مريح في أرتا، بعيد عن ضجيج المدينة وقريب من الطبيعة. حديقة أمامية وخلفية، ثلاث غرف نوم، وصالة واسعة. مثالي للعائلات التي تفضل الهدوء والمساحات المفتوحة.',
      fr: 'Maison familiale confortable à Arta, loin du bruit de la ville et proche de la nature. Jardin avant et arrière, trois chambres et un grand séjour. Idéale pour les familles qui aiment le calme et les espaces ouverts.',
      en: 'A comfortable family house in Arta, away from the city noise and close to nature. Front and rear gardens, three bedrooms and a large lounge. Ideal for families who prefer calm and open space.'
    },
    type: 'house',
    deal: 'rent',
    district: 'arta',
    price: 450000,
    rooms: 3,
    baths: 2,
    area: 240,
    floor: null,
    year: 2014,
    featured: false,
    isNew: false,
    postedDays: 16,
    views: 689,
    images: ['villa-4', 'apt-3', 'kitchen-2'],
    amenities: ['garden', 'parking', 'water', 'solar', 'ac'],
    owner: { name: 'أحمد الحاج', phone: '25377234567' }
  }
];

/* Expose globally */
window.SITE_CONFIG = SITE_CONFIG;
window.DISTRICTS = DISTRICTS;
window.TYPES = TYPES;
window.AMENITIES = AMENITIES;
window.PROPERTIES = PROPERTIES;
