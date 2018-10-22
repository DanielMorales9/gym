import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    check(date: Date, id: number,  success: (res) => void, error: (error) => void) {
        let dateString = TimesOffService.getDateString(date);
        this.http.get("/timesOff/checkAvailabilityAndEnablement?day=" + dateString)
            .subscribe(success, error)
    }

    book(date: Date, name: string, id: number, success: (res) => void, error: (error) => void) {
        let dateString = TimesOffService.getDateString(date);
        this.http.get("/timesOff/book/"+id+"?name="+name+"&date=" + dateString).subscribe(success, error)
    }

    private static getDateString(date: Date, hour:boolean = false) {
        let dateString = date.getDate() + "-" + (date.getMonth() + 1) + "-"
            + date.getFullYear();
        if (hour) {dateString += "_"+date.getHours()+":"+date.getMinutes();}
        return dateString;
    }

    getTimesOff(startDay: Date, success: (res) => void, error: (err) => void, id?: number, endDay?: Date) {
        let endpoint = "/timesOff?";
        if (id)
            endpoint += "id="+id + "&";
        endpoint += "startDay="+TimesOffService.getDateString(startDay, true) + "&";
        endpoint += "endDay="+ TimesOffService.getDateString(endDay, true);
        this.http.get(endpoint).subscribe(success, error);
    }

    delete(id: any, success: (res) => any, error: (err) => any) {
        this.http.delete("/timesOff/"+id).subscribe(success, error);
    }
/*

    confirm(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/timesOff/confirm/"+id).subscribe(success, error)
    }
*/
/*

    complete(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/reservations/complete/"+id).subscribe(success, error)
    }
*/
}