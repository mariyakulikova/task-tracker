import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from './servises/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TimerComponent } from './timer/timer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EditComponent } from './edit/edit.component';
import { WeekPreviewComponent } from './week-preview/week-preview.component';
import { AuthComponent } from './auth/auth.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    SidebarComponent,
    EditComponent,
    WeekPreviewComponent,
    AuthComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [AuthService, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
