import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Item } from './item';

@Injectable()
export class ItemService {
  constructor(private http: HttpClient) {}
  getCustomersLarge() {
    return lastValueFrom(
      this.http.get<Item[]>(
        'https://api.medzakupivli.com/appellation/type/?hash=8f7d225ffda84d9a143ca8c9868779a95cc9b033'
      )
    );
  }
  send(name: any) {
    return this.http.get<Item>(`https://api.medzakupivli.com/inbound_logistics/angular/?name=${name}`)
    .pipe(
      catchError(val => of(`I caught: ${val}`))
    );
  }
  handleError(text: string, item:any) {
	return console.log();
  }
}
