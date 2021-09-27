import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './component/login/login.component';
import {RegisterComponent} from './component/register/register.component';
import {AuthenticationGuard} from "./guard/authentication.guard";
import {SettingsUserComponent} from "./component/settings-user/settings-user.component";
import {UserInfoComponent} from "./component/user-info/user-info.component";
import {UsersComponent} from "./component/users/users.component";
import {HomeComponent} from "./component/home/home.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthenticationGuard]},
  {path: 'user-settings', component: SettingsUserComponent, canActivate: [AuthenticationGuard]},
  {path: 'user-details', component: UserInfoComponent, canActivate: [AuthenticationGuard]},
  {path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard]},
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
