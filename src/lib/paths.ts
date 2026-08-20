import { SITE } from '../config';

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path = ''): string {
  if (!path || path === '/') return `${base}/`;
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function absolute(path = ''): string {
  return new URL(withBase(path), SITE.origin).toString();
}
