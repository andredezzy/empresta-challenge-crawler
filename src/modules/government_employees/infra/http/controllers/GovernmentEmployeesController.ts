import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListGovernmentEmployeesService from '@modules/government_employees/services/ListGovernmentEmployeesService';

export default class GovernmentEmployeesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { employee_types, superior_army_organ, army_organ } = request.body;
    const { page } = request.query;

    const listGovernmentEmployees = container.resolve(
      ListGovernmentEmployeesService,
    );

    const {
      government_employees,
      current_page,
      total_pages,
    } = await listGovernmentEmployees.execute({
      employee_types,
      superior_army_organ,
      army_organ,
      page: Number(page),
    });

    response.header('X-Page', String(current_page));
    response.header('X-Total-Pages', String(total_pages));

    return response.json(government_employees);
  }
}
