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
    const capitalizacion = data.capitalizacion;
    let plazoTotal = Number(data.plazo);
    let mesesGracia = Number(data.mesesGracia || 0);
    const tipoGracia = data.tipoGracia;

    let saldo = precioVenta;
    const valorBono = 15000;
    if (data.aplicaBono) {
        saldo -= valorBono;
    }

    let TEM = 0;

    if (tipoTasa === 'Nominal') {
        TEM = (tasaInput / 100) / 12;
    } else {
        TEM = Math.pow(1 + (tasaInput / 100), 1 / 12) - 1;
    }

    let cronograma = [];
    let totalIntereses = 0;
    let totalAmortizacion = 0;
    let plazoRestante = plazoTotal;

    for (let i = 1; i <= mesesGracia; i++) {
        let interes = saldo * TEM;
        let cuota = 0;
        let amortizacion = 0;

        if (tipoGracia === 'Total') {
            cuota = 0;
            amortizacion = 0;
            saldo += interes;
        } else if (tipoGracia === 'Parcial') {
            cuota = interes;
            amortizacion = 0;
        }

        cronograma.push({
            periodo: i,
            interes: interes,
            cuota: cuota,
            amortizacion: amortizacion,
            saldo: saldo
        });

        totalIntereses += interes;
        plazoRestante--;
    }

    const numerador = TEM * Math.pow(1 + TEM, plazoRestante);
    const denominador = Math.pow(1 + TEM, plazoRestante) - 1;

    let cuotaFija = 0;
    if (denominador !== 0) {
        cuotaFija = saldo * (numerador / denominador);
    }

    let periodoActual = mesesGracia + 1;

    for (let i = 0; i < plazoRestante; i++) {
        let interes = saldo * TEM;
        let cuota = cuotaFija;
        let amortizacion = cuota - interes;

        saldo -= amortizacion;

        if (saldo < 0 || i === plazoRestante - 1) {
            if (Math.abs(saldo) < 5) saldo = 0;
        }

        totalIntereses += interes;
        totalAmortizacion += amortizacion;

        cronograma.push({
            periodo: periodoActual++,
            interes: interes,
            cuota: cuota,
            amortizacion: amortizacion,
            saldo: saldo
        });
    }

    let van = 500.25;
    const ctc = totalIntereses + totalAmortizacion + (data.aplicaBono ? 0 : 0);

    return {
        schedule: cronograma,
        indicators: {
            van: van,
            tir: tasaInput,
            totalInteres: totalIntereses,
            totalAmortizacion: totalAmortizacion,
            cuotaMensual: cuotaFija,
            ctc: ctc
        }
    };
}