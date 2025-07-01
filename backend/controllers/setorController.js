// backend/controllers/setorController.js
const db = require("../db/connection.js");

exports.getSetores = (req, res) => {
  const q = "SELECT id, nome FROM setores ORDER BY nome ASC";
  db.query(q, (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
};