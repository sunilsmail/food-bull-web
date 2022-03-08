import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from '../../components/account/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/app-shared.module';
import { ViewStoresComponent } from '../../components/account/stores/view-stores/view-stores.component';
import { AddStoreGroupComponent } from '../../components/account/stores/add-store-group/add-store-group.component';
import { AddSingleStoreComponent } from '../../components/account/stores/add-single-store/add-single-store.component';
import { ImageUploadComponent } from '../../components/generic/image-upload/image-upload.component';
import { ViewStoreComponent } from '../../components/account/stores/view-store/view-store.component';
import { AddStoreTimingsComponent } from '../../components/account/stores/add-store-timings/add-store-timings.component';
import { ViewStoreGroupComponent } from '../../components/account/stores/view-store-group/view-store-group.component';
import { AddSpecialDayComponent } from '../../components/account/stores/add-special-day/add-special-day.component';
import { AddContactPersonComponent } from '../../components/account/stores/add-contact-person/add-contact-person.component';
import { SharedGenericComponentsModule } from 'src/app/shared/app-shared-components.module';
import { ViewContactPersonComponent } from '../../components/account/stores/view-contact-person/view-contact-person.component';
import { ViewSpecialDayComponent } from '../../components/account/stores/view-special-day/view-special-day.component';
import { ViewUsersComponent } from '../../components/account/users/view-users/view-users.component';
import { AddUserComponent } from '../../components/account/users/add-user/add-user.component';
import { GroupAdminGridComponent } from '../../components/account/users/group-admin-grid/group-admin-grid.component';
import { StoreAdminGridComponent } from '../../components/account/users/store-admin-grid/store-admin-grid.component';
import { AllUsersGridComponent } from '../../components/account/users/all-users-grid/all-users-grid.component';
import { ViewMenusComponent } from '../../components/account/menu/view-menus/view-menus.component';
import { AddMenuComponent } from '../../components/account/menu/add-menu/add-menu.component';
import { ViewMenuComponent } from '../../components/account/menu/view-menu/view-menu.component';
import { ViewUserComponent } from '../../components/account/users/view-user/view-user.component';
import { ViewCategoriesComponent } from '../../components/account/category/view-categories/view-categories.component';
import { AddCategoryComponent } from '../../components/account/category/add-category/add-category.component';
import { AddItemComponent } from '../../components/account/item/add-item/add-item.component';
import { ViewItemComponent } from '../../components/account/item/view-item/view-item.component';
import { WeekTimingsControlComponent } from '../../components/generic/week-timings-control/week-timings-control.component';
import { AddAddonsComponent } from '../../components/account/category/add-addons/add-addons.component';
import { SettingsLayoutComponent } from '../../components/settings/settings-layout/settings-layout.component';
import { MasterServicesViewComponent } from '../../components/settings/master-services/master-services-view/master-services-view.component';
import { AddMasterServiceComponent } from '../../components/settings/master-services/add-master-service/add-master-service.component';
import { AllergensTagsViewComponent } from '../../components/settings/master-allergens-tags/allergens-tags-view/allergens-tags-view.component';
import { AddAllergensTagsComponent } from '../../components/settings/master-allergens-tags/add-allergens-tags/add-allergens-tags.component';
import { CopyMenuTreeModalComponent } from '../../components/account/menu/copy-menu-tree-modal/copy-menu-tree-modal.component';
import { ViewAddonsComponent } from '../../components/account/category/view-addons/view-addons.component';
import { StoreTimingsComponent } from '../../components/account/stores/store-timings/store-timings.component';
import { StoreSpecialDayComponent } from '../../components/account/stores/store-special-day/store-special-day.component';
import { StoreGridComponent } from '../../components/account/stores/store-grid/store-grid.component';
import { StoreGroupGridComponent } from '../../components/account/stores/store-group-grid/store-group-grid.component';

@NgModule({
  declarations: [
    AccountComponent,
    DashboardComponent,
    ViewStoresComponent,
    AddStoreGroupComponent,
    AddSingleStoreComponent,
    ImageUploadComponent,
    ViewStoreComponent,
    AddStoreTimingsComponent,
    ViewStoreGroupComponent,
    AddSpecialDayComponent,
    AddContactPersonComponent,
    ViewContactPersonComponent,
    ViewSpecialDayComponent,
    ViewUsersComponent,
    AddUserComponent,
    GroupAdminGridComponent,
    StoreAdminGridComponent,
    AllUsersGridComponent,
    ViewMenusComponent,
    AddMenuComponent,
    ViewMenuComponent,
    ViewUserComponent,
    ViewCategoriesComponent,
    AddCategoryComponent,
    AddItemComponent,
    ViewItemComponent,
    WeekTimingsControlComponent,
    AddAddonsComponent,
    SettingsLayoutComponent,
    MasterServicesViewComponent,
    AddMasterServiceComponent,
    AllergensTagsViewComponent,
    AddAllergensTagsComponent,
    CopyMenuTreeModalComponent,
    ViewAddonsComponent,
    StoreTimingsComponent,
    StoreSpecialDayComponent,
    StoreGridComponent,
    StoreGroupGridComponent
  ],
  imports: [
    SharedModule,
    AccountRoutingModule,
    SharedGenericComponentsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class AccountModule { }
