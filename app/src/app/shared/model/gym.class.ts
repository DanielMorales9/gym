export interface Gym {
    id: number;
    name: string;
    dayStartHour: number;
    dayEndHour: number;
    excludeDays: number[];
    weekStartsOn: number;
}
