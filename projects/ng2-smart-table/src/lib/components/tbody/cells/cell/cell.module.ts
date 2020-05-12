import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from '@akveo/ng2-completer';

import { CellComponent } from './cell.component';
import { CustomEditComponent } from './cell-edit-mode/custom-edit.component';
import { DefaultEditComponent } from './cell-edit-mode/default-edit.component';
import { EditCellComponent } from './cell-edit-mode/edit-cell.component';
import { CheckboxEditorComponent } from './cell-edit-mode/cell-editors/checkbox-editor.component';
import { CompleterEditorComponent } from './cell-edit-mode/cell-editors/completer-editor.component';
import { InputEditorComponent } from './cell-edit-mode/cell-editors/input-editor.component';
import { SelectEditorComponent } from './cell-edit-mode/cell-editors/select-editor.component';
import { TextareaEditorComponent } from './cell-edit-mode/cell-editors/textarea-editor.component';
import { CustomViewComponent } from './cell-view-mode/custom-view.component';
import { ViewCellComponent } from './cell-view-mode/view-cell.component';
import { EditCellDefault } from './cell-edit-mode/edit-cell-default';
import { DefaultEditor } from './cell-edit-mode/cell-editors/default-editor';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { THeadModule } from '../../../thead/thead.module';
import { SanitizeHtmlPipe } from '../../../pipe/sanitize-html-pipe';

const CELL_COMPONENTS = [
  CellComponent,
  EditCellDefault,
  DefaultEditor,
  CustomEditComponent,
  DefaultEditComponent,
  EditCellComponent,
  CheckboxEditorComponent,
  CompleterEditorComponent,
  InputEditorComponent,
  SelectEditorComponent,
  TextareaEditorComponent,
  CustomViewComponent,
  ViewCellComponent,
  SanitizeHtmlPipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2CompleterModule
  ],
  declarations: [
    ...CELL_COMPONENTS,
  ],
  exports: [
    ...CELL_COMPONENTS,
  ],
})
export class CellModule { }
