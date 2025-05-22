export function getImageUrl(name: string): string {
  const images = import.meta.glob('/src/assets/icons/*', { eager: true });
  const path = `/src/assets/icons/${name}`;
  const image = images[path] as { default: string };
  return image?.default || '';
} 