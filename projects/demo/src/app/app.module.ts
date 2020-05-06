import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { ScrollPositionDirective } from './theme/directives/scrollPosition.directive';
import { AdvancedExamplesTypesComponent } from './pages/examples/custom-edit-view/advanced-example-types.component';
import { ButtonViewComponent } from './pages/examples/custom-edit-view/basic-example-button-view.component';
import { CustomEditorComponent } from './pages/examples/custom-edit-view/custom-editor.component';
import { CustomFilterComponent } from './pages/examples/custom-edit-view/custom-filter.component';
import { ColumnShowModule } from '../../../ng2-smart-table/src/lib/components/columns-show/column-show.module';

@NgModule({
  declarations: [
    AppComponent,
    ScrollPositionDirective,
    AdvancedExamplesTypesComponent,
    ButtonViewComponent,
    CustomEditorComponent,
    CustomFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    Ng2SmartTableModule,
    ReactiveFormsModule,
    ColumnShowModule
  ],
  entryComponents: [
    ButtonViewComponent,
    CustomEditorComponent,
    CustomFilterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
