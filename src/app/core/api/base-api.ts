import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApi {
  protected readonly baseUrl = environment.apiBaseUrl;

  /** API path for the service. Must start with '/'. */
  protected abstract readonly apiPath: string;

  protected get apiUrl(): string {
    return `${this.baseUrl}${this.apiPath}`;
  }
}
