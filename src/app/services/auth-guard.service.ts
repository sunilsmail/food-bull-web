import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { StorageClientService } from './storage-client.service';
import { UtilitiesService } from 'src/app/helpers/utilities';
import { WebConfiguration } from '../helpers/web-configuration';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private storage: StorageClientService,
    private utilitiesService: UtilitiesService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      const userInfo = JSON.parse(this.storage.get(`${WebConfiguration.SID}USERINFO`));
      const empInfo = userInfo as any;
      if (!this.utilitiesService.checkNull(empInfo)) {
        // logged in so return true
        this.authService.authState.next(true);
        return true;
      } else {
        this.authService.authState.next(false);
        this.router.navigate(['/login']);
        // return false;
      }
      this.router.navigate(['/login']);
    }
}

