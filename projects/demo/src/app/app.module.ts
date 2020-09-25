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
import { CustomNumberFilterComponent } from './pages/examples/custom-edit-view/custom-number-filter.component';
import { ColumnShowModule } from '../../../ng2-smart-table/src/components/columns-show/column-show.module';
import { THeadModule } from '../../../ng2-smart-table/src/components/thead/thead.module';
import { CellModule } from '../../../ng2-smart-table/src/components/tbody/cells/cell/cell.module';
import { TestCustomActionComponent } from './srd/test-custom-action/test-custom-action.component';
import { CustomRenderComponent } from './pages/examples/custom-edit-view/custom-render.component';
import { SrdExamplesTypesComponent } from './srd/srd-main.component';
import { FileUploaderComponent } from './srd/file-uploader/file-uploader.component';
import { NgxAtonBaseLibModule } from 'ngx-aton-base-library';
import {  PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FilesCustomActionComponent } from './srd/files-custom-actions/files-custom-action.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ScrollPositionDirective,
    AdvancedExamplesTypesComponent,
    ButtonViewComponent,
    CustomEditorComponent,
    CustomNumberFilterComponent,
    CustomRenderComponent,
    TestCustomActionComponent,
    SrdExamplesTypesComponent,
    FileUploaderComponent,
    FilesCustomActionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true }),
    Ng2SmartTableModule,
    ReactiveFormsModule,
    ColumnShowModule,
    THeadModule,
    CellModule,
    NgxAtonBaseLibModule,
    PerfectScrollbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
