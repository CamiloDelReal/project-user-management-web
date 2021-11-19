import { Pipe, PipeTransform } from '@angular/core';
import {Role} from "../services/models/role";

@Pipe({
  name: 'roles'
})
export class RolesPipe implements PipeTransform {

  transform(value: Role[] | null, ...args: unknown[]): unknown {
    if(value != null) {
      return value.map((r) => r.name).join(', ');
    } else {
      return 'Error';
    }
  }

}
