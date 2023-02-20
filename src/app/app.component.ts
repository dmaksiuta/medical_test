import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ItemService } from './itemservice';
import { Item } from './item';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  public _selectedColumns: any[] = [];
  public items!: Item[];
  public cols: any[] = [];
  public filterCol: any[] = [
    'mnn_id',
    'num',
    'name',
    'release_form',
    'dosage',
    'unit',
    'multiplicity',
    'subtype',
  ];
  private myData = {
    mnn_id: 2023,
    subtype: 'front-end developer',
    num: 0,
    name: 'Dmytro Maksiuta',
    release_form: 'ампули, флакони, шприци',
    dosage: '50 мг',
    unit: 'ампули, флакони, шприци',
    multiplicity: 1,
  };

  public first = 0;

  public rows = 10;

  constructor(private itemService: ItemService) {}

  ngOnInit() {
    this.itemService.getCustomersLarge().then((items) => (this.items = items));
    this.cols = [
      { field: 'mnn_id', header: 'Ідентифікатор МНН ' },
      { field: 'num', header: '# позиції номенклатури' },
      { field: 'name', header: 'МНН' },
      { field: 'release_form', header: 'Форма випуску' },
      { field: 'dosage', header: 'Дозування' },
      { field: 'unit', header: 'Одиниці виміру' },
      { field: 'multiplicity', header: 'Численність' },
      { field: 'subtype', header: 'Піднапрям' },
    ];
    this._selectedColumns = this.cols;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.items);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'product');
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }
  next() {
    this.first = this.first + this.rows;
  }

  create() {
    this.itemService
      .send('maksiuta')
      .subscribe((here) => {

		this.items.unshift(this.myData)
		console.log(this.items);
	  });
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.items ? this.first === this.items.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.items ? this.first === 0 : true;
  }
}
