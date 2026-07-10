// ============================================
// DATE / TIME
// ============================================

export function formatDate(date: string | Date, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatTime(date: string | Date, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

export function formatDateTime(date: string | Date, locale = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDate(d, locale)} ${formatTime(d, locale)}`;
}

export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export function daysBetween(a: string | Date, b: string | Date): number {
  const d1 = typeof a === 'string' ? new Date(a) : a;
  const d2 = typeof b === 'string' ? new Date(b) : b;
  return Math.floor(Math.abs(d2.getTime() - d1.getTime()) / 86400000);
}

export function isToday(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

export function isThisWeek(date: string | Date): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return d >= weekStart && d < weekEnd;
}

export function startOfWeek(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfWeek(date: Date = new Date()): Date {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 7);
  return d;
}

export function startOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function toISOString(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

export function secondsToTimer(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function minutesToTimer(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function getRelativeDateLabel(date: string | Date): string {
  if (isToday(date)) return 'Today';
  const d = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return formatDate(d);
}

// ============================================
// MATH
// ============================================

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function range(start: number, end: number, step = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) result.push(i);
  return result;
}

export function round(value: number, decimals = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function min(values: number[]): number {
  return Math.min(...values);
}

export function max(values: number[]): number {
  return Math.max(...values);
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return round((value / total) * 100, 1);
}

export function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

// ============================================
// STRING
// ============================================

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : plural || `${singular}s`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string): string {
  return str.replace(/_/g, ' ').replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function snakeToTitle(str: string): string {
  return titleCase(str.replace(/_/g, ' '));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function kebabCase(str: string): string {
  return slugify(str);
}

export function camelCase(str: string): string {
  return str.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
}

export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function randomString(length = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

// ============================================
// FORMATTING
// ============================================

export function formatCalories(calories: number): string {
  return `${Math.round(calories)} kcal`;
}

export function formatWeight(weight: number, unit: 'kg' | 'lbs' = 'kg'): string {
  return `${round(weight, 1)} ${unit}`;
}

export function formatHeight(height: number, unit: 'cm' | 'ft' = 'cm'): string {
  if (unit === 'ft') {
    const feet = Math.floor(height / 30.48);
    const inches = Math.round((height % 30.48) / 2.54);
    return `${feet}'${inches}"`;
  }
  return `${round(height, 1)} cm`;
}

export function formatDistance(distance: number, unit: 'km' | 'mi' = 'km'): string {
  if (distance < 1) return `${Math.round(distance * 1000)} m`;
  return `${round(distance, 2)} ${unit}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatSetsReps(sets: number, reps: number | string): string {
  const repStr = typeof reps === 'number' ? reps.toString() : reps;
  return `${sets}×${repStr}`;
}

export function formatMacro(
  current: number,
  target: number,
  unit = 'g'
): string {
  return `${round(current, 1)} / ${round(target, 1)}${unit}`;
}

export function formatProgress(value: number, total: number): string {
  return `${round(value, 0)} / ${round(total, 0)}`;
}

export function formatPercentage(value: number, total: number): string {
  return `${percentage(value, total)}%`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${round(xp / 1000, 1)}k`;
  return xp.toString();
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// ============================================
// VALIDATION
// ============================================

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s-]{7,15}$/.test(phone);
}

export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value >= 0 && isFinite(value);
}

export function isBetween(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

// ============================================
// DATA
// ============================================

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

export function generateId(length = 16): string {
  return randomString(length);
}

export function parseJSON<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function safeJSON<T>(json: string): T | null {
  return parseJSON<T | null>(json, null);
}

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const groupKey = String(item[key]);
    (acc[groupKey] = acc[groupKey] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(items: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T>(items: T[], key: keyof T): T[] {
  const seen = new Set();
  return items.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

export function omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}

export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as Record<string, unknown>;
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key] && typeof target[key] === 'object') {
      result[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      result[key] = source[key];
    }
  }
  return result as T & U;
}

// ============================================
// STORAGE
// ============================================

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const storage = require('react-native-mmkv').MMKV;
    const mmkv = new storage();
    const value = mmkv.getString(key);
    return value ? parseJSON<T>(value) : null;
  } catch {
    return null;
  }
}

export async function setItem(key: string, value: unknown): Promise<void> {
  try {
    const storage = require('react-native-mmkv').MMKV;
    const mmkv = new storage();
    mmkv.set(key, JSON.stringify(value));
  } catch {}
}

export async function removeItem(key: string): Promise<void> {
  try {
    const storage = require('react-native-mmkv').MMKV;
    const mmkv = new storage();
    mmkv.delete(key);
  } catch {}
}

export async function clearAll(): Promise<void> {
  try {
    const storage = require('react-native-mmkv').MMKV;
    const mmkv = new storage();
    mmkv.clearAll();
  } catch {}
}

// ============================================
// COLORS
// ============================================

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

// ============================================
// FITNESS
// ============================================

export function calculateBMI(weight: number, height: number): number {
  const heightM = height / 100;
  return round(weight / (heightM * heightM), 1);
}

export function getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  if (gender === 'male') {
    return round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age, 0);
  }
  return round(447.593 + 9.247 * weight + 3.098 * height - 4.33 * age, 0);
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  } as const;
  return round(bmr * (multipliers[activityLevel] || 1.2), 0);
}

// ============================================
// CHART / ANALYSIS
// ============================================

export function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  const recent = values.slice(-3);
  const avg = average(recent);
  const first = recent[0];
  if (avg > first * 1.05) return 'up';
  if (avg < first * 0.95) return 'down';
  return 'stable';
}

export function calculateProgress(current: number, target: number): number {
  if (target === 0) return 0;
  return clamp(percentage(current, target), 0, 100);
}

export function calculateCalorieDeficit(consumed: number, burned: number, goal: number): number {
  return consumed - burned - goal;
}
