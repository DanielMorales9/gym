import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {AppService} from './app.service';

@Injectable()
export class ScreenService {

    isDesktop() {
        let screenWidth = window.innerWidth;
        window.onresize = (_) => {
            screenWidth = window.innerWidth;
        };
        return screenWidth >= 599;
    }
}
