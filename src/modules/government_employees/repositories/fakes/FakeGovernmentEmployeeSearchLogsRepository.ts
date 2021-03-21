import { merge } from 'lodash';
import { ObjectID } from 'mongodb';

import ICreateGovernmentEmployeeSearchLog from '@modules/government_employees/dtos/ICreateGovernmentEmployeeSearchLog';
import GovernmentEmployeeSearchLog from '@modules/government_employees/infra/typeorm/schemas/GovernmentEmployeeSearchLog';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';

class FakeGovernmentEmployeeSearchLogsRepository
  implements IGovernmentEmployeeSearchLogsRepository {
  private governmentEmployeeSearchLogs: GovernmentEmployeeSearchLog[] = [];

  public async findById(
    id: ObjectID,
  ): Promise<GovernmentEmployeeSearchLog | undefined> {
    const findGovernmentEmployeeSearchLog = this.governmentEmployeeSearchLogs.find(
      governmentEmployeeSearchLog => governmentEmployeeSearchLog._id === id,
    );

    return findGovernmentEmployeeSearchLog;
  }

  public async create({
    government_employees,
    employee_types,
    superior_army_organ,
    army_organ,
    page,
    total_pages,
  }: ICreateGovernmentEmployeeSearchLog): Promise<GovernmentEmployeeSearchLog> {
    const governmentEmployeeSearchLog = new GovernmentEmployeeSearchLog();

    merge(governmentEmployeeSearchLog, {
      _id: new ObjectID(),
      government_employees,
      employee_types,
      superior_army_organ,
      army_organ,
      page,
      total_pages,
    });

    this.governmentEmployeeSearchLogs.push(governmentEmployeeSearchLog);

    return governmentEmployeeSearchLog;
  }
}

export default FakeGovernmentEmployeeSearchLogsRepository;
