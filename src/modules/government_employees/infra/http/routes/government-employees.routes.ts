import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import GovernmentEmployeesController from '../controllers/GovernmentEmployeesController';

const governmentEmployeesRouter = Router();
const governmentEmployeesController = new GovernmentEmployeesController();

governmentEmployeesRouter.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      employee_types: Joi.array().items(Joi.string().valid('militar', 'civil')),
      superior_army_organ: Joi.string().required(),
      army_organ: Joi.string().required(),
    },
    [Segments.QUERY]: {
      page: Joi.number(),
    },
  }),
  governmentEmployeesController.index,
);

export default governmentEmployeesRouter;
