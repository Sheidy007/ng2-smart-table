export class SettingsClass {
  mode: 'inline' | 'external' | 'click-to-edit';
  selectMode: 'single' | 'multi';
  hideHeader: boolean;
  hideSubHeader: boolean;
  actions: ActionsClass;
  filter: { inputClass: string };
  edit: EditClass;
  add: AddClass;
  delete: DeleteClass;
  attr: AttributeClass;
  noDataMessage: string;
  columns: {};
  pager: PagerClass;
  rowClassFunction: (...arg) => string;

  default() {
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
  delete: boolean;

  constructor(
    public columnTitle = 'Actions',
    public position: 'left' | 'right' = 'left',
    public add = true,
    public edit = true,
    public deleteInput = true,
    public custom = []
  ) {
    this.delete = deleteInput;
  }
}

export class EditClass {

  constructor(
    public inputClass = '',
    public editButton = 'Edit',
    public saveButton = 'Update',
    public cancelButton = 'Cancel',
    public confirmSave = false
  ) {
  }
}

export class AddClass {
  constructor(
    public inputClass = '',
    public addButtonContent = 'Add New',
    public createButtonContent = 'Create',
    public cancelButtonContent = 'Cancel',
    public confirmCreate = false
  ) {
  }
}

export class DeleteClass {
  constructor(
    public deleteButtonContent = 'Delete',
    public confirmDelete = false
  ) {
  }
}

export class AttributeClass {
  public class: string;
  constructor(
    public id = '',
    public inputClass = '') {
    this.class = inputClass;
  }
}

export class PagerClass {
  constructor(
    public display = true,
    public perPage = 10) {
  }
}
