import { getMongoRepository, MongoRepository } from 'typeorm';

import ICreateGovernmentEmployeeSearchLog from '@modules/government_employees/dtos/ICreateGovernmentEmployeeSearchLog';
import GovernmentEmployeeSearchLog from '@modules/government_employees/infra/typeorm/schemas/GovernmentEmployeeSearchLog';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';

class GovernmentEmployeeSearchLogsRepository
  implements IGovernmentEmployeeSearchLogsRepository {
  private ormRepository: MongoRepository<GovernmentEmployeeSearchLog>;

  constructor() {
    this.ormRepository = getMongoRepository(GovernmentEmployeeSearchLog);
  }

  public async create({
    government_employees,
  }: ICreateGovernmentEmployeeSearchLog): Promise<GovernmentEmployeeSearchLog> {
    const governmentEmployee = this.ormRepository.create({
      government_employees,
    });

    await this.ormRepository.save(governmentEmployee);

    return governmentEmployee;
  }
}

export default GovernmentEmployeeSearchLogsRepository;
