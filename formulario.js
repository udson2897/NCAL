document.addEventListener("DOMContentLoaded", function () {
  const dataRequisicao = document.getElementById('dataRequisicao');
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
  tipoRequisicao.addEventListener('change', () => {
    const selectedValue = tipoRequisicao.value;
    subtipoRequisicao.innerHTML = ''; // Resetando a lista de subtipo

    if (subtipos[selectedValue]) {
      // Adiciona as novas opções ao select
      subtipos[selectedValue].forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option.value;
        newOption.textContent = option.text;
        subtipoRequisicao.appendChild(newOption);
      });

      opcoesExtras.style.display = 'block';
      listaItens.style.display = 'block';
      descricaoServico.style.display = 'none'; // Esconde o campo de descrição

    } else if (selectedValue.includes("manutenção") || selectedValue === "serviços") {
      // Se for manutenção ou serviços, mostrar campo de descrição e ocultar os demais
      descricaoServico.style.display = 'block';
      opcoesExtras.style.display = 'none';
      listaItens.style.display = 'none';
    } else {
      // Se for outro tipo, esconder tudo
      descricaoServico.style.display = 'none';
      opcoesExtras.style.display = 'none';
      listaItens.style.display = 'none';
    }
  });

  // Função para adicionar item à lista
  addItemBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do botão dentro do form

    const subtipo = subtipoRequisicao.value;
    const subtipoText = subtipoRequisicao.options[subtipoRequisicao.selectedIndex]?.text || '';
    const quantidade = quantidadeInput.value;
    const tipo = tipoRequisicao.value;

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
      itensAdicionados.appendChild(listItem);

      // Resetando os campos
      subtipoRequisicao.selectedIndex = 0;
      quantidadeInput.value = '1';
    } else {
      alert('Por favor, selecione um subtipo e insira uma quantidade válida.');
    }
  });

  // Atualizar comprador responsável com base na filial
  filialSelect.addEventListener('change', () => {
    const filial = filialSelect.value;

    if (['Brasília', 'Goiânia', 'Maranhão'].includes(filial)) {
      compradorInput.value = 'Margarete';
      compradorContainer.style.display = 'block';
    } else if (['Bahia', 'Minas Gerais', 'Pará'].includes(filial)) {
      compradorInput.value = 'Jonatã';
      compradorContainer.style.display = 'block';
    } else {
      compradorInput.value = ''; // Limpa o campo quando "Selecione" for escolhido
      compradorContainer.style.display = 'none';
    }
  });
});

  
