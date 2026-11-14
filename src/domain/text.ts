import type { ReactNode } from 'react';

/**
 * Türkçe kurallarla büyük harf (i → İ, ı → I). `textTransform: 'uppercase'`
 * bu kuralı uygulamadığı için etiketler bununla büyütülür. JSX çocuk
 * dizilerindeki metinleri de büyütür; diğer düğümlere dokunmaz.
 */
export function upperTr<T extends ReactNode>(node: T): T {
  if (typeof node === 'string') return node.toLocaleUpperCase('tr') as T;
  if (Array.isArray(node)) return node.map((n) => upperTr(n)) as unknown as T;
  return node;
}
