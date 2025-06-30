document.addEventListener("DOMContentLoaded", function () {
    const data_requisicao = document.getElementById('data_requisicao');
    const tipoRequisicao = document.getElementById('tipoRequisicao');
    const opcoesExtras = document.getElementById('opcoesExtras');
    const listaItens = document.getElementById('listaItens');
    const descricaoServico = document.getElementById('descricaoServico');
    const subtipoRequisicao = document.getElementById('subtipoRequisicao');
    const quantidadeInput = document.getElementById('quantidadeInput');
    const addItemBtn = document.getElementById('addItemBtn');
    const itensAdicionados = document.getElementById('itensAdicionados');
    const filialSelect = document.getElementById('filial');
    const compradorContainer = document.getElementById('compradorContainer');
    const compradorInput = document.getElementById('comprador');

    // Definição dos subtipos
    const subtipos = {
        'mat.consumo': [
            { value: 'resma', text: 'Resma' },
            { value: 'caneta', text: 'Caneta' },
            { value: 'grampo', text: 'Grampo' },
            { value: 'envelope', text: 'Envelope' },
            { value: 'acucar', text: 'Açúcar' },
            { value: 'cafe', text: 'Café' },
            { value: 'copo descartavel', text: 'Copo descartável' }
        ],
        'embalagens': [
            { value: 'papelao', text: 'Papelão' },
            { value: 'filme stretch', text: 'Filme stretch' },
            { value: 'etiquetas', text: 'Etiquetas' }
        ],
        'material de limpeza': [
            { value: 'detergente', text: 'Detergente' },
            { value: 'papel higienico', text: 'Papel higiênico' },
            { value: 'desinfetante', text: 'Desinfetante' },
            { value: 'esponja', text: 'Esponja' },
            { value: 'pano de chao', text: 'Pano de chão' },
            { value: 'papel toalha', text: 'Papel toalha' }
        ],
        'EPIs': [
            { value: 'luva latex', text: 'Luva latex' },
            { value: 'bota', text: 'Bota' },
            { value: 'protetor auricular plug', text: 'Protetor auricular plug' },
            { value: 'protetor auricular concha', text: 'Protetor auricular concha' },
            { value: 'capacete', text: 'Capacete' }
        ]
    };

    // Função para atualizar os subtipos dinamicamente
    if (tipoRequisicao) {
        tipoRequisicao.addEventListener('change', () => {
            const selectedValue = tipoRequisicao.value;
            
            if (subtipoRequisicao) {
                subtipoRequisicao.innerHTML = ''; // Resetando a lista de subtipo
            }

            if (subtipos[selectedValue]) {
                // Adiciona as novas opções ao select
                subtipos[selectedValue].forEach(option => {
                    const newOption = document.createElement('option');
                    newOption.value = option.value;
                    newOption.textContent = option.text;
                    subtipoRequisicao.appendChild(newOption);
                });

                if (opcoesExtras) opcoesExtras.style.display = 'block';
                if (listaItens) listaItens.style.display = 'block';
                if (descricaoServico) descricaoServico.style.display = 'none'; // Esconde o campo de descrição

            } else if (selectedValue.includes("manutenção") || selectedValue === "serviços") {
                // Se for manutenção ou serviços, mostrar campo de descrição e ocultar os demais
                if (descricaoServico) descricaoServico.style.display = 'block';
                if (opcoesExtras) opcoesExtras.style.display = 'none';
                if (listaItens) listaItens.style.display = 'none';
            } else {
                // Se for outro tipo, esconder tudo
                if (descricaoServico) descricaoServico.style.display = 'none';
                if (opcoesExtras) opcoesExtras.style.display = 'none';
                if (listaItens) listaItens.style.display = 'none';
            }
        });
    }

    // Função para adicionar item à lista
    if (addItemBtn) {
        addItemBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do botão dentro do form

            const subtipo = subtipoRequisicao ? subtipoRequisicao.value : '';
            const subtipoText = subtipoRequisicao ? (subtipoRequisicao.options[subtipoRequisicao.selectedIndex]?.text || '') : '';
            const quantidade = quantidadeInput ? quantidadeInput.value : '1';
            const tipo = tipoRequisicao ? tipoRequisicao.value : '';

            if (subtipo && quantidade > 0) {
                // Determinar unidade de medida
                let unidadeMedida = 'UN';
                if (tipo === 'embalagens' && subtipo === 'papelao') {
                    unidadeMedida = 'kg';
                }

                // Criar item na lista
                const listItem = document.createElement('li');
                listItem.textContent = `${subtipoText} - ${quantidade} ${unidadeMedida}`;

                // Botão para remover item
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remover';
                removeBtn.style.marginLeft = '10px';
                removeBtn.addEventListener('click', () => listItem.remove());

                listItem.appendChild(removeBtn);
                if (itensAdicionados) {
                    itensAdicionados.appendChild(listItem);
                }

                // Resetando os campos
                if (subtipoRequisicao) subtipoRequisicao.selectedIndex = 0;
                if (quantidadeInput) quantidadeInput.value = '1';
            } else {
                alert('Por favor, selecione um subtipo e insira uma quantidade válida.');
            }
        });
    }

    // Atualizar comprador responsável com base na filial
    if (filialSelect) {
        filialSelect.addEventListener('change', () => {
            const filial = filialSelect.value;

            if (['Brasília', 'Goiânia', 'Maranhão'].includes(filial)) {
                if (compradorInput) compradorInput.value = 'Margarete';
                if (compradorContainer) compradorContainer.style.display = 'block';
            } else if (['Bahia', 'Minas Gerais', 'Pará'].includes(filial)) {
                if (compradorInput) compradorInput.value = 'Jonatã';
                if (compradorContainer) compradorContainer.style.display = 'block';
            } else {
                if (compradorInput) compradorInput.value = ''; // Limpa o campo quando "Selecione" for escolhido
                if (compradorContainer) compradorContainer.style.display = 'none';
            }
        });
    }
});