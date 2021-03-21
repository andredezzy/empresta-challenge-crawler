import { Router } from 'express';

import governmentEmployeesRouter from '@modules/government_employees/infra/http/routes/government-employees.routes';

const routes = Router();

routes.use('/government-employees', governmentEmployeesRouter);

routes.get('/', (_request, response) => {
  return response.json({
    name: 'Empresta Challenge Crawler',
    version: '1.0.0',
  });
});

export default routes;
