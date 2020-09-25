import { AfterViewInit, Component, EventEmitter } from '@angular/core';
import { ButtonViewComponent } from './basic-example-button-view.component';
import { CustomEditorComponent } from './custom-editor.component';
import { CustomRenderComponent } from './custom-render.component';
import { CustomNumberFilterComponent } from './custom-number-filter.component';
import { ActionResultClass, ComponentLoader, Grid, LocalDataSource, Row, Settings } from 'ng2-smart-table';
import { TestCustomActionComponent } from '../../../srd/test-custom-action/test-custom-action.component';

@Component({
  selector: 'advanced-example-types',
  template: `
		<ngx-rt-column-show
				style="margin:1rem;padding:1rem;background-color: #e9ebec ;display: block"
				*ngIf="grid"
				[grid]="grid">
		</ngx-rt-column-show>
		<ng2-smart-table
				style="margin:1rem;padding:1rem;display: block"
				*ngIf="data"
				(customAction)="onCustom($event)"
				[settings]="settings"
				[source]="data"
				[componentLoader]="compLoader"
		>
		</ng2-smart-table>
  `
})
export class AdvancedExamplesTypesComponent implements AfterViewInit {

  data: LocalDataSource;
  compLoader: ComponentLoader;
  confirmSave = new EventEmitter();
  confirmDelete = new EventEmitter();

