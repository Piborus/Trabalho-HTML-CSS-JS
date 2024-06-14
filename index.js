document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('health-plan-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const age = parseInt(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const imc = weight / (height * height);

        const planosA = calcularPlanosA(age, imc);
        const planosB = calcularPlanosB(imc);

        const menorPlano = determinarMelhorPlano(planosA, planosB);

        const resultElement = document.getElementById('result');
        resultElement.innerHTML = ''; // Limpa o conteúdo atual

        resultElement.appendChild(gerarDivResultado('Básico', planosA.basico, planosB.basico));
        resultElement.appendChild(gerarDivResultado('Standard', planosA.standard, planosB.standard));
        resultElement.appendChild(gerarDivResultado('Premium', planosA.premium, planosB.premium));
        resultElement.appendChild(gerarDivMelhorOpcao(menorPlano));
        resultElement.classList.remove('intro-text');
        resultElement.classList.add('result-section', 'fade-in');
    });
});

function calcularPlanosA(age, imc) {
    const basico = Math.max(0, 100 + (age * 10 * (imc / 10)));
    const standard = Math.max(0, (150 + (age * 15)) * (imc / 10));
    const premium = Math.max(0, (200 - (imc * 10) + (age * 20)) * (imc / 10));

    return {
        basico,
        standard,
        premium
    };
}

function calcularPlanosB(imc) {
    let fatorComorbidade;

    if (imc < 18.5) {
        fatorComorbidade = 10;
    } else if (imc < 25) {
        fatorComorbidade = 1;
    } else if (imc < 30) {
        fatorComorbidade = 6;
    } else if (imc < 35) {
        fatorComorbidade = 10;
    } else if (imc < 40) {
        fatorComorbidade = 20;
    } else {
        fatorComorbidade = 30;
    }

    return {
        basico: 100 + (fatorComorbidade * 10 * (imc / 10)),
        standard: (150 + (fatorComorbidade * 15)) * (imc / 10),
        premium: (200 - (imc * 10) + (fatorComorbidade * 20)) * (imc / 10)
    };
}

function determinarMelhorPlano(planosA, planosB) {
    const todosPlanos = [
        { nome: 'Básico A', valor: planosA.basico },
        { nome: 'Básico B', valor: planosB.basico },
        { nome: 'Standard A', valor: planosA.standard },
        { nome: 'Standard B', valor: planosB.standard },
        { nome: 'Premium A', valor: planosA.premium },
        { nome: 'Premium B', valor: planosB.premium },
    ];

    const planosPositivos = todosPlanos.filter(plano => plano.valor > 0);

    planosPositivos.sort((a, b) => a.valor - b.valor);

    return planosPositivos[0];
}

function gerarDivResultado(plano, valorA, valorB) {
    const div = document.createElement('div');
    div.classList.add('result-section', 'fade-in');

    div.innerHTML = `
        <h3>Plano ${plano}</h3>
        <p>Operadora A: R$ ${valorA.toFixed(2)}</p>
        <p>Operadora B: R$ ${valorB.toFixed(2)}</p>
    `;

    return div;
}

function gerarDivMelhorOpcao(menorPlano) {
    const div = document.createElement('div');
    div.classList.add('melhor-opcao', 'fade-in');

    div.innerHTML = `<h3>Melhor Plano</h3>
    <p><b>${menorPlano.nome}</b></p><p> R$ ${menorPlano.valor.toFixed(2)}</p>`;

    return div;
}
