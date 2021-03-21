import { getMongoRepository, MongoRepository, ObjectID } from 'typeorm';

import ICreateGovernmentEmployeeSearchLog from '@modules/government_employees/dtos/ICreateGovernmentEmployeeSearchLog';
import GovernmentEmployeeSearchLog from '@modules/government_employees/infra/typeorm/schemas/GovernmentEmployeeSearchLog';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';

class GovernmentEmployeeSearchLogsRepository
  implements IGovernmentEmployeeSearchLogsRepository {
  private ormRepository: MongoRepository<GovernmentEmployeeSearchLog>;

  constructor() {
    this.ormRepository = getMongoRepository(GovernmentEmployeeSearchLog);
  }

  public async findById(
    id: ObjectID,
  ): Promise<GovernmentEmployeeSearchLog | undefined> {
    const governmentEmployeeSearchLog = await this.ormRepository.findOne(id);

    return governmentEmployeeSearchLog;
  }

  public async create({
    government_employees,
    employee_types,
    superior_army_organ,
    army_organ,
    page,
    total_pages,
  }: ICreateGovernmentEmployeeSearchLog): Promise<GovernmentEmployeeSearchLog> {
    const governmentEmployeeSearchLog = this.ormRepository.create({
      government_employees,
      employee_types,
      superior_army_organ,
      army_organ,
      page,
      total_pages,
    });

    await this.ormRepository.save(governmentEmployeeSearchLog);

    return governmentEmployeeSearchLog;
  }
}

export default GovernmentEmployeeSearchLogsRepository;
