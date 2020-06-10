import { Component, OnInit } from '@angular/core';
import { StockDataService } from 'src/app/stock-data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  currentPortfolioValue: Number;
  currentPortfolioSign: String;
  portfolioValue: number;
  private portfolioValueSub : Subscription;
  isLoading: boolean = false;

  constructor(
    private stockDataService: StockDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.portfolioValueSub = this.stockDataService.portfolioValue.subscribe(data =>{
      this.portfolioValue = data
      this.checkPorfolioSign();
    })
    
  }

  onNavigateHome(){
    this.router.navigateByUrl('/home');
  }

  ionViewWillEnter(){
    this.isLoading = true;
    this.stockDataService.getCurrentPortfolioValue().subscribe(() => {
      this.isLoading = false;
      this.checkPorfolioSign();
    });  
  }

  checkPorfolioSign(){
    this.currentPortfolioSign = (Number(this.portfolioValue) > 0) ? 'success' : 'danger' ;
  }

  ngOnDestroy() {
    if (this.portfolioValueSub) {
      this.portfolioValueSub.unsubscribe();
    }
  }

}
