import { Users } from '../models';

export const getAll = async (req, res) => {
  const users = await Users.findAll({});
  const out = users.map(user => {
    return { userId: user.userId, username: user.username };
  });
  return res.status(200).json(out);
};

export const getUser = async (req, res) => {
  const user = await Users.findOne({
    where: { userId: req.user.userId }
  });
  const out = {
    username: user.username
  };
  return res.status(200).json(out);
};

// TODO: REMOVE the User Controller. 