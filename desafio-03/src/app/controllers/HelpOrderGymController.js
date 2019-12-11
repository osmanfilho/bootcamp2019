import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderGymController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({ where: { answer_at: null } });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { answer } = req.body;
    const { id } = req.params;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(400).json({ erro: 'Help Order not found' });
    }

    const helpOrderUpdate = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    return res.json(helpOrderUpdate);
  }
}

export default new HelpOrderGymController();
