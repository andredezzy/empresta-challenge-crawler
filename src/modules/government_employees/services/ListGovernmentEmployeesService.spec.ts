import FakeGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/fakes/FakeGovernmentEmployeeSearchLogsRepository';
import AppError from '@shared/errors/AppError';

import ListGovernmentEmployeesService from './ListGovernmentEmployeesService';

let fakeGovernmentEmployeeSearchLogsRepository: FakeGovernmentEmployeeSearchLogsRepository;
let listGovernmentEmployees: ListGovernmentEmployeesService;

describe('ListGovernmentEmployees', () => {
  beforeEach(() => {
    fakeGovernmentEmployeeSearchLogsRepository = new FakeGovernmentEmployeeSearchLogsRepository();

    listGovernmentEmployees = new ListGovernmentEmployeesService(
      fakeGovernmentEmployeeSearchLogsRepository,
    );
  });

  it('should be able to list government employees with employee type filters', async () => {
    const governmentEmployees = await listGovernmentEmployees.execute({
      employee_types: ['militar'],
      superior_army_organ: 'Ministério da Defesa',
      army_organ: 'Comando da Aeronáutica',
    });

    expect(governmentEmployees).toEqual({
      government_employees: expect.arrayContaining([
        {
          type: expect.any(String),
          cpf: expect.any(String),
          name: expect.any(String),
          registration: expect.any(String),
        },
      ]),
      current_page: 1,
      total_pages: expect.any(Number),
    });
  });

  it('should be able to list government employees with employee type filters and pagination', async () => {
    const governmentEmployees = await listGovernmentEmployees.execute({
      employee_types: ['militar'],
      superior_army_organ: 'Ministério da Defesa',
      army_organ: 'Comando da Aeronáutica',
      page: 5,
    });

    expect(governmentEmployees).toEqual({
      government_employees: expect.arrayContaining([
        {
          type: expect.any(String),
          cpf: expect.any(String),
          name: expect.any(String),
          registration: expect.any(String),
        },
      ]),
      current_page: 5,
      total_pages: expect.any(Number),
    });
  });

  it('should not be able to list government employees with employee type filters and page greater than total pages', async () => {
    await expect(
      listGovernmentEmployees.execute({
        employee_types: ['militar'],
        superior_army_organ: 'Ministério da Defesa',
        army_organ: 'Comando da Aeronáutica',
        page: 9999,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to list government employees with pagination without employee type filters', async () => {
    const governmentEmployees = await listGovernmentEmployees.execute({
      superior_army_organ: 'Ministério da Defesa',
      army_organ: 'Comando da Aeronáutica',
    });

    expect(governmentEmployees).toEqual({
      government_employees: expect.arrayContaining([
        {
          type: expect.any(String),
          cpf: expect.any(String),
          name: expect.any(String),
          registration: expect.any(String),
        },
      ]),
      current_page: 1,
      total_pages: expect.any(Number),
    });
  });
});
