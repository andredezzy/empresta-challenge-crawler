import GovernmentEmployee, {
  EmployeeType,
} from '@modules/government_employees/infra/typeorm/models/GovernmentEmployee';

export default interface ICreateGovernmentEmployeeSearchLog {
  government_employees: GovernmentEmployee[];
  employee_types: EmployeeType[];
  superior_army_organ: string;
  army_organ: string;
  page: number;
  total_pages: number;
}
