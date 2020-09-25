import { Settings } from 'ng2-smart-table';
import { SrdExamplesTypesComponent } from '../srd-main.component';
import { Shareholder } from '../srd-classes';

export class SrdSharedholdersConfig {
  settings: Settings;

  constructor(mainComponent: SrdExamplesTypesComponent) {
    this.settings = {
      settingsName: 'srd-shared',
      innerTableHeightPx: 300,
      minOuterTableWidthStr: '90vw',
      selectMode: 'multi',
      minRowHeightPx: 42,
      canSelectedFunction: (row: Shareholder) => !!row.email && ![0, 1, 2, 3].includes(row.manualStatus),
      rowClassFunction: (row: Shareholder) =>
        row.manualStatus === 1 ? 'success' :
          row.manualStatus === 2 ? 'warning' :
            row.manualStatus === 3 ? 'error' :
              '',
      actions: {
        custom: [
          {
            id: 'emailExample',
            content: '<button>GetExample</button>',
            position: 'right',
            confirm: mainComponent.confirmAction,
            showActionFunction: (row: Shareholder) => !!row.email && ![0, 1, 2, 3].includes(row.manualStatus)
          },
          {
            id: 'getSendMail',
            content: '<button>GetSent</button>',
            position: 'right',
            confirm: mainComponent.confirmAction,
            showActionFunction: (row: Shareholder) => !!row.email && ![0, 2, 4].includes(row.manualStatus)
          },
          {
            id: 'emailSend',
            content: '<button>Send</button>',
            position: 'right',
            confirm: mainComponent.confirmAction,
            showActionFunction: (row: Shareholder) => !!row.email && ![0, 1, 2, 3].includes(row.manualStatus)
          },
          {
            id: 'emailSendAll',
            content: '<button>SendAllSelected</button>',
            position: 'top',
            confirm: mainComponent.confirmAction
          },
          {
            id: 'resetSettings',
            content: '<button>reset settings</button>',
            position: 'bottom',
            confirm: mainComponent.confirmAction
          },
          {
            id: 'resetFilters',
            content: '<button>reset filters</button>',
            position: 'bottom',
            confirm: mainComponent.confirmAction
          },
          {
            id: 'resetSorts',
            content: '<button>reset sorts</button>',
            position: 'bottom',
            confirm: mainComponent.confirmAction
          },
          {
            id: 'showSum',
            content: '<button>Show sum</button>',
            innerActions: {
              hide: { content: '<button>Hide sum</button>', closeAfterAction: true }
            },
            position: 'top',
            actionEvent: mainComponent.actionEvent
          }
        ]
      },
      columns: {
        cpId: {
          title: 'cpId', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        ownerId: {
          title: 'ownerId', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        vaultId: {
          title: 'vaultId',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.vaults.map(a => ( { value: a.value, title: a.title } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.vaults.find(a => a.value === value);
            return system ? system.title : '';
          }, defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        name: {
          title: 'name', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        accountType: {
          title: 'accountType', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        regAddress: {
          title: 'regAddress', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        passport: {
          title: 'passport', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        registration: {
          title: 'registration', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        email: {
          title: 'email', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        qtyWillBe: {
          title: 'qtyWillBe', defaultValue: '-', type: 'number',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        qtyAvailable: {
          title: 'qtyAvailable', defaultValue: '-', type: 'number',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        qtyDate: {
          title: 'qtyDate', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        recordDate: {
          title: 'recordDate', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        wayOfInform: {
          title: 'wayOfInform', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        informDateTime: {
          title: 'informDateTime', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 3, gridColumnCount: 1 } }
        }
      }
    };
  }
}
