import { areas } from '@/content/areas';
export async function listarAreas() {
  return areas;
}
export async function obterArea(slug: string) {
  return areas.find((area) => area.slug === slug);
}
