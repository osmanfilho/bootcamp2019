import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();
    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .positive()
        .integer(),
      price: Yup.number()
        .required()
        .positive(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { title, duration, price } = req.body;

    const planExists = await Plan.findOne({ where: { title } });

    if (planExists) {
      return res.status(400).json({ erro: 'Plan already exists' });
    }

    const plan = await Plan.create({
      title,
      duration,
      price,
    });

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().min(3),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { id, title } = req.body;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ erro: 'Plan not found' });
    }

    if (title && title !== plan.title) {
      const planExists = await Plan.findOne({ where: { title } });

      if (planExists) {
        return res.status(400).json({ erro: 'Plan already exists' });
      }
    }

    const updatePlan = await plan.update(req.body);

    return res.json(updatePlan);
  }

  async delete(req, res) {
    const { id } = req.params;

    const planExists = await Plan.findByPk(id);

    if (!planExists) {
      return res.status(400).json({ erro: 'Plan not found' });
    }

    const plan = await Plan.destroy({ where: { id } });
    if (!plan) {
      return res.status(400).json({ erro: 'Error registering the plan' });
    }
    return res.json({ message: 'Plan successfully deleted' });
  }
}

export default new PlanController();
