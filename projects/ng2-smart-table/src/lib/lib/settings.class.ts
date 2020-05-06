import { LocalDataSource } from './data-source/local.data-source';
import { Column } from './data-set/column';

export class SettingsClass {
  settingsName ? = '';
  mode?: 'inline' | 'external' | 'click-to-edit' = 'inline';
  selectMode?: 'single' | 'multi' = 'single';
  multiCompare ? = false;
  hideHeader ? = false;
  hideSubHeader ? = false;
  actions?: ActionsClass;
  filter?: { inputClass: string };
  edit?: EditClass;
  add?: AddClass;
  delete?: DeleteClass;
  attr?: AttributeClass = new AttributeClass();
  noDataMessage ? = 'No data found';
  columns: { [name: string]: Column } = {};
  pager?: PagerClass = new PagerClass();
  rowClassFunction?: (...arg) => string = (...arg) => '';

  constructor(me?: SettingsClass) {
    if (me) {
      Object.keys(me).forEach(key => this[key] = me[key]);
      if (this.actions) {
        this.actions = new ActionsClass();
        Object.keys(me.actions).forEach(key => this.actions[key] = me.actions[key]);
        if (this.actions.add && !this.add) {
          this.add = new AddClass();
        }
        if (this.actions.edit && !this.edit) {
          this.edit = new EditClass();
        }
        if (this.actions.delete && !this.delete) {
          this.delete = new DeleteClass();
        }
      } else {
        if (this.add || this.edit || this.delete) {
          this.actions = new ActionsClass();
          if (this.add) {
            this.actions.add = true;
            this.add = new AddClass();
            Object.keys(me.add).forEach(key => this.add[key] = me.add[key]);
          }
          if (this.edit) {
            this.actions.edit = true;
            this.edit = new EditClass();
            Object.keys(me.edit).forEach(key => this.edit[key] = me.edit[key]);
          }
          if (this.delete) {
            this.actions.delete = true;
            this.delete = new DeleteClass();
            Object.keys(me.delete).forEach(key => this.delete[key] = me.delete[key]);
          }
        }
      }
    } else {
      this.setDefault();
    }
  }

  private setDefault ? = () => {
    this.mode = 'inline';
    this.selectMode = 'single';
    this.hideHeader = false;
    this.hideSubHeader = false;
    this.actions = new ActionsClass();
    this.filter = { inputClass: '' };
    this.edit = new EditClass();
    this.add = new AddClass();
    this.delete = new DeleteClass();
    this.attr = new AttributeClass();
    this.noDataMessage = 'No data found';
    this.columns = {};
    this.pager = new PagerClass();
    this.rowClassFunction = (...arg) => '';
  }
}

export class ActionsClass {
  columnTitle ? = 'Actions';
  position?: 'left' | 'right' = 'left';
  add  ? = false;
  edit ? = false;
  delete ? = false;
  custom ?: CustomActionClass[] = [];
}

export class EditClass {
  inputClass ? = '';
  editButtonContent ? = 'Edit ';
  saveButtonContent ? = 'Update';
  cancelButtonContent ? = 'Cancel';
  confirmSave ? = false;
}

export class AddClass {
  inputClass ? = '';
  addButtonContent ? = 'Add New';
  createButtonContent ? = 'Create';
  cancelButtonContent ? = 'Cancel';
  confirmCreate ? = false;
}

export class DeleteClass {
  inputClass ? = '';
  deleteButtonContent ? = 'Delete ';
  confirmDelete ? = false;
}

export class CustomActionClass {
  name: string;
  title: string;
}

export class CustomActionResultClass {
  action: string;
  data: any;
  source: LocalDataSource;
}

export class AttributeClass {
  id ? = '';
  class ? = '';
}

export class PagerClass {
  display ? = true;
  perPage?: number | number[] = [15, 30, 60];
}
