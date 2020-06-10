import { Component, OnInit, ViewChild  } from '@angular/core';
import { Router } from '@angular/router';
import { StockFormat } from 'src/app/stock-format.model';
import { Subscription } from 'rxjs';
import { StockDataService } from 'src/app/stock-data.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Plugins, NetworkStatus } from '@capacitor/core';


@Component({
  selector: 'app-trade-calls',
  templateUrl: './trade-calls.page.html',
  styleUrls: ['./trade-calls.page.scss'],
})
export class TradeCallsPage implements OnInit {
  displayedColumns: string[] = ['symbol', 'trigger', 'stopLoss', 'target', 'action'];
  dataSource: MatTableDataSource<StockFormat>;
  isLoading = false;
  todaysData: StockFormat[];
  private todaysDataSub : Subscription;
  paginator: MatPaginator;

  status: NetworkStatus;
  listener: any;

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
    }


  constructor(
    private stockDataService: StockDataService,
    private router: Router
  ) { }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource =   new MatTableDataSource();
    this.todaysDataSub = this.stockDataService.todaysData.subscribe(data =>{
      this.todaysData = data
      this.dataSource.data = data;
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    }

  onNavigateHome(){
    this.router.navigateByUrl('/home');
  }

  
  ionViewWillEnter(){
    this.isLoading = true;
    this.stockDataService.fetchTodaysData.subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.todaysDataSub) {
      this.todaysDataSub.unsubscribe();
    }
  }


}
