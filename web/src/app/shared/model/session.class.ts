import {Bundle} from './bundle.class';
import {Workout} from './workout';

export class Session {
    id: number;
    completed: boolean;
    deletable: boolean;
    endTime: Date;
    startTime: Date;
    type: string;
    workouts: Workout[];
    bundle: Bundle;
}
