const bcrypt = require('bcryptjs');

const password = '12345';

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash generado:', hash);
});
