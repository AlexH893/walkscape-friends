import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import this module

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RegionsService } from '../regions.service'; // Import the service
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [AppComponent, BaseLayoutComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    HttpClientModule,
    ClipboardModule,
    MatSnackBarModule
  ],
  providers: [RegionsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
