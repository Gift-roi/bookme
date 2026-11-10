// BookMe Cameroun - Modèle de données prévisionnel (Section 13 du Cahier des Charges)
// Fuseau horaire de référence : Africa/Douala (GMT+1)

window.BOOKME_SEED_DATA = {
  platform_settings: {
    currency: 'FCFA',
    timezone: 'Africa/Douala (GMT+1)',
    defaultCity: 'Douala',
    commissionRate: 5, // 5% sur les réservations payées en ligne (Section 9)
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        price: 0,
        period: 'mois',
        badge: 'Gratuit',
        features: [
          'Profil professionnel vérifié',
          'Jusqu\'à 5 prestations publiées',
          'Gestion simple du calendrier & réservations',
          'Paiement sur place uniquement'
        ]
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 5000,
        period: 'mois',
        badge: 'Populaire',
        features: [
          'Prestations illimitées',
          'Paiements Orange Money & MTN MoMo intégrés',
          'Statistiques avancées & rappels SMS automatiques',
          'Visibilité prioritaire dans les recherches à Douala'
        ]
      },
      {
        id: 'business',
        name: 'Business',
        price: 15000,
        period: 'mois',
        badge: 'Multi-équipes',
        features: [
          'Tout le pack Pro inclus',
          'Gestion de plusieurs employés / coiffeurs / techniciens',
          'Multi-sites (Douala, Yaoundé...)',
          'Support dédié & badge Top Partenaire'
        ]
      }
    ]
  },

  // 5. Catégories de services proposées (AD04)
  categories: [
    {
      id: 'cat-coiffure',
      name: 'Coiffure et barber',
      slug: 'coiffure-barber',
      icon: 'scissors',
      description: 'Coupe, tresses, coiffure, rasage, soins capillaires.',
      color: 'teal',
      active: true
    },
    {
      id: 'cat-beaute',
      name: 'Beauté et esthétique',
      slug: 'beaute-esthetique',
      icon: 'sparkles',
      description: 'Manucure, pédicure, maquillage, soins du visage.',
      color: 'amber',
      active: true
    },
    {
      id: 'cat-auto',
      name: 'Automobile',
      slug: 'automobile',
      icon: 'car',
      description: 'Diagnostic, réparation, entretien, lavage.',
      color: 'blue',
      active: true
    },
    {
      id: 'cat-photo',
      name: 'Photographie',
      slug: 'photographie',
      icon: 'camera',
      description: 'Séances photo, portraits, couverture d\'événements.',
      color: 'purple',
      active: true
    },
    {
      id: 'cat-domicile',
      name: 'Services à domicile',
      slug: 'services-domicile',
      icon: 'home',
      description: 'Ménage, nettoyage, entretien et petits travaux.',
      color: 'emerald',
      active: true
    },
    {
      id: 'cat-sport',
      name: 'Sport et coaching',
      slug: 'sport-coaching',
      icon: 'dumbbell',
      description: 'Coaching sportif, séances individuelles et accompagnement.',
      color: 'rose',
      active: true
    }
  ],

  // Table: users (CL01, PR01, AD02)
  users: [
    {
      id: 'usr-client-1',
      name: 'Christian Ndongo',
      email: 'christian.ndongo@email.cm',
      phone: '+237 699 42 18 75',
      password: 'password123',
      role: 'client',
      city: 'Douala',
      neighborhood: 'Bonapriso',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-05T09:15:00+01:00'
    },
    {
      id: 'usr-client-2',
      name: 'Aïcha Moukoko',
      email: 'aicha.moukoko@email.cm',
      phone: '+237 677 88 31 09',
      password: 'password123',
      role: 'client',
      city: 'Douala',
      neighborhood: 'Akwa',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-12T14:20:00+01:00'
    },
    {
      id: 'usr-pro-1',
      name: 'Samuel Ewane',
      email: 'contact@lebarbier-akwa.cm',
      phone: '+237 694 11 22 33',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-1',
      city: 'Douala',
      neighborhood: 'Akwa',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-01T08:00:00+01:00'
    },
    {
      id: 'usr-pro-2',
      name: 'Clarisse Biya-Ngo',
      email: 'clarisse@ebene-glow.cm',
      phone: '+237 675 44 90 12',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-2',
      city: 'Douala',
      neighborhood: 'Bonapriso',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-02T10:30:00+01:00'
    },
    {
      id: 'usr-pro-3',
      name: 'Hervé Kamga',
      email: 'garage@autotech-makepe.cm',
      phone: '+237 691 05 67 89',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-3',
      city: 'Douala',
      neighborhood: 'Makepe',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-04T11:00:00+01:00'
    },
    {
      id: 'usr-pro-4',
      name: 'Yannick Fotso',
      email: 'studio@lumiere237.cm',
      phone: '+237 655 30 98 41',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-4',
      city: 'Douala',
      neighborhood: 'Bonamoussadi',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-07T15:10:00+01:00'
    },
    {
      id: 'usr-pro-5',
      name: 'Mireille Tchouaffe',
      email: 'contact@cleanhome-douala.cm',
      phone: '+237 698 76 54 32',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-5',
      city: 'Douala',
      neighborhood: 'Logpom',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-10T09:00:00+01:00'
    },
    {
      id: 'usr-pro-6',
      name: 'Coach Franck Mbarga',
      email: 'franck@fitpower237.cm',
      phone: '+237 670 19 28 37',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-6',
      city: 'Douala',
      neighborhood: 'Bonanjo',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-10-14T16:40:00+01:00'
    },
    {
      id: 'usr-pro-7',
      name: 'Patrick Njoya',
      email: 'patrick@royalwash-deido.cm',
      phone: '+237 690 12 34 56',
      password: 'password123',
      role: 'provider',
      providerId: 'prv-7',
      city: 'Douala',
      neighborhood: 'Deïdo',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-11-08T11:30:00+01:00'
    },
    {
      id: 'usr-admin-1',
      name: 'Direction BookMe Cameroun',
      email: 'admin@bookme.cm',
      phone: '+237 699 00 00 01',
      password: 'adminpassword',
      role: 'admin',
      city: 'Douala',
      neighborhood: 'Bonanjo',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
      createdAt: '2026-09-25T08:00:00+01:00'
    }
  ],

  // Table: providers (PR02, PR03, AD03)
  providers: [
    {
      id: 'prv-1',
      userId: 'usr-pro-1',
      businessName: 'King\'s Lounge Barber & Spa',
      categoryId: 'cat-coiffure',
      city: 'Douala',
      neighborhood: 'Akwa',
      address: 'Boulevard de la Liberté, face Immeuble Socar, Akwa, Douala',
      phone: '+237 694 11 22 33',
      description: 'Le salon de référence à Akwa pour vos coupes dégradées américaines, taille de barbe au rasoir traditionnel, soins du visage vapeur et locks. Cadre climatisé, Wi-Fi gratuit et boisson offerte.',
      coverImage: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80'
      ],
      verificationStatus: 'verified', // verified | pending | rejected
      verificationDoc: 'RCCM RC/DLA/2024/B/1492 - NIU M0424198237C',
      confirmationMode: 'auto', // auto | manual (PR08)
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation sans frais jusqu\'à 3 heures avant le rendez-vous.',
      subscriptionPlan: 'pro',
      rating: 4.9,
      reviewCount: 38,
      featured: true
    },
    {
      id: 'prv-2',
      userId: 'usr-pro-2',
      businessName: 'Ébène & Glow Beauty Institute',
      categoryId: 'cat-beaute',
      city: 'Douala',
      neighborhood: 'Bonapriso',
      address: 'Rue des Palmiers, près Hôtel Résidence La Falaise, Bonapriso, Douala',
      phone: '+237 675 44 90 12',
      description: 'Institut haut de gamme spécialisé dans la beauté africaine et internationale : tresses sans douleur, pose de perruques lace frontal, maquillage mariée & soirée, onglerie gel et soins éclat du teint.',
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80'
      ],
      verificationStatus: 'verified',
      verificationDoc: 'RCCM RC/DLA/2023/A/0891 - CNI 110928374',
      confirmationMode: 'auto',
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation gratuite jusqu\'à 6 heures avant le créneau réservé.',
      subscriptionPlan: 'business',
      rating: 4.8,
      reviewCount: 52,
      featured: true
    },
    {
      id: 'prv-3',
      userId: 'usr-pro-3',
      businessName: 'AutoTech Diagnostic & Lavage Makepe',
      categoryId: 'cat-auto',
      city: 'Douala',
      neighborhood: 'Makepe',
      address: 'Carrefour Makepe Missoke, à 150m de la station Total, Douala',
      phone: '+237 691 05 67 89',
      description: 'Centre automobile moderne équipé de valises de diagnostic multi-marques (Toyota, Mercedes, Hyundai, Kia). Vidange express, recharge climatisation, révision freinage et lavage VIP vapeur.',
      coverImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80'
      ],
      verificationStatus: 'verified',
      verificationDoc: 'RCCM RC/DLA/2022/B/4410 - Patente 2026 valide',
      confirmationMode: 'manual',
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Prévenir au moins 4 heures à l\'avance en cas d\'empêchement.',
      subscriptionPlan: 'pro',
      rating: 4.7,
      reviewCount: 24,
      featured: true
    },
    {
      id: 'prv-4',
      userId: 'usr-pro-4',
      businessName: 'Studio Lumière 237 Photography',
      categoryId: 'cat-photo',
      city: 'Douala',
      neighborhood: 'Bonamoussadi',
      address: ' Rond-point Maetur Bonamoussadi, Immeuble Vitré 2e étage, Douala',
      phone: '+237 655 30 98 41',
      description: 'Studio photo professionnel climatisé et équipe mobile pour vos shootings portrait, anniversaire, dot, mariage civil et corporate. Retouches haute définition livrées sous 48h.',
      coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80'
      ],
      verificationStatus: 'verified',
      verificationDoc: 'NIU P0992831120A - CNI Vérifiée',
      confirmationMode: 'manual',
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation sans frais jusqu\'à 24 heures avant la séance.',
      subscriptionPlan: 'pro',
      rating: 4.9,
      reviewCount: 19,
      featured: false
    },
    {
      id: 'prv-5',
      userId: 'usr-pro-5',
      businessName: 'CleanHome Services Douala',
      categoryId: 'cat-domicile',
      city: 'Douala',
      neighborhood: 'Logpom',
      address: 'Intervention à domicile : Logpom, Kotto, Bonamoussadi, Makepe, Akwa & Bonapriso',
      phone: '+237 698 76 54 32',
      description: 'Équipe d\'agents d\'entretien formés et vérifiés pour le ménage complet d\'appartements, nettoyage de canapés/matelas par injection-extraction, et remise en état fin de chantier.',
      coverImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      verificationStatus: 'verified',
      verificationDoc: 'RCCM RC/DLA/2025/B/0312',
      confirmationMode: 'auto',
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation gratuite jusqu\'à 12 heures avant l\'intervention.',
      subscriptionPlan: 'basic',
      rating: 4.6,
      reviewCount: 15,
      featured: false
    },
    {
      id: 'prv-6',
      userId: 'usr-pro-6',
      businessName: 'FitPower 237 Coaching & Wellness',
      categoryId: 'cat-sport',
      city: 'Douala',
      neighborhood: 'Bonanjo',
      address: 'Rue Joss, Parcours Vita & salle privée Bonanjo, Douala',
      phone: '+237 670 19 28 37',
      description: 'Coach sportif diplômé d\'État : remise en forme, perte de poids, préparation physique, boxe cardio et suivi nutritionnel adapté aux habitudes alimentaires camerounaises.',
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      verificationStatus: 'verified',
      verificationDoc: 'Certificat INJS Yaoundé + CNI Vérifiée',
      confirmationMode: 'auto',
      acceptOnlinePayment: true,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation possible jusqu\'à 4 heures avant la séance.',
      subscriptionPlan: 'basic',
      rating: 4.8,
      reviewCount: 11,
      featured: false
    },
    {
      id: 'prv-7',
      userId: 'usr-pro-7',
      businessName: 'Royal Auto Wash & Detailing Deïdo',
      categoryId: 'cat-auto',
      city: 'Douala',
      neighborhood: 'Deïdo',
      address: 'Boulevard de la République, près Rond-Point Deïdo, Douala',
      phone: '+237 690 12 34 56',
      description: 'Nouveau centre de lavage écologique haute pression, polissage carrosserie et rénovation optique de phares à Deïdo.',
      coverImage: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&w=1000&q=80',
      gallery: [],
      verificationStatus: 'pending', // En attente de validation Admin (RG02, AD03)
      verificationDoc: 'Attestation d\'immatriculation NIU en cours de vérification (soumis le 08/11/2026)',
      confirmationMode: 'manual',
      acceptOnlinePayment: false,
      acceptOnSitePayment: true,
      cancellationPolicy: 'Annulation gratuite jusqu\'à 2 heures avant.',
      subscriptionPlan: 'basic',
      rating: 0,
      reviewCount: 0,
      featured: false
    }
  ],

  // Table: services (PR04, PR05, RG03)
  services: [
    // King's Lounge Barber (prv-1)
    {
      id: 'srv-101',
      providerId: 'prv-1',
      categoryId: 'cat-coiffure',
      name: 'Coupe Dégradée VIP + Barbe + Serviette Chaude',
      description: 'Coupe de précision aux ciseaux et tondeuse, traçage lame neuve, soin barbe aux huiles essentielles et vapeur relaxante.',
      price: 5000,
      isQuote: false,
      duration: 45, // minutes
      active: true
    },
    {
      id: 'srv-102',
      providerId: 'prv-1',
      categoryId: 'cat-coiffure',
      name: 'Coupe Classique Homme / Enfant',
      description: 'Coupe rapide et soignée avec coiffage et lotion après-rasage.',
      price: 2500,
      isQuote: false,
      duration: 30,
      active: true
    },
    {
      id: 'srv-103',
      providerId: 'prv-1',
      categoryId: 'cat-coiffure',
      name: 'Retwist Locks + Shampoing Clarifiant',
      description: 'Lavage en profondeur, hydratation au beurre de karité pur et reprise des racines.',
      price: 10000,
      isQuote: false,
      duration: 90,
      active: true
    },
    {
      id: 'srv-104',
      providerId: 'prv-1',
      categoryId: 'cat-coiffure',
      name: 'Soin Visage Black Mask & Vapozone',
      description: 'Extraction des comédons, gommage doux, vapeur d\'ozone et masque purifiant charbon actif.',
      price: 7500,
      isQuote: false,
      duration: 45,
      active: true
    },

    // Ébène & Glow Beauty (prv-2)
    {
      id: 'srv-201',
      providerId: 'prv-2',
      categoryId: 'cat-beaute',
      name: 'Knotless Braids (Tresses sans nœuds mi-dos)',
      description: 'Tresses légères et protectrices réalisées sans tension sur le cuir chevelu. Soin hydratant inclus.',
      price: 15000,
      isQuote: false,
      duration: 120,
      active: true
    },
    {
      id: 'srv-202',
      providerId: 'prv-2',
      categoryId: 'cat-beaute',
      name: 'Pose Perruque Lace Frontal + Baby Hair & Styling',
      description: 'Customisation de la lace, blanchiment des nœuds, pose colle ou sans colle et coiffage au fer.',
      price: 12000,
      isQuote: false,
      duration: 60,
      active: true
    },
    {
      id: 'srv-203',
      providerId: 'prv-2',
      categoryId: 'cat-beaute',
      name: 'Manucure Russe + Pose Gel &Pédicure Spa',
      description: 'Soin complet des mains et des pieds au bain moussant, cuticules nettes et vernis semi-permanent.',
      price: 10000,
      isQuote: false,
      duration: 60,
      active: true
    },
    {
      id: 'srv-204',
      providerId: 'prv-2',
      categoryId: 'cat-beaute',
      name: 'Maquillage Glam Soirée / Dot / Mariage',
      description: 'Teint lumineux longue tenue adapté au climat humide de Douala, faux-cils de soie inclus.',
      price: 15000,
      isQuote: false,
      duration: 60,
      active: true
    },

    // AutoTech Makepe (prv-3)
    {
      id: 'srv-301',
      providerId: 'prv-3',
      categoryId: 'cat-auto',
      name: 'Diagnostic Électronique Complet (Valise OBD2 Pro)',
      description: 'Lecture et effacement des codes défauts moteur, boîte auto, ABS, airbag + rapport PDF détaillé.',
      price: 10000,
      isQuote: false,
      duration: 45,
      active: true
    },
    {
      id: 'srv-302',
      providerId: 'prv-3',
      categoryId: 'cat-auto',
      name: 'Forfait Vidange Moteur + Contrôle 25 Points',
      description: 'Main d\'œuvre remplacement huile et filtre, vérification freins, batterie, pneus et niveaux.',
      price: 15000,
      isQuote: false,
      duration: 60,
      active: true
    },
    {
      id: 'srv-303',
      providerId: 'prv-3',
      categoryId: 'cat-auto',
      name: 'Lavage Complet VIP + Désinfection Intérieure Vapeur',
      description: 'Lavage carrosserie mousse active, aspiration, nettoyage sièges vapeur et brillant pneus.',
      price: 6000,
      isQuote: false,
      duration: 60,
      active: true
    },
    {
      id: 'srv-304',
      providerId: 'prv-3',
      categoryId: 'cat-auto',
      name: 'Réparation Mécanique / Climatisation (Sur Devis)',
      description: 'Inspection approfondie sur pont élévateur et établissement d\'un devis chiffré avant travaux.',
      price: 0,
      isQuote: true, // RG03 : indication explicite de prix sur devis
      duration: 60,
      active: true
    },

    // Studio Lumière 237 (prv-4)
    {
      id: 'srv-401',
      providerId: 'prv-4',
      categoryId: 'cat-photo',
      name: 'Shooting Studio Portrait / Anniversaire (2 Tenues)',
      description: '1h de prise de vue en studio climatisé, 10 photos HD retouchées + toutes les brutes sur galerie privée.',
      price: 25000,
      isQuote: false,
      duration: 60,
      active: true
    },
    {
      id: 'srv-402',
      providerId: 'prv-4',
      categoryId: 'cat-photo',
      name: 'Pack Corporate & LinkedIn Express',
      description: '3 portraits professionnels sur fond neutre pour CV, réseaux pro et communication d\'entreprise.',
      price: 12000,
      isQuote: false,
      duration: 30,
      active: true
    },

    // CleanHome Services (prv-5)
    {
      id: 'srv-501',
      providerId: 'prv-5',
      categoryId: 'cat-domicile',
      name: 'Grand Ménage Appartement (2 à 3 pièces)',
      description: 'Dépoussiérage complet, lavage sols, désinfection cuisine et salles d\'eau, vitres accessibles.',
      price: 15000,
      isQuote: false,
      duration: 120,
      active: true
    },
    {
      id: 'srv-502',
      providerId: 'prv-5',
      categoryId: 'cat-domicile',
      name: 'Nettoyage Profond Salon Canapé 5-7 places',
      description: 'Shampouinage par injection-extraction anti-acariens et détachage professionnel à domicile.',
      price: 20000,
      isQuote: false,
      duration: 90,
      active: true
    },

    // FitPower 237 (prv-6)
    {
      id: 'srv-601',
      providerId: 'prv-6',
      categoryId: 'cat-sport',
      name: 'Séance Coaching Individuel (1h) + Bilan Corporel',
      description: 'Entraînement personnalisé cardio/renforcement et prise des mensurations par impédancemancie.',
      price: 7500,
      isQuote: false,
      duration: 60,
      active: true
    },

    // Royal Auto Wash Deïdo (prv-7 - non vérifié)
    {
      id: 'srv-701',
      providerId: 'prv-7',
      categoryId: 'cat-auto',
      name: 'Lavage Express Haute Pression',
      description: 'Lavage extérieur et coup d\'aspirateur rapide.',
      price: 3500,
      isQuote: false,
      duration: 30,
      active: true
    }
  ],

  // Table: availability (PR06 : configuration des jours et heures de travail, pauses et fermeture)
  // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  availability: {
    'prv-1': {
      1: { open: true, start: '08:30', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
      2: { open: true, start: '08:30', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
      3: { open: true, start: '08:30', end: '20:00', breakStart: '13:00', breakEnd: '14:00' },
      4: { open: true, start: '08:30', end: '20:30', breakStart: '13:00', breakEnd: '14:00' },
      5: { open: true, start: '08:30', end: '21:00', breakStart: '13:00', breakEnd: '14:00' },
      6: { open: true, start: '08:00', end: '21:00', breakStart: '13:30', breakEnd: '14:00' },
      0: { open: true, start: '11:00', end: '18:00', breakStart: '', breakEnd: '' }
    },
    'prv-2': {
      1: { open: false, start: '09:00', end: '18:00', breakStart: '', breakEnd: '' },
      2: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      3: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      4: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      5: { open: true, start: '08:30', end: '20:00', breakStart: '13:00', breakEnd: '13:30' },
      6: { open: true, start: '08:00', end: '20:00', breakStart: '', breakEnd: '' },
      0: { open: true, start: '12:00', end: '18:00', breakStart: '', breakEnd: '' }
    },
    'prv-3': {
      1: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      2: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      3: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      4: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      5: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      6: { open: true, start: '08:00', end: '16:00', breakStart: '', breakEnd: '' },
      0: { open: false, start: '08:00', end: '14:00', breakStart: '', breakEnd: '' }
    },
    'prv-4': {
      1: { open: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      2: { open: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      3: { open: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      4: { open: true, start: '09:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
      5: { open: true, start: '09:00', end: '19:00', breakStart: '13:00', breakEnd: '14:00' },
      6: { open: true, start: '09:00', end: '19:00', breakStart: '', breakEnd: '' },
      0: { open: true, start: '13:00', end: '18:00', breakStart: '', breakEnd: '' }
    },
    'prv-5': {
      1: { open: true, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      2: { open: true, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      3: { open: true, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      4: { open: true, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      5: { open: true, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
      6: { open: true, start: '08:00', end: '16:00', breakStart: '', breakEnd: '' },
      0: { open: false, start: '08:00', end: '14:00', breakStart: '', breakEnd: '' }
    },
    'prv-6': {
      1: { open: true, start: '06:30', end: '19:30', breakStart: '12:00', breakEnd: '15:00' },
      2: { open: true, start: '06:30', end: '19:30', breakStart: '12:00', breakEnd: '15:00' },
      3: { open: true, start: '06:30', end: '19:30', breakStart: '12:00', breakEnd: '15:00' },
      4: { open: true, start: '06:30', end: '19:30', breakStart: '12:00', breakEnd: '15:00' },
      5: { open: true, start: '06:30', end: '19:30', breakStart: '12:00', breakEnd: '15:00' },
      6: { open: true, start: '07:00', end: '14:00', breakStart: '', breakEnd: '' },
      0: { open: false, start: '08:00', end: '12:00', breakStart: '', breakEnd: '' }
    },
    'prv-7': {
      1: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      2: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      3: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      4: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      5: { open: true, start: '08:00', end: '18:00', breakStart: '12:30', breakEnd: '13:30' },
      6: { open: true, start: '08:00', end: '18:00', breakStart: '', breakEnd: '' },
      0: { open: false, start: '08:00', end: '14:00', breakStart: '', breakEnd: '' }
    }
  },

  // Créneaux bloqués par les professionnels (PR09, RG04)
  blocked_slots: [
    {
      id: 'blk-1',
      providerId: 'prv-1',
      date: '2026-11-11',
      time: '15:00',
      reason: 'Maintenance matériel & désinfection salon'
    },
    {
      id: 'blk-2',
      providerId: 'prv-1',
      date: '2026-11-12',
      time: '10:00',
      reason: 'Rendez-vous fournisseur cosmétiques Akwa'
    }
  ],

  // Table: bookings (Section 6.2 Cycle de vie d'une réservation : confirmed, pending, completed, cancelled, noshow, rejected)
  bookings: [
    {
      id: 'BKM-2026-8401',
      clientId: 'usr-client-1',
      providerId: 'prv-1',
      serviceId: 'srv-101',
      serviceNameSnapshot: 'Coupe Dégradée VIP + Barbe + Serviette Chaude',
      priceSnapshot: 5000, // RG14 : prix figé au moment de la réservation
      durationSnapshot: 45,
      date: '2026-11-04',
      time: '16:00',
      status: 'completed',
      paymentMethod: 'orange_money',
      paymentStatus: 'paid',
      paymentRef: 'TX-OM-261104-9941',
      commissionAmount: 250,
      hasReview: true,
      notes: 'Dégradé bas (low fade), conserver la longueur sur le dessus.',
      createdAt: '2026-11-03T18:20:00+01:00'
    },
    {
      id: 'BKM-2026-8402',
      clientId: 'usr-client-1',
      providerId: 'prv-2',
      serviceId: 'srv-203',
      serviceNameSnapshot: 'Manucure Russe + Pose Gel & Pédicure Spa',
      priceSnapshot: 10000,
      durationSnapshot: 60,
      date: '2026-11-07',
      time: '14:30',
      status: 'completed',
      paymentMethod: 'mtn_momo',
      paymentStatus: 'paid',
      paymentRef: 'TX-MOMO-261107-3318',
      commissionAmount: 500,
      hasReview: false, // Permet de tester CL10 & RG08 (laisser un avis sur une prestation terminée !)
      notes: 'Cadeau pour mon épouse.',
      createdAt: '2026-11-05T11:10:00+01:00'
    },
    {
      id: 'BKM-2026-8403',
      clientId: 'usr-client-1',
      providerId: 'prv-1',
      serviceId: 'srv-101',
      serviceNameSnapshot: 'Coupe Dégradée VIP + Barbe + Serviette Chaude',
      priceSnapshot: 5000,
      durationSnapshot: 45,
      date: '2026-11-11',
      time: '10:30',
      status: 'confirmed',
      paymentMethod: 'onsite',
      paymentStatus: 'pending_onsite',
      paymentRef: 'PAY-SUR-PLACE-8403',
      commissionAmount: 0,
      hasReview: false,
      notes: 'Je passerai pile à l\'heure.',
      createdAt: '2026-11-10T10:00:00+01:00'
    },
    {
      id: 'BKM-2026-8404',
      clientId: 'usr-client-2',
      providerId: 'prv-1',
      serviceId: 'srv-103',
      serviceNameSnapshot: 'Retwist Locks + Shampoing Clarifiant',
      priceSnapshot: 10000,
      durationSnapshot: 90,
      date: '2026-11-11',
      time: '14:00',
      status: 'pending', // Pour que le pro puisse Accepter ou Refuser en direct (PR08)
      paymentMethod: 'mtn_momo',
      paymentStatus: 'paid',
      paymentRef: 'TX-MOMO-261110-7712',
      commissionAmount: 500,
      hasReview: false,
      notes: 'Merci de prévoir une huile au romarin si disponible.',
      createdAt: '2026-11-10T15:30:00+01:00'
    },
    {
      id: 'BKM-2026-8405',
      clientId: 'usr-client-1',
      providerId: 'prv-3',
      serviceId: 'srv-301',
      serviceNameSnapshot: 'Diagnostic Électronique Complet (Valise OBD2 Pro)',
      priceSnapshot: 10000,
      durationSnapshot: 45,
      date: '2026-11-13',
      time: '09:00',
      status: 'pending',
      paymentMethod: 'onsite',
      paymentStatus: 'pending_onsite',
      paymentRef: 'PAY-SUR-PLACE-8405',
      commissionAmount: 0,
      hasReview: false,
      notes: 'Toyota RAV4 2019 - Voyant Check Engine allumé.',
      createdAt: '2026-11-10T16:45:00+01:00'
    },
    {
      id: 'BKM-2026-8406',
      clientId: 'usr-client-2',
      providerId: 'prv-2',
      serviceId: 'srv-201',
      serviceNameSnapshot: 'Knotless Braids (Tresses sans nœuds mi-dos)',
      priceSnapshot: 15000,
      durationSnapshot: 120,
      date: '2026-11-02',
      time: '09:30',
      status: 'completed',
      paymentMethod: 'orange_money',
      paymentStatus: 'paid',
      paymentRef: 'TX-OM-261102-5104',
      commissionAmount: 750,
      hasReview: true,
      notes: 'Couleur mèches numéro 1B.',
      createdAt: '2026-10-30T13:00:00+01:00'
    }
  ],

  // Table: payments (Section 8.2 & RG15)
  payments: [
    {
      id: 'pay-1',
      bookingId: 'BKM-2026-8401',
      amount: 5000,
      currency: 'FCFA',
      method: 'Orange Money Cameroun',
      externalRef: 'TX-OM-261104-9941',
      phoneUsed: '+237 699 42 18 75',
      status: 'succeeded',
      verifiedServerToServer: true,
      createdAt: '2026-11-03T18:21:00+01:00'
    },
    {
      id: 'pay-2',
      bookingId: 'BKM-2026-8402',
      amount: 10000,
      currency: 'FCFA',
      method: 'MTN Mobile Money (MoMo)',
      externalRef: 'TX-MOMO-261107-3318',
      phoneUsed: '+237 677 88 31 09',
      status: 'succeeded',
      verifiedServerToServer: true,
      createdAt: '2026-11-05T11:11:00+01:00'
    },
    {
      id: 'pay-3',
      bookingId: 'BKM-2026-8404',
      amount: 10000,
      currency: 'FCFA',
      method: 'MTN Mobile Money (MoMo)',
      externalRef: 'TX-MOMO-261110-7712',
      phoneUsed: '+237 677 88 31 09',
      status: 'succeeded',
      verifiedServerToServer: true,
      createdAt: '2026-11-10T15:31:00+01:00'
    },
    {
      id: 'pay-4',
      bookingId: 'BKM-2026-8406',
      amount: 15000,
      currency: 'FCFA',
      method: 'Orange Money Cameroun',
      externalRef: 'TX-OM-261102-5104',
      phoneUsed: '+237 699 42 18 75',
      status: 'succeeded',
      verifiedServerToServer: true,
      createdAt: '2026-10-30T13:01:00+01:00'
    }
  ],

  // Table: reviews (CL10, PR11, AD07, RG08)
  reviews: [
    {
      id: 'rev-1',
      bookingId: 'BKM-2026-8401',
      clientId: 'usr-client-1',
      clientName: 'Christian Ndongo',
      providerId: 'prv-1',
      serviceName: 'Coupe Dégradée VIP + Barbe + Serviette Chaude',
      rating: 5,
      comment: 'Ponctualité exemplaire ! Pas d\'attente comme d\'habitude, mon créneau réservé sur BookMe a été respecté à la minute près. Le dégradé est impeccable.',
      status: 'published', // published | hidden
      createdAt: '2026-11-04T18:30:00+01:00'
    },
    {
      id: 'rev-2',
      bookingId: 'BKM-2026-8406',
      clientId: 'usr-client-2',
      clientName: 'Aïcha Moukoko',
      providerId: 'prv-2',
      serviceName: 'Knotless Braids (Tresses sans nœuds mi-dos)',
      rating: 5,
      comment: 'Salon très propre à Bonapriso, les coiffeuses ont la main douce et le paiement par Orange Money sur BookMe est super pratique.',
      status: 'published',
      createdAt: '2026-11-02T15:00:00+01:00'
    },
    {
      id: 'rev-3',
      bookingId: 'BKM-2026-8390',
      clientId: 'usr-client-2',
      clientName: 'Aïcha Moukoko',
      providerId: 'prv-3',
      serviceName: 'Lavage Complet VIP + Désinfection Intérieure Vapeur',
      rating: 4,
      comment: 'Travail très sérieux à Makepe. Ma voiture est ressortie comme neuve.',
      status: 'published',
      createdAt: '2026-10-28T17:15:00+01:00'
    }
  ],

  // Table: notifications (CL11, PR12, RG09)
  notifications: [
    {
      id: 'notif-1',
      userId: 'usr-client-1',
      title: 'Rappel de rendez-vous demain',
      message: 'Votre RDV chez King\'s Lounge Barber & Spa (Coupe Dégradée VIP) est confirmé pour le 11/11/2026 à 10:30.',
      channel: 'SMS & In-App',
      read: false,
      createdAt: '2026-11-10T18:00:00+01:00'
    },
    {
      id: 'notif-2',
      userId: 'usr-client-1',
      title: 'Donnez votre avis !',
      message: 'Votre prestation chez Ébène & Glow Beauty Institute est terminée. Partagez votre note avec la communauté BookMe.',
      channel: 'In-App',
      read: false,
      createdAt: '2026-11-07T16:00:00+01:00'
    },
    {
      id: 'notif-3',
      userId: 'usr-pro-1',
      title: 'Nouvelle demande de réservation',
      message: 'Aïcha Moukoko souhaite réserver "Retwist Locks + Shampoing" le 11/11/2026 à 14:00 (Payé via MTN MoMo).',
      channel: 'SMS & Push',
      read: false,
      createdAt: '2026-11-10T15:31:00+01:00'
    },
    {
      id: 'notif-4',
      userId: 'usr-admin-1',
      title: 'Nouveau prestataire à vérifier (AD03)',
      message: 'Royal Auto Wash & Detailing Deïdo a soumis ses justificatifs NIU pour validation.',
      channel: 'Système Admin',
      read: false,
      createdAt: '2026-11-08T11:35:00+01:00'
    }
  ],

  // Table: favorites (CL12)
  favorites: [
    { clientId: 'usr-client-1', providerId: 'prv-1' },
    { clientId: 'usr-client-1', providerId: 'prv-2' }
  ],

  // Table: reports / signalements (AD06)
  reports: [
    {
      id: 'rep-1',
      reporterName: 'Marc Essomba (Client)',
      targetName: 'Royal Auto Wash & Detailing Deïdo',
      reason: 'Coordonnées d\'adresse imprécises sur le boulevard',
      description: 'Le numéro de rue exact mériterait d\'être précisé avant validation finale du profil.',
      status: 'open', // open | resolved
      createdAt: '2026-11-09T14:10:00+01:00'
    }
  ],

  // Table: subscriptions (Section 9 & AD08)
  subscriptions: [
    { id: 'sub-1', providerId: 'prv-1', planId: 'pro', amount: 5000, status: 'active', renewsAt: '2026-12-01' },
    { id: 'sub-2', providerId: 'prv-2', planId: 'business', amount: 15000, status: 'active', renewsAt: '2026-12-02' },
    { id: 'sub-3', providerId: 'prv-3', planId: 'pro', amount: 5000, status: 'active', renewsAt: '2026-12-04' },
    { id: 'sub-4', providerId: 'prv-4', planId: 'pro', amount: 5000, status: 'active', renewsAt: '2026-12-07' },
    { id: 'sub-5', providerId: 'prv-5', planId: 'basic', amount: 0, status: 'active', renewsAt: '-' },
    { id: 'sub-6', providerId: 'prv-6', planId: 'basic', amount: 0, status: 'active', renewsAt: '-' }
  ],

  // Traçabilité & Journalisation des actions sensibles (Section 11 : Exigences non fonctionnelles)
  audit_logs: [
    {
      id: 'log-1',
      actor: 'Système Paiement Mobile Money',
      action: 'WEBHOOK_VERIFIED',
      details: 'Confirmation serveur-à-serveur MTN MoMo réf TX-MOMO-261110-7712 (10 000 FCFA)',
      timestamp: '2026-11-10T15:31:02+01:00'
    },
    {
      id: 'log-2',
      actor: 'Direction BookMe Cameroun (Admin)',
      action: 'PROVIDER_VERIFIED',
      details: 'Validation du dossier RCCM/NIU de King\'s Lounge Barber & Spa (prv-1)',
      timestamp: '2026-10-02T09:00:00+01:00'
    }
  ]
};

