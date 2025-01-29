import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CanActivateFn, Router} from "@angular/router";

export const AccessGuard: CanActivateFn = (route, state) => {
    const _authService = inject(AuthService);
    const _url = inject(Router);
    const _token = _authService.getToken();

    if(!_token){
        sessionStorage.clear();
        _url.navigateByUrl('/login');
        return false;
    } else {
        return true;
    }

}
// Compare this snippet from frontend/sga/src/app/config/accessGuard.ts:
