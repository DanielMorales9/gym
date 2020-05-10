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

    search(query: any, page: number, size: number): Observable<Object> {
        query['page'] = page;
        query['size'] = size;
        query['sort'] = ['createdAt,desc', 'name,asc'];
        return this.http.get('/workouts/search', {params: query});
    }

    patchWorkout(workout: Workout): Observable<Object> {
        return this.http.patch(`/workouts/${workout.id}`, workout);
    }

    postWorkout(workout: Workout): Observable<Object> {
        return this.http.post('/workouts', workout);
    }

    deleteWorkout(id: number) {
        return this.http.delete(`/workouts/${id}`);
    }

    findWorkoutById(id: number): any {
        return this.http.get(`/workouts/${id}`);
    }

    getWorkoutTags(): any {
        return this.http.get(`/workouts/tags`);
    }

    assignWorkout(id: string, workoutId: any) {
        return this.http.get(`/workouts/${workoutId}/assign`, {params: {
                eventId: id
            }});
    }

    deleteWorkoutFromEvent(eventId: any, wId: any) {
        return this.http.delete(`/workouts/${wId}/remove`, {params: {
                eventId: eventId
        }});
    }
}
