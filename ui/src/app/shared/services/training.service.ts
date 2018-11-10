import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'

@Injectable()
export class TrainingService {

    constructor(private http: HttpClient) {}

    check(date: Date, id: number,  success: (res) => void, error: (error) => void) {
        let dateString = TrainingService.getDateString(date);
        this.http.get("/reservations/checkAvailabilityAndEnablement?date=" + dateString + "&id=" + id).subscribe(success, error)
    }

    book(date: Date, id: number, success: (res) => void, error: (error) => void) {
        let dateString = TrainingService.getDateString(date);
        this.http.get("/reservations/book/"+id+"?date=" + dateString).subscribe(success, error)
    }

    private static getDateString(date: Date) {
        return date.getUTCDate() + "-" + (date.getUTCMonth() + 1) + "-"
            + date.getUTCFullYear() + "_" + date.getUTCHours() + ":" + date.getUTCMinutes();
    }

    getReservations(startDay: Date, success: (res) => void, error: (err) => void, id?: number, endDay?: Date) {
        let endpoint = "/reservations?";
        if (id)
            endpoint += "id="+id + "&";
        endpoint += "startDay="+TrainingService.getDateString(startDay) + "&";
        endpoint += "endDay="+ TrainingService.getDateString(endDay);
        this.http.get(endpoint).subscribe(success, error);
    }

    delete(id: any, success: (res) => any, error: (err) => any) {
        this.http.delete("/reservations/"+id).subscribe(success, error);
    }

    confirm(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/reservations/confirm/"+id).subscribe(success, error)
    }

    complete(id: any, success: (res) => void, error: (err) => void) {
        this.http.get("/reservations/complete/"+id).subscribe(success, error)
    }
}