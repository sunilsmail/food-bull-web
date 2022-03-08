import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Food Bull';
  spinnerColor = '#DB0D15';
  spinnerBdColor = 'rgba(255, 255, 255, 0.8)';

  constructor(
    readonly router: Router,
    private viewportScroller: ViewportScroller,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      'add_group_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/add_group_icon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'add_store_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/add_store_icon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/logo-login.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'logo-nav',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/logo-nav.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'contact_person_placeholder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/contact_person_placeholder.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'date_placeholder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/date_placeholder.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'contact_person_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/contact_person_icon.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'upload_logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/upload_logo.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'timer_placeholder',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/timer_placeholder.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'stores',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/stores.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'single_store_ind',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/single_store_ind.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'placeholder_logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg/placeholder_logo.svg')
    );
  }
}
