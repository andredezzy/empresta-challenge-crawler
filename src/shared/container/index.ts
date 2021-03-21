import { container } from 'tsyringe';

import GovernmentEmployeeSearchLogsRepository from '@modules/government_employees/infra/typeorm/repositories/GovernmentEmployeeSearchLogsRepository';
import IGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/IGovernmentEmployeeSearchLogsRepository';

container.registerSingleton<IGovernmentEmployeeSearchLogsRepository>(
  'GovernmentEmployeeSearchLogsRepository',
  GovernmentEmployeeSearchLogsRepository,
);
