import ICreateGovernmentEmployeeSearchLog from '../dtos/ICreateGovernmentEmployeeSearchLog';
import GovernmentEmployeeSearchLog from '../infra/typeorm/schemas/GovernmentEmployeeSearchLog';

export default interface IGovernmentEmployeeSearchLogsRepository {
  create(
    data: ICreateGovernmentEmployeeSearchLog,
  ): Promise<GovernmentEmployeeSearchLog>;
}
