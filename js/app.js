// BookMe Cameroun - Contrôleur Principal (Espaces Client, Professionnel, Administrateur)

class BookMeApp {
  constructor() {
    this.store = window.bookMeStore;
    this.activeSpace = 'client'; // 'client' | 'provider' | 'admin'
    this.clientTab = 'explore';  // 'explore' | 'bookings' | 'favorites'
    this.proTab = 'dashboard';   // 'dashboard' | 'calendar' | 'services' | 'hours' | 'subscription'
    this.adminTab = 'overview';  // 'overview' | 'providers' | 'users' | 'categories' | 'bookings' | 'moderation'
    this.filters = {
      query: '',
      categoryId: 'all',
      neighborhood: 'all',
      maxPrice: 0,
      minRating: 0,
      onlyOnlinePayment: false,
      sortBy: 'featured'
    };
    this.bookingDraft = null;
    this.calendarDate = '2026-11-11';
  }

  init() {
    this.syncSpaceWithUser();
    this.renderAll();
  }

  syncSpaceWithUser() {
    const u = this.store.currentUser;
    if (!u) {
      this.activeSpace = 'client';
    } else if (u.role === 'admin') {
      this.activeSpace = 'admin';
    } else if (u.role === 'provider') {
      this.activeSpace = 'provider';
    } else {
      this.activeSpace = 'client';
    }
  }

