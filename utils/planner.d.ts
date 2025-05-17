export interface PlannerContract {
  planNextSteps(state: any): Promise<any>;
}