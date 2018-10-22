import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'

@Injectable()
export class TimesOffService {

    constructor(private http: HttpClient) {}

    check(startTime: Date, endTime: Date, id: number,  success: (res) => void, error: (error) => void) {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        this.http.get("/timesOff/checkAvailabilityAndEnablement?startTime="
            + startTimeString + "&endTime=" + endTimeString)
            .subscribe(success, error)
    }

    book(startTime: Date, endTime: Date, name: string, id: number,
         success: (res) => void, error: (error) => void) {
        let startTimeString = TimesOffService.getDateString(startTime);
        let endTimeString = TimesOffService.getDateString(endTime);
        this.http.get("/timesOff/book/"+id+"?name="+name
            +"&startTime="+startTimeString+"&endTime="+endTimeString).subscribe(success, error)
    }

    private static getDateString(date: Date) {
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-"
            + date.getUTCFullYear() + "_" +
            date.getUTCHours() + ":" + date.getUTCMinutes();
    }

    getTimesOff(startDay: Date, success: (res) => void, error: (err) => void, id?: number, endDay?: Date) {
        let endpoint = "/timesOff?";
        if (id)
            endpoint += "id="+id + "&";
        endpoint += "startTime="+TimesOffService.getDateString(startDay) + "&";
        endpoint += "endTime="+ TimesOffService.getDateString(endDay);
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