import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from '@akveo/ng2-completer';

import { CellComponent } from './cell.component';
import { CustomEditComponent } from './cell-editor/editor-base/custom-edit.component';
import { DefaultEditorComponent } from './cell-editor/editor-base/default-editor.component';
import { EditCellComponent } from './cell-editor/edit-cell.component';
import { CheckboxEditorComponent } from './cell-editor/editor-types/checkbox-editor.component';
import { CompleterEditorComponent } from './cell-editor/editor-types/completer-editor.component';
import { InputEditorComponent } from './cell-editor/editor-types/input-editor.component';
import { SelectEditorComponent } from './cell-editor/editor-types/select-editor.component';
import { TextareaEditorComponent } from './cell-editor/editor-types/textarea-editor.component';
import { ViewCellComponent } from './cell-view/view-cell.component';
import { CustomViewComponent } from './cell-view/view-base/custom-view.component';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html-pipe';
import { InlineActionComponent } from '../../../actions/inline-actions/inline-actions.component';
import { InlineActionIdleComponent } from '../../../actions/inline-actions/inline-actions-idle.component';
import { InlineActionActiveComponent } from '../../../actions/inline-actions/inline-action-active.component';
import { TbodyCreateCancelComponent } from '../../../actions/inline-actions/edit/edit-update-cancel.component';
import { CustomActionAddedContentComponent } from '../../../actions/inline-actions/custom/custom-action-added-content.component';
import { TbodyEditComponent } from '../../../actions/inline-actions/edit/edit.component';
import { DeleteComponent } from '../../../actions/inline-actions/delete-show-checkbox/delete.component';
import { ShowComponent } from '../../../actions/inline-actions/delete-show-checkbox/show.component';
import { CustomActionComponent } from '../../../actions/inline-actions/custom/custom-action.component';
import { CloseActionComponent } from '../../../actions/separate-actions/close-action.component';
import { DefaultViewCellComponent } from './cell-view/view-base/default-view-cell.component';
import { RowShowDirective } from '../../../../directives/row-show.directive';
import { ResizedShowMinimizeCellDirective } from '../../../../directives/resized-show-minimize-cell.directive';

const CELL_COMPONENTS = [
  CellComponent,
  DefaultEditorComponent,
  CustomEditComponent,
  EditCellComponent,
  CheckboxEditorComponent,
  CompleterEditorComponent,
  InputEditorComponent,
  SelectEditorComponent,
  TextareaEditorComponent,
  CustomViewComponent,
  ViewCellComponent,
  SanitizeHtmlPipe,
  InlineActionComponent,
  InlineActionIdleComponent,
  InlineActionActiveComponent,
  TbodyCreateCancelComponent,
  CustomActionAddedContentComponent,
  TbodyEditComponent,
  DeleteComponent,
  ShowComponent,
  CustomActionComponent,
  CloseActionComponent,
  DefaultViewCellComponent,
  ResizedShowMinimizeCellDirective
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    Ng2CompleterModule
  ],
  declarations: [
    ...CELL_COMPONENTS
  ],
  exports: [
    ...CELL_COMPONENTS
  ]
})
export class CellModule {}
