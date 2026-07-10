import bcrypt from 'bcrypt';

const counters = new Map<string, number>();

export function uniqueId(prefix: string): string {
  const count = (counters.get(prefix) || 0) + 1;
  counters.set(prefix, count);
  return `fact-${prefix}-${count}`;
}

export function resetUniqueIds(): void {
  counters.clear();
}

export function genEmail(localPart: string): string {
  return `${localPart}@example.com`;
}

export function genName(id: string): string {
  return id
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function hashPassword(password = 'TestPass123!'): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function daysAgo(days: number, base = new Date()): Date {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d;
}

export function daysFromNow(days: number, base = new Date()): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}
