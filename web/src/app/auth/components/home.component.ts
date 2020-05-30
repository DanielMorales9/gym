import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['../../styles/root.css', '../../styles/home.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {


}
