// Importando a biblioteca Supabase usando o CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Configuração do Supabase: Substitua com suas credenciais
const supabaseUrl = 'https://vvgtuaxymotjbkpqncln.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3R1YXh5bW90amJrcHFuY2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjk4ODYsImV4cCI6MjA0OTcwNTg4Nn0.TRC3a7-2lRt7HLQD3ImnAZmWaiDa4HXtn_mnSIqZwHs';            

// Inicializando o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Capturando o formulário
const form = document.getElementById('form');
const itensAdicionados = document.getElementById('itensAdicionados');

// Função auxiliar para coletar itens selecionados dinamicamente e retornar como string
function getListaDeItens() {
  const itens = [];
  const lista = itensAdicionados.querySelectorAll('li');
  lista.forEach((item) => {
    itens.push(item.textContent.replace('Remover', '').trim());
  });
  return itens.join(', '); // Converte o array em uma string separada por vírgulas
}

// Evento de envio do formulário
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Capturando todos os valores do formulário
  const formData = new FormData(form);

  const dadosFormulario = {
    tipo_requisicao: formData.get('tipo_requisicao'),
    descricao: formData.get('descricao') || null,
    produto: getListaDeItens(), // Itens selecionados como string
    urgente: formData.get('urgente'),
    filial: formData.get('filial'),
    comprador: formData.get('comprador'),
    solicitante: formData.get('solicitante'),
    cargo: formData.get('cargo'),
  };

  console.log('Dados coletados:', dadosFormulario); // Verificação no console

  // Enviando os dados para o Supabase
  try {
    const { data, error } = await supabase
      .from('requisicoes') // Tabela no Supabase
      .insert([dadosFormulario]);

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
