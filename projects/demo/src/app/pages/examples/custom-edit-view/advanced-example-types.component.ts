import { Component } from '@angular/core';
import { CustomActionResultClass, SettingsClass } from '../../../../../../ng2-smart-table/src/lib/lib/settings.class';
import { ButtonViewComponent } from './basic-example-button-view.component';
import { CustomEditorComponent } from './custom-editor.component';
import { CustomRenderComponent } from './custom-render.component';

@Component({
  selector: 'advanced-example-types',
  template: `
		<ng2-smart-table
				*ngIf="data.length"
				[settings]="settings"
				[source]="data"
				(custom)="onCustom($event)"
				(deleteConfirm)="onDeleteConfirm($event)"
				(editConfirm)="onSaveConfirm($event)"
				(createConfirm)="onCreateConfirm($event)">
		</ng2-smart-table>
  `
})
export class AdvancedExamplesTypesComponent {

  data = [];

  preData = [
    {
      id: 1,
      name: 'Leanne Graham',
      username: 'Delphine',
      email: 'Sincere@april.biz',
      comments: 'Lorem ipsum dolor sit amet, ex dolorem officiis convenire usu.',
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>'
    },
    {
      id: 2,
      name: 'Ervin Howell',
      username: 'Antonette',
      email: 'Shanna@melissa.tv',
      comments: `Vix iudico graecis in? Malis eirmod consectetuer duo ut?
                Mel an aeterno vivendum accusata, qui ne amet stet definitiones.`,
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>'
    },
    {
      id: 3,
      name: 'Clementine Bauch',
      username: 'Samantha',
      email: 'Nathan@yesenia.net',
      comments: 'Mollis latine intellegebat ei usu, veri exerci intellegebat vel cu. Eu nec ferri copiosae.',
      passed: 'No',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>'
    },
    {
      id: 4,
      name: 'Nicholas DuBuque',
      username: 'Karianne',
      email: 'Julianne.OConner@kory.org',
      comments: 'Eu sea graece corrumpit, et tation nominavi philosophia eam, veri posidonium ex mea?',
      passed: 'Yes',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>'
    },
    {
      id: 5,
      name: 'Chelsey Dietrich',
      username: 'Kamren',
      email: 'Lucio_Hettinger@annie.ca',
      comments: `Quo viris appellantur an, pro id eirmod oblique iuvaret,
                timeam omittam comprehensam ad eam? Eos id dico gubergren,
                cum dicant qualisque ea, id vim ferri moderatius?`,
      passed: 'No',
      button: 'Button #1',
      link: '<a href="http://www.google.com">Google</a>'
    }
  ];
  settings: SettingsClass;

  constructor() {
    for (let i = 0; i < 10; i++) {
      const prePreData = JSON.parse(JSON.stringify(this.preData));
      prePreData.forEach(d => d.id += i * 5);
      this.data = [...this.data, ...prePreData];
    }
    this.settings = {
      settingsName: 'testName',
      selectMode: 'multi',
      multiCompare: true,
      actions: {
        add: true,
        delete: true,
        edit: true
        , custom: [
          {
            name: 'view',
            title: 'View '
          },
          {
            name: 'duplicate',
            title: 'Duplicate '
          }
        ]
      },
      delete: {
        confirmDelete: true,
        deleteButtonContent: 'Rem'
      },
      columns: {
        id: {
          title: 'ID'
        },
        name: {
          title: 'Full Name',
          filter: {
            type: 'completer',
            config: {
              completer: {
                data: this.data,
                searchFields: 'name',
                titleField: 'name'
              }
            }
          },
          editor: {
            type: 'completer',
            config: {
              completer: {
                data: this.data,
                searchFields: 'name',
                titleField: 'name'
              }
            }
          }
        },
        username: {
          title: 'User Name',
          type: 'html',
          filter: {
            type: 'list',
            config: {
              selectText: 'Select...',
              list: [
                { value: 'Antonette', title: 'Antonette' }
                , { value: 'Bret', title: 'Bret' }
                , { value: '<b>Samantha</b>', title: 'Samantha' }
              ]
            }
          },
          editor: {
            type: 'list',
            config: {
              list: [
                { value: 'Antonette', title: 'Antonette' }
                , { value: 'Bret', title: 'Bret' }
                , { value: '<b>Samantha</b>', title: 'Samantha' }
              ]
            }
          }
        },
        email: {
          title: 'Email',
          type: 'string',
          renderComponent: CustomRenderComponent
        },
        comments: {
          width: '30%',
          title: 'Comments',
          editor: {
            type: 'textarea'
          }
        },
        passed: {
          title: 'Passed'
          , filter: {
            type: 'checkbox',
            config: {
              true: 'Yes',
              false: 'No',
              resetText: 'clear'
            }
          },
          editor: {
            type: 'checkbox',
            config: {
              true: 'Yes',
              false: 'No'
            }
          }
        },
        button: {
          title: 'Button',
          type: 'custom',
          renderComponent: ButtonViewComponent,
          onComponentInitFunction(instance) {
            instance.save.subscribe(row => {
              alert(`${ row.name } saved!`);
            });
          }
        },
        link: {
          title: 'Link',
          type: 'html',
          editor: {
            type: 'custom',
            component: CustomEditorComponent
          }
        }
      }
    };
  }

  onCustom(event: CustomActionResultClass) {
    alert(`Custom event '${ event.action }' fired on email : ${ event.data.email }`);
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
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event) {
    if (window.confirm('Are you sure you want to create?')) {
      event.newData['name'] += ' + added in code';
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }
};