  preData = [
    {
      system_id: 1,
      name: 'Aanne Graham',
      username: 'Delphine',
      email: 'Sincere@april.biz',
      comments: 'Lorem ipsum dolor sit amet, ex dolorem officiis convenire usu.',
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>',
      date: new Date('12 06 2014').getTime(),
      tableInfo: [{ name: 'AAA', type: 'BBB', button: '' }, { name: 'AAA1', type: 'BBB2' }, { name: 'AAA1', type: 'BBB2' }]
    },
    {
      system_id: 2,
      name: 'Mrvin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      comments: `Vix iudico graecis in? Malis eirmod consectetuer duo ut?
                Mel an aeterno vivendum accusata, qui ne amet stet definitiones.`,
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>',
      date: new Date('10 05 2014').getTime(),
      tableInfo: [{ name: 'AAA', type: 'BBB', button: '' }, { name: 'AAA1', type: 'BBB2' }, { name: 'AAA1', type: 'BBB2' }]
    },
    {
      system_id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      comments: 'Mollis latine intellegebat ei usu, veri exerci intellegebat vel cu. Eu nec ferri copiosae.',
      passed: 'No',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>',
      date: new Date('10 06 2015').getTime(),
      tableInfo: [{ name: 'AAA', type: 'BBB', button: '' }, { name: 'AAA1', type: 'BBB2' }, { name: 'AAA1', type: 'BBB2' }]
    },
    {
      system_id: 4,
      name: 'Nicholas DuBuque',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      comments: 'Eu sea graece corrumpit, et tation nominavi philosophia eam, veri posidonium ex mea?',
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>',
      date: Date.now(),
      tableInfo: [{ name: 'AAA', type: 'BBB', button: '' }, { name: 'AAA1', type: 'BBB2' }, { name: 'AAA1', type: 'BBB2' }]
    },
    {
      system_id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      comments: `Quo viris appellantur an, pro id eirmod oblique iuvaret,
                timeam omittam comprehensam ad eam? Eos id dico gubergren,
                cum dicant qualisque ea, id vim ferri moderatius?`,
      passed: 'No',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>',
      date: new Date('10 18 2016').getTime(),
      tableInfo: [{ name: 'AAA', type: 'BBB', button: '' }, { name: 'AAA1', type: 'BBB2' }, { name: 'AAA1', type: 'BBB2' }]
    }
  ];
  settings: Settings;
  grid: Grid;
  editRow: Row;
  createRow: Row;
  viewRow: Row;

  constructor() {
    let dt = [];
    const stringData = JSON.stringify(this.preData).slice(1, JSON.stringify(this.preData).length - 1) + ',';
    for (let j = 0; j < 50; j++) {
      let resultString = '';
      for (let i = 0; i < 1000; i++) {
        resultString = resultString + stringData;
      }
      resultString = '[' + resultString.slice(0, resultString.length - 1) + ']';
      const newDt = JSON.parse(resultString);
      dt = [...dt, ...newDt];
    }

    for (let i = 0; i < dt.length; i++) {
      dt[i].system_id = i;
    }

    const settings: Settings = {
      settingsName: 'testName2',
      selectMode: 'multi',
      canSelectedFunction: (row) => row.system_id % 10 !== 0,

      multiCompare: true,
      andOperator: true,

      actions: {
        selectorPosition: 'right',
        add: {
          // viewType: 'modal',
          position: 'right'
        },
        show: {
          title: 'View',
          viewType: 'quickView'
        },
        edit: {
          content: `<button>Edit</button>`,
          viewType: 'modal',
          detailColumnName: 'name',
          confirm: this.confirmSave
        },
        delete: {
          content: `<button>Remove</button>`,
          confirm: this.confirmDelete
        },
        custom: [
          {
            id: 'customShow',
            content: 'CustomShow',
            viewType: 'expandRow',
            position: 'right',
            innerActions: {
              show: { content: 'Show', closeAfterAction: false },
              hide: { content: 'Hide', closeAfterAction: true }
            },
            customComponent: 'testCustomActionComponent'
          },
          {
            id: 'customTb',
            content: 'Table',
            viewType: 'details',
            detailColumnName: 'name',
            innerActions: {
              show: { content: 'Show', closeAfterAction: false },
              hide: { content: 'Hide', closeAfterAction: true }
            },
            customComponent: 'testCustomActionComponent'
          },
          {
            id: 'column',
            content: 'Test',
            viewType: 'modal',
            concatWithColumnName: 'username',
            innerActions: {
              show: { content: 'Show', closeAfterAction: false },
              hide: { content: 'Hide', closeAfterAction: true }
            },
            customComponent: 'testCustomActionComponent'
          },
          {
            id: 'column',
            content: 'Test2',
            concatWithColumnName: 'username',
            position: 'right',
            customComponent: 'testCustomActionComponent',
            confirm: this.confirmSave
          }
        ]
      },
      columns: {
        system_id: {
          title: 'ID',
          filter: {
            type: 'custom',
            component: 'customFilterComponent'
          },
          editSeparate: {
            separateGrid: {
              gridColumnPosition: 1,
              gridRowPosition: 1,
              gridColumnCount: 2
            }
          },
          showSeparate: {
            separateGrid: {
              gridColumnPosition: 1,
              gridRowPosition: 1,
              gridColumnCount: 2
            }
          }
        },
        name: {
          title: 'Full Name',
          filter: {
            type: 'completer',
            config: {
              completer: {
                valueField: 'name',
                titleField: 'name'
              }
            }
          },
          editor: {
            type: 'completer',
            config: {
              completer: {
                valueField: 'name',
                titleField: 'name'
              }
            }
          },
          editSeparate: {
            separateGroup: 'Names',
            separateGrid: {
              gridColumnPosition: 2,
              gridRowPosition: 2,
              gridColumnCount: 2
            }
          },
          showSeparate: {
            separateGroup: 'Names',
            separateGrid: {
              gridColumnPosition: 2,
              gridRowPosition: 2,
              gridColumnCount: 2
            }
          }
        },
        username: {
          title: 'User Name',
          type: 'html',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                selectText: 'Select...',
                resetText: '(Select all)',
                listMembers: [
                  { value: 'Antonette', title: 'Antonette' }
                  , { value: 'Bret', title: 'Bret' }
                  , { value: 'Karianne', title: '<b>Karianne</b>' }
                  , { value: 'Antonette1', title: 'Antonette1' }
                  , { value: 'Bret1', title: 'Bret1' }
                  , { title: '<b>Samantha1</b>', value: 'Samantha1' }
                  , { value: 'Antonette2', title: 'Antonette2' }
                  , { value: 'Bret2', title: 'Bret2' }
                  , { title: '<b>Samantha1</b>', value: 'Samantha2' }
                ]
              }
            }
          },
          editor: {
            type: 'list',
            config: {
              listSettings: {
                listMembers: [
                  { value: 'Antonette', title: 'Antonette' }
                  , { value: 'Bret', title: 'Bret' }
                  , { value: '<b>Samantha</b>', title: 'Samantha' }
                ]
              }
            }
          },
          editSeparate: {
            separateGroup: 'Names',
            separateGrid: {
              gridColumnPosition: 3,
              gridRowPosition: 2,
              gridColumnCount: 2
            }
          },
          showSeparate: {
            separateGroup: 'Names',
            separateGrid: {
              gridColumnPosition: 3,
              gridRowPosition: 2,
              gridColumnCount: 2
            }
          }
        },
        email: {
          title: 'Email',
          show: false,
          type: 'custom',
          renderComponent: 'customRenderComponent',
          filter: null
        },
        comments: {
          width: '30%',
          title: 'Comments',
          editor: {
            type: 'textarea'
          },
          editable: false
        },
        passed: {
          title: 'Passed',
          filter: {
            type: 'checkbox',
            config: {
              checkboxSettings: {
                true: 'Yes',
                false: 'No'
              }
            }
          },
          editor: {
            type: 'checkbox',
            config: {
              checkboxSettings: {
                true: 'Yes',
                false: 'No'
              }
            }
          }
        },
        button: {
          title: 'Button',
          type: 'custom',
          minWidth: 8,
          renderComponent: 'buttonViewComponent',
          onRenderComponentInstance: (instance: ButtonViewComponent) => {
            instance.save.subscribe(row => {
              alert(`${ row.name } saved! ${ instance.value }`);
            });
          },
          editSeparate: {
            separateGroup: 'Names'
          }
        },
        link: {
          title: 'Link',
          type: 'html',
          addable: false,
          editor: {
            type: 'custom',
            component: 'customEditorComponent'
          },
          editSeparate: {
            separateGroup: 'Other'
          }
        },
        date: {
          title: 'date'
        },
        tableInfo: {
          title: 'table',
          type: 'table',
          show: false,
          tableSettings: {
            selectMode: 'multi',
            innerTableHeightPx: 100,
            actions: {
              add: {
                viewType: 'modal'
              },
              edit: {
                content: `<button>Edit</button>`,
                viewType: 'modal',
                detailColumnName: 'name'
              },
              delete: {
                content: `<button>Remove</button>`
              }
            },
            columns: {
              name: {
                title: 'TestName',
                filter: null
              },
              type: {
                title: 'TestType',
                filter: null
              },
              button: {
                title: 'Button',
                type: 'custom',
                defaultValue: 'test',
                minWidth: 8,
                renderComponent: ButtonViewComponent,
                onRenderComponentInstance: (instance: ButtonViewComponent) => {
                  instance.save.subscribe(row => {
                    alert(`${ row.name } saved! ${ instance.value }`);
                  });
                },
                editSeparate: {
                  separateGroup: 'Names'
                }
              }
            }
          }
        }
      }
    };
    this.confirmDelete.subscribe(event => this.onDeleteConfirm(event));
    this.confirmSave.subscribe(event => this.onSaveConfirm(event));
    this.compLoader = {
      testCustomActionComponent: TestCustomActionComponent,
      buttonViewComponent: ButtonViewComponent,
      customEditorComponent: CustomEditorComponent,
      customRenderComponent: CustomRenderComponent,
      customFilterComponent: CustomNumberFilterComponent
    };
    this.settings = new Settings(settings);
    this.data = new LocalDataSource(dt);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.grid = this.data.getGridAfterViewInit('testName');
    }, 1);
  }

  onCustom(event: ActionResultClass) {
    if (event.innerActionId) {
      alert(`Custom event '${ event.action }' '${ event.innerActionId }' fired on email : ${ event.rowData ? event.rowData.email : 'null' }`);
    }
  }

  onDeleteConfirm(event) {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onSaveConfirm(event) {
    if (window.confirm('Are you sure you want to save?')) {
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onEditRowEvent(event) {
    this.editRow = event;
  }

  onViewRowEvent(event) {
    this.viewRow = event;
  }

  onCreateRowEvent(event) {
    this.createRow = event;
  }
}
