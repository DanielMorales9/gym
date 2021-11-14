export interface Policy {

    getName(): string;

}

export interface CanDelete extends Policy {

    canDelete(): boolean;

}

export interface CanEdit extends Policy {

    canEdit(): boolean;

}
