// BookMe Cameroun - Moteur métier & Règles de gestion (RG01 à RG15)

const STORAGE_KEY = 'bookme_cm_db_v1';
const SESSION_KEY = 'bookme_cm_session_v1';

class BookMeStore {
  constructor() {
    this.db = this.loadDatabase();
    this.currentUser = this.loadSession();
  }

  loadDatabase() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erreur lecture LocalStorage, chargement seed data.', e);
    }
    const fresh = JSON.parse(JSON.stringify(window.BOOKME_SEED_DATA));
    this.saveDatabase(fresh);
    return fresh;
  }

  saveDatabase(data = this.db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erreur sauvegarde LocalStorage:', e);
    }
  }

  resetDatabase() {
    const fresh = JSON.parse(JSON.stringify(window.BOOKME_SEED_DATA));
    this.db = fresh;
    this.saveDatabase(fresh);
    this.setCurrentUser('usr-client-1');
    return fresh;
  }

  loadSession() {
    try {
      const savedUserId = localStorage.getItem(SESSION_KEY);
      if (savedUserId) {
        const user = this.db.users.find(u => u.id === savedUserId);
        if (user && user.status === 'active') return user;
      }
    } catch (e) {}
    const defaultUser = this.db.users.find(u => u.id === 'usr-client-1');
    return defaultUser;
  }

  setCurrentUser(userId) {
    if (!userId) {
      this.currentUser = null;
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const user = this.db.users.find(u => u.id === userId);
    if (user) {
      this.currentUser = user;
      localStorage.setItem(SESSION_KEY, user.id);
    }
    return this.currentUser;
  }

  // Journalisation des actions sensibles (Section 11 - Traçabilité)
  logAudit(actor, action, details) {
    this.db.audit_logs.unshift({
      id: 'log-' + Date.now(),
      actor,
      action,
      details,
      timestamp: new Date().toISOString()
    });
    this.saveDatabase();
  }

  // Notification déclenchée lors des événements importants (RG09, CL11, PR12)
  notify(userId, title, message, channel = 'SMS & In-App') {
    this.db.notifications.unshift({
      id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId,
      title,
      message,
      channel,
      read: false,
      createdAt: new Date().toISOString()
    });
    this.saveDatabase();
  }

  // Formatage monétaire FCFA
  formatFCFA(amount, isQuote = false) {
    if (isQuote) return 'Sur devis';
    return new Intl.NumberFormat('fr-FR').format(Number(amount || 0)) + ' FCFA';
  }

  // Authentification (CL01, CL02, PR01)
  login(emailOrPhone, password) {
    const clean = (emailOrPhone || '').trim().toLowerCase();
    const user = this.db.users.find(
      u => (u.email.toLowerCase() === clean || u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')) &&
           u.password === password
    );
    if (!user) {
      throw new Error('Identifiants incorrects. Vérifiez votre e-mail/téléphone ou mot de passe.');
    }
    if (user.status !== 'active') {
      throw new Error('Ce compte a été suspendu par l\'administrateur BookMe.');
    }
    this.setCurrentUser(user.id);
    return user;
  }

  registerUser({ name, email, phone, password, role, city, neighborhood, businessName, categoryId, address, verificationDoc }) {
    if (!name || !email || !phone || !password) {
      throw new Error('Veuillez remplir tous les champs obligatoires.');
    }
    const exists = this.db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error('Cette adresse e-mail est déjà associée à un compte BookMe.');
    }

    const userId = 'usr-' + Date.now();
    let providerId = null;

    if (role === 'provider') {
      providerId = 'prv-' + Date.now();
      const newProvider = {
        id: providerId,
        userId,
        businessName: businessName || `Espace Pro de ${name}`,
        categoryId: categoryId || 'cat-coiffure',
        city: city || 'Douala',
        neighborhood: neighborhood || 'Akwa',
        address: address || `${neighborhood || 'Akwa'}, ${city || 'Douala'}`,
        phone,
        description: 'Professionnel enregistré sur BookMe Cameroun.',
        coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80',
        gallery: [],
        verificationStatus: 'pending', // RG02 : doit être validé par l'administrateur avant publication publique
        verificationDoc: verificationDoc || 'En attente de justificatif NIU / CNI',
        confirmationMode: 'auto',
        acceptOnlinePayment: true,
        acceptOnSitePayment: true,
        cancellationPolicy: 'Annulation sans frais jusqu\'à 4 heures avant le rendez-vous.',
        subscriptionPlan: 'basic',
        rating: 5.0,
        reviewCount: 0,
        featured: false
      };
      this.db.providers.push(newProvider);

      // Horaires par défaut Lundi-Samedi 08:30-18:30
      this.db.availability[providerId] = {
        1: { open: true, start: '08:30', end: '18:30', breakStart: '12:30', breakEnd: '13:30' },
        2: { open: true, start: '08:30', end: '18:30', breakStart: '12:30', breakEnd: '13:30' },
        3: { open: true, start: '08:30', end: '18:30', breakStart: '12:30', breakEnd: '13:30' },
        4: { open: true, start: '08:30', end: '18:30', breakStart: '12:30', breakEnd: '13:30' },
        5: { open: true, start: '08:30', end: '18:30', breakStart: '12:30', breakEnd: '13:30' },
        6: { open: true, start: '09:00', end: '17:00', breakStart: '', breakEnd: '' },
        0: { open: false, start: '09:00', end: '14:00', breakStart: '', breakEnd: '' }
      };

      this.db.subscriptions.push({
        id: 'sub-' + Date.now(),
        providerId,
        planId: 'basic',
        amount: 0,
        status: 'active',
        renewsAt: '-'
      });

      this.notify(
        'usr-admin-1',
        'Nouveau prestataire inscrit (AD03)',
        `${newProvider.businessName} (${name}) demande la validation de son profil à ${newProvider.neighborhood}.`,
        'Système Admin'
      );
      this.logAudit(name, 'PROVIDER_REGISTERED', `Inscription professionnelle de ${newProvider.businessName}`);
    }

    const newUser = {
      id: userId,
      name,
      email,
      phone,
      password,
      role: role || 'client',
      providerId,
      city: city || 'Douala',
      neighborhood: neighborhood || 'Akwa',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      createdAt: new Date().toISOString()
    };

    this.db.users.push(newUser);
    this.notify(userId, 'Bienvenue sur BookMe Cameroun !', `Bonjour ${name}, votre compte a été créé avec succès.`);
    this.saveDatabase();
    this.setCurrentUser(userId);
    return newUser;
  }

  // RG02 : Seuls les professionnels vérifiés (et actifs) apparaissent dans la recherche publique client
  getPublicProviders(filters = {}) {
    return this.db.providers.filter(p => {
      const owner = this.db.users.find(u => u.id === p.userId);
      if (owner && owner.status !== 'active') return false;
      if (p.verificationStatus !== 'verified') return false;

      // Catégorie active uniquement
      const cat = this.db.categories.find(c => c.id === p.categoryId);
      if (cat && !cat.active) return false;

      if (filters.categoryId && filters.categoryId !== 'all' && p.categoryId !== filters.categoryId) {
        return false;
      }

      if (filters.neighborhood && filters.neighborhood !== 'all' && p.neighborhood.toLowerCase() !== filters.neighborhood.toLowerCase()) {
        return false;
      }

      if (filters.minRating && Number(p.rating) < Number(filters.minRating)) {
        return false;
      }

      if (filters.onlyOnlinePayment && !p.acceptOnlinePayment) {
        return false;
      }

      const providerServices = this.getProviderServices(p.id, true);

      if (filters.maxPrice && Number(filters.maxPrice) > 0) {
        const hasAffordable = providerServices.some(s => !s.isQuote && s.price <= Number(filters.maxPrice));
        if (!hasAffordable) return false;
      }

      if (filters.query && filters.query.trim() !== '') {
        const q = filters.query.trim().toLowerCase();
        const matchName = p.businessName.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchArea = p.neighborhood.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
        const matchCat = cat && cat.name.toLowerCase().includes(q);
        const matchService = providerServices.some(
          s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        );
        if (!matchName && !matchDesc && !matchArea && !matchCat && !matchService) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'price_asc') {
        return this.getMinServicePrice(a.id) - this.getMinServicePrice(b.id);
      }
      if (filters.sortBy === 'price_desc') {
        return this.getMinServicePrice(b.id) - this.getMinServicePrice(a.id);
      }
      // Par défaut : Abonnés Business/Pro mis en avant puis note
      const rank = { business: 3, pro: 2, basic: 1 };
      const diff = (rank[b.subscriptionPlan] || 1) - (rank[a.subscriptionPlan] || 1);
      return diff !== 0 ? diff : b.rating - a.rating;
    });
  }

  getProviderServices(providerId, onlyActive = true) {
    return this.db.services.filter(s => s.providerId === providerId && (!onlyActive || s.active));
  }

  getMinServicePrice(providerId) {
    const srvs = this.getProviderServices(providerId, true).filter(s => !s.isQuote);
    if (!srvs.length) return 0;
    return Math.min(...srvs.map(s => s.price));
  }

  // Moteur de calcul des créneaux horaires (RG04, RG06, PR06, PR09)
  // Empêche toute double réservation et respecte les horaires d'ouverture et pauses
  getSlotsForDate(providerId, dateStr) {
    const dateObj = new Date(dateStr + 'T12:00:00');
    if (isNaN(dateObj.getTime())) return { closed: true, slots: [] };

    const dayOfWeek = dateObj.getDay(); // 0..6
    const provAvail = (this.db.availability[providerId] && this.db.availability[providerId][dayOfWeek]) || null;

    if (!provAvail || !provAvail.open) {
      return { closed: true, slots: [] };
    }

    const toMinutes = (hhmm) => {
      if (!hhmm || !hhmm.includes(':')) return null;
      const [h, m] = hhmm.split(':').map(Number);
      return h * 60 + m;
    };

    const toHHMM = (mins) => {
      const h = Math.floor(mins / 60).toString().padStart(2, '0');
      const m = (mins % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMins = toMinutes(provAvail.start) ?? 480;
    const endMins = toMinutes(provAvail.end) ?? 1080;
    const breakStartMins = toMinutes(provAvail.breakStart);
    const breakEndMins = toMinutes(provAvail.breakEnd);

    // Créneaux déjà occupés par une réservation active (pending ou confirmed ou completed) - RG04
    const activeBookings = this.db.bookings.filter(
      b => b.providerId === providerId &&
           b.date === dateStr &&
           ['pending', 'confirmed', 'completed'].includes(b.status)
    );

    // Créneaux bloqués manuellement par le professionnel - PR09 & RG04
    const blocked = this.db.blocked_slots.filter(
      blk => blk.providerId === providerId && blk.date === dateStr
    );

    const slots = [];
    for (let t = startMins; t + 30 <= endMins; t += 30) {
      // Vérifier pause déjeuner
      if (breakStartMins !== null && breakEndMins !== null && t >= breakStartMins && t < breakEndMins) {
        continue;
      }

      const timeStr = toHHMM(t);

      // Vérifier si bloqué ou déjà réservé (chevauchement de durée inclus)
      const isBlocked = blocked.some(blk => blk.time === timeStr);
      const isBooked = activeBookings.some(b => {
        const bStart = toMinutes(b.time);
        const bEnd = bStart + (Number(b.durationSnapshot) || 30);
        return t >= bStart && t < bEnd;
      });

      slots.push({
        time: timeStr,
        available: !isBlocked && !isBooked,
        reason: isBooked ? 'Réservé' : (isBlocked ? 'Indisponible' : 'Disponible')
      });
    }

    return { closed: false, schedule: provAvail, slots };
  }

  // Création d'une réservation avec contrôle anti-conflit serveur/store (RG01, RG04, RG05, RG06, RG10, RG14, RG15)
  createBooking({ providerId, serviceId, date, time, paymentMethod, paymentPhone, notes }) {
    // RG01 : Utilisateur authentifié obligatoire
    if (!this.currentUser) {
      throw new Error('RG01 : Vous devez être connecté pour effectuer une réservation.');
    }

    const provider = this.db.providers.find(p => p.id === providerId);
    if (!provider || provider.verificationStatus !== 'verified') {
      throw new Error('RG02 : Ce prestataire n\'est pas encore validé pour recevoir des réservations.');
    }

    const service = this.db.services.find(s => s.id === serviceId && s.providerId === providerId && s.active);
    if (!service) {
      throw new Error('RG05 : Veuillez sélectionner une prestation valide.');
    }

    // RG04 & RG06 : Vérification stricte de la disponibilité du créneau au moment T
    const daySlots = this.getSlotsForDate(providerId, date);
    if (daySlots.closed) {
      throw new Error('RG06 : Le professionnel est fermé à la date sélectionnée.');
    }
    const targetSlot = daySlots.slots.find(s => s.time === time);
    if (!targetSlot || !targetSlot.available) {
      throw new Error('RG04 : Ce créneau vient d\'être réservé ou bloqué. Veuillez choisir un autre horaire.');
    }

    // RG15 : Référence unique de transaction
    const bookingId = 'BKM-2026-' + Math.floor(1000 + Math.random() * 9000);
    const isOnline = paymentMethod === 'orange_money' || paymentMethod === 'mtn_momo';
    const paymentRef = isOnline
      ? `TX-${paymentMethod === 'orange_money' ? 'OM' : 'MOMO'}-${Date.now().toString().slice(-6)}`
      : `PAY-SUR-PLACE-${bookingId.slice(-4)}`;

    // RG10 : Calcul de la commission (uniquement sur les réservations payées via BookMe)
    const commissionRate = Number(this.db.platform_settings.commissionRate || 5);
    const priceSnapshot = Number(service.price || 0);
    const commissionAmount = (isOnline && !service.isQuote)
      ? Math.round((priceSnapshot * commissionRate) / 100)
      : 0;

    // Statut selon le mode de confirmation du professionnel (Section 6.2 & PR08)
    const initialStatus = provider.confirmationMode === 'auto' ? 'confirmed' : 'pending';

    const newBooking = {
      id: bookingId,
      clientId: this.currentUser.id,
      providerId: provider.id,
      serviceId: service.id,
      serviceNameSnapshot: service.name, // RG14 : figé
      priceSnapshot,                     // RG14 : prix figé
      isQuoteSnapshot: Boolean(service.isQuote),
      durationSnapshot: Number(service.duration || 45), // RG14 : durée figée
      date,
      time,
      status: initialStatus,
      paymentMethod,
      paymentStatus: isOnline ? 'paid' : 'pending_onsite',
      paymentRef,
      commissionAmount,
      hasReview: false,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    this.db.bookings.unshift(newBooking);

    if (isOnline) {
      this.db.payments.unshift({
        id: 'pay-' + Date.now(),
        bookingId,
        amount: priceSnapshot,
        currency: 'FCFA',
        method: paymentMethod === 'orange_money' ? 'Orange Money Cameroun' : 'MTN Mobile Money (MoMo)',
        externalRef: paymentRef,
        phoneUsed: paymentPhone || this.currentUser.phone,
        status: 'succeeded',
        verifiedServerToServer: true,
        createdAt: new Date().toISOString()
      });

      this.logAudit(
        this.currentUser.name,
        'PAYMENT_VERIFIED',
        `Paiement ${paymentRef} (${priceSnapshot} FCFA) vérifié serveur-à-serveur pour ${bookingId}`
      );
    }

    // RG09 : Notifications au client et au professionnel
    this.notify(
      this.currentUser.id,
      initialStatus === 'confirmed' ? 'Réservation confirmée !' : 'Demande de réservation envoyée',
      `${service.name} chez ${provider.businessName} le ${date} à ${time} (${bookingId}).`,
      'SMS & E-mail'
    );

    this.notify(
      provider.userId,
      'Nouvelle réservation reçue !',
      `${this.currentUser.name} a réservé "${service.name}" pour le ${date} à ${time}.`,
      'SMS & Push Pro'
    );

    this.logAudit(
      this.currentUser.name,
      'BOOKING_CREATED',
      `Réservation ${bookingId} auprès de ${provider.businessName} le ${date} à ${time}`
    );

    this.saveDatabase();
    return newBooking;
  }

  // Changement de statut d'une réservation (CL09, PR08, AD05, RG07)
  updateBookingStatus(bookingId, newStatus, actorLabel = 'Utilisateur') {
    const booking = this.db.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Réservation introuvable.');

    // RG07 : Une réservation terminée ne peut pas être annulée
    if (booking.status === 'completed' && newStatus === 'cancelled') {
      throw new Error('RG07 : Une prestation déjà terminée ne peut plus être annulée.');
    }

    booking.status = newStatus;

    // Si marquée terminée et paiement sur place, marquer le paiement comme encaissé (Section 8.1)
    if (newStatus === 'completed' && booking.paymentMethod === 'onsite') {
      booking.paymentStatus = 'paid';
    }

    // Si annulée ou refusée et payée en ligne -> remboursement traçable (Section 8.3)
    if ((newStatus === 'cancelled' || newStatus === 'rejected') && booking.paymentStatus === 'paid' && booking.paymentMethod !== 'onsite') {
      booking.paymentStatus = 'refunded';
      booking.commissionAmount = 0;
      const payRecord = this.db.payments.find(p => p.bookingId === booking.id);
      if (payRecord) payRecord.status = 'refunded';
      this.logAudit(actorLabel, 'PAYMENT_REFUNDED', `Remboursement Mobile Money initié pour ${booking.id} (${booking.paymentRef})`);
    }

    const provider = this.db.providers.find(p => p.id === booking.providerId);
    const statusLabels = {
      confirmed: 'Confirmée',
      completed: 'Terminée',
      cancelled: 'Annulée',
      rejected: 'Refusée',
      noshow: 'Absence signalée (No-show)'
    };

    this.notify(
      booking.clientId,
      `Mise à jour réservation ${booking.id}`,
      `Votre rendez-vous "${booking.serviceNameSnapshot}" chez ${provider ? provider.businessName : ''} est désormais : ${statusLabels[newStatus] || newStatus}.`,
      'SMS & In-App'
    );

    if (provider) {
      this.notify(
        provider.userId,
        `Statut modifié : ${booking.id}`,
        `La réservation du ${booking.date} à ${booking.time} est passée au statut "${statusLabels[newStatus] || newStatus}".`,
        'In-App'
      );
    }

    this.logAudit(actorLabel, 'BOOKING_STATUS_CHANGED', `Réservation ${booking.id} -> ${newStatus}`);
    this.saveDatabase();
    return booking;
  }

  // Publication d'un avis client (CL10, RG08)
  addReview({ bookingId, rating, comment }) {
    if (!this.currentUser) throw new Error('Veuillez vous connecter.');
    const booking = this.db.bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Réservation introuvable.');

    // RG08 : Seul un client ayant une réservation terminée peut publier un avis lié à cette prestation
    if (booking.status !== 'completed') {
      throw new Error('RG08 : Seul un client ayant une réservation terminée peut publier un avis.');
    }
    if (booking.hasReview) {
      throw new Error('Vous avez déjà publié un avis pour cette prestation.');
    }

    const review = {
      id: 'rev-' + Date.now(),
      bookingId: booking.id,
      clientId: this.currentUser.id,
      clientName: this.currentUser.name,
      providerId: booking.providerId,
      serviceName: booking.serviceNameSnapshot,
      rating: Number(rating),
      comment: comment.trim(),
      status: 'published',
      createdAt: new Date().toISOString()
    };

    booking.hasReview = true;
    this.db.reviews.unshift(review);

    // Recalculer la note moyenne du professionnel
    this.recalculateProviderRating(booking.providerId);

    const provider = this.db.providers.find(p => p.id === booking.providerId);
    if (provider) {
      this.notify(
        provider.userId,
        `Nouvel avis ${rating}/5 étoiles !`,
        `${this.currentUser.name} a laissé un commentaire sur "${booking.serviceNameSnapshot}".`
      );
    }

    this.saveDatabase();
    return review;
  }

  recalculateProviderRating(providerId) {
    const provider = this.db.providers.find(p => p.id === providerId);
    if (!provider) return;
    const pubReviews = this.db.reviews.filter(r => r.providerId === providerId && r.status === 'published');
    provider.reviewCount = pubReviews.length;
    if (pubReviews.length === 0) {
      provider.rating = 5.0;
    } else {
      const sum = pubReviews.reduce((acc, r) => acc + Number(r.rating), 0);
      provider.rating = Number((sum / pubReviews.length).toFixed(1));
    }
  }

  // Favoris (CL12)
  toggleFavorite(providerId) {
    if (!this.currentUser) throw new Error('Connectez-vous pour enregistrer des favoris.');
    const idx = this.db.favorites.findIndex(
      f => f.clientId === this.currentUser.id && f.providerId === providerId
    );
    let added = false;
    if (idx >= 0) {
      this.db.favorites.splice(idx, 1);
    } else {
      this.db.favorites.push({ clientId: this.currentUser.id, providerId });
      added = true;
    }
    this.saveDatabase();
    return added;
  }

  isFavorite(providerId) {
    if (!this.currentUser) return false;
    return this.db.favorites.some(f => f.clientId === this.currentUser.id && f.providerId === providerId);
  }

  // Gestion des prestations par le professionnel (PR04, PR05, RG03, RG14)
  saveService(providerId, serviceData) {
    if (!serviceData.name || !serviceData.duration) {
      throw new Error('RG03 : Chaque prestation doit posséder au minimum un nom, une durée et un prix (ou sur devis).');
    }
    const provider = this.db.providers.find(p => p.id === providerId);
    if (serviceData.id) {
      // Modification (RG14 : ne modifie pas les snapshots des réservations existantes)
      const existing = this.db.services.find(s => s.id === serviceData.id && s.providerId === providerId);
      if (!existing) throw new Error('Prestation introuvable.');
      existing.name = serviceData.name;
      existing.description = serviceData.description || '';
      existing.price = serviceData.isQuote ? 0 : Number(serviceData.price || 0);
      existing.isQuote = Boolean(serviceData.isQuote);
      existing.duration = Number(serviceData.duration || 30);
      existing.active = serviceData.active !== undefined ? Boolean(serviceData.active) : existing.active;
      this.saveDatabase();
      return existing;
    } else {
      const newService = {
        id: 'srv-' + Date.now(),
        providerId,
        categoryId: provider ? provider.categoryId : 'cat-coiffure',
        name: serviceData.name,
        description: serviceData.description || '',
        price: serviceData.isQuote ? 0 : Number(serviceData.price || 0),
        isQuote: Boolean(serviceData.isQuote),
        duration: Number(serviceData.duration || 45),
        active: true
      };
      this.db.services.push(newService);
      this.saveDatabase();
      return newService;
    }
  }

  deleteService(providerId, serviceId) {
    const idx = this.db.services.findIndex(s => s.id === serviceId && s.providerId === providerId);
    if (idx >= 0) {
      this.db.services.splice(idx, 1);
      this.saveDatabase();
    }
  }

  // Blocage de créneau (PR09)
  addBlockedSlot(providerId, date, time, reason) {
    this.db.blocked_slots.push({
      id: 'blk-' + Date.now(),
      providerId,
      date,
      time,
      reason: reason || 'Indisponibilité ponctuelle'
    });
    this.saveDatabase();
  }

  removeBlockedSlot(blockId) {
    this.db.blocked_slots = this.db.blocked_slots.filter(b => b.id !== blockId);
    this.saveDatabase();
  }

  // Actions Administrateur (AD02, AD03, AD04, AD06, AD07, AD08, AD09)
  verifyProvider(providerId, status, note = '') {
    const provider = this.db.providers.find(p => p.id === providerId);
    if (!provider) return;
    provider.verificationStatus = status; // verified | rejected | pending
    this.notify(
      provider.userId,
      status === 'verified' ? 'Compte Professionnel Validé !' : 'Statut de vérification mis à jour',
      status === 'verified'
        ? `Félicitations ! Votre établissement "${provider.businessName}" est désormais visible publiquement sur BookMe.`
        : `Votre dossier nécessite un complément : ${note || 'Veuillez vérifier vos pièces justificatives.'}`,
      'E-mail & SMS'
    );
    this.logAudit('Administrateur', 'PROVIDER_VERIFICATION', `${provider.businessName} -> ${status}`);
    this.saveDatabase();
  }

  toggleUserStatus(userId) {
    const user = this.db.users.find(u => u.id === userId);
    if (!user || user.role === 'admin') return;
    user.status = user.status === 'active' ? 'suspended' : 'active';
    this.logAudit('Administrateur', 'USER_STATUS_TOGGLE', `Compte ${user.name} (${user.email}) -> ${user.status}`);
    this.saveDatabase();
  }

  saveCategory(catData) {
    if (catData.id) {
      const cat = this.db.categories.find(c => c.id === catData.id);
      if (cat) {
        cat.name = catData.name;
        cat.description = catData.description;
        cat.active = Boolean(catData.active);
      }
    } else {
      this.db.categories.push({
        id: 'cat-' + Date.now(),
        name: catData.name,
        slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: catData.icon || 'briefcase',
        description: catData.description || '',
        color: 'teal',
        active: true
      });
    }
    this.logAudit('Administrateur', 'CATEGORY_UPDATED', `Catégorie "${catData.name}" enregistrée`);
    this.saveDatabase();
  }
}

window.bookMeStore = new BookMeStore();

