import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {BaseChartDirective, Color, Label} from 'ng2-charts';
import {StatsService} from '../../core/controllers';
import {map, takeUntil} from 'rxjs/operators';
import {BaseComponent} from '../../shared/base-component';
import {forkJoin} from 'rxjs';
import {feedChart, padding} from '../../shared/stats';

function insertAt(array, index, ...elementsArray) {
    array.splice(index, 0, ...elementsArray);
}


@Component({
    templateUrl: './stats.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/card.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsComponent extends BaseComponent implements OnInit {

    @ViewChild('pieChart', {static: true, read: BaseChartDirective})
    public pieChart: BaseChartDirective;

    @ViewChild('barChart', {static: true, read: BaseChartDirective})
    public barChart: BaseChartDirective;

    @ViewChild('lineChart', {static: true, read: BaseChartDirective})
    public lineChart: BaseChartDirective;

    @ViewChild('barChartDay', {static: true, read: BaseChartDirective})
    public barChartDay: BaseChartDirective;

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

    private MONTHS_OF_YEAR = {
        'January': 0,
        'February': 1,
        'March': 2,
        'April': 3,
        'May': 4,
        'June': 5,
        'July': 6,
        'August': 8,
        'September': 9,
        'October': 10,
        'November': 11,
        'December': 12,
    };

    private MONTHS_IDX = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    public barChartOptions: ChartOptions = {
        responsive: true
    };
    public barChartLabels: Label[] = [];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartData: ChartDataSets[] = [{data: []}];
    public barChartDayOptions: ChartOptions = {
        responsive: true,
        scales: {
            yAxes: [
                {
                    stacked: true,
                }
            ]
        }
    };
    public barChartDayLabels: Label[] = [];
    public barChartDayType: ChartType = 'bar';
    public barChartDayLegend = true;
    public barChartDayData: ChartDataSets[] = [{data: []}];

    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    return ctx.chart.data.labels[ctx.dataIndex];
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

    totalPrice: number;
    amountPayed: number;
    intervalName: string;

    constructor(private statsService: StatsService) {
        super();
    }


    ngOnInit(): void {
        this.updateCharts();
    }

    private getSalesByMonths(interval?) {
        return this.statsService.getSalesByMonths(interval)
            .pipe(map(d => {
                const data = padding(d,
                    'month',
                    this.MONTHS_OF_YEAR,
                    this.MONTHS_IDX,
                    { totalprice: 0, amountpayed: 0 });
                this.barChartLabels = data.map(v => v.month);

                this.barChartData = [
                    {data: d.map(v => v.totalprice), label: 'Totale'},
                    {data: d.map(v => v.amountpayed), label: 'Pagato'}
                ];
                this.barChart.datasets = this.barChartData;
                this.barChart.labels = this.barChartLabels;
                this.barChart.chart.update();
            }));
    }

    private getSalesByBundleType(interval?) {

        return this.statsService.getSalesByBundleType(interval)
            .pipe(takeUntil(this.unsubscribe$),
                map(d => {
                    this.pieChartLabels.length = 0;
                    this.pieChartLabels = d.map(v => this.BUNDLE_TYPE_NAME[v.bundletype]);
                    this.pieChartData = [{data: d.map(v => v.totalprice), label: 'Totale'}];
                    this.pieChart.datasets = this.pieChartData;
                    this.pieChart.labels = this.pieChartLabels;
                    this.pieChart.chart.update();

                    const prices = d.map(v => v.totalprice) || [];
                    const amounts = d.map(v => v.amountpayed) || [];
                    if (prices.length > 0) {
                        this.totalPrice = prices.reduce((previousValue, currentValue) => previousValue + currentValue);
                    }
                    else {
                        this.totalPrice = 0;
                    }

                    if (amounts.length > 0) {
                        this.amountPayed = amounts.reduce((previousValue, currentValue) => previousValue + currentValue);
                    }
                    else {
                        this.amountPayed = 0;
                    }
                }));
    }

    private getReservationsByWeek(interval?) {

        return this.statsService.getReservationsByWeek(interval)
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

    private getReservationsByDayOfWeek(interval?) {
        return this.statsService.getReservationsByDayOfWeek(interval)
            .pipe(map((d: any) => {
                this.barChartDayLabels.length = 0;
                let labels = d.map(v => v.dayofweek)
                    .filter((v, i, a) => a.indexOf(v) === i);
                labels.sort();
                labels = labels.map(v => this.DAY_OF_WEEK_NAME[v]);
                this.barChartDayLabels = labels;

                this.barChartDayData = [];
                for (const key in this.BUNDLE_TYPE_NAME) {
                    const data = d.filter(v => v.type === key).map(v => v.numreservations);
                    this.barChartDayData.push({data: data, label: this.BUNDLE_TYPE_NAME[key], stack: '1'});
                }
                this.barChartDay.datasets = this.barChartDayData;
                this.barChartDay.labels = this.barChartDayLabels;
                this.barChartDay.chart.update();
            }));
    }

    updateCharts(interval?: string) {
        if (!interval) {
            interval = '3 months';
        }
        this.intervalName = this.INTERVAL_NAME[interval];
        const o = [];
        o.push(this.getSalesByMonths(interval));
        o.push(this.getSalesByBundleType(interval));
        o.push(this.getReservationsByWeek(interval));
        o.push(this.getReservationsByDayOfWeek(interval));
        forkJoin(o).pipe(takeUntil(this.unsubscribe$)).subscribe(v => v);
    }
}
