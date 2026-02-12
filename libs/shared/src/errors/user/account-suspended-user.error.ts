// importando appError para ser herdado
import { AppError } from '../app.error';

// exportando classe de error personalizado
export class AccountSuspendedUserError extends AppError {
  constructor() {
    super('Your account is temporarily blocked. Please contact support!', 401);
  }
}
