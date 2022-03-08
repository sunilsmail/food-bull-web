import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LocalStorageUserInfo } from 'src/app/interfaces/local-storage-user-info';
import { UtilitiesService } from 'src/app/helpers/utilities';

@Component({
  selector: 'foodbull-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  userInfo = {} as LocalStorageUserInfo;
  isSuperAdmin: boolean = false;

  constructor(
    private utilityService: UtilitiesService,
    private authService: AuthenticationService
    ) {}

  ngOnInit(): void {
    this.userInfo = this.utilityService.getLocalUser();
    this.isSuperAdmin = this.utilityService.getSuperAdminAccess();
  }

  logout(): void {
    this.authService.logOut();
  }
}
