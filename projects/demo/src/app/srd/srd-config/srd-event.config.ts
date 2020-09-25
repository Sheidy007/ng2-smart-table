import { map } from 'rxjs/operators';
import { Settings } from 'ng2-smart-table';
import { SrdExamplesTypesComponent } from '../srd-main.component';
import { CorporateEvent } from '../srd-classes';

export class SrdEventConfig {
  settings: Settings;

  constructor(shareholdersConfig: Settings, mainComponent: SrdExamplesTypesComponent) {
    this.settings = {
      settingsName: 'srd-events',
      innerTableHeightPx: 250,
      minRowHeightPx: 42,
      rowClassFunction: (row: CorporateEvent) => row.cntAttachments > 0 ? 'error' : '',
      actions: {
        show: {
          separateHeader: (row: CorporateEvent) => `${ row.caEventId } ${ row.assetName ? row.assetName : '' }`,
          viewType: 'modal',
          dblclickOnRow: true,
          showActionOverThis : true,
          onComponentInitObservable: (row: CorporateEvent) => {
            return mainComponent.getShareholderList(row.accountingSystem, row.caEventId)
              .pipe(map((data) => {
                row.tableInfo = data;
              }));
          }
        },
        custom: [
          {
            id: 'swift',
            content: '<button>SWIFT</button>',
            separateHeader: () => `Исходное SWIFT-сообщение`,
            viewType: 'modal',
            position: 'right',
            positionAsOverAction: 'top',
            confirm: mainComponent.confirmAction,
            innerActions: {
              show: { content: '<button>Make Attachment</button>', closeAfterAction: true, position: 'top' }
            },
            customComponent: 'testCustomActionComponent',
            onComponentInitObservable: (row: CorporateEvent) => {
              return mainComponent.getSwift(row.swiftId)
                .pipe(map((data) => {
                  return data;
                }));
            }
          },
          {
            id: 'Attachments',
            content: '<button>Attach</button>',
            separateHeader: (row: CorporateEvent) => `Attachments`,
            viewType: 'modal',
            position: 'right',
            positionAsOverAction: 'top',
            innerActions: {
              show: { content: 'Ok', closeAfterAction: true }
            },
            customComponent: 'filesCustomActionComponent',
            onComponentInitObservable: (row: CorporateEvent) => {
              return mainComponent.getAttachments(row.accountingSystem, row.caEventId)
                .pipe(map((data) => {
                  return data;
                }));
            }
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
        caEventId: {
          title: 'caEventId', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        sender: {
          title: 'sender',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.senders.map(a => ( { value: a.value, title: a.titleEng } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.senders.find(a => a.value === value);
            return system ? system.titleEng : '-';
          }, defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        reciever: {
          title: 'reciever', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 1, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        rcvDateTime: {
          title: 'rcvDateTime', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        senderMessageId: {
          title: 'senderMessageId', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        relatedMessageId: {
          title: 'relatedMessageId', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 2, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        depoAccount: {
          title: 'depoAccount', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        corpRefId: {
          title: 'corpRefId', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        caTypeId: {
          title: 'caTypeId', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 3, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        isSrd: {
          title: 'isSrd',
          type: 'boolean',
          filter: {
            type: 'checkbox',
            config: {
              checkboxSettings: {
                true: 'true',
                false: 'false'
              }
            }
          },
          valuePrepareFunction: (value) => value === true ? 'Yes' : value === false ? 'No' : '-',
          defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        caEventProcStatusId: {
          title: 'caEventProcStatusId',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.eventProcStatuses.map(a => ( { value: a.value, title: a.title } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.eventProcStatuses.find(a => a.value === value);
            return system ? system.title : '-';
          }, defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        mandatoryIndicator: {
          title: 'mandatoryIndicator', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 4, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        assetName: {
          title: 'assetName', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        assetCode: {
          title: 'assetCode', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        isin: {
          title: 'isin', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 5, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        caEventExtStatusId: {
          title: 'caEventExtStatusId',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.swiftStatuses.map(a => ( { value: a.value, title: a.title } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.swiftStatuses.find(a => a.value === value);
            return system ? system.title : '-';
          }, defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        qtyAvailable: {
          title: 'qtyAvailable', defaultValue: '-', type: 'number',
          showSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        qtyDesc: {
          title: 'qtyDesc', defaultValue: '-', type: 'number',
          showSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        qtyMain: {
          title: 'qtyMain', defaultValue: '-', type: 'number',
          showSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        recordDate: {
          title: 'recordDate', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        meetingDate: {
          title: 'meetingDate', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        threshold: {
          title: 'threshold', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 7, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        place: {
          title: 'place', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 10, gridColumnPosition: 1, gridColumnCount: 1 } }
        },
        web: {
          title: 'web', defaultValue: '-', show: false,
          showSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        deadline: {
          title: 'deadline', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 10, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        clientDeadline: {
          title: 'clientDeadline', defaultValue: '-', type: 'date',
          showSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        caEventStatusId: {
          title: 'caEventStatusId',
          filter: {
            type: 'multiList',
            config: {
              listSettings: {
                listMembers: mainComponent.dictionaries.eventStatuses.map(a => ( { value: a.value, title: a.titleEng } ))
              }
            }
          },
          valuePrepareFunction: (value) => {
            const system = mainComponent.dictionaries.eventStatuses.find(a => a.value === value);
            return system ? system.titleEng : '-';
          }, defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 9, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        closedDate: {
          title: 'closedDate', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 8, gridColumnPosition: 2, gridColumnCount: 1 } }
        },
        swiftId: {
          title: 'swiftId', defaultValue: '-',
          showSeparate: { separateGrid: { gridRowPosition: 6, gridColumnPosition: 3, gridColumnCount: 1 } }
        },
        cntAttachments: { title: 'Attachments', defaultValue: '-' },
        tableInfo: {
          title: 'table',
          type: 'table',
          show: false,
          editable: false,
          showSeparate: {
            separateGrid: {
              gridRowPosition: 11,
              gridColumnPosition: 1,
              gridColumnCount: 1
            }
          },
          tableSettings: shareholdersConfig
        }
      }
    };
  }
}
