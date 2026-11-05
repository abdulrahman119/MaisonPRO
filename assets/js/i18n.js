/* =========================================================
   MaisonPRO — i18n (ar / fr / en)
   العربية هي اللغة الأساسية (RTL)، مع دعم الفرنسية والإنجليزية.
   ========================================================= */

const I18N = {
  ar: {
    /* --- meta / a11y --- */
    skip: 'تجاوز إلى المحتوى الرئيسي',
    navAria: 'التنقل الرئيسي',
    menuAria: 'القائمة',
    openMenu: 'فتح القائمة',
    close: 'إغلاق',
    language: 'اللغة',
    searchAria: 'البحث عن عقار',
    searchAria2: 'البحث في العقارات',
    sortLabel: 'ترتيب النتائج',
    currency: 'العملة',
    toTop: 'إلى الأعلى',
    drawerAreas: 'مناطق شائعة',

    /* --- brand / nav --- */
    brandTag: 'وساطة عقارية · جيبوتي',
    navHome: 'الرئيسية',
    navProperties: 'العقارات',
    navServices: 'خدماتنا',
    navAdd: 'أضف عقارك',
    navContact: 'اتصل بنا',
    callUs: 'اتصل بنا',
    whatsappCta: 'واتساب',

    /* --- hero --- */
    heroBadge: 'منصة الوساطة العقارية الأولى في جيبوتي',
    heroTitle: 'ابحث عن منزل أحلامك <span class="hl">في جيبوتي</span>',
    heroDesc: 'شقق وفيلات ومكاتب موثقة للإيجار والبيع في أرقى الأحياء — حيرون، حرموس، سيتي سعودي، وسط المدينة وغيرها. نربط الملاك بالمستأجرين بسرعة وأمانة.',
    trustVerified: 'عقارات تم التحقق منها',
    trustFast: 'زيارة خلال 24 ساعة',
    trustNoFee: 'بدون رسوم على المستأجر',
    statListed: 'عقار متاح',
    statDistricts: 'حي مغطى',
    statClients: 'عميل سعيد',

    /* --- search --- */
    dealType: 'نوع العملية',
    dealAll: 'الكل',
    dealRent: 'للإيجار',
    dealSale: 'للبيع',
    propertyType: 'نوع العقار',
    typeAll: 'كل الأنواع',
    district: 'المنطقة / الحي',
    districtAll: 'كل المناطق',
    budget: 'الميزانية',
    budgetMax: 'الميزانية القصوى',
    budgetAny: 'بدون حد',
    searchBtn: 'بحث',
    quickSearch: 'بحث سريع:',
    quickHeron: 'إيجار في حيرون',
    quickSaudi: 'سيتي سعودي',
    quickVillaSale: 'فيلا للبيع',
    quickOffice: 'مكاتب تجارية',
    resetFilters: 'إعادة تعيين الفلاتر',

    /* --- listings --- */
    eyebrowProperties: 'العقارات',
    listingsTitle: 'عقارات مختارة بعناية',
    searchPlaceholder: 'ابحث بالاسم أو الحي...',
    sortNewest: 'الأحدث',
    sortPriceAsc: 'السعر: من الأقل',
    sortPriceDesc: 'السعر: من الأعلى',
    sortArea: 'المساحة الأكبر',
    favorites: 'المفضلة',
    loadMore: 'عرض المزيد من العقارات',
    resultsCount: 'تم العثور على <strong>{n}</strong> عقار',
    resultsCountOne: 'تم العثور على <strong>1</strong> عقار',
    resultsNone: 'لا توجد نتائج مطابقة',
    showingOf: 'عرض {a} من أصل {b}',

    /* --- card / detail --- */
    badgeRent: 'للإيجار',
    badgeSale: 'للبيع',
    badgeNew: 'جديد',
    badgeFeatured: 'مميز',
    cardRooms: '{n} غرف',
    cardRoomsOne: 'غرفة واحدة',
    cardBaths: '{n} حمام',
    cardBathsOne: 'حمام',
    cardArea: '{n} م²',
    cardDetails: 'التفاصيل',
    cardWhatsapp: 'واتساب',
    perMonth: '/ شهرياً',
    perMonthWord: 'شهرياً',
    rentWord: 'إيجار',
    saleWord: 'بيع',
    perYear: 'الإجمالي',
    dealRentShort: 'إيجار',
    dealSaleShort: 'بيع',
    postedAgo: 'قبل {n} يوم',
    postedToday: 'اليوم',

    detailOverview: 'وصف العقار',
    detailAmenities: 'المرافق والخدمات',
    detailLocation: 'الموقع',
    detailSpecs: 'المواصفات',
    detailRooms: 'الغرف',
    detailBaths: 'الحمامات',
    detailArea: 'المساحة',
    detailFloor: 'الطابق',
    detailYear: 'سنة البناء',
    detailType: 'النوع',
    detailId: 'رقم العقار',
    detailAgent: 'المسؤول عن العقار',
    detailAgentRole: 'مستشار عقاري · MaisonPRO',
    detailOnline: 'متاح الآن',
    detailWa: 'تواصل عبر واتساب',
    detailCall: 'اتصل',
    detailShare: 'نسخ الرابط',
    detailPhotos: '{n} صور',
    propertyNotFound: 'لم يتم العثور على العقار',

    /* --- whatsapp messages --- */
    waPropertyMsg: 'مرحباً MaisonPRO 👋\nأرغب في الاستفسار عن هذا العقار:\n\n🏠 {title}\n🔖 رقم العقار: {id}\n📍 الحي: {district}\n🏷️ العملية: {deal}\n💰 السعر: {price}\n\nرأيته على موقعكم وأود ترتيب زيارة.',
    waGeneralMsg: 'مرحباً MaisonPRO 👋\nأبحث عن عقار في جيبوتي وأود الاستفسار عن الخيارات المتاحة.',

    /* --- benefits --- */
    eyebrowWhy: 'لماذا MaisonPRO',
    whyTitle: 'الثقة تُبنى بالتفاصيل',
    whySub: 'نعمل بمعايير واضحة تحمي المالك والمستأجر في كل خطوة — من أول اتصال حتى تسليم المفتاح.',
    featTrustTitle: 'الأمانة والشفافية',
    featTrustDesc: 'صور حقيقية ووصف مطابق للواقع. لا مفاجآت في السعر ولا رسوم خفية على أي طرف.',
    featDocsTitle: 'التوثيق والتحقق',
    featDocsDesc: 'نتحقق من صك الملكية وهوية المالك قبل نشر أي عقار، لضمان تعامل آمن للجميع.',
    featSpeedTitle: 'سرعة في الإنجاز',
    featSpeedDesc: 'نرد على استفسارك خلال دقائق عبر واتساب وننسّق الزيارة في أقل من 24 ساعة.',
    featFollowTitle: 'متابعة حتى التسليم',
    featFollowDesc: 'نساعد في العقد والتفاوض وتجهيز المستندات، ونبقى معك بعد التسليم إن احتجت.',

    /* --- services --- */
    eyebrowServices: 'خدماتنا',
    servicesTitle: 'حلول عقارية متكاملة',
    servicesSub: 'من البحث عن سكن إلى إدارة محفظتك العقارية — فريق واحد يرافقك في كل مرحلة.',
    srvRentTitle: 'وساطة الإيجار',
    srvRentDesc: 'نساعد المستأجر على إيجاد السكن المناسب، ونضمن للمالك مستأجراً جدياً وموثوقاً.',
    srvRentLi1: 'زيارات منظمة ومجدولة',
    srvRentLi2: 'تحقق من هوية المستأجر',
    srvSaleTitle: 'بيع وشراء العقارات',
    srvSaleDesc: 'تقييم واقعي للسعر وتسويق احترافي للعقار مع متابعة كاملة لإجراءات البيع.',
    srvSaleLi1: 'تقييم مجاني للعقار',
    srvSaleLi2: 'متابعة التوثيق والعقد',
    srvManageTitle: 'إدارة الأملاك',
    srvManageDesc: 'للملاك غير المقيمين: تحصيل الإيجار، الصيانة الدورية، وتقارير شهرية واضحة.',
    srvManageLi1: 'تحصيل الإيجار في موعده',
    srvManageLi2: 'تقارير مصاريف شهرية',
    srvAdviceTitle: 'استشارات واستثمار',
    srvAdviceDesc: 'نساعدك على اختيار الحي والعائد الأنسب لاستثمارك العقاري في جيبوتي.',
    srvAdviceLi1: 'مقارنة المناطق والأسعار',
    srvAdviceLi2: 'تقدير العائد المتوقع',

    /* --- add property --- */
    eyebrowAdd: 'للملاك',
    addTitle: 'أضف عقارك مجاناً',
    addDesc: 'أرسل تفاصيل عقارك وسيتواصل معك فريقنا خلال 24 ساعة لمعاينة العقار ونشره أمام آلاف الباحثين عن سكن في جيبوتي.',
    addBen1Title: 'نشر مجاني',
    addBen1Desc: 'لا رسوم على المالك لنشر العقار.',
    addBen2Title: 'تصوير احترافي',
    addBen2Desc: 'نساعدك في تصوير العقار بشكل يجذب المستأجر.',
    addBen3Title: 'مستأجرون موثقون',
    addBen3Desc: 'نتحقق من جدية كل طلب قبل الزيارة.',
    addBen4Title: 'متابعة كاملة',
    addBen4Desc: 'من المعاينة حتى توقيع العقد.',
    preferWhatsapp: 'تفضّل الواتساب؟ راسلنا مباشرة',
    formTitle: 'بيانات العقار',
    formSub: 'املأ الحقول التالية — الحقول المعلّمة بـ * إلزامية',
    ownerName: 'اسم المالك <span class="req">*</span>',
    ownerPhone: 'رقم الهاتف / واتساب <span class="req">*</span>',
    dealLabel: 'العملية <span class="req">*</span>',
    dealRentOpt: 'للإيجار',
    dealSaleOpt: 'للبيع',
    districtLabel: 'الحي / المنطقة <span class="req">*</span>',
    addressLabel: 'عنوان تفصيلي (اختياري)',
    priceLabel: 'السعر المطلوب <span class="req">*</span>',
    titleLabel: 'عنوان الإعلان <span class="req">*</span>',
    roomsLabel: 'عدد الغرف',
    bathsLabel: 'عدد الحمامات',
    areaLabel: 'المساحة (م²)',
    amenitiesLabel: 'المرافق والخدمات',
    descLabel: 'وصف العقار',
    photosLabel: 'صور العقار',
    phOwnerName: 'مثال: أحمد عبدالله',
    phAddress: 'مثال: شارع 12، قرب مسجد النور',
    phTitle: 'مثال: شقة مفروشة بإطلالة',
    phDesc: 'اكتب وصفاً واضحاً: الطابق، التشطيبات، قرب الخدمات، حالة المبنى...',
    uploadStrong: 'اسحب الصور هنا أو انقر للاختيار',
    uploadHint: 'JPG أو PNG — يتم ضغط الصور تلقائياً لتسريع الموقع',
    uploadCover: 'الصورة الرئيسية',
    termsText: 'أؤكد أن العقار ملكي أو أنني مفوّض بتأجيره/بيعه، وأوافق على <a href="#" onclick="return false">شروط الاستخدام</a> وسياسة الخصوصية.',
    submitBtn: 'إرسال العقار للمراجعة',
    formNote: 'بالنقر على الإرسال، يتم حفظ الإعلان في نسختك التجريبية وإرسال نسخة إلى فريقنا على واتساب.',
    successTitle: 'تم استلام عقارك بنجاح!',
    successDesc: 'شكراً لك. سيتواصل معك فريق MaisonPRO خلال 24 ساعة لمعاينة العقار. يمكنك متابعة الطلب عبر واتساب في أي وقت.',
    followWa: 'متابعة عبر واتساب',
    addAnother: 'إضافة عقار آخر',
    errRequired: 'هذا الحقل مطلوب',
    errPhone: 'أدخل رقم هاتف صحيح (8 أرقام على الأقل)',
    errPrice: 'أدخل سعراً صحيحاً',
    errTerms: 'يجب الموافقة على الشروط للمتابعة',

    /* --- contact --- */
    eyebrowContact: 'اتصل بنا',
    contactTitle: 'نحن هنا لمساعدتك',
    contactSub: 'لديك سؤال عن عقار أو تريد استشارة؟ اختر الطريقة الأنسب لك — نجيب على واتساب عادةً خلال دقائق.',
    contactWhatsapp: 'واتساب',
    contactPhone: 'هاتف المكتب',
    contactEmail: 'البريد الإلكتروني',
    contactAddress: 'العنوان',
    addressValue: 'شارع بورقيبة، وسط المدينة، جيبوتي',
    ctaTitle: 'جاهز للعثور على عقارك القادم؟',
    ctaDesc: 'أرسل لنا نوع العقار والحي والميزانية، وسنرسل لك قائمة مختارة تناسبك — بدون التزام وبدون رسوم على المستأجر.',
    ctaWa: 'تواصل عبر واتساب',
    ctaCall: 'اتصال مباشر',
    hoursText: 'السبت – الخميس: <b>8:00 – 18:00</b> · الجمعة: <b>14:00 – 18:00</b>',
    fabTip: 'اسأل عن أي عقار',

    /* --- areas / footer --- */
    eyebrowAreas: 'مناطق التغطية',
    areasTitle: 'نغطي أحياء جيبوتي الرئيسية',
    footerAbout: 'منصة عقارية جيبوتية تربط الملاك بالمستأجرين والمشترين، بوساطة شفافة ومتابعة كاملة من أول اتصال حتى تسليم المفتاح.',
    footerQuick: 'روابط سريعة',
    footerTypes: 'أنواع العقارات',
    footerContact: 'معلومات الاتصال',
    rights: 'جميع الحقوق محفوظة',
    madeIn: 'صُنع في جيبوتي',

    /* --- empty states / toasts --- */
    noResults: 'لا توجد عقارات مطابقة',
    noResultsDesc: 'جرّب توسيع نطاق البحث: أزل الفلاتر أو زد الميزانية أو اختر منطقة أخرى.',
    clearFilters: 'مسح كل الفلاتر',
    favEmpty: 'قائمة المفضلة فارغة',
    favEmptyDesc: 'اضغط على رمز القلب في أي عقار لحفظه هنا والرجوع إليه لاحقاً.',
    toastFavAdd: 'تمت الإضافة إلى المفضلة',
    toastFavRemove: 'تمت الإزالة من المفضلة',
    toastFiltersReset: 'تمت إعادة تعيين الفلاتر',
    toastMaxImages: 'الحد الأقصى 6 صور',
    toastImageAdded: 'تمت إضافة الصورة',
    toastImageErr: 'تعذّرت إضافة الصورة — جرّب صورة أخرى',
    toastFormOk: 'تم إرسال العقار بنجاح',
    toastFormErr: 'يرجى تصحيح الحقول المعلّمة بالأحمر',
    toastLinkCopied: 'تم نسخ رابط العقار',
    toastLinkFail: 'تعذّر نسخ الرابط'
  },

  fr: {
    skip: 'Aller au contenu principal',
    navAria: 'Navigation principale',
    menuAria: 'Menu',
    openMenu: 'Ouvrir le menu',
    close: 'Fermer',
    language: 'Langue',
    searchAria: 'Rechercher un bien',
    searchAria2: 'Rechercher dans les annonces',
    sortLabel: 'Trier les résultats',
    currency: 'Devise',
    toTop: 'Haut de page',
    drawerAreas: 'Quartiers populaires',

    brandTag: 'Courtage immobilier · Djibouti',
    navHome: 'Accueil',
    navProperties: 'Annonces',
    navServices: 'Services',
    navAdd: 'Publier un bien',
    navContact: 'Contact',
    callUs: 'Appelez-nous',
    whatsappCta: 'WhatsApp',

    heroBadge: 'La 1ʳᵉ plateforme de courtage immobilier à Djibouti',
    heroTitle: 'Trouvez votre futur logement <span class="hl">à Djibouti</span>',
    heroDesc: 'Appartements, villas et bureaux vérifiés à la location et à la vente, dans les meilleurs quartiers : Héron, Haramous, Cité Saoudienne, Centre-ville et plus. Nous connectons propriétaires et locataires, rapidement et en toute confiance.',
    trustVerified: 'Biens vérifiés',
    trustFast: 'Visite sous 24 h',
    trustNoFee: 'Sans frais locataire',
    statListed: 'biens disponibles',
    statDistricts: 'quartiers couverts',
    statClients: 'clients satisfaits',

    dealType: 'Type d’opération',
    dealAll: 'Tous',
    dealRent: 'Location',
    dealSale: 'Vente',
    propertyType: 'Type de bien',
    typeAll: 'Tous les types',
    district: 'Quartier',
    districtAll: 'Tous les quartiers',
    budget: 'Budget',
    budgetMax: 'Budget maximum',
    budgetAny: 'Sans limite',
    searchBtn: 'Rechercher',
    quickSearch: 'Recherche rapide :',
    quickHeron: 'Location à Héron',
    quickSaudi: 'Cité Saoudienne',
    quickVillaSale: 'Villa à vendre',
    quickOffice: 'Bureaux',
    resetFilters: 'Réinitialiser les filtres',

    eyebrowProperties: 'Annonces',
    listingsTitle: 'Une sélection soignée',
    searchPlaceholder: 'Rechercher par nom ou quartier…',
    sortNewest: 'Plus récentes',
    sortPriceAsc: 'Prix croissant',
    sortPriceDesc: 'Prix décroissant',
    sortArea: 'Surface la plus grande',
    favorites: 'Favoris',
    loadMore: 'Voir plus d’annonces',
    resultsCount: '<strong>{n}</strong> biens trouvés',
    resultsCountOne: '<strong>1</strong> bien trouvé',
    resultsNone: 'Aucun résultat',
    showingOf: '{a} sur {b} affichés',

    badgeRent: 'Location',
    badgeSale: 'Vente',
    badgeNew: 'Nouveau',
    badgeFeatured: 'Coup de cœur',
    cardRooms: '{n} pièces',
    cardRoomsOne: '1 pièce',
    cardBaths: '{n} sdb',
    cardBathsOne: '1 sdb',
    cardArea: '{n} m²',
    cardDetails: 'Détails',
    cardWhatsapp: 'WhatsApp',
    perMonth: '/ mois',
    perMonthWord: 'par mois',
    rentWord: 'location',
    saleWord: 'vente',
    perYear: 'Total',
    dealRentShort: 'Location',
    dealSaleShort: 'Vente',
    postedAgo: 'il y a {n} j',
    postedToday: 'aujourd’hui',

    detailOverview: 'Description',
    detailAmenities: 'Équipements',
    detailLocation: 'Localisation',
    detailSpecs: 'Caractéristiques',
    detailRooms: 'Pièces',
    detailBaths: 'Salles de bain',
    detailArea: 'Surface',
    detailFloor: 'Étage',
    detailYear: 'Année',
    detailType: 'Type',
    detailId: 'Réf.',
    detailAgent: 'Votre interlocuteur',
    detailAgentRole: 'Conseiller immobilier · MaisonPRO',
    detailOnline: 'Disponible',
    detailWa: 'Contacter sur WhatsApp',
    detailCall: 'Appeler',
    detailShare: 'Copier le lien',
    detailPhotos: '{n} photos',
    propertyNotFound: 'Bien introuvable',

    waPropertyMsg: 'Bonjour MaisonPRO 👋\nJe souhaite des informations sur ce bien :\n\n🏠 {title}\n🔖 Réf. : {id}\n📍 Quartier : {district}\n🏷️ Opération : {deal}\n💰 Prix : {price}\n\nVu sur votre site, je souhaiterais organiser une visite.',
    waGeneralMsg: 'Bonjour MaisonPRO 👋\nJe cherche un bien à Djibouti et j’aimerais connaître les options disponibles.',

    eyebrowWhy: 'Pourquoi MaisonPRO',
    whyTitle: 'La confiance se construit dans les détails',
    whySub: 'Des règles claires protègent propriétaire et locataire à chaque étape, du premier appel à la remise des clés.',
    featTrustTitle: 'Honnêteté et transparence',
    featTrustDesc: 'Des photos réelles et une description fidèle. Aucune surprise sur le prix, aucun frais caché.',
    featDocsTitle: 'Vérification et conformité',
    featDocsDesc: 'Nous contrôlons le titre de propriété et l’identité du propriétaire avant publication.',
    featSpeedTitle: 'Réactivité',
    featSpeedDesc: 'Nous répondons en quelques minutes sur WhatsApp et organisons la visite en moins de 24 h.',
    featFollowTitle: 'Suivi jusqu’à la remise des clés',
    featFollowDesc: 'Nous vous accompagnons sur le contrat, la négociation et les documents, même après l’entrée.',

    eyebrowServices: 'Nos services',
    servicesTitle: 'Des solutions immobilières complètes',
    servicesSub: 'De la recherche d’un logement à la gestion de votre patrimoine — une seule équipe à vos côtés.',
    srvRentTitle: 'Courtage locatif',
    srvRentDesc: 'Nous aidons le locataire à trouver le bon logement et garantissons au propriétaire un locataire sérieux.',
    srvRentLi1: 'Visites organisées et planifiées',
    srvRentLi2: 'Vérification du locataire',
    srvSaleTitle: 'Achat & vente',
    srvSaleDesc: 'Estimation réaliste et mise en valeur professionnelle du bien, avec suivi complet de la vente.',
    srvSaleLi1: 'Estimation gratuite',
    srvSaleLi2: 'Suivi notaire et contrat',
    srvManageTitle: 'Gestion locative',
    srvManageDesc: 'Pour les propriétaires non résidents : encaissement, entretien et rapports mensuels clairs.',
    srvManageLi1: 'Loyers encaissés à temps',
    srvManageLi2: 'Rapports de charges mensuels',
    srvAdviceTitle: 'Conseil & investissement',
    srvAdviceDesc: 'Nous vous aidons à choisir le quartier et le rendement les plus adaptés à Djibouti.',
    srvAdviceLi1: 'Comparaison des quartiers',
    srvAdviceLi2: 'Estimation du rendement',

    eyebrowAdd: 'Propriétaires',
    addTitle: 'Publiez votre bien gratuitement',
    addDesc: 'Envoyez-nous les détails de votre bien : notre équipe vous contacte sous 24 h pour la visite et la publication auprès de milliers de candidats à Djibouti.',
    addBen1Title: 'Publication gratuite',
    addBen1Desc: 'Aucun frais pour le propriétaire.',
    addBen2Title: 'Photos professionnelles',
    addBen2Desc: 'Nous vous aidons à photographier le bien pour attirer les locataires.',
    addBen3Title: 'Locataires vérifiés',
    addBen3Desc: 'Chaque demande est contrôlée avant la visite.',
    addBen4Title: 'Accompagnement complet',
    addBen4Desc: 'De la visite à la signature du contrat.',
    preferWhatsapp: 'Vous préférez WhatsApp ? Écrivez-nous',
    formTitle: 'Informations du bien',
    formSub: 'Remplissez les champs ci-dessous — * champs obligatoires',
    ownerName: 'Nom du propriétaire <span class="req">*</span>',
    ownerPhone: 'Téléphone / WhatsApp <span class="req">*</span>',
    dealLabel: 'Opération <span class="req">*</span>',
    dealRentOpt: 'Location',
    dealSaleOpt: 'Vente',
    districtLabel: 'Quartier <span class="req">*</span>',
    addressLabel: 'Adresse détaillée (facultatif)',
    priceLabel: 'Prix demandé <span class="req">*</span>',
    titleLabel: 'Titre de l’annonce <span class="req">*</span>',
    roomsLabel: 'Nombre de pièces',
    bathsLabel: 'Salles de bain',
    areaLabel: 'Surface (m²)',
    amenitiesLabel: 'Équipements',
    descLabel: 'Description',
    photosLabel: 'Photos du bien',
    phOwnerName: 'Ex. : Ahmed Abdallah',
    phAddress: 'Ex. : Rue 12, près de la mosquée An-Nour',
    phTitle: 'Ex. : Appartement meublé avec vue',
    phDesc: 'Décrivez clairement : étage, finitions, proximité des services, état de l’immeuble…',
    uploadStrong: 'Glissez vos photos ici ou cliquez pour choisir',
    uploadHint: 'JPG ou PNG — les images sont compressées automatiquement',
    uploadCover: 'Photo principale',
    termsText: 'Je certifie être propriétaire du bien ou mandaté pour le louer/vendre, et j’accepte les <a href="#" onclick="return false">conditions d’utilisation</a> et la politique de confidentialité.',
    submitBtn: 'Envoyer pour validation',
    formNote: 'À l’envoi, l’annonce est enregistrée dans votre version de démonstration et une copie est transmise à notre équipe sur WhatsApp.',
    successTitle: 'Votre bien a bien été reçu !',
    successDesc: 'Merci. L’équipe MaisonPRO vous contacte sous 24 h pour la visite. Vous pouvez suivre votre demande sur WhatsApp à tout moment.',
    followWa: 'Suivre sur WhatsApp',
    addAnother: 'Ajouter un autre bien',
    errRequired: 'Ce champ est obligatoire',
    errPhone: 'Saisissez un numéro valide (au moins 8 chiffres)',
    errPrice: 'Saisissez un prix valide',
    errTerms: 'Veuillez accepter les conditions',

    eyebrowContact: 'Contact',
    contactTitle: 'Nous sommes là pour vous aider',
    contactSub: 'Une question sur un bien ou besoin d’un conseil ? Choisissez le canal qui vous convient — nous répondons en quelques minutes sur WhatsApp.',
    contactWhatsapp: 'WhatsApp',
    contactPhone: 'Téléphone bureau',
    contactEmail: 'E-mail',
    contactAddress: 'Adresse',
    addressValue: 'Boulevard Bourguiba, Centre-ville, Djibouti',
    ctaTitle: 'Prêt à trouver votre prochain bien ?',
    ctaDesc: 'Indiquez-nous le type de bien, le quartier et le budget : nous vous envoyons une sélection adaptée, sans engagement et sans frais locataire.',
    ctaWa: 'Contacter sur WhatsApp',
    ctaCall: 'Appeler directement',
    hoursText: 'Samedi – Jeudi : <b>8h00 – 18h00</b> · Vendredi : <b>14h00 – 18h00</b>',
    fabTip: 'Une question ? Écrivez-nous',

    eyebrowAreas: 'Zones couvertes',
    areasTitle: 'Nous couvrons les principaux quartiers de Djibouti',
    footerAbout: 'Plateforme immobilière djiboutienne qui relie propriétaires, locataires et acquéreurs, avec un courtage transparent et un suivi complet.',
    footerQuick: 'Liens rapides',
    footerTypes: 'Types de biens',
    footerContact: 'Coordonnées',
    rights: 'Tous droits réservés',
    madeIn: 'Conçu à Djibouti',

    noResults: 'Aucun bien ne correspond',
    noResultsDesc: 'Élargissez votre recherche : retirez des filtres, augmentez le budget ou changez de quartier.',
    clearFilters: 'Effacer les filtres',
    favEmpty: 'Votre liste de favoris est vide',
    favEmptyDesc: 'Touchez le cœur d’une annonce pour l’enregistrer et la retrouver plus tard.',
    toastFavAdd: 'Ajouté aux favoris',
    toastFavRemove: 'Retiré des favoris',
    toastFiltersReset: 'Filtres réinitialisés',
    toastMaxImages: '6 photos maximum',
    toastImageAdded: 'Photo ajoutée',
    toastImageErr: 'Impossible d’ajouter cette image',
    toastFormOk: 'Bien envoyé avec succès',
    toastFormErr: 'Corrigez les champs en rouge',
    toastLinkCopied: 'Lien de l’annonce copié',
    toastLinkFail: 'Impossible de copier le lien'
  },

  en: {
    skip: 'Skip to main content',
    navAria: 'Main navigation',
    menuAria: 'Menu',
    openMenu: 'Open menu',
    close: 'Close',
    language: 'Language',
    searchAria: 'Search properties',
    searchAria2: 'Search listings',
    sortLabel: 'Sort results',
    currency: 'Currency',
    toTop: 'Back to top',
    drawerAreas: 'Popular areas',

    brandTag: 'Real estate brokerage · Djibouti',
    navHome: 'Home',
    navProperties: 'Properties',
    navServices: 'Services',
    navAdd: 'List your property',
    navContact: 'Contact',
    callUs: 'Call us',
    whatsappCta: 'WhatsApp',

    heroBadge: 'Djibouti’s leading real estate brokerage',
    heroTitle: 'Find your dream home <span class="hl">in Djibouti</span>',
    heroDesc: 'Verified apartments, villas and offices for rent and sale in the best neighbourhoods — Heron, Haramous, Saudi City, Downtown and more. We connect owners with tenants, quickly and honestly.',
    trustVerified: 'Verified listings',
    trustFast: 'Viewing within 24h',
    trustNoFee: 'No tenant fees',
    statListed: 'properties available',
    statDistricts: 'districts covered',
    statClients: 'happy clients',

    dealType: 'Transaction',
    dealAll: 'All',
    dealRent: 'For rent',
    dealSale: 'For sale',
    propertyType: 'Property type',
    typeAll: 'All types',
    district: 'Area / district',
    districtAll: 'All districts',
    budget: 'Budget',
    budgetMax: 'Maximum budget',
    budgetAny: 'No limit',
    searchBtn: 'Search',
    quickSearch: 'Quick search:',
    quickHeron: 'Rent in Heron',
    quickSaudi: 'Saudi City',
    quickVillaSale: 'Villa for sale',
    quickOffice: 'Offices',
    resetFilters: 'Reset filters',

    eyebrowProperties: 'Listings',
    listingsTitle: 'A hand-picked selection',
    searchPlaceholder: 'Search by name or area…',
    sortNewest: 'Newest',
    sortPriceAsc: 'Price: low to high',
    sortPriceDesc: 'Price: high to low',
    sortArea: 'Largest area',
    favorites: 'Saved',
    loadMore: 'Load more properties',
    resultsCount: '<strong>{n}</strong> properties found',
    resultsCountOne: '<strong>1</strong> property found',
    resultsNone: 'No matching results',
    showingOf: 'Showing {a} of {b}',

    badgeRent: 'For rent',
    badgeSale: 'For sale',
    badgeNew: 'New',
    badgeFeatured: 'Featured',
    cardRooms: '{n} rooms',
    cardRoomsOne: '1 room',
    cardBaths: '{n} baths',
    cardBathsOne: '1 bath',
    cardArea: '{n} m²',
    cardDetails: 'Details',
    cardWhatsapp: 'WhatsApp',
    perMonth: '/ month',
    perMonthWord: 'per month',
    rentWord: 'rent',
    saleWord: 'sale',
    perYear: 'Total',
    dealRentShort: 'Rent',
    dealSaleShort: 'Sale',
    postedAgo: '{n} d ago',
    postedToday: 'Today',

    detailOverview: 'Description',
    detailAmenities: 'Amenities',
    detailLocation: 'Location',
    detailSpecs: 'Key facts',
    detailRooms: 'Rooms',
    detailBaths: 'Bathrooms',
    detailArea: 'Area',
    detailFloor: 'Floor',
    detailYear: 'Built',
    detailType: 'Type',
    detailId: 'Ref.',
    detailAgent: 'Your advisor',
    detailAgentRole: 'Property advisor · MaisonPRO',
    detailOnline: 'Available now',
    detailWa: 'Chat on WhatsApp',
    detailCall: 'Call',
    detailShare: 'Copy link',
    detailPhotos: '{n} photos',
    propertyNotFound: 'Property not found',

    waPropertyMsg: 'Hello MaisonPRO 👋\nI’d like more information about this property:\n\n🏠 {title}\n🔖 Ref: {id}\n📍 Area: {district}\n🏷️ Transaction: {deal}\n💰 Price: {price}\n\nI saw it on your website and would like to arrange a viewing.',
    waGeneralMsg: 'Hello MaisonPRO 👋\nI’m looking for a property in Djibouti and would like to know what’s available.',

    eyebrowWhy: 'Why MaisonPRO',
    whyTitle: 'Trust is built on details',
    whySub: 'Clear standards protect both owner and tenant at every step — from the first call to handing over the keys.',
    featTrustTitle: 'Honesty & transparency',
    featTrustDesc: 'Real photos and accurate descriptions. No price surprises and no hidden fees for either side.',
    featDocsTitle: 'Verified & documented',
    featDocsDesc: 'We check the title deed and the owner’s identity before any listing goes live.',
    featSpeedTitle: 'Fast turnaround',
    featSpeedDesc: 'We reply within minutes on WhatsApp and arrange a viewing in under 24 hours.',
    featFollowTitle: 'Follow-through to handover',
    featFollowDesc: 'We help with the contract, negotiation and paperwork, and stay available after you move in.',

    eyebrowServices: 'Our services',
    servicesTitle: 'End-to-end property solutions',
    servicesSub: 'From finding a home to managing your portfolio — one team beside you at every stage.',
    srvRentTitle: 'Rental brokerage',
    srvRentDesc: 'We help tenants find the right home and give owners a serious, reliable tenant.',
    srvRentLi1: 'Organised, scheduled viewings',
    srvRentLi2: 'Tenant identity checks',
    srvSaleTitle: 'Buying & selling',
    srvSaleDesc: 'Realistic pricing and professional marketing, with full support through the sale.',
    srvSaleLi1: 'Free property valuation',
    srvSaleLi2: 'Notary and contract follow-up',
    srvManageTitle: 'Property management',
    srvManageDesc: 'For non-resident owners: rent collection, maintenance and clear monthly reports.',
    srvManageLi1: 'Rent collected on time',
    srvManageLi2: 'Monthly expense reports',
    srvAdviceTitle: 'Advisory & investment',
    srvAdviceDesc: 'We help you pick the neighbourhood and yield that best fit your investment in Djibouti.',
    srvAdviceLi1: 'Area and price comparison',
    srvAdviceLi2: 'Expected yield estimate',

    eyebrowAdd: 'For owners',
    addTitle: 'List your property for free',
    addDesc: 'Send us your property details and our team will get in touch within 24 hours to view and publish it to thousands of people looking for a home in Djibouti.',
    addBen1Title: 'Free listing',
    addBen1Desc: 'No fee for owners to publish.',
    addBen2Title: 'Professional photos',
    addBen2Desc: 'We help you photograph the property to attract tenants.',
    addBen3Title: 'Verified tenants',
    addBen3Desc: 'Every request is checked before a viewing.',
    addBen4Title: 'Full follow-up',
    addBen4Desc: 'From viewing to signing the contract.',
    preferWhatsapp: 'Prefer WhatsApp? Message us',
    formTitle: 'Property details',
    formSub: 'Fill in the fields below — * required',
    ownerName: 'Owner name <span class="req">*</span>',
    ownerPhone: 'Phone / WhatsApp <span class="req">*</span>',
    dealLabel: 'Transaction <span class="req">*</span>',
    dealRentOpt: 'For rent',
    dealSaleOpt: 'For sale',
    districtLabel: 'Area / district <span class="req">*</span>',
    addressLabel: 'Detailed address (optional)',
    priceLabel: 'Asking price <span class="req">*</span>',
    titleLabel: 'Listing title <span class="req">*</span>',
    roomsLabel: 'Rooms',
    bathsLabel: 'Bathrooms',
    areaLabel: 'Area (m²)',
    amenitiesLabel: 'Amenities',
    descLabel: 'Description',
    photosLabel: 'Property photos',
    phOwnerName: 'e.g. Ahmed Abdallah',
    phAddress: 'e.g. Street 12, near An-Nour mosque',
    phTitle: 'e.g. Furnished apartment with a view',
    phDesc: 'Describe it clearly: floor, finishes, nearby services, building condition…',
    uploadStrong: 'Drag photos here or click to choose',
    uploadHint: 'JPG or PNG — images are compressed automatically',
    uploadCover: 'Cover photo',
    termsText: 'I confirm I own this property or am authorised to rent/sell it, and I accept the <a href="#" onclick="return false">terms of use</a> and privacy policy.',
    submitBtn: 'Submit for review',
    formNote: 'On submit, the listing is saved in your demo version and a copy is sent to our team on WhatsApp.',
    successTitle: 'Your property has been received!',
    successDesc: 'Thank you. The MaisonPRO team will contact you within 24 hours to arrange a viewing. You can follow up on WhatsApp anytime.',
    followWa: 'Follow up on WhatsApp',
    addAnother: 'Add another property',
    errRequired: 'This field is required',
    errPhone: 'Enter a valid phone number (at least 8 digits)',
    errPrice: 'Enter a valid price',
    errTerms: 'Please accept the terms to continue',

    eyebrowContact: 'Contact',
    contactTitle: 'We’re here to help',
    contactSub: 'A question about a property or need advice? Pick the channel that suits you — we usually reply on WhatsApp within minutes.',
    contactWhatsapp: 'WhatsApp',
    contactPhone: 'Office phone',
    contactEmail: 'Email',
    contactAddress: 'Address',
    addressValue: 'Boulevard Bourguiba, Downtown, Djibouti',
    ctaTitle: 'Ready to find your next property?',
    ctaDesc: 'Tell us the property type, area and budget and we’ll send a tailored shortlist — no obligation and no tenant fees.',
    ctaWa: 'Chat on WhatsApp',
    ctaCall: 'Call directly',
    hoursText: 'Sat – Thu: <b>8:00 – 18:00</b> · Fri: <b>14:00 – 18:00</b>',
    fabTip: 'Ask about any property',

    eyebrowAreas: 'Coverage',
    areasTitle: 'We cover Djibouti’s main neighbourhoods',
    footerAbout: 'A Djiboutian real estate platform connecting owners, tenants and buyers through transparent brokerage and full follow-up.',
    footerQuick: 'Quick links',
    footerTypes: 'Property types',
    footerContact: 'Contact details',
    rights: 'All rights reserved',
    madeIn: 'Made in Djibouti',

    noResults: 'No matching properties',
    noResultsDesc: 'Try widening your search: remove filters, raise the budget or choose another area.',
    clearFilters: 'Clear all filters',
    favEmpty: 'Your saved list is empty',
    favEmptyDesc: 'Tap the heart on any listing to save it here and come back later.',
    toastFavAdd: 'Saved to your list',
    toastFavRemove: 'Removed from saved',
    toastFiltersReset: 'Filters reset',
    toastMaxImages: '6 photos maximum',
    toastImageAdded: 'Photo added',
    toastImageErr: 'Could not add that image',
    toastFormOk: 'Property sent successfully',
    toastFormErr: 'Please fix the highlighted fields',
    toastLinkCopied: 'Listing link copied',
    toastLinkFail: 'Could not copy the link'
  }
};

