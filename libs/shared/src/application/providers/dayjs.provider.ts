// importando dayjs para manipulação de datas
import dayjs from 'dayjs';

// exportando classe abstrata a ser implementada
export abstract class DayJsProvider {
  abstract add(value: number, date: dayjs.ManipulateType): Date;
}
