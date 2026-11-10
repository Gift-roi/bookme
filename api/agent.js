import { ToolLoopAgent, tool } from 'ai';
import { z } from 'zod';

// Catalogue de référence pour l'exécution serveur Vercel Functions
const DOUALA_PROVIDERS = [
  {
    id: 'prv-1',
    businessName: "King's Lounge Barber & Spa",
    category: 'Coiffure et barber',
    neighborhood: 'Akwa',
    minPrice: 3000,
    rating: 4.9,
    acceptOnlinePayment: true,
    services: ['Coupe Homme VIP & Barbe (5 000 FCFA)', 'Coupe Simple & Contours (3 000 FCFA)', 'Soin Visage Vapeur & Masque Noir (7 500 FCFA)']
  },
  {
    id: 'prv-2',
    businessName: 'Ébène & Glow Institut',
    category: 'Beauté et esthétique',
    neighborhood: 'Bonapriso',
    minPrice: 6000,
    rating: 4.8,
    acceptOnlinePayment: true,
    services: ['Tresses Africaines / Box Braids (12 000 FCFA)', 'Manucure Gel & Pédicure Spa (8 500 FCFA)', 'Maquillage Cérémonie & Mariage (15 000 FCFA)']
  },
  {
    id: 'prv-3',
    businessName: 'AutoTech Diagnostic & Froid',
    category: 'Réparation et diagnostic auto',
    neighborhood: 'Makepe',
    minPrice: 10000,
    rating: 4.7,
    acceptOnlinePayment: true,
    services: ['Diagnostic Électronique Complet OBD2 (10 000 FCFA)', 'Recharge Climatisation Auto Gaz R134a (18 000 FCFA)']
  },
  {
    id: 'prv-4',
    businessName: 'Studio Lumière 237',
    category: 'Photographie',
    neighborhood: 'Bonamoussadi',
    minPrice: 20000,
    rating: 4.9,
    acceptOnlinePayment: true,
    services: ['Shooting Portrait Corporate / CV (20 000 FCFA)', 'Pack Shooting Anniversaire / Famille (35 000 FCFA)']
  },
  {
    id: 'prv-5',
    businessName: 'CleanHome Services Douala',
    category: 'Services à domicile',
    neighborhood: 'Logpom',
    minPrice: 12000,
    rating: 4.6,
    acceptOnlinePayment: false,
    services: ['Ménage Complet Appartement / Studio (12 000 FCFA)', 'Désinsectisation & Dératisation (Sur devis)']
  },
  {
    id: 'prv-6',
    businessName: 'FitPower Coaching 237',
    category: 'Coaching et formations',
    neighborhood: 'Bonanjo',
    minPrice: 8000,
    rating: 4.8,
    acceptOnlinePayment: true,
    services: ['Séance Coaching Fitness Individuel (8 000 FCFA)', 'Bilan Nutritionnel & Programme 4 Semaines (25 000 FCFA)']
  }
];

// Définition de l'Agent IA BookMe avec ToolLoopAgent (Vercel AI SDK v6 + AI Gateway)
const bookMeAgent = new ToolLoopAgent({
  model: 'google/gemini-2.5-flash',
  instructions: `Tu es l'Assistant IA officiel de BookMe Cameroun à Douala (fuseau Africa/Douala GMT+1).
Tu aides les clients et professionnels à :
- Trouver le meilleur prestataire vérifié à Douala (Akwa, Bonapriso, Makepe, Bonamoussadi, Logpom, Bonanjo, Deïdo)
- Consulter les tarifs en FCFA et les prestations disponibles
- Comprendre le paiement en ligne (Orange Money, MTN MoMo) ou le paiement sur place
Réponds toujours en français de manière chaleureuse, concise et structurée.`,
  tools: {
    searchProviders: tool({
      description: 'Rechercher des prestataires vérifiés à Douala par quartier, catégorie ou budget maximum en FCFA',
      inputSchema: z.object({
        neighborhood: z.string().optional().describe('Quartier de Douala (ex: Akwa, Bonapriso, Makepe, Bonamoussadi, Logpom, Bonanjo)'),
        category: z.string().optional().describe('Catégorie ou mot-clé (ex: coiffure, barber, beauté, auto, photo, ménage, coaching)'),
        maxBudgetFcfa: z.number().optional().describe('Budget maximum souhaité en FCFA')
      }),
      execute: async ({ neighborhood, category, maxBudgetFcfa }) => {
        return DOUALA_PROVIDERS.filter(p => {
          const matchNeighborhood = !neighborhood || p.neighborhood.toLowerCase().includes(neighborhood.toLowerCase());
          const matchCat = !category ||
            p.category.toLowerCase().includes(category.toLowerCase()) ||
            p.businessName.toLowerCase().includes(category.toLowerCase()) ||
            p.services.some(s => s.toLowerCase().includes(category.toLowerCase()));
          const matchBudget = !maxBudgetFcfa || p.minPrice <= maxBudgetFcfa;
          return matchNeighborhood && matchCat && matchBudget;
        });
      }
    })
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt requis' });
    }

    const result = await bookMeAgent.generate({ prompt });
    return res.status(200).json({
      text: result.text,
      steps: result.steps?.length || 1
    });
  } catch (error) {
    return res.status(503).json({
      fallback: true,
      error: 'AI Gateway non configuré ou mode local actif, bascule sur le moteur local BookMe.'
    });
  }
}

