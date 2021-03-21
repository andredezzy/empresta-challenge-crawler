import FakeGovernmentEmployeeSearchLogsRepository from '@modules/government_employees/repositories/fakes/FakeGovernmentEmployeeSearchLogsRepository';

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

  it('should be able to list government employees', async () => {
    const governmentEmployees = await listGovernmentEmployees.execute({
      employee_types: ['militar'],
      superior_army_organ: 'Ministério da Defesa',
      army_organ: 'Comando da Aeronáutica',
      page: 5,
    });

    expect(governmentEmployees).toEqual(expect.arrayContaining([]));
  });
});
