import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgxAtonBaseConstant, NgxAtonBaseDialogTemplateClass, NgxAtonBaseDialogTemplateComponent } from 'ngx-aton-base-library';
import { UploadService } from './upload.service';
import { HttpParams } from '@angular/common/http';

export class FileClass {
  fileDom: File;
  fileName: string;
  content: any;
  isLoading?: boolean;
  loadedOnServer: boolean;
  addInfo = false;
  id?: string;
}

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnDestroy {
  @Input() addTypeName: string;
  @Input() disabled: boolean;
  @Input() fileTypeLimitation: string[];
  @Input() server: string;
  @Input() loadUrl?: string;
  @Input() removeUrl?: string;
  @Input() getUrl: string;
  @Input() loadParams: HttpParams;
  @Input() removeParams: HttpParams;
  @Input() files: FileClass[];
  @Input() waitResult: boolean;
  @Output() filesChange = new EventEmitter<FileClass[]>();
  @Output() uploadResult = new EventEmitter<{ result: any, file: FileClass }>();
  @Output() removeResult = new EventEmitter<string>();

  private readonly destroy: Subject<boolean>;

  constructor(private formBuilder: FormBuilder,
              public uploadService: UploadService
  ) {
    this.files = [];
    this.destroy = new Subject<boolean>();
  }

  public onFileInput($event: DataTransfer | EventTarget) {
    const files = ($event as DataTransfer).files;
    let allGood = true;
    for (const file of Array.from(files)) {
      if (file.name.split('.').length <= 1 ||
        this.fileTypeLimitation.length && !this.fileTypeLimitation.includes(file.name
          .split('.')[file.name.split('.').length - 1].toLowerCase())) {
        allGood = false;
        NgxAtonBaseConstant.openDialog(
          new NgxAtonBaseDialogTemplateClass(
            'Ошибка',
            `<p class="text-left">Поддерживаются только файлы типов: <br>${ this.fileTypeLimitation.join(',') }</p>`,
            'Понятно!'),
          NgxAtonBaseDialogTemplateComponent);
        return;
      }
    }
    if (files && files.length) {
      const fileForLoad = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.readAsBinaryString(files[i]);
        reader.onloadend = () => {
          const fl = { fileName: files[i].name, content: reader.result, loadedOnServer: false, fileDom: files[i], addInfo: false };
          fileForLoad.push(fl);
          this.files.push(fl);
          if (i === files.length - 1) {
            this.upload(fileForLoad);
          }
        };
      }
    }
  }

  public upload(fileForUpload?): void {
    if (fileForUpload) {
      (fileForUpload.length ? fileForUpload : [fileForUpload]).forEach((file: FileClass) => {
        file.isLoading = true;
        this.uploadService.sendFiles(file.fileDom, this.server, this.loadUrl, this.loadParams)
          .subscribe((result) => {
            file.isLoading = false;
            if (result) {
              file.loadedOnServer = true;
              this.uploadResult.next({ result, file });
            } else {
              NgxAtonBaseConstant.openDialog(
                new NgxAtonBaseDialogTemplateClass(
                  'Внимание!',
                  `<p class="text-center">Ошибка при попытке загрузить файл.`,
                  'Ок'),
                NgxAtonBaseDialogTemplateComponent,
                {});
            }
          });
      });
    }
  }

  public deleteAttachment(file: FileClass) {
    if (!file.isLoading) {
      if (!file.loadedOnServer) {
        this.files.splice(this.files.indexOf(file), 1);
      } else {
        file.isLoading = true;
        this.removeParams = this.removeParams.set('id', file.id);
        this.uploadService.removeFile(this.server, this.removeUrl, this.removeParams)
          .subscribe((result) => {
            file.isLoading = false;
            if (result) {
              this.files.splice(this.files.indexOf(file), 1);
              this.removeResult.next(file.id);
            } else {
              NgxAtonBaseConstant.openDialog(
                new NgxAtonBaseDialogTemplateClass(
                  'Внимание!',
                  `<p class="text-center">Ошибка при попытке удалить файл.`,
                  'Ок'),
                NgxAtonBaseDialogTemplateComponent,
                {});
            }
          });
      }
    }
  }

  ngOnDestroy(): void {
    NgxAtonBaseConstant.autoDestroy([this.destroy]);
  }
}
