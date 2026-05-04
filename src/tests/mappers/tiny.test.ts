import { describe, it, expect } from 'vitest';
import { TinyProvider } from '@/lib/providers/implementations/TinyProvider';

describe('TinyProvider', () => {
  it('should be correctly instantiated', () => {
    const provider = new TinyProvider();
    expect(provider).toBeInstanceOf(TinyProvider);
  });
});
