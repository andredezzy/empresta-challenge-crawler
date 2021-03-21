import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListGovernmentEmployeesService from '@modules/government_employees/services/ListGovernmentEmployeesService';

export default class GovernmentEmployeesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { employee_types, superior_army_organ, army_organ } = request.body;

    const listGovernmentEmployees = container.resolve(
      ListGovernmentEmployeesService,
    );

    const governmentEmployees = await listGovernmentEmployees.execute({
      employee_types,
      superior_army_organ,
      army_organ,
    });

    return response.json(governmentEmployees);
  }
}
