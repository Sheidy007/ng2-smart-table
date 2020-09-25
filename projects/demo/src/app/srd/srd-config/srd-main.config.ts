import { map } from 'rxjs/operators';
import { Settings } from 'ng2-smart-table';
import { SrdExamplesTypesComponent } from '../srd-main.component';
import { CorporateAction } from '../srd-classes';
import { CustomNumberFilterComponent } from '../../pages/examples/custom-edit-view/custom-number-filter.component';

export class SrdMainConfig {
  settings: Settings;

  constructor(eventConfig: Settings, mainComponent: SrdExamplesTypesComponent) {
    this.settings = {
      settingsName: 'srd',
      innerTableHeightPx: 650,
      canSelectedFunction: (row) => row.system_id % 10 !== 0,
      rowClassFunction: (row: CorporateAction) => row.highlight ? 'error' : '',
      multiCompare: true,
      andOperator: true,
      minRowHeightPx: 42,
      actions: {
        show: {
          separateHeader: (row: CorporateAction) => `${ row.corpRefId } ${ row.assetName ? row.assetName : '' }`,
          viewType: 'details',
          detailColumnName: 'refIdAndAssetName',
          dblclickOnRow: true,
          onComponentInitObservable: (row: CorporateAction) => {
            return mainComponent.getEventsList(row.accountingSystem, row.cActionId)
              .pipe(map((data) => {
                row.tableInfo = data;
              }));
          }
        },
/*        edit: {
          separateHeader: (row: CorporateAction) => `${ row.corpRefId } ${ row.assetName ? row.assetName : '' }`,
/!*          viewType: 'modal',*!/
          position: 'right'
          /!*onComponentInitObservable: (row: CorporateAction) => {
           return mainComponent.getEventsList(row.accountingSystem, row.cActionId)
           .pipe(map((data) => {
           row.tableInfo = data;
           }));
           }*!/
        },*/
        custom: [
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
        refIdAndAssetName: {
          title: 'refIdAndAssetName',
          type: 'html',
          show: false,
          valuePrepareFunction: (value, row: CorporateAction) => {
            return `${ row.corpRefId ? row.corpRefId : '-' }` + ( row.assetName ? `<div>${ row.assetName }</div>` : `<div>-</div>` );
          }
        },
        status: {
          title: 'Status',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.activityStatuses.map(a => ( { value: a.value, title: a.titleEng } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.activityStatuses.find(a => a.value === value);
            return system ? system.titleEng : '-';
          },
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 1, gridColumnCount: 2 } },
          editSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 1, gridColumnCount: 2 } },
          createSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 1, gridColumnCount: 2 } }
        },
        accountingSystem: {
          title: 'Accounting System',
          filter: {
            type: 'list',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.accountingSystems.map(a => ( { value: a.value, title: a.title } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.accountingSystems.find(a => a.value === value);
            return system ? system.title : '';
          },
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        corpRefId: {
          title: 'CorpRefID',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        caType: {
          title: 'CA Type',
          defaultValue: '-',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.activityTypes.map(a => ( { value: a.value, title: a.titleEng } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.activityTypes.find(a => a.value === value);
            return system ? system.titleEng : '';
          },
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        caDate: {
          title: 'CA Date',
          type: 'date',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        assetName: {
          title: 'Asset Name',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        assetCode: {
          title: 'Asset Code',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridColumnPosition: 2, gridRowPosition: 4, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridColumnPosition: 2, gridRowPosition: 4, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridColumnPosition: 2, gridRowPosition: 4, gridColumnCount: 1 } }
        },
        mandatoryIndicator: {
          title: 'MandatoryIndicator',
          defaultValue: '-',
          filter: {
            type: 'completer',
            config: {
              completer: {
                valueField: 'mandatoryIndicator',
                titleField: 'mandatoryIndicator'
              }
            }
          },
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        isin: {
          title: 'ISIN',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        deadline: {
          title: 'Deadline',
          type: 'date',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        clientDeadline: {
          title: 'Client Deadline',
          type: 'date',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        recordDate: {
          title: 'Record Date',
          type: 'date',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        threshold: {
          title: 'Threshold',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 2, gridColumnCount: 1 } },
          filter: {
            type: 'custom',
            component: CustomNumberFilterComponent
          }
        },
        qtyAvailable: {
          title: 'QtyAvailable',
          type: 'number',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        rcvDateTime: {
          title: 'rcvDateTime',
          type: 'date',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 2, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 2, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        srdIndicator: {
          title: 'SRD Indicator',
          defaultValue: '-',
          type: 'boolean',
          filter: {
            type: 'checkbox',
            config: {
              checkboxSettings: {
                true: true,
                false: false
              }
            }
          },
          valuePrepareFunction: (value) => value === true ? 'Yes' : value === false ? 'No' : '-',
          showSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 1, gridColumnCount: 1 } },
          editSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 1, gridColumnCount: 1 } },
          createSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        tableInfo: {
          title: 'table',
          type: 'table',
          show: false,
          editable: false,
          showSeparate: { separateGrid: { gridRowPosition: 10, gridColumnPosition: 1, gridColumnCount: 2 } },
          tableSettings: eventConfig
        }
      }
    };
  }
}
