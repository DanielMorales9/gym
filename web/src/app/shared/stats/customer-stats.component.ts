import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {StatsService} from '../../core/controllers';
import {map, takeUntil} from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import {ActivatedRoute} from '@angular/router';
import {BaseComponent} from '../base-component';
import {AuthenticationService} from '../../core/authentication';
import {feedChart} from './padding';
import {of} from 'rxjs';


function insertAt(array, index, ...elementsArray) {
  array.splice(index, 0, ...elementsArray);
}


@Component({
  templateUrl: './customer-stats.component.html',
  styleUrls: ['../../styles/root.css', '../../styles/card.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerStatsComponent extends BaseComponent implements OnInit {

  @ViewChild('lineChart', {static: true, read: BaseChartDirective})
  public lineChart: BaseChartDirective;


  private BUNDLE_TYPE_NAME = {
    'P': 'Allenamento Personalizzato',
    'C': 'Corsi'
  };

  private INTERVAL_NAME = {
    '1 week': '1 Settimana',
    '1 month': '1 Mese',
    '3 months': '3 Mesi',
    '6 months': '6 Mesi',
    '1 year': '1 Anno'
  };

  private DAY_OF_WEEK_NAME = {
    1: 'Lunedì',
    2: 'Martedì',
    3: 'Mercoledì',
    4: 'Giovedì',
    5: 'Venerdì',
    6: 'Sabato',
    0: 'Domenica',
  };

  public id: any;
  public lineChartData: ChartDataSets[] = [{data: []}];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          stacked: true,
        }
      ]
    }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  intervalName: string;

  constructor(private statsService: StatsService,
              private authService: AuthenticationService,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute) {
    super();
  }


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || this.route.snapshot.queryParamMap.get('id');

    let ob;
    if (!this.id) {
      ob = this.authService.getObservableUser()
          .pipe(
              takeUntil(this.unsubscribe$),
              map(v => {
                this.id = v.id;
                return this.id;
              }));
    }
    else {
      ob = of(this.id);
    }

    ob.subscribe(v => this.update());
  }

  private getCustomerReservationsByWeek(interval, id) {

    return this.statsService.getCustomerReservationsByWeek(id, interval)
        .pipe(map(d => {
          this.lineChartLabels.length = 0;
          const [lineChartData, lineChartLabels] = feedChart(d, this.BUNDLE_TYPE_NAME);
          this.lineChartLabels = lineChartLabels;
          this.lineChartData = lineChartData;
          this.lineChart.datasets = lineChartData;
          this.lineChart.labels = lineChartLabels;
          this.lineChart.chart.update();
        }));
  }

  update(interval?: string) {
    if (!interval) {
      interval = '3 months';
    }
    this.intervalName = this.INTERVAL_NAME[interval];
    this.getCustomerReservationsByWeek(interval, this.id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(v => {
          this.cdr.detectChanges();
        });
  }
}
