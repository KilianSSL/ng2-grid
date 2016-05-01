import {Component, Input} from 'angular2/core';
import {GridOptions} from './grid-options';
import * as _ from 'underscore';

@Component({
  selector: 'ng-grid',
  template: `
    <div class="ng-grid">
      <div class="ng-grid-header" [style.width]="options.width" \n\
          [class.scroll]="options.height">
        <table [style.width]="options.width">
          <thead>
            <tr>
              <th *ngFor="let field of options.fields"
                  [style.width]="field.width" [attr.data-id]="field.name"
                  (click)="_sortClick($event)">
                {{_renderHeading(field)}}
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="ng-grid-body" [style.width]="options.width" \n\
          [class.scroll]="options.height" [style.height]="options.height">
        <table class="table" [style.width]="options.width">
          <tbody>
            <tr *ngFor="let row of options.data">
              <td *ngFor="let field of options.fields" [style.width]="field.width">
                {{_renderCell(field, row)}}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="ng-grid-footer">
      </div>
    </div>`
})
export class Grid {
  @Input() options: GridOptions;

  private _orderBy: string;
  private _orderByType: string = Grid.ORDER_TYPE_ASC;

  static ORDER_TYPE_ASC: string = 'asc';
  static ORDER_TYPE_DESC: string = 'desc';

  ngOnInit() {
    if (this.options.fields.length == 0 && this.options.data.length > 0) {
      this.options.fields = new Array<any>();
      for (let column in this.options.data[0]) {
        this.options.fields.push({name: column});
      }
    }
  }

  sort(field) {
    this._orderBy = field;
    console.log(this._orderByType);
    console.log(this._orderBy);
    this.options.data = this._orderByType == Grid.ORDER_TYPE_ASC ?
      _.chain(this.options.data).sortBy(this._orderBy).value() :
      _.chain(this.options.data).sortBy(this._orderBy).reverse().value();
  }

  private _sortClick(event) {
    let element = <HTMLElement>event.target;
    let field = element.getAttribute('data-id');

    this._orderByType = this._getSortOrderByType(field);

    this.sort(field);
  }

  private _getSortOrderByType(field: string): string {
    return field != this._orderBy ? this._orderByType :
      (this._orderByType == Grid.ORDER_TYPE_ASC ?
        Grid.ORDER_TYPE_DESC : Grid.ORDER_TYPE_ASC);
  }

  private _renderHeading(field: any): string {
    return field.heading ? field.heading : field.name;
  }

  private _renderCell(field: any, row: any): string {
    let value = this._readProperty(row, field.name);

    return value;
  }

  private _readProperty(object: any, property: string): any {
    if (typeof object === 'undefined') {
      return false;
    }

    var _index = property.indexOf('.');

    if(_index > -1) {
      return this._readProperty(
        object[property.substring(0, _index)],
        property.substr(_index + 1)
      );
    }

    return object[property];
  }
}