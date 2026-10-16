import ipaddr from 'ipaddr.js';
export function isPublicIp(value: string) {
  try {
    const ip = ipaddr.process(value);
    return ip.range() === 'unicast';
  } catch {
    return false;
  }
}
export function validateUrl(value: string) {
  const url = new URL(value);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    (url.port && !['80', '443'].includes(url.port))
  )
    throw new Error('Use um link público HTTP ou HTTPS.');
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local')
  )
    throw new Error('Endereço privado não permitido.');
  if (ipaddr.isValid(host) && !isPublicIp(host))
    throw new Error('Endereço privado não permitido.');
  return url;
}
