const { Sequelize } = require('sequelize');

// Usa DATABASE_URL si está definida, o un valor por defecto para desarrollo local.
// Reemplaza 'usuario', 'contraseña' y 'tu_basededatos' con tus datos reales.
const databaseUrl = 'postgres://postgres:Usa.2025@localhost:5432/postgres';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false, // Desactiva los logs para una salida más limpia
  pool: {
    max: 5,      // Número máximo de conexiones en el pool
    min: 0,      // Número mínimo de conexiones en el pool
    acquire: 30000, // Tiempo máximo en ms para obtener una conexión antes de lanzar un error
    idle: 10000,    // Tiempo máximo en ms que una conexión puede estar inactiva antes de ser liberada
  },
});

// Probar la conexión a la base de datos
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
