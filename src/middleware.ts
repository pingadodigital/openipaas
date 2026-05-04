import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Se o usuário tentar acessar qualquer coisa dentro de /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // Redireciona imediatamente de volta para a Landing Page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configura o middleware para rodar apenas nas rotas do dashboard
export const config = {
  matcher: '/dashboard/:path*',
};
