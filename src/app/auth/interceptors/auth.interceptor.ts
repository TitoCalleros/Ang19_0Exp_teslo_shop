import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth/services/auth.service";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  // Validación de sí el url del request apunta a la URL requerida de check-status. Si se desea verificar múltiples elementos, es mejor crear una función con los endpoints requeridos.
  // if (!req.url.includes('check-status')) return next(req);

  const token = inject(AuthService).token()!;

  // Clone the request to add the Authorization header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  return next(newReq);
}
