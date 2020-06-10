import { Component, OnInit, ViewChild} from '@angular/core';
import { StockDataService } from 'src/app/stock-data.service';
import { StockFormat } from 'src/app/stock-format.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.page.html',
  styleUrls: ['./historic-data.page.scss'],
})
export class HistoricDataPage implements OnInit {
  displayedColumns: string[] = ['date', 'symbol', 'action', 'trigger', 'stopLoss', 'target'];
  dataSource: MatTableDataSource<StockFormat>;
  isLoading = false;
  historicData: StockFormat[];
  private historicDataSub : Subscription;
  paginator: MatPaginator;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }

  constructor(
    private stockDataService: StockDataService
  ) { }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource =   new MatTableDataSource();
    this.historicDataSub = this.stockDataService.stockData.subscribe(data =>{
      const todaysDate = new Date();
      this.historicData = data.filter(data => data.date.setHours(0,0,0,0) != todaysDate.setHours(0,0,0,0));
      this.dataSource.data = this.historicData;
    })
    console.log("HEre goes historic data in historic details page");
    console.log(this.historicData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  ionViewWillEnter(){
    this.isLoading = true;
    this.stockDataService.fetchData().subscribe(() => {
      this.isLoading = false;
    });    
  }

  ngOnDestroy() {
    if (this.historicDataSub) {
      this.historicDataSub.unsubscribe();
    }
  }

}
