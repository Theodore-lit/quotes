import userService from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers({ page: req.query.page, limit: req.query.limit, search: req.query.search, role: req.query.role });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export async function getProfile(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}


export const update = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(
      req.params.id,
      req.body,
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const disactive = async (req, res) => {
  try {
    const deletedUser = await userService.deleteUser(
      req.params.id
    );
    res.status(201).json({ message: "Utilisateur désactivé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const userController = {
  update,
  getProfile,
  disactive,
  getUsers
};
export default userController;