  toast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const colors = {
      success: 'bg-teal-800 text-white border-teal-600',
      error: 'bg-rose-700 text-white border-rose-500',
      info: 'bg-slate-900 text-white border-slate-700'
    };
    const el = document.createElement('div');
    el.className = `px-4 py-3 rounded-xl shadow-xl border text-sm font-medium flex items-center gap-2.5 animate-fade-in ${colors[type] || colors.info}`;
    el.innerHTML = `<i data-lucide="${type === 'error' ? 'alert-triangle' : 'check-circle-2'}" class="w-4 h-4 shrink-0"></i><span>${message}</span>`;
    container.appendChild(el);
    if (window.lucide) lucide.createIcons();
    setTimeout(() => el.remove(), 4000);
  }

  switchDemoRole(userId) {
    const user = this.store.setCurrentUser(userId);
    this.syncSpaceWithUser();
    this.renderAll();
    this.toast(`Connecté en tant que ${user.name} (${user.role.toUpperCase()})`, 'info');
  }

  switchSpace(space) {
    if (space === 'provider' && (!this.store.currentUser || this.store.currentUser.role !== 'provider')) {
      this.store.setCurrentUser('usr-pro-1');
      this.toast('Bascule sur le compte démo Pro : Samuel Ewane (King\'s Lounge Barber)', 'info');
    } else if (space === 'admin' && (!this.store.currentUser || this.store.currentUser.role !== 'admin')) {
      this.store.setCurrentUser('usr-admin-1');
      this.toast('Bascule sur le compte Administrateur BookMe Cameroun', 'info');
    } else if (space === 'client' && (!this.store.currentUser || this.store.currentUser.role !== 'client')) {
      this.store.setCurrentUser('usr-client-1');
      this.toast('Bascule sur le compte Client : Christian Ndongo', 'info');
    }
    this.activeSpace = space;
    this.renderAll();
  }

  renderAll() {
    this.renderNavbar();
    const main = document.getElementById('app-main');
    if (!main) return;

    if (this.activeSpace === 'client') {
      main.innerHTML = this.renderClientSpace();
    } else if (this.activeSpace === 'provider') {
      main.innerHTML = this.renderProviderSpace();
    } else {
      main.innerHTML = this.renderAdminSpace();
    }

    if (window.lucide) lucide.createIcons();
  }

  renderNavbar() {
    const u = this.store.currentUser;
    const unread = u ? this.store.db.notifications.filter(n => n.userId === u.id && !n.read).length : 0;
    const nav = document.getElementById('app-navbar');
    if (!nav) return;

    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 cursor-pointer group" onclick="app.switchSpace('client'); app.clientTab='explore'; app.renderAll();">
          <img src="./assets/logo.svg" alt="Logo BookMe Cameroun" class="w-10 h-10 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-200" />
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-display font-extrabold text-lg tracking-tight text-slate-900">Book<span class="text-teal-700">Me</span></span>
              <span class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">Cameroun 🇨🇲</span>
            </div>
            <p class="text-[11px] text-slate-500 hidden sm:block">Réservation de services en ligne • Douala</p>
          </div>
        </div>

        <!-- Sélecteur des 3 Espaces du Cahier des Charges -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button onclick="app.switchSpace('client')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.activeSpace === 'client' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="user" class="w-3.5 h-3.5"></i> Espace Client
          </button>
          <button onclick="app.switchSpace('provider')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.activeSpace === 'provider' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="briefcase" class="w-3.5 h-3.5"></i> Espace Pro
          </button>
          <button onclick="app.switchSpace('admin')"
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${this.activeSpace === 'admin' ? 'bg-white text-teal-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Admin
          </button>
        </div>

        <div class="flex items-center gap-2.5">
          <button onclick="app.openNotificationsModal()" class="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition" title="Notifications (CL11 / PR12)">
            <i data-lucide="bell" class="w-4 h-4"></i>
            ${unread > 0 ? `<span class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">${unread}</span>` : ''}
          </button>

          ${u ? `
            <div class="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
              <img src="${u.avatar}" class="w-8 h-8 rounded-full object-cover border border-teal-500" alt="${u.name}" />
              <div class="text-left">
                <p class="text-xs font-bold text-slate-800 leading-none">${u.name}</p>
                <p class="text-[10px] text-teal-700 font-semibold uppercase">${u.role} • ${u.neighborhood}</p>
              </div>
            </div>
          ` : ''}

          <button onclick="app.openAuthModal()" class="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition flex items-center gap-1.5">
            <i data-lucide="key-round" class="w-3.5 h-3.5"></i>
            <span class="hidden sm:inline">${u ? 'Changer de compte' : 'Connexion'}</span>
          </button>
        </div>
      </div>
    `;
  }

  // ============================================================================
  // 4.1 ESPACE CLIENT (CL01 à CL12)
  // ============================================================================
  renderClientSpace() {
    const u = this.store.currentUser;
    const myBookings = u ? this.store.db.bookings.filter(b => b.clientId === u.id) : [];
    const myFavs = u ? this.store.db.favorites.filter(f => f.clientId === u.id) : [];

    return `
      <!-- Sous-navigation Client -->
      <div class="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto">
          <div class="flex space-x-6 py-3">
            <button onclick="app.clientTab='explore'; app.renderAll();"
              class="text-xs sm:text-sm font-bold pb-1 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${this.clientTab === 'explore' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i data-lucide="compass" class="w-4 h-4"></i> Explorer & Réserver
            </button>
            <button onclick="app.clientTab='bookings'; app.renderAll();"
              class="text-xs sm:text-sm font-bold pb-1 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${this.clientTab === 'bookings' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i data-lucide="calendar-clock" class="w-4 h-4"></i> Mes Rendez-vous
              <span class="px-1.5 py-0.2 rounded-full text-[11px] bg-teal-100 text-teal-800">${myBookings.length}</span>
            </button>
            <button onclick="app.clientTab='favorites'; app.renderAll();"
              class="text-xs sm:text-sm font-bold pb-1 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${this.clientTab === 'favorites' ? 'border-teal-700 text-teal-800' : 'border-transparent text-slate-500 hover:text-slate-800'}">
              <i data-lucide="heart" class="w-4 h-4"></i> Mes Favoris (${myFavs.length})
            </button>
          </div>
          <div class="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <i data-lucide="clock" class="w-3.5 h-3.5 text-teal-600"></i>
            <span>Fuseau : <strong>Africa/Douala (GMT+1)</strong></span>
          </div>
        </div>
      </div>

      ${this.clientTab === 'explore' ? this.renderClientExplore() : ''}
      ${this.clientTab === 'bookings' ? this.renderClientBookings(myBookings) : ''}
      ${this.clientTab === 'favorites' ? this.renderClientFavorites(myFavs) : ''}
    `;
  }

  renderClientExplore() {
    const categories = this.store.db.categories.filter(c => c.active);
    const providers = this.store.getPublicProviders(this.filters);
    const neighborhoods = ['Akwa', 'Bonapriso', 'Bonanjo', 'Makepe', 'Bonamoussadi', 'Logpom', 'Deïdo'];

    return `
      <!-- Hero Section Douala -->
      <section class="hero-gradient text-white py-10 sm:py-14 px-4">
        <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              Pilote Officiel Douala • Réservation instantanée 24h/24
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Réservez les meilleurs professionnels à <span class="text-amber-400">Douala</span> sans attendre.
            </h1>
            <p class="text-slate-300 text-sm sm:text-base max-w-2xl">
              Coiffure & Barber, Beauté, Diagnostic Auto, Photographie, Ménage ou Coaching. Comparez les tarifs en FCFA, choisissez un créneau réel et payez sur place ou via <strong>Orange Money & MTN MoMo</strong>.
            </p>

            <!-- Barre de recherche principale (CL03 & CL04) -->
            <div class="bg-white p-2 rounded-2xl shadow-2xl grid sm:grid-cols-12 gap-2 text-slate-900 mt-4">
              <div class="sm:col-span-5 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <i data-lucide="search" class="w-4 h-4 text-teal-600 shrink-0"></i>
                <input type="text" id="search-query-input" value="${this.filters.query}"
                  oninput="app.filters.query = this.value; app.updateProviderGrid();"
                  placeholder="Salon, coupe, tresses, vidange, photo..."
                  class="w-full text-xs sm:text-sm focus:outline-none bg-transparent" />
              </div>
              <div class="sm:col-span-4 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200">
                <i data-lucide="map-pin" class="w-4 h-4 text-amber-500 shrink-0"></i>
                <select onchange="app.filters.neighborhood = this.value; app.renderAll();"
                  class="w-full text-xs sm:text-sm focus:outline-none bg-transparent font-medium">
                  <option value="all">Tous les quartiers (Douala)</option>
                  ${neighborhoods.map(n => `<option value="${n}" ${this.filters.neighborhood === n ? 'selected' : ''}>Douala - ${n}</option>`).join('')}
                </select>
              </div>
              <div class="sm:col-span-3">
                <button onclick="app.renderAll()" class="w-full h-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5">
                  <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> Rechercher
                </button>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 hidden lg:grid grid-cols-2 gap-3">
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
                <i data-lucide="calendar-check-2" class="w-5 h-5"></i>
              </div>
              <p class="font-bold text-sm">Zéro double réservation</p>
              <p class="text-xs text-slate-300">Créneaux synchronisés en temps réel et bloqués dès validation (RG04).</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2">
              <div class="w-9 h-9 rounded-xl bg-teal-400/20 text-teal-300 flex items-center justify-center">
                <i data-lucide="smartphone" class="w-5 h-5"></i>
              </div>
              <p class="font-bold text-sm">Mobile Money & Sur place</p>
              <p class="text-xs text-slate-300">Orange Money, MTN MoMo avec référence vérifiée ou règlement au salon.</p>
            </div>
            <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-2 col-span-2 flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-wider text-amber-300 font-bold">Vous êtes un professionnel à Douala ?</p>
                <p class="text-sm font-bold">Digitalisez votre agenda dès 0 FCFA/mois (Formule Basic)</p>
              </div>
              <button onclick="app.openAuthModal('register-pro')" class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shrink-0 transition">
                Devenir Partenaire
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Catégories de services (Section 5) -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          <button onclick="app.filters.categoryId='all'; app.renderAll();"
            class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border ${this.filters.categoryId === 'all' ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
            Toutes les catégories
          </button>
          ${categories.map(c => `
            <button onclick="app.filters.categoryId='${c.id}'; app.renderAll();"
              class="px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${this.filters.categoryId === c.id ? 'bg-teal-700 text-white border-teal-700 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}">
              <i data-lucide="${c.icon || 'sparkles'}" class="w-3.5 h-3.5"></i>
              ${c.name}
            </button>
          `).join('')}
        </div>

        <!-- Filtres secondaires (CL04) -->
        <div class="mt-3 bg-white p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-slate-500 font-medium">Budget max :</span>
              <select onchange="app.filters.maxPrice = Number(this.value); app.renderAll();" class="border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800">
                <option value="0" ${this.filters.maxPrice === 0 ? 'selected' : ''}>Tous les prix</option>
                <option value="5000" ${this.filters.maxPrice === 5000 ? 'selected' : ''}>≤ 5 000 FCFA</option>
                <option value="10000" ${this.filters.maxPrice === 10000 ? 'selected' : ''}>≤ 10 000 FCFA</option>
                <option value="15000" ${this.filters.maxPrice === 15000 ? 'selected' : ''}>≤ 15 000 FCFA</option>
              </select>
            </div>

            <div class="flex items-center gap-1.5 text-xs">
              <span class="text-slate-500 font-medium">Note min :</span>
              <select onchange="app.filters.minRating = Number(this.value); app.renderAll();" class="border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800">
                <option value="0" ${this.filters.minRating === 0 ? 'selected' : ''}>Toutes notes</option>
                <option value="4.5" ${this.filters.minRating === 4.5 ? 'selected' : ''}>★ 4.5 et +</option>
                <option value="4.8" ${this.filters.minRating === 4.8 ? 'selected' : ''}>★ 4.8 et +</option>
              </select>
            </div>

            <label class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" ${this.filters.onlyOnlinePayment ? 'checked' : ''}
                onchange="app.filters.onlyOnlinePayment = this.checked; app.renderAll();"
                class="rounded text-teal-600 focus:ring-teal-500" />
              Accepte Orange Money / MTN MoMo
            </label>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-500">Trier par :</span>
            <select onchange="app.filters.sortBy = this.value; app.renderAll();" class="border border-slate-200 rounded-lg px-2.5 py-1 font-bold text-slate-800">
              <option value="featured" ${this.filters.sortBy === 'featured' ? 'selected' : ''}>Recommandés BookMe</option>
              <option value="rating" ${this.filters.sortBy === 'rating' ? 'selected' : ''}>Meilleure note</option>
              <option value="price_asc" ${this.filters.sortBy === 'price_asc' ? 'selected' : ''}>Prix croissant</option>
              <option value="price_desc" ${this.filters.sortBy === 'price_desc' ? 'selected' : ''}>Prix décroissant</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Grille des Prestataires Vérifiés -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-extrabold text-slate-900">
            ${providers.length} professionnel${providers.length > 1 ? 's' : ''} vérifié${providers.length > 1 ? 's' : ''} disponible${providers.length > 1 ? 's' : ''}
          </h2>
          ${(this.filters.query || this.filters.categoryId !== 'all' || this.filters.neighborhood !== 'all' || this.filters.maxPrice > 0) ? `
            <button onclick="app.resetFilters()" class="text-xs font-bold text-teal-700 hover:underline">Réinitialiser les filtres</button>
          ` : ''}
        </div>

        <div id="providers-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${providers.length ? providers.map(p => window.BookMeViews.renderProviderCard(p, this.store)).join('') : `
            <div class="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200">
              <p class="text-base font-bold text-slate-800">Aucun prestataire ne correspond à ces critères.</p>
              <p class="text-xs text-slate-500 mt-1">Essayez d'élargir votre quartier ou votre budget.</p>
              <button onclick="app.resetFilters()" class="mt-4 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold">Tout afficher</button>
            </div>
          `}
        </div>
      </section>
    `;
  }

  updateProviderGrid() {
    const grid = document.getElementById('providers-grid');
    if (!grid) return;
    const providers = this.store.getPublicProviders(this.filters);
    grid.innerHTML = providers.map(p => window.BookMeViews.renderProviderCard(p, this.store)).join('');
    if (window.lucide) lucide.createIcons();
  }

  resetFilters() {
    this.filters = { query: '', categoryId: 'all', neighborhood: 'all', maxPrice: 0, minRating: 0, onlyOnlinePayment: false, sortBy: 'featured' };
    this.renderAll();
  }

  // CL08, CL09, CL10 : Historique des réservations, Annulation & Avis
  renderClientBookings(bookings) {
    return `
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-2xl font-extrabold text-slate-900">Mes Rendez-vous & Réservations (CL08)</h2>
            <p class="text-xs text-slate-500">Consultez vos réservations, téléchargez vos reçus Mobile Money, annulez ou laissez un avis après prestation (RG08).</p>
          </div>
          <button onclick="app.clientTab='explore'; app.renderAll();" class="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold self-start">
            + Nouvelle réservation
          </button>
        </div>

        <div class="space-y-4">
          ${bookings.length === 0 ? `
            <div class="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p class="font-bold text-slate-700">Vous n'avez aucune réservation pour le moment.</p>
            </div>
          ` : bookings.map(b => {
            const p = this.store.db.providers.find(pr => pr.id === b.providerId);
            return `
              <div class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div class="space-y-1.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="font-mono text-xs font-bold text-slate-500">${b.id}</span>
                    ${window.BookMeViews.statusBadge(b.status)}
                    ${window.BookMeViews.paymentBadge(b.paymentMethod, b.paymentStatus)}
                  </div>
                  <h3 class="text-base font-extrabold text-slate-900">${b.serviceNameSnapshot}</h3>
                  <p class="text-xs text-slate-600 font-medium">
                    Chez <strong class="text-teal-800">${p ? p.businessName : 'Prestataire'}</strong> (${p ? p.neighborhood + ', ' + p.city : ''})
                  </p>
                  <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span class="flex items-center gap-1 font-semibold text-slate-800"><i data-lucide="calendar" class="w-3.5 h-3.5 text-teal-600"></i> ${b.date} à ${b.time}</span>
                    <span>Durée : ${b.durationSnapshot} min</span>
                    <span class="font-extrabold text-teal-800">Tarif garanti (RG14) : ${this.store.formatFCFA(b.priceSnapshot, b.isQuoteSnapshot)}</span>
                    <span>Réf : <code class="bg-slate-100 px-1.5 py-0.5 rounded">${b.paymentRef}</code></span>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-2 shrink-0">
                  <button onclick="app.openReceiptModal('${b.id}')" class="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Reçu
                  </button>

                  ${(b.status === 'pending' || b.status === 'confirmed') ? `
                    <button onclick="app.cancelBooking('${b.id}')" class="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition">
                      Annuler (CL09)
                    </button>
                  ` : ''}

                  ${(b.status === 'completed' && !b.hasReview) ? `
                    <button onclick="app.openReviewModal('${b.id}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-sm">
                      <i data-lucide="star" class="w-3.5 h-3.5"></i> Noter la prestation (CL10)
                    </button>
                  ` : ''}

                  ${b.hasReview ? `<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg">✓ Avis publié</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  renderClientFavorites(favs) {
    const favProviders = favs.map(f => this.store.db.providers.find(p => p.id === f.providerId)).filter(Boolean);
    return `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h2 class="text-2xl font-extrabold text-slate-900">Mes Prestataires Favoris (CL12)</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${favProviders.length ? favProviders.map(p => window.BookMeViews.renderProviderCard(p, this.store)).join('') : `
            <div class="col-span-full bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p class="text-sm font-bold text-slate-700">Aucun favori enregistré.</p>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

window.BookMeApp = BookMeApp;