/* ---------------------------------------------------------
   i18n runtime
   --------------------------------------------------------- */
const I18N_LANGS = ['ar', 'fr', 'en'];
const LANG_NAMES = { ar: 'العربية', fr: 'Français', en: 'English' };
const RTL_LANGS = ['ar'];

let currentLang = 'ar';

function t(key, vars) {
  const dict = I18N[currentLang] || I18N.ar;
  let str = dict[key];
  if (str === undefined) str = I18N.ar[key];
  if (str === undefined) return key;
  if (vars) {
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
    });
  }
  return str;
}

/* nom localisé d'un quartier / type / équipement */
function loc(obj) {
  if (!obj) return '';
  return obj[currentLang] || obj.ar || obj.fr || '';
}
function districtName(id) {
  const d = DISTRICTS.find(x => x.id === id);
  return d ? loc(d) : id;
}
function typeName(id) {
  const ty = TYPES.find(x => x.id === id);
  return ty ? loc(ty) : id;
}
function amenityName(id) {
  const a = AMENITIES[id];
  return a ? loc(a) : id;
}

function applyLanguage(lang) {
  if (!I18N_LANGS.includes(lang)) lang = 'ar';
  currentLang = lang;
  const rtl = RTL_LANGS.includes(lang);

  document.documentElement.lang = lang;
  document.documentElement.dir = rtl ? 'rtl' : 'ltr';
  const body = document.body;
  body.setAttribute('data-lang', lang);
  body.style.fontFamily = lang === 'ar' ? 'var(--font-ar)' : 'var(--font-en)';

  /* simple text nodes */
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val !== key) el.innerHTML = val;
  });
  /* rich html (links, <b>, <span>) */
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = t(key);
    if (val !== key) el.innerHTML = val;
  });
  /* placeholders */
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  /* aria labels */
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
  });

  /* language switch buttons */
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang-btn') === lang));
  });

  /* header language label */
  const cur = document.getElementById('lang-current');
  if (cur) cur.textContent = LANG_NAMES[lang] || lang;

  /* number formatting locale */
  try { localStorage.setItem('maisonpro:lang', lang); } catch (e) {}
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

window.I18N = I18N;
window.t = t;
window.loc = loc;
window.applyLanguage = applyLanguage;
window.getLang = () => currentLang;
window.districtName = districtName;
window.typeName = typeName;
window.amenityName = amenityName;
