import { AfterViewInit, Component, EventEmitter } from '@angular/core';
import { CustomEditorComponent } from '../pages/examples/custom-edit-view/custom-editor.component';
import { CustomRenderComponent } from '../pages/examples/custom-edit-view/custom-render.component';
import { CustomNumberFilterComponent } from '../pages/examples/custom-edit-view/custom-number-filter.component';
import { ActionResultClass, ComponentLoader, Grid, LocalDataSource, Settings } from 'ng2-smart-table';
import { TestCustomActionComponent } from './test-custom-action/test-custom-action.component';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { SrdMainConfig } from './srd-config/srd-main.config';
import { SrdEventConfig } from './srd-config/srd-event.config';
import { SrdSharedholdersConfig } from './srd-config/srd-sharedholders.config';
import { NgxAtonBaseAuthenticationService, NgxAtonBaseBackendInteractionClass, NgxAtonBaseConstant, NgxAtonBaseDialogTemplateClass, NgxAtonBaseDialogTemplateComponent } from 'ngx-aton-base-library';
import { FileClass } from './file-uploader/file-uploader.component';
import { CorporateAction, CorporateEvent, Dictionaries, NotifyShareholders, RequestCorporateActionsBase, Shareholder } from './srd-classes';
import { FilesCustomActionComponent } from './files-custom-actions/files-custom-action.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'srd-example-types',
  template: `
		<div style="
      height: 62px;
      background: linear-gradient(269.89deg, #2B2B48 0%, #39395C 100%);
        box-shadow: 0 1px 0 #EAECF1;"
		     (click)="changePoa()">
			<img style="padding-top: 15px;padding-left: 26px" src="assets/Aton-srd.svg" alt="">
		</div>
		<div style="display: flex;flex-wrap: nowrap;align-items: center">
			<label style="margin: 5px">
				<input type="checkbox" [(ngModel)]="requestCorporateActionsBase.isOnlySRD"/>
				<span>isOnlySRD</span>
			</label>
			<label style="margin: 5px">
				<input type="checkbox" [(ngModel)]="requestCorporateActionsBase.isOnlyActive"/>
				<span>isOnlyActive</span>
			</label>
			<ng-select style="margin: 5px;min-width: 200px"
			           [(ngModel)]="requestCorporateActionsBase.caStatusId"
			           [closeOnSelect]="false"
			           [items]="this.caStatuses | async"
			           [placeholder]="'caStatus'"
			           [searchable]="true"
			           [clearable]="true"
			           bindLabel="title"
			           bindValue="value">
			</ng-select>
			<ng-select style="margin: 5px;min-width: 200px"
			           [(ngModel)]="requestCorporateActionsBase.caTypeId"
			           [closeOnSelect]="false"
			           [clearable]="true"
			           [items]="this.caType | async"
			           [placeholder]="'caType'"
			           [searchable]="true"
			           bindLabel="title"
			           bindValue="value">
			</ng-select>
			<input style="margin: 5px"
			       [(ngModel)]="requestCorporateActionsBase.isin" placeholder="isin">
			<mat-form-field appearance="fill">
				<mat-label>begDate</mat-label>
				<input matInput [matDatepicker]="dpb" [(ngModel)]="requestCorporateActionsBase.begDate">
				<mat-datepicker-toggle matSuffix [for]="dpb"></mat-datepicker-toggle>
				<mat-datepicker #dpb></mat-datepicker>
			</mat-form-field>
			<mat-form-field appearance="fill">
				<mat-label>endDate</mat-label>
				<input matInput [matDatepicker]="dpe" [(ngModel)]="requestCorporateActionsBase.endDate">
				<mat-datepicker-toggle matSuffix [for]="dpe"></mat-datepicker-toggle>
				<mat-datepicker #dpe></mat-datepicker>
			</mat-form-field>
			<button style="margin: 5px"
			        (click)="getListActions()">GetList
			</button>
		</div>
		<ng2-smart-table
				style="padding: 0 26px 26px;display: block"
				*ngIf="data"
				[settings]="settings"
				[source]="data"
				[componentLoader]="compLoader"
				(gridGenerated)="autoGridGenerated($event)">
		</ng2-smart-table>
		<!--	<ngx-rt-column-show
          style="margin:1rem;padding:1rem;background-color: #e9ebec ;display: block"
          *ngIf="grid"
          [grid]="grid">
      </ngx-rt-column-show>-->
  `,
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class SrdExamplesTypesComponent implements AfterViewInit {

  data: LocalDataSource;
  compLoader: ComponentLoader;
  confirmAction = new EventEmitter();
  actionEvent = new EventEmitter();
  dictionaries: Dictionaries;
  settings: Settings;
  grid: Grid;
  requestCorporateActionsBase: RequestCorporateActionsBase = new RequestCorporateActionsBase();
  caStatuses = new BehaviorSubject<{ value: string, title: string }[]>([]);
  caType = new BehaviorSubject<{ value: string, title: string }[]>([]);

  serverName = 'SRDService';
  viewLoading: HTMLElement;
  viewLoadingSet: Subject<boolean> = new Subject<boolean>();

  constructor(private ngxAtonBaseAuthenticationService: NgxAtonBaseAuthenticationService) {}

  ngAfterViewInit() {
    this.viewLoading = document.getElementById('loading-view');
    this.viewLoadingSet.subscribe(view => {
      this.viewLoading.style.display = view ? 'block' : 'none';
    });
    this.viewLoadingSet.next(true);
    this.ngxAtonBaseAuthenticationService.initProjectConfig(this.serverName, 'authService', 'https://crm:8041/');

    this.getDictionaries().subscribe(dictionaries => {
      this.dictionaries = dictionaries;
      this.caStatuses.next(this.dictionaries.activityStatuses.map(a => ( { value: a.value.toString(), title: a.titleEng } )));
      this.caType.next(this.dictionaries.activityTypes.map(a => ( { value: a.value.toString(), title: a.titleEng } )));
      this.confirmAction.subscribe(event => {
        this.onActionConfirm(event);
      });
      this.actionEvent.subscribe(event => {
        this.onActionEvent(event);
      });

      const settings: Settings =
        new SrdMainConfig(
          new SrdEventConfig(new SrdSharedholdersConfig(
            this).settings
            , this).settings
          , this).settings;

      this.compLoader = {
        testCustomActionComponent: TestCustomActionComponent,
        filesCustomActionComponent: FilesCustomActionComponent,
        customEditorComponent: CustomEditorComponent,
        customRenderComponent: CustomRenderComponent,
        customFilterComponent: CustomNumberFilterComponent
      };
      this.settings = new Settings(settings);
      this.viewLoadingSet.next(false);
    });
  }

  changePoa() {
    this.requestCorporateActionsBase.poa++;
    if (this.requestCorporateActionsBase.poa > 2) {
      this.requestCorporateActionsBase.poa = 0;
    }
    this.getListActions();
  }

  getListActions() {
    this.viewLoadingSet.next(true);
    this.getListPost().subscribe((result) => {
      this.viewLoadingSet.next(false);
      if (result) {
        result.forEach((r: CorporateAction) => {
          r.tableInfo = [];
          r.refIdAndAssetName = r.corpRefId + ( r.assetName ? r.assetName : '' );
        });
        !this.data ? this.data = new LocalDataSource(result) : this.data.load(result);
        if (this.grid) {
          const column = this.grid.getAllColumns().find(c => c.id === 'accountingSystem');
          if (column) {
            column.show = this.requestCorporateActionsBase.poa === 2;
            this.grid.refreshGrid();
          }
        }
      }
    });
  }

  autoGridGenerated(grid: Grid) {
    this.grid = grid;
    const column = this.grid.getAllColumns().find(c => c.id === 'accountingSystem');
    if (column) {
      column.show = this.requestCorporateActionsBase.poa === 2;
      this.grid.refreshGrid();
    }
  }

  /* resetStatusToNew(event?: number[]) {
   if (!event || !event.length) {
   this.requestCorporateActionsBase.caStatusId = '1';
   }
   }*/

  onActionEvent(event: ActionResultClass) {
    if (event.action.id === 'showSum') {
      event.grid.settings.hideSumRow = !!event.innerActionId;
    }
  }

  onActionConfirm(event: ActionResultClass) {
    if (event.action.id === 'swift') {
      const corporateEvent = event.rowData as CorporateEvent;

      this.addAttachmentOnEvent(corporateEvent.accountingSystem, corporateEvent.caEventId, event.action.preInitResultData)
        .subscribe((createResult) => {
          if (createResult) {
            event.confirm.resolve();
            event.grid.source.updateField(corporateEvent, 'cntAttachments', corporateEvent.cntAttachments + 1).then();
          } else {
            event.confirm.reject();
          }
        });
    }
    if (event.action.id === 'emailExample') {
      const corpAction = JSON.parse(JSON.stringify(event.grid.parentRowData.parentRowData.getData()));
      const corpEvent = JSON.parse(JSON.stringify(event.grid.parentRowData.getData()));
      const shareholders = JSON.parse(JSON.stringify(event.rowData));

      const fullData = new NotifyShareholders();
      fullData.corpAction = corpAction as CorporateAction;
      fullData.corpEvent = corpEvent as CorporateEvent;
      fullData.shareholders = [shareholders as Shareholder];
      this.GetExample(fullData).subscribe(() => event.confirm.resolve());
    }
    if (event.action.id === 'emailSend') {
      const corpAction = JSON.parse(JSON.stringify(event.grid.parentRowData.parentRowData.getData()));
      const corpEvent = JSON.parse(JSON.stringify(event.grid.parentRowData.getData()));
      const shareholders = JSON.parse(JSON.stringify(event.rowData));

      const fullData = new NotifyShareholders();
      fullData.corpAction = corpAction as CorporateAction;
      fullData.corpEvent = corpEvent as CorporateEvent;
      fullData.shareholders = [shareholders as Shareholder];

      const dialog = NgxAtonBaseConstant.openDialog(
        new NgxAtonBaseDialogTemplateClass(
          'Подтверждение',
          `<p class="text-left">Отправить email?</p>`,
          'Да', 'Нет'),
        NgxAtonBaseDialogTemplateComponent);
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.Notify(fullData).subscribe((notified) => {
            if (notified) {
              event.grid.source.updateField(event.rowData, 'manualStatus', 2).then();
            } else {
              event.grid.source.updateField(event.rowData, 'manualStatus', 3).then();
            }
            event.confirm.resolve();
          });
        } else {
          event.confirm.reject();
        }
      });
    }
    if (event.action.id === 'emailSendAll') {
      const corpAction = JSON.parse(JSON.stringify(event.grid.parentRowData.parentRowData.getData()));
      const corpEvent = JSON.parse(JSON.stringify(event.grid.parentRowData.getData()));
      const shareholders = JSON.parse(JSON.stringify(event.grid.source.filteredAndSorted.filter(f => f.system_info_777_isSelected)));

      const fullData = new NotifyShareholders();
      fullData.corpAction = corpAction as CorporateAction;
      fullData.corpEvent = corpEvent as CorporateEvent;
      fullData.shareholders = shareholders as Shareholder[];

      if (!fullData.shareholders || !fullData.shareholders.length) {
        event.confirm.reject();
        return;
      }

      const dialog = NgxAtonBaseConstant.openDialog(
        new NgxAtonBaseDialogTemplateClass(
          'Подтверждение',
          `<p class="text-left">Отправить email?</p>`,
          'Да', 'Нет'),
        NgxAtonBaseDialogTemplateComponent);
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.Notify(fullData).subscribe((notified) => {
            if (notified) {
              for (const shar of event.grid.source.filteredAndSorted.filter(f => f.system_info_777_isSelected)) {
                event.grid.source.updateField(shar, 'manualStatus', 2).then();
                event.grid.source.updateField(shar, 'system_info_777_isSelected', false).then();
              }
            } else {
              for (const shar of event.grid.source.filteredAndSorted.filter(f => f.system_info_777_isSelected)) {
                event.grid.source.updateField(shar, 'manualStatus', 3).then();
                event.grid.source.updateField(shar, 'system_info_777_isSelected', false).then();
              }
            }
            event.confirm.resolve();
          });
        } else {
          event.confirm.reject();
        }
      });
    }
    if (event.action.id === 'getSendMail') {
      const corpAction = JSON.parse(JSON.stringify(event.grid.parentRowData.parentRowData.getData()));
      const corpEvent = JSON.parse(JSON.stringify(event.grid.parentRowData.getData()));
      const shareholders = JSON.parse(JSON.stringify(event.rowData));

      const fullData = new NotifyShareholders();
      fullData.corpAction = corpAction as CorporateAction;
      fullData.corpEvent = corpEvent as CorporateEvent;
      fullData.shareholders = [shareholders as Shareholder];
      this.GetSendMail(fullData).subscribe(() => event.confirm.resolve());
    }
    if (event.action.id === 'resetSettings') {
      event.grid.resetSettingsToInputData();
      event.confirm.resolve();
    }
    if (event.action.id === 'resetFilters') {
      event.grid.source.clearFilter();
      event.confirm.resolve();
    }
    if (event.action.id === 'resetSorts') {
      event.grid.source.clearSort();
      event.confirm.resolve();
    }
  }

  getDictionaries(): Observable<Dictionaries> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<any>(
      this.serverName,
      'api/Dictionary/GetAll'
      , true)
      .pipe(map((response: Dictionaries) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  getListPost(): Observable<CorporateAction[]> {
    const info = JSON.parse(JSON.stringify(this.requestCorporateActionsBase));
    info.caTypeId = info.caTypeId ? parseInt(info.caTypeId, 10) : info.caTypeId;
    return NgxAtonBaseBackendInteractionClass.postObserveBody<CorporateAction[]>(
      this.serverName,
      'api/CorporateAction/GetList'
      , JSON.stringify(info)
      , true
      , new HttpParams({
        fromObject: {
          poa: this.requestCorporateActionsBase.poa.toString()
        }
      }))
      .pipe(map((response: CorporateAction[]) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  getList(): Observable<CorporateAction[]> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<CorporateAction[]>(
      this.serverName,
      'api/CorporateAction/GetList'
      , true
      , new HttpParams({
        fromObject: {
          begDate: null,
          endDate: null,
          poa: '2'
        }
      }))
      .pipe(map((response: CorporateAction[]) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  getEventsList(companyId: number, actionId: number): Observable<CorporateEvent[]> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<CorporateEvent[]>(
      this.serverName,
      'api/CorporateEvents/GetList'
      , true
      , new HttpParams({
        fromObject: {
          companyId: companyId.toString(),
          actionId: actionId.toString()
        }
      }))
      .pipe(map((response: CorporateEvent[]) => {
        if (response) {
          response.forEach(r => r.accountingSystem = companyId);
          return response;
        }
        return null;
      }));
  }

  getShareholderList(companyId: number, eventId: number): Observable<Shareholder[]> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<Shareholder[]>(
      this.serverName,
      'api/Shareholders/GetList'
      , true
      , new HttpParams({
        fromObject: {
          companyId: companyId.toString(),
          eventId: eventId.toString()
        }
      }))
      .pipe(map((response: Shareholder[]) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  getSwift(swiftId: number): Observable<string> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<string>(
      this.serverName,
      'api/CorporateEvents/GetSwift'
      , true
      , new HttpParams({
        fromObject: {
          swiftId: swiftId.toString()
        }
      }))
      .pipe(map((response: string) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  getAttachments(companyId: number, eventId: number): Observable<FileClass[]> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<FileClass[]>(
      this.serverName,
      'api/Attachments/GetFileList'
      , true
      , new HttpParams({
        fromObject: {
          companyId: companyId.toString(),
          eventId: eventId.toString()
        }
      }))
      .pipe(map((response: FileClass[]) => {
        if (response) {
          response.forEach(r => r.loadedOnServer = true);
          return response;
        }
        return [];
      }));
  }

  addAttachmentOnEvent(companyId: number, eventId: number, swift: string): Observable<string> {
    return NgxAtonBaseBackendInteractionClass.postObserveBody<string>(
      this.serverName,
      'api/Attachments/AddSwiftOnEvent'
      , JSON.stringify(swift)
      , true
      , new HttpParams({
        fromObject: {
          companyId: companyId.toString(),
          eventId: eventId.toString()
        }
      }))
      .pipe(map((response: string) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  GetExample(exampleData: NotifyShareholders): Observable<boolean> {
    return NgxAtonBaseBackendInteractionClass.postObserveSaveFile<boolean>(
      this.serverName,
      'api/Shareholders/GetExample'
      , JSON.stringify(exampleData)
      , 'mail.eml'
      , true)
      .pipe(map((response: boolean) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  GetSendMail(exampleData: NotifyShareholders): Observable<boolean> {
    return NgxAtonBaseBackendInteractionClass.postObserveSaveFile<boolean>(
      this.serverName,
      'api/Shareholders/GetSendMail'
      , JSON.stringify(exampleData)
      , 'mail.eml'
      , true)
      .pipe(map((response: boolean) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }

  Notify(exampleData: NotifyShareholders): Observable<boolean> {
    return NgxAtonBaseBackendInteractionClass.postObserveBody<boolean>(
      this.serverName,
      'api/Shareholders/Notify'
      , JSON.stringify(exampleData)
      , true)
      .pipe(map((response: boolean) => {
        if (response) {
          return response;
        }
        return null;
      }));
  }
}


