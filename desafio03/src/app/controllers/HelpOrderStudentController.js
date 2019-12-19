import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderStudentController {
  async index(req, res) {
    const { id } = req.params;
    const helpOrders = await HelpOrder.findAll({ where: { student_id: id } });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { question } = req.body;
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ erro: 'Student not found' });
    }

    const helpOrder = await HelpOrder.create({
      question,
      student_id: id,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderStudentController();
