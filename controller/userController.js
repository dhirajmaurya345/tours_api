exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: "success",
    data: {
      message:"This API is not yet defined"
    },
  });
};
//Create user handler
exports.createUser = (req, res) => {
  res.status(201).json({
    status: "success",
    message: "User Created",
  });
};
//get User by ID handler
exports.getUser = (req, res) => {
  const id = req.params.id * 1;
  const user = users.find((el) => el.id === id);
  if (id > users.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: { user },
  });
};
//Update user handler
exports.updateUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(200).json({
    status: "success",
    data: {
      user: "Update you users here...",
    },
  });
};
//Detele User handler
exports.deleteUser = (req, res) => {
  if (req.params.id * 1 > users.length) {
    res.status(404).json({ status: "Fail", message: "Invalide Id" });
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
};
