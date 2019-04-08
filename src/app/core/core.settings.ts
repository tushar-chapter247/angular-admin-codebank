import { environment } from '../../environments/environment';

export class CoreAppSettings {
  static env = environment.production; // if production, true else false;
  public static API_ENDPOINT = CoreAppSettings.env
    ? 'http://localhost:3001/api/'
    : 'http://localhost:3001/api/';

  /* Configuration for data */
  public static authId = 'id'; // local storage key for access token
  public static TABLE_LIMIT = 50;
  public static IMAGE_URL = 'https://unsplash.co';
}
