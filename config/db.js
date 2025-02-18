const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // Desactiva los logs de Sequelize para hacer más limpia la salida
  dialectOptions: {
    ssl: {
      require: true, // Obliga a usar SSL
      rejectUnauthorized: false, // Acepta certificados no firmados
    },
  },
  pool: {
    max: 5, // Número máximo de conexiones en el pool
    min: 0, // Número mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo en ms para intentar obtener una conexión antes de lanzar un error
    idle: 10000, // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
  },
});


// Probar la conexión
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

connectDB();

module.exports = sequelize;
