// importando appError para ser herdado
import { AppError } from '../app.error';

// exportando classe de error personalizado
export class AccountBlockedUserError extends AppError {
  constructor() {
    super('Your account is permanently blocked. Please contact support!', 401);
  }
}
