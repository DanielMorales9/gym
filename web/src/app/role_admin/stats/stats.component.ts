import {Component, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Label} from 'ng2-charts';
import {StatsService} from '../../core/controllers';

@Component({
  templateUrl: './stats.component.html',
  styleUrls: ['../../styles/root.css', '../../styles/card.css']
})
export class StatsComponent implements OnInit {

  @ViewChild('pieChart', {static: true, read: BaseChartDirective})
  public pieChart: BaseChartDirective;

  @ViewChild('barChart', {static: true, read: BaseChartDirective})
  public barChart: BaseChartDirective;

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

  public barChartOptions: ChartOptions = {
    responsive: true
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [{data: []}];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartData: ChartDataSets[] = [{data: []}];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  totalPrice: number;
  amountPayed: number;
  intervalName: string;

  constructor(private statsService: StatsService) { }

  async ngOnInit(): Promise<void> {
    await this.update();
  }

  private async getSalesByMonths(interval?) {
    const [d, error] = await this.statsService.getSalesByMonths(interval);
    if (error) {
      throw error;
    }
    this.barChartLabels = d.map(v => v.month);
    this.barChartData = [
        {data: d.map(v => v.totalprice), label: 'Totale'},
      {data: d.map(v => v.amountpayed), label: 'Pagato'}
    ];
    this.barChart.datasets = this.barChartData;
    this.barChart.labels = this.barChartLabels;
    this.barChart.chart.update();
  }


  private async getSalesByBundleType(interval?) {

    const [d, error] = await this.statsService.getSalesByBundleType(interval);
    if (error) {
      throw error;
    }
    this.pieChartLabels.length = 0;
    this.pieChartLabels = d.map(v => this.BUNDLE_TYPE_NAME[v.bundletype]);
    this.pieChartData = [{data: d.map(v => v.totalprice), label: 'Totale'}];
    this.pieChart.datasets = this.pieChartData;
    this.pieChart.labels = this.pieChartLabels;
    this.pieChart.chart.update();

    this.totalPrice = d.map(v => v.totalprice).reduce((previousValue, currentValue) => previousValue + currentValue);
    this.amountPayed = d.map(v => v.amountpayed).reduce((previousValue, currentValue) => previousValue + currentValue);
  }

  async update(interval?: string) {
    if (!interval) {
      interval = '3 months';
    }
    this.intervalName = this.INTERVAL_NAME[interval];
    await this.getSalesByMonths(interval);
    await this.getSalesByBundleType(interval);
  }
}
