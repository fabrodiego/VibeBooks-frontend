import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Pega o token do localStorage
  const token = localStorage.getItem('vibebooks_token');

  // 2. Se o token existir, clona a requisição e adiciona o cabeçalho Authorization
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // 3. Envia a requisição clonada e modificada
    return next(authReq);
  }

  // 4. Se não houver token, envia a requisição original sem modificação
  return next(req);
};
