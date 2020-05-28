import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SortableHeaderDirective} from './Directives/sortable-header.directive';
import { TitleCasePipe, LowerCasePipe } from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination'; // <--- external package
import { ReactiveTableComponent } from './reactive-table/reactive-table.component';
import { FormArrayFilterPipe } from './form-array-filter-pipe.pipe';



@NgModule({
  declarations: [
    AppComponent,
    SortableHeaderDirective,
    ReactiveTableComponent,
    FormArrayFilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
  ],
  providers: [TitleCasePipe, LowerCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
