

export interface Project {

    projectName: string;
    role: string;
    description?: string;
    projectDetails: string[];
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    current: boolean;
    link?:string;

}