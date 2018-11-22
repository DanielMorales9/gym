import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    check(startTime: Date, endTime: Date, type: string, id: number,  success: (res) => void, error: (error) => void) {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        this.http.get("/timesOff/checkAvailabilityAndEnablement?startTime="
            + startTimeString + "&endTime=" + endTimeString+"&type="+type)
            .subscribe(success, error)
    }

    book(startTime: Date, endTime: Date, type: string, name: string, id: number,
         success: (res) => void, error: (error) => void) {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        this.http.get("/timesOff/book/"+id+"?name="+name
            +"&startTime="+startTimeString+"&endTime="+endTimeString+"&type="+type).subscribe(success, error)
    }

    private static getDateString(date: Date) {
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-"
            + date.getUTCFullYear() + "_" +
            date.getUTCHours() + ":" + date.getUTCMinutes();
    }

    getTimesOff(startDay: Date, endDay: Date, success: (res) => void, error: (err) => void,
                id?: number,
                type?: string,) {
        let endpoint = "/timesOff?";
        if (id)
            endpoint += "id="+id + "&";
        endpoint += "startTime="+TimesOffService.getDateString(startDay) + "&";
        endpoint += "endTime="+ TimesOffService.getDateString(endDay);
        if (type)
            endpoint += "&type="+type;
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