import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {StatsService} from '../../core/controllers';
import {first} from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import {ActivatedRoute} from '@angular/router';


function insertAt(array, index, ...elementsArray) {
  array.splice(index, 0, ...elementsArray);
}


@Component({
  templateUrl: './customer-stats.component.html',
  styleUrls: ['../../styles/root.css', '../../styles/card.css']
})
export class CustomerStatsComponent implements OnInit {

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
              private route: ActivatedRoute) { }


  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');

    const params = this.route.snapshot.queryParamMap.get('id');
    this.id = params || this.id;
    await this.update();
  }

  private async getCustomerReservationsByWeek(interval, id) {

    const [d, error] = await this.statsService.getCustomerReservationsByWeek(id, interval);
    if (error) {
      throw error;
    }
    if (!d) {
      return;
    }
    this.lineChartLabels.length = 0;
    // tslint:disable-next-line:radix
    // this.lineChartLabels
    const labels  = d.map(v => parseInt(v.week, undefined))
        .filter((v, i, a) => a.indexOf(v) === i);
    labels.sort((a, b) => a.week - b.week);
    this.lineChartLabels = labels.map(v => 'Sett. ' + v);
    this.lineChartData = [];

    for (const key in this.BUNDLE_TYPE_NAME) {

      let data = d.filter(v => v.type === key);
      data.forEach(v => v.week = parseInt(v.week, undefined));
      const labels_dict = {};

      data = data.map(v => labels_dict[v.week] = v.numreservations);

      for (let i = 0; i < labels.length; i++) {
        if (!labels_dict[labels[i]]) {
          labels_dict[labels[i]] = 0;
        }
      }

      data = labels.map(v => labels_dict[v]);
      this.lineChartData.push({data: data, label: this.BUNDLE_TYPE_NAME[key], stack: '1'});
    }

    this.lineChart.datasets = this.lineChartData;
    this.lineChart.labels = this.lineChartLabels;
    this.lineChart.chart.update();
  }

  async update(interval?: string) {
    if (!interval) {
      interval = '3 months';
    }
    this.intervalName = this.INTERVAL_NAME[interval];
    await this.getCustomerReservationsByWeek(interval, this.id);
  }
}
