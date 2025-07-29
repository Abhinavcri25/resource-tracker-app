import { Routes } from '@angular/router';
import { DropdownformComponent } from './components/dropdownform/dropdownform.component';
import { KendoComponentComponent } from './components/kendo-component/kendo-component.component';
import { AppComponent } from './app.component';
import { DetailsComponent } from './components/details/details.component';

export const routes: Routes = [
    { path: 'form', component: DropdownformComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'kendo', component: KendoComponentComponent },
    { path: 'form/:id', component: DropdownformComponent },
    // { path: '', component: DashboardComponent }
];
