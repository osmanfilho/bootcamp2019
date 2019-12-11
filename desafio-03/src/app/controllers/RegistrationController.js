import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
    });
    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { start_date, plan_id, student_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ erro: 'Plan not found' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ erro: 'Student not found' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const registration = await Registration.create({
      start_date,
      plan_id,
      student_id,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      start_date: Yup.date().required(),
      plan_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { id, start_date, plan_id, student_id } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ erro: 'Plan not found' });
    }

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ erro: 'Student not found' });
    }

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ erro: 'Registration not found' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);
    const price = plan.duration * plan.price;

    const updateRegistration = await registration.update({
      id,
      start_date,
      end_date,
      plan_id,
      student_id,
      price,
    });

    return res.json(updateRegistration);
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Registration.destroy({ where: { id } });

      if (deleted) {
        return res.status(200).send('Registration deleted');
      }

      throw new Error('Registration not found');
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
}

export default new RegistrationController();
