import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationConlroller from './app/controllers/RegistrationController';
import SessionController from './app/controllers/SessionController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderStudentController from './app/controllers/HelpOrderStudentController';
import HelpOrderGymController from './app/controllers/HelpOrderGymController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/students', StudentController.index);
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/registrations', RegistrationConlroller.index);
routes.post('/registrations', RegistrationConlroller.store);
routes.put('/registrations', RegistrationConlroller.update);
routes.delete('/registrations/:id', RegistrationConlroller.delete);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/students/:id/help-orders', HelpOrderStudentController.index);
routes.post('/students/:id/help-orders', HelpOrderStudentController.store);

routes.get('/help-orders', HelpOrderGymController.index);
routes.post('/help-orders/:id/answer', HelpOrderGymController.store);

export default routes;
