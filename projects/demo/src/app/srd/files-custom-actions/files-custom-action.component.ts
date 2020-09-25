import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BaseActionClass, Grid } from 'ng2-smart-table';
import { FileClass } from '../file-uploader/file-uploader.component';
import { HttpParams } from '@angular/common/http';
import { CorporateEvent } from '../srd-classes';

@Component({
  selector: 'app-test-custom-action',
  templateUrl: './files-custom-action.component.html',
  styleUrls: ['./files-custom-action.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FilesCustomActionComponent implements OnInit {
  @Input() row: CorporateEvent;
  @Input() grid: Grid;
  @Input() action: BaseActionClass;
  fileUploadParams: HttpParams;
  fileRemoveParams: HttpParams;
  serverName = 'SRDService';

  ngOnInit() {
    this.fileUploadParams = new HttpParams({
      fromObject: {
        companyId: this.row.accountingSystem.toString(),
        eventId: this.row.caEventId.toString()
      }
    });
    this.fileRemoveParams = new HttpParams({
      fromObject: {
        companyId: this.row.accountingSystem.toString()
      }
    });
  }

  fileUploaded(output: { result: FileClass, file: FileClass }) {
    output.file.id = output.result.id.toString();
    this.grid.source.updateField(this.row, 'cntAttachments', this.action.preInitResultData.length).then();
  }

  fileRemoved() {
    this.grid.source.updateField(this.row, 'cntAttachments', this.action.preInitResultData.length).then();
  }

}
