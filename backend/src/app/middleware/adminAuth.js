module.exports = function(req, res, next) {
  // Verificar se o usuário está definido no objeto de requisição
  if (!req.usuario) {
    return res.status(401).json({ msg: 'Usuário não autenticado' });
  }
  
  // Checando a regra
  if (req.usuario.regra !== 'ADMIN') {
    return res.status(403).json({ msg: 'Não autorizado' });
  }
  
  // Se o usuário é admin, continua para o próximo middleware
  next();
};
