const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/UsuarioModel'); // Certifique-se de que o caminho está correto

module.exports = async function (req, res, next) {
  const token = req.header('authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Token não encontrado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.usuario;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'O Token é inválido' });
  }
};
