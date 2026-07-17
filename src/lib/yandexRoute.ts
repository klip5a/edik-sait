export function createYandexRouteUrl(destination: string) {
  const routePoints = `~${destination.trim()}`
  return `https://yandex.ru/maps/?mode=routes&rtext=${encodeURIComponent(routePoints)}&rtt=auto`
}
