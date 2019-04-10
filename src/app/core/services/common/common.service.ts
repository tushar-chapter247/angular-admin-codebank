import { Injectable } from '@angular/core';
import { CoreAppSettings } from '../../core.settings';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

interface IData {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private API: string = CoreAppSettings.API_ENDPOINT;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  // SLUGIFY A STRING
  createSlugFromString(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  // Convert dataURI to Blob so large images do not crash the browser
  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const dataView = new DataView(arrayBuffer);
    const blob = new Blob([dataView], { type: mimeString });
    return blob;
  }

  // CREATE PARAMS URL BY PASSING OBJECT
  formUrlParam(url: string, data: IData) {
    let queryString = '';
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (!queryString) {
          queryString = `?${key}=${data[key]}`;
        } else {
          queryString += `&${key}=${data[key]}`;
        }
      }
    }
    return url + queryString;
  }

  // FETCH DATA FROM SERVER USING HTTP GET
  get(url: string, params?: IData): Observable<HttpResponse<object>> {
    let endPoint: string;
    if (params) {
      endPoint = this.API + this.formUrlParam(url, params);
    } else {
      endPoint = this.API + url;
    }

    // Default 'body' of response, get full response using observe
    return this.http.get(endPoint, { observe: 'response' });
  }

  // CREATE NEW RECORD ON SERVER BY USING HTTP POST
  post(url: string, data: IData, params?: IData): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        access_token: localStorage.getItem(CoreAppSettings.authId)
          ? localStorage.getItem(CoreAppSettings.authId)
          : '',
      }),
    };

    let endPoint: string;
    if (params) {
      endPoint = this.API + this.formUrlParam(url, params);
    } else {
      endPoint = this.API + url;
    }

    return this.http.post(endPoint, data, options);
  }

  // BYPASS ANGULAR SECURITY FOR UNTRUSTED URL
  trustAsDataURI(url: string) {
    try {
      return this.sanitizer.bypassSecurityTrustUrl(url);
    } catch (error) {
      return url;
    }
  }
}
