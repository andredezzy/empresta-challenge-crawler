import GovernmentEmployee from "@modules/government_employees/infra/typeorm/models/GovernmentEmployee";

export default interface ICreateGovernmentEmployeeSearchLog {
  government_employees: GovernmentEmployee[];
}
