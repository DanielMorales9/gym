import {Injectable} from '@angular/core';

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
