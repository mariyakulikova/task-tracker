import { Component } from '@angular/core';
import {AuthService} from '../servises/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent{

  constructor(private auth: AuthService) { }

  onLogOut() {
    this.auth.logout();
  }

  showLogOut(): boolean {
    return this.auth.isAuthenticated;
  }
}
