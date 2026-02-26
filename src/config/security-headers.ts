// Shared security headers configuration
// Used by middleware for dynamic nonce injection and fallback headers

// Base CSP directives
export const CSP_DIRECTIVES: Record<string, string[]> = {
  "default-src": ["'self'"],
  "manifest-src": ["'self'", "https://*.cloudflareaccess.com"],
  "script-src": ["'strict-dynamic'"],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "font-src": ["'self'", "https://fonts.gstatic.com"],
  "img-src": ["'self'", "https:", "data:"],
  "connect-src": ["'self'", "https://cdn.contentful.com", "https://preview.contentful.com", "https://images.ctfassets.net"],
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
};

export function buildCSPHeader(nonce?: string): string {
  const directives = { ...CSP_DIRECTIVES };
  
  if (nonce) {
    // Add nonce to script-src
    directives["script-src"] = ["'strict-dynamic'", `'nonce-${nonce}'`];
  }
  
  return Object.entries(directives)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

// Additional security headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;
