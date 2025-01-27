import { HttpInterceptorFn } from "@angular/common/http";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const AccessInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();
    
    if(!req.url.includes('login') && token !== ''){
        const tokenRequired = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            },
        });
        return next(tokenRequired);
    } else{
        return next(req);
    }
}
