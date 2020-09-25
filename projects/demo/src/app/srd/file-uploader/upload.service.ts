import { Injectable } from '@angular/core';
import { NgxAtonBaseBackendInteractionClass } from 'ngx-aton-base-library';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor() {}

  sendFiles(file: File, server: string, url: string, params: HttpParams): Observable<any> {
    return NgxAtonBaseBackendInteractionClass.postObserveFile<boolean>(server, url, file, true, params)
      .pipe(map((response: boolean) => response));
  }

  removeFile(server: string, url: string, params: HttpParams): Observable<boolean> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<boolean>(server, url, true, params)
      .pipe(map((response: boolean) => response));
  }

  getFiles(server: string, url: string, params: HttpParams): Observable<any> {
    return NgxAtonBaseBackendInteractionClass.getObserveBody<boolean>(server, url, false, params)
      .pipe(map((response: boolean) => response));
  }
}
