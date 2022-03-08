import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewCategoriesComponent } from 'src/app/components/account/category/view-categories/view-categories.component';
import { DashboardComponent } from 'src/app/components/account/dashboard/dashboard.component';
import { ViewMenusComponent } from 'src/app/components/account/menu/view-menus/view-menus.component';
import { ViewStoreGroupComponent } from 'src/app/components/account/stores/view-store-group/view-store-group.component';
import { ViewStoreComponent } from 'src/app/components/account/stores/view-store/view-store.component';
import { ViewStoresComponent } from 'src/app/components/account/stores/view-stores/view-stores.component';
import { ViewUsersComponent } from 'src/app/components/account/users/view-users/view-users.component';
import { SettingsLayoutComponent } from 'src/app/components/settings/settings-layout/settings-layout.component';
import { AccountComponent } from './account.component';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'stores',
        children: [
          { path: '', redirectTo: 'view-stores', pathMatch: 'full' },
          { path: 'view-stores', component: ViewStoresComponent },
          { path: 'store/:id', component: ViewStoreComponent },
          { path: 'store-group/:id', component: ViewStoreGroupComponent },
          { path: '**', redirectTo: 'view-stores', pathMatch: 'full' },
        ]
      },
      {
        path: 'users',
        children: [
          { path: '', redirectTo: 'view-users', pathMatch: 'full' },
          { path: 'view-users', component: ViewUsersComponent },
          { path: '**', redirectTo: 'view-users', pathMatch: 'full' },
        ]
      },
      {
        path: 'menu',
        children: [
          { path: '', redirectTo: 'view-menus', pathMatch: 'full' },
          { path: 'view-menus', component: ViewMenusComponent },
          { path: 'category/:storeId/:menuId', component: ViewCategoriesComponent },
          { path: '**', redirectTo: 'view-menus', pathMatch: 'full' },
        ]
      },
      { path: 'modules', component: SettingsLayoutComponent },
      { path: '**', redirectTo: 'modules', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
