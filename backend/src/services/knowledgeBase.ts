import { prisma } from './database.js';
import { logger } from '../utils/logger.js';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: string[];
  difficulty: string;
  evidenceLevel?: string;
  relatedTopics: string[];
  references: string[];
  createdAt: Date;
  updatedAt: Date;
}

const hardcodedKnowledge: KnowledgeArticle[] = [
  {
    id: 'kb-progressive-overload',
    title: 'Progressive Overload: The Foundation of Growth',
    category: 'exercise-science',
    summary: 'Gradually increasing training stress to drive adaptation and growth.',
    content: 'Progressive overload is the gradual increase of stress placed on the body during exercise training. ' +
      'This principle is essential for continued adaptation and improvement. Methods include: increasing weight, ' +
      'increasing reps, increasing sets, decreasing rest periods, improving technique, or increasing training frequency. ' +
      'Without progressive overload, the body has no stimulus to adapt and progress will stall.',
    tags: ['progressive overload', 'training principles', 'adaptation', 'growth'],
    difficulty: 'beginner',
    evidenceLevel: 'strong',
    relatedTopics: ['periodization', 'volume management', 'recovery'],
    references: ['Kraemer & Ratamess (2004)', 'American College of Sports Medicine position stand'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-protein-intake',
    title: 'Protein Requirements for Active Individuals',
    category: 'nutrition',
    summary: 'Optimal protein intake for muscle maintenance, repair, and growth.',
    content: 'For individuals engaged in regular resistance training, protein intake of 1.6-2.2g per kg of body weight ' +
      'per day is recommended for optimal muscle protein synthesis. This should be distributed evenly across 3-4 meals. ' +
      'Higher intakes (up to 2.4g/kg) may be beneficial during calorie restriction or for experienced athletes. ' +
      'Good sources include lean meats, poultry, fish, eggs, dairy, legumes, and quality supplements like whey protein.',
    tags: ['protein', 'nutrition', 'muscle growth', 'recovery'],
    difficulty: 'beginner',
    evidenceLevel: 'strong',
    relatedTopics: ['meal timing', 'supplements', 'calorie management'],
    references: ['Morton et al. (2018)', 'Schoenfeld & Aragon (2018)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-sleep-recovery',
    title: 'Sleep and Athletic Recovery',
    category: 'recovery',
    summary: 'How sleep quality and quantity directly impact training adaptation and performance.',
    content: 'Sleep is a critical component of the recovery process. During deep sleep, growth hormone is released, ' +
      'muscle tissue is repaired, and neural pathways are consolidated. Aim for 7-9 hours of quality sleep per night. ' +
      'Poor sleep increases cortisol, impairs glycogen replenishment, reduces cognitive function, and increases injury risk. ' +
      'Sleep hygiene tips: consistent schedule, cool dark room, limit blue light before bed, avoid caffeine after 2pm.',
    tags: ['sleep', 'recovery', 'hormones', 'performance'],
    difficulty: 'beginner',
    evidenceLevel: 'strong',
    relatedTopics: ['stress management', 'nutrition timing', 'active recovery'],
    references: ['Halson (2014)', 'Fullagar et al. (2015)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-hypertrophy-mechanisms',
    title: 'Mechanisms of Muscle Hypertrophy',
    category: 'exercise-science',
    summary: 'The three primary mechanisms driving muscle growth.',
    content: 'Muscle hypertrophy is primarily driven by three mechanisms: (1) Mechanical tension - the force generated ' +
      'during muscle contraction, considered the primary driver. (2) Metabolic stress - the accumulation of metabolites ' +
      'during repeated efforts, creating a "pump" and hormonal response. (3) Muscle damage - microscopic damage to ' +
      'muscle fibers from eccentric contractions, stimulating repair and growth. Training programs should leverage ' +
      'all three mechanisms for optimal results.',
    tags: ['hypertrophy', 'muscle growth', 'exercise science', 'training'],
    difficulty: 'intermediate',
    evidenceLevel: 'strong',
    relatedTopics: ['progressive overload', 'training volume', 'exercise selection'],
    references: ['Schoenfeld (2010)', 'Hornberger & Esser (2024)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-calorie-management',
    title: 'Calorie Management for Body Composition Goals',
    category: 'nutrition',
    summary: 'Understanding energy balance for weight loss, maintenance, or gain.',
    content: 'Body composition changes are driven by energy balance. For fat loss: a moderate deficit of 300-500 calories ' +
      'per day leads to sustainable weight loss of 0.5-1kg per week. For muscle gain: a surplus of 200-400 calories per day ' +
      'supports muscle growth while minimizing fat gain. Protein intake should remain high (1.6-2.2g/kg) regardless of goal. ' +
      'Extreme deficits or surpluses should be avoided as they can lead to muscle loss or excessive fat gain.',
    tags: ['calories', 'fat loss', 'muscle gain', 'body composition'],
    difficulty: 'beginner',
    evidenceLevel: 'strong',
    relatedTopics: ['protein requirements', 'meal timing', 'dietary adherence'],
    references: ['Helms et al. (2014)', 'Slater et al. (2019)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-training-frequency',
    title: 'Training Frequency: How Often Should You Train?',
    category: 'exercise-science',
    summary: 'Evidence-based recommendations for training frequency by goal and experience.',
    content: 'Research suggests that training each muscle group 2x per week is generally superior to 1x per week for ' +
      'hypertrophy. For strength, frequencies of 3-6x per week for the main lifts can be effective. Beginners may benefit ' +
      'from full-body routines 3x per week. Advanced trainees often use higher frequency split routines. ' +
      'Frequency should be adjusted based on recovery capacity, schedule, and individual response.',
    tags: ['frequency', 'training split', 'program design', 'volume'],
    difficulty: 'intermediate',
    evidenceLevel: 'moderate',
    relatedTopics: ['volume management', 'recovery', 'program design'],
    references: ['Schoenfeld et al. (2016)', 'Dankel et al. (2017)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-hydration',
    title: 'Hydration for Performance and Recovery',
    category: 'nutrition',
    summary: 'Optimal hydration strategies for training and daily life.',
    content: 'Proper hydration is essential for performance, recovery, and overall health. Aim for 35-40ml of water per kg ' +
      'of body weight daily. During exercise, drink 500-1000ml per hour depending on sweat rate. After exercise, ' +
      'replace 125-150% of fluid lost. Dehydration of just 2% body weight can impair performance. Monitor urine color ' +
      'as a simple hydration indicator (pale yellow = hydrated).',
    tags: ['hydration', 'water', 'performance', 'recovery'],
    difficulty: 'beginner',
    evidenceLevel: 'strong',
    relatedTopics: ['electrolytes', 'nutrient timing', 'recovery'],
    references: ['Thomas et al. (2016)', 'ACSM position stand on exercise and fluid replacement'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'kb-deloading',
    title: 'Deloading: When and How to Reduce Training Load',
    category: 'recovery',
    summary: 'Strategic reduction in training volume or intensity to manage fatigue.',
    content: 'A deload is a planned period of reduced training volume or intensity to manage accumulated fatigue, ' +
      'prevent overtraining, and allow for supercompensation. Typical deload protocols: reduce volume by 40-60% for one week, ' +
      'while maintaining intensity. Deload every 4-8 weeks depending on program intensity. Signs you need a deload: ' +
      'stalled progress, persistent fatigue, poor sleep, decreased motivation, increased soreness.',
    tags: ['deload', 'recovery', 'fatigue management', 'programming'],
    difficulty: 'intermediate',
    evidenceLevel: 'moderate',
    relatedTopics: ['periodization', 'recovery', 'fatigue management'],
    references: ['Zatsiorsky & Kraemer (2006)', 'Kubo et al. (2019)'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export async function searchKnowledge(
  query: string,
  category?: string,
  limit = 5
): Promise<KnowledgeArticle[]> {
  if (prisma) {
    try {
      const dbResults = await prisma.knowledgeArticle.findMany({
        where: {
          AND: [
            category ? { category } : {},
            {
              OR: [
                { title: { contains: query } },
                { summary: { contains: query } },
                { content: { contains: query } },
              ],
            },
          ],
        },
        take: limit,
        orderBy: { createdAt: 'desc' },
      });

      if (dbResults.length > 0) {
        return dbResults.map(mapPrismaArticle);
      }
    } catch {
      logger.warn('KnowledgeBase: DB searchArticles failed, using hardcoded fallback');
    }
  }

  let filtered = hardcodedKnowledge;
  if (category) {
    filtered = filtered.filter((a) => a.category === category);
  }

  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

  const scored = filtered.map((article) => {
    let score = 0;
    const searchText = `${article.title} ${article.summary} ${article.content} ${article.tags.join(' ')}`.toLowerCase();

    for (const word of queryWords) {
      if (searchText.includes(word)) {
        score += 1;
      }
    }

    if (searchText.includes(lowerQuery)) {
      score += 3;
    }

    const titleLower = article.title.toLowerCase();
    if (titleLower.includes(lowerQuery)) {
      score += 5;
    }

    return { article, score };
  });

  const sorted = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);

  return sorted.length > 0 ? sorted : filtered.slice(0, limit);
}

export async function getArticleById(id: string): Promise<KnowledgeArticle | null> {
  if (prisma) {
    try {
      const article = await prisma.knowledgeArticle.findUnique({ where: { id } });
      if (article) return mapPrismaArticle(article);
    } catch {
      logger.warn('KnowledgeBase: DB getArticleById failed, using hardcoded fallback');
    }
  }

  return hardcodedKnowledge.find((a) => a.id === id) || null;
}

export async function getArticlesByCategory(category: string): Promise<KnowledgeArticle[]> {
  if (prisma) {
    try {
      const results = await prisma.knowledgeArticle.findMany({
        where: { category },
        orderBy: { createdAt: 'desc' },
      });
      if (results.length > 0) return results.map(mapPrismaArticle);
    } catch {
      logger.warn('KnowledgeBase: DB getArticlesByCategory failed, using hardcoded fallback');
    }
  }

  return hardcodedKnowledge.filter((a) => a.category === category);
}

function mapPrismaArticle(article: {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  tags: unknown;
  difficulty: string;
  evidenceLevel: string | null;
  relatedTopics: unknown;
  references: unknown;
  createdAt: Date;
  updatedAt: Date;
}): KnowledgeArticle {
  return {
    id: article.id,
    title: article.title,
    category: article.category,
    summary: article.summary,
    content: article.content,
    tags: Array.isArray(article.tags) ? article.tags.map(String) : [],
    difficulty: article.difficulty,
    evidenceLevel: article.evidenceLevel || undefined,
    relatedTopics: Array.isArray(article.relatedTopics) ? article.relatedTopics.map(String) : [],
    references: Array.isArray(article.references) ? article.references.map(String) : [],
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}
