import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Workout} from '../../shared/model';
import {DataSourceService} from './data-source.service';

@Injectable()
export class WorkoutService extends DataSourceService {

    constructor(private http: HttpClient) {
        super();
    }

    get(page: number, size: number): Observable<Object> {
        return this.http.get(`/workouts?page=${page}&size=${size}&sort=name`);
    }


    patch(workout: Workout): Observable<Object> {
        return this.http.patch(`/workouts/${workout.id}`, workout);
    }

    post(workout: Workout): Observable<Object> {
        return this.http.post('/workouts', workout);
    }


    search(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = ['createdAt,desc', 'name,asc'];
        return this.http.get('/workouts/search', {params: query});
    }

    delete(id: number) {
        return this.http.delete(`/workouts/${id}`);
    }

    findById(id: number): any {
        return this.http.get(`/workouts/${id}`);
    }

    getTags(): any {
        return this.http.get(`/workouts/tags`);
    }

    assign(id: string, workoutId: any) {
        return this.http.get(`/workouts/${workoutId}/assign`, {params: {
                eventId: id
            }});
    }

    deleteFromEvent(eventId: any, wId: any) {
        return this.http.delete(`/workouts/${wId}/remove`, {params: {
                eventId: eventId
        }});
    }
}
