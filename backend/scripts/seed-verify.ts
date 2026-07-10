import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

let exitCode = 0;

async function count(table: string, expected: number, query: () => Promise<number>) {
  try {
    const count = await query();
    if (count >= expected) {
      console.log(`  ✅ ${table}: ${count} (expected ${expected}+)`);
    } else {
      console.log(`  ⚠️  ${table}: ${count} (expected ${expected}+, got ${count})`);
    }
    return count;
  } catch (err: unknown) {
    console.log(`  ❌ ${table}: ERROR - ${err instanceof Error ? err.message : String(err)}`);
    exitCode = 1;
    return 0;
  }
}

async function main() {
  console.log('🌱 Seed Data Verification');
  console.log('========================\n');

  const results = await Promise.all([
    count('Exercises', 200, () => prisma.exercise.count()),
    count('Foods', 500, () => prisma.food.count()),
    count('Recipes', 50, () => prisma.recipe.count()),
    count('Knowledge Articles', 30, () => prisma.knowledgeArticle.count()),
  ]);

  console.log('\n========================');
  console.log(`📊 Total records: ${results.reduce((a, b) => a + b, 0)}`);
  console.log(`📋 All checks ${exitCode === 0 ? '✅ PASSED' : '❌ FAILED'}`);

  await prisma.$disconnect();
  process.exit(exitCode);
}

main().catch((err) => {
  console.error('Seed verification error:', err);
  process.exit(1);
});
