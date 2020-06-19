import {Workout} from './bundle.class';

export class Session {
    id: number;
    completed: boolean;
    deletable: boolean;
    endTime: Date;
    startTime: Date;
    type: string;
    workouts: Workout[];
}
