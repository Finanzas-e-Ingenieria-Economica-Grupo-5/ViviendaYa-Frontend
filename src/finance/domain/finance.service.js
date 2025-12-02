// finance/domain/finance.service.js

export const financeService = {
    async calculate(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const resultado = calcularLogicaNegocio(data);
                resolve(resultado);
            }, 500);
        });
    }
};

function calcularLogicaNegocio(data) {
    let precioVenta = Number(data.montoCredito);
    let tasaInput = Number(data.tasaInteres);
    const tipoTasa = data.tipoTasa;
    let plazoTotal = Number(data.plazo);
    let mesesGracia = Number(data.mesesGracia || 0);
    const tipoGracia = data.tipoGracia || 'Ninguno';

    // 🔥 APLICAR BONO ANTES DE TODO
    const valorBono = 15000;
    let montoFinanciar = precioVenta;

    if (data.aplicaBono && data.tipoCredito === 'TechoPropio') {
        montoFinanciar = Math.max(0, precioVenta - valorBono);
    }

    let saldo = montoFinanciar;

    // 🔥 Calcular TEM
    let TEM = 0;
    if (tipoTasa === 'Nominal') {
        TEM = (tasaInput / 100) / 12;
    } else {
        TEM = Math.pow(1 + (tasaInput / 100), 1 / 12) - 1;
    }

    let cronograma = [];
    let totalIntereses = 0;
    let totalAmortizacion = 0;

    // 🔥 PERÍODO DE GRACIA
    if (mesesGracia > 0 && tipoGracia !== 'Ninguno') {
        for (let i = 1; i <= mesesGracia; i++) {
            let interes = saldo * TEM;
            let cuota = 0;
            let amortizacion = 0;

            if (tipoGracia === 'Total') {
                cuota = 0;
                amortizacion = 0;
                saldo += interes; // Los intereses se capitalizan
            } else if (tipoGracia === 'Parcial') {
                cuota = interes;
                amortizacion = 0;
                // Saldo no cambia
            }

            cronograma.push({
                period: i,
                interest: interes,
                payment: cuota,
                amortization: amortizacion,
                balance: saldo
            });

            totalIntereses += interes;
        }
    }

    // 🔥 CUOTAS NORMALES
    const plazoRestante = plazoTotal - (tipoGracia === 'Total' || tipoGracia === 'Parcial' ? mesesGracia : 0);

    const numerador = TEM * Math.pow(1 + TEM, plazoRestante);
    const denominador = Math.pow(1 + TEM, plazoRestante) - 1;

    let cuotaFija = 0;
    if (denominador !== 0 && saldo > 0) {
        cuotaFija = saldo * (numerador / denominador);
    }

    let periodoActual = (tipoGracia !== 'Ninguno' ? mesesGracia : 0) + 1;

    for (let i = 0; i < plazoRestante; i++) {
        let interes = saldo * TEM;
        let cuota = cuotaFija;
        let amortizacion = cuota - interes;

        saldo -= amortizacion;

        // Ajuste final para evitar saldo residual
        if (i === plazoRestante - 1) {
            if (Math.abs(saldo) < 1) saldo = 0;
        }

        totalIntereses += interes;
        totalAmortizacion += amortizacion;

        cronograma.push({
            period: periodoActual++,
            interest: interes,
            payment: cuota,
            amortization: amortizacion,
            balance: Math.max(0, saldo)
        });
    }

    // 🔥 CALCULAR VAN REAL
    // VAN = -Inversión Inicial + Σ(Flujo / (1+tasa)^periodo)
    let van = -montoFinanciar; // Inversión inicial (negativa)

    cronograma.forEach(row => {
        // Cada cuota es un flujo positivo descontado
        van += row.payment / Math.pow(1 + TEM, row.period);
    });

    // 🔥 CTC = Capital + Intereses
    const ctc = montoFinanciar + totalIntereses;

    return {
        schedule: cronograma,
        indicators: {
            van: van,
            tir: tasaInput,
            totalInteres: totalIntereses,
            totalAmortizacion: montoFinanciar,
            cuotaMensual: cuotaFija,
            ctc: ctc,
            ahorroBono: (data.aplicaBono && data.tipoCredito === 'TechoPropio') ? valorBono : 0,
            bonoAplicado: (data.aplicaBono && data.tipoCredito === 'TechoPropio')
        }
    };
}