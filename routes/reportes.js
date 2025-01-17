const express = require('express');
const router = express.Router();
const { calcularVentasDiarias, calcularVentasSemanales, calcularVentasMensuales, calcularBalanceProductos } = require('../models/ventas'); // Importamos funciones del modelo ventas

router.get('/', async (req, res) => {
    try {
        const ventasDiarias = await calcularVentasDiarias();
        const ventasSemanales = await calcularVentasSemanales();
        const ventasMensuales = await calcularVentasMensuales();
        const balance = await calcularBalanceProductos();

        res.json({ diarias: ventasDiarias, semanales: ventasSemanales, mensuales: ventasMensuales, balance });
    } catch (error) {
        console.error('Error en /api/reportes:', error);
        res.status(500).json({ error: 'Error al obtener los reportes' });
    }
});

module.exports = router;
