import { ObjectID } from 'mongodb';

import ICreateGovernmentEmployeeSearchLog from '../dtos/ICreateGovernmentEmployeeSearchLog';
import GovernmentEmployeeSearchLog from '../infra/typeorm/schemas/GovernmentEmployeeSearchLog';

export default interface IGovernmentEmployeeSearchLogsRepository {
  findById(id: ObjectID): Promise<GovernmentEmployeeSearchLog | undefined>;
  create(
    data: ICreateGovernmentEmployeeSearchLog,
  ): Promise<GovernmentEmployeeSearchLog>;
}
