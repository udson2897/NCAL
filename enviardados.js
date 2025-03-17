// Importando a biblioteca Supabase usando o CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://vvgtuaxymotjbkpqncln.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3R1YXh5bW90amJrcHFuY2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjk4ODYsImV4cCI6MjA0OTcwNTg4Nn0.TRC3a7-2lRt7HLQD3ImnAZmWaiDa4HXtn_mnSIqZwHs';            

// Inicializando o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Capturando o formulário
const form = document.getElementById('form');
const itensAdicionados = document.getElementById('itensAdicionados');
const descricaoInput = document.getElementById('descricaoInput');

// Função auxiliar para coletar itens selecionados dinamicamente e retornar como array
function getListaDeItens() {
  const itens = [];
  const lista = itensAdicionados.querySelectorAll('li');
  lista.forEach((item) => {
    itens.push(item.textContent.replace('Remover', '').trim());
  });
  return itens; // Retorna um array de itens
}

// Função para gerar um ID único para a requisição (timestamp + número aleatório)
function generateRequisicaoId() {
  return Date.now();
}

// Evento de envio do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Capturando os valores do formulário
  const formData = new FormData(form);
  const requisicaoId = generateRequisicaoId(); // Gerando um ID único
  const itens = getListaDeItens(); // Obtendo os itens individualmente
  const descricaoTexto = descricaoInput ? descricaoInput.value.trim() : ''; // Obtendo o valor da textarea

  console.log('Valor da textarea (descrição):', descricaoTexto);

  const dadosBase = {
    requisicao_id: requisicaoId,
    data_requisicao: formData.get('data_requisicao'),
    tipo_requisicao: formData.get('tipo_requisicao'),
    descricao: descricaoTexto || null, // Garantindo que o campo seja enviado corretamente
    filial: formData.get('filial'),
    solicitante: formData.get('solicitante'),
    cargo: formData.get('cargo'),
    urgente: formData.get('urgente'),
  };

  console.log('Dados base coletados:', dadosBase);
  console.log('Itens a serem inseridos:', itens);

  // Criando as inserções para cada item individualmente
  const registros = itens.length > 0 ? itens.map(item => ({
    ...dadosBase,
    item
  })) : [{ ...dadosBase, item: 'Nenhum item' }];

  console.log('Registros a serem enviados:', registros);

  try {
    const { data, error } = await supabase.from('requisicoes').insert(registros);
    
    if (error) {
      console.error('Erro ao enviar dados:', error);
      alert('Erro ao enviar dados. Consulte o console.');
    } else {
      alert('Dados enviados com sucesso!');
      console.log('Dados inseridos:', data);
      form.reset(); // Limpa o formulário após o envio
      itensAdicionados.innerHTML = ''; // Limpa os itens dinâmicos
    }
  } catch (err) {
    console.error('Erro inesperado:', err.message);
  }
});
