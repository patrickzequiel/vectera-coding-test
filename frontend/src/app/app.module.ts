import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MeetingsListComponent } from './meetings/meetings-list.component';
import { MeetingDetailComponent } from './meetings/meeting-detail.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';
import { CardComponent } from './shared/components/card/card.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FormInputComponent } from './shared/components/forms/form-input.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ErrorComponent } from './shared/components/error/error.component';

const routes: Routes = [
  { path: '', redirectTo: 'meetings', pathMatch: 'full' },
  { path: 'meetings', component: MeetingsListComponent },
  { path: 'meetings/:id', component: MeetingDetailComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MeetingsListComponent,
    HeaderComponent,
    CardComponent,
    ButtonComponent,
    FormInputComponent,
    MeetingDetailComponent,
    LoadingComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    TagModule,
    ToastModule,
    MessageModule,
    ButtonModule,
    CardModule,
    DataViewModule,
    AvatarModule,
    DividerModule,
    RouterModule.forRoot(routes),
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
