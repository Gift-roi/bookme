// BookMe Cameroun - Vues des 3 Espaces (Client, Professionnel, Administrateur)

window.BookMeViews = {
  statusBadge(status) {
    const map = {
      confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      noshow: 'bg-slate-200 text-slate-700 border-slate-300'
    };
    const labels = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      completed: 'Terminée',
      cancelled: 'Annulée',
      rejected: 'Refusée',
      noshow: 'Absence (No-show)'
    };
    return `<span class="px-2.5 py-1 text-xs font-semibold rounded-full border ${map[status] || map.pending}">${labels[status] || status}</span>`;
  },

  paymentBadge(method, status) {
    if (method === 'orange_money') {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold badge-om">Orange Money • ${status === 'refunded' ? 'Remboursé' : 'Payé'}</span>`;
    }
    if (method === 'mtn_momo') {
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold badge-momo">MTN MoMo • ${status === 'refunded' ? 'Remboursé' : 'Payé'}</span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">Sur place • ${status === 'paid' ? 'Encaissé' : 'À régler au RDV'}</span>`;
  },

  renderProviderCard(p, store) {
    const cat = store.db.categories.find(c => c.id === p.categoryId);
    const minPrice = store.getMinServicePrice(p.id);
    const isFav = store.isFavorite(p.id);
    const services = store.getProviderServices(p.id, true).slice(0, 2);

    return `
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden card-hover flex flex-col">
        <div class="relative h-48 overflow-hidden bg-slate-900">
          <img src="${p.coverImage}" alt="${p.businessName}" class="w-full h-full object-cover opacity-95" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
          <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-600/95 text-white backdrop-blur-sm flex items-center gap-1">
              <i data-lucide="badge-check" class="w-3.5 h-3.5"></i> Vérifié BookMe
            </span>
            ${p.subscriptionPlan === 'business' ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">Top Partenaire</span>` : ''}
          </div>
          <button onclick="app.toggleFavorite('${p.id}', event)" title="Favoris (CL12)"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow transition">
            <i data-lucide="heart" class="w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-700'}"></i>
          </button>
          <div class="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
            <div>
              <span class="text-xs font-medium text-amber-300 uppercase tracking-wider">${cat ? cat.name : 'Service'}</span>
              <h3 class="text-lg font-bold leading-snug">${p.businessName}</h3>
            </div>
            <div class="bg-white/95 text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400"></i>
              ${p.rating} <span class="text-slate-500 font-normal">(${p.reviewCount})</span>
            </div>
          </div>
        </div>

        <div class="p-4 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div class="flex items-center gap-1.5 text-xs text-slate-600">
              <i data-lucide="map-pin" class="w-4 h-4 text-teal-600 shrink-0"></i>
              <span class="font-semibold text-slate-800">${p.neighborhood}, ${p.city}</span>
              <span class="text-slate-400">•</span>
              <span class="truncate">${p.address}</span>
            </div>

            <div class="border-t border-slate-100 pt-2.5 space-y-1.5">
              ${services.map(s => `
                <div class="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg">
                  <span class="text-slate-700 font-medium truncate pr-2">${s.name}</span>
                  <span class="font-bold text-teal-700 shrink-0">${store.formatFCFA(s.price, s.isQuote)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span class="text-[11px] text-slate-400 block">À partir de</span>
              <span class="text-sm font-extrabold text-slate-900">${store.formatFCFA(minPrice)}</span>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="app.openProviderModal('${p.id}')"
                class="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition">
                Profil & Avis
              </button>
              <button onclick="app.openBookingModal('${p.id}')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition flex items-center gap-1.5 shadow-sm">
                <i data-lucide="calendar-check" class="w-3.5 h-3.5"></i> Réserver
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
};

