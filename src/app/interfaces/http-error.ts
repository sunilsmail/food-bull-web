
import { ErrorType } from 'src/app/shared/app-interfaces';
export interface HttpError {
  headers: any;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: any;
}
