import * as Yup from 'yup';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const checkins = await Checkin.findAll({ where: { student_id: id } });
    return res.json(checkins);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
    });

    schema.validate(req.body).catch(erro => {
      return res.status(400).json({ error: erro.message });
    });

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ erro: 'Student not found' });
    }

    const date = new Date();

    const countCheckins = await Checkin.count({
      where: {
        student_id: id,
        created_at: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    });

    if (countCheckins >= 5) {
      return res.status(400).json({ erro: 'Limited checkin exceeded' });
    }

    const checkin = await Checkin.create({
      student_id: id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
