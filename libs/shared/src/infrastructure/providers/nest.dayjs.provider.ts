// importando classe abstrata a ser implementada nesta classe
import { DayJsProvider } from '@app/shared/application/providers/dayjs.provider';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando dayjs para a manipulação de datas
import { ManipulateType } from 'dayjs';
import dayjs from 'dayjs';

@Injectable()
export class NestDayJsProvider implements DayJsProvider {
  add(value: number, date: ManipulateType): Date {
    return dayjs().add(value, date).toDate();
  }
}
