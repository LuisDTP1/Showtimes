require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('❌ Falta JWT_SECRET en el .env (se usa para firmar los tokens)');
  process.exit(1);
}

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Showtimes en puerto ${PORT}`);
});
