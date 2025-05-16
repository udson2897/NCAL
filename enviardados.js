// Importando a biblioteca Supabase usando o CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://vvgtuaxymotjbkpqncln.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2Z3R1YXh5bW90amJrcHFuY2xuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQxMjk4ODYsImV4cCI6MjA0OTcwNTg4Nn0.TRC3a7-2lRt7HLQD3ImnAZmWaiDa4HXtn_mnSIqZwHs';            

// Inicializando o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Aguarda o carregamento do DOM
window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const itensAdicionados = document.getElementById('itensAdicionados');
  const descricaoInput = document.getElementById('descricaoInput');

  if (!form) {
    console.error('Elemento #form não encontrado.');
    return;
  }

  // Função auxiliar para coletar itens selecionados dinamicamente e retornar como array
  function getListaDeItens() {
    const itens = [];
    const lista = itensAdicionados.querySelectorAll('li');
    lista.forEach((item) => {
      itens.push(item.textContent.replace('Remover', '').trim());
    });
    return itens;
  }

  // Gera um ID único com base no timestamp
  function generateRequisicaoId() {
    return Date.now();
  }

  // Evento de envio do formulário
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const requisicaoId = generateRequisicaoId();
    const itens = getListaDeItens();
    const descricaoTexto = descricaoInput ? descricaoInput.value.trim() : '';

    console.log('Valor da textarea (descrição):', descricaoTexto);

    const urgenteValue = formData.get('urgente');
    const urgenteBoolean = urgenteValue === 'Sim' ? 'Sim' : 'Não'; // Corrige tipo booleano

    const dadosBase = {
      requisicao_id: requisicaoId,
      data_requisicao: formData.get('data_requisicao'),
      tipo_requisicao: formData.get('tipo_requisicao'),
      descricao: descricaoTexto || null,
      filial: formData.get('filial'),
      comprador: formData.get('comprador'),
      solicitante: formData.get('solicitante'),
      cargo: formData.get('cargo'),
      urgente: urgenteValue === 'Sim' ? 'Sim' : 'Não', 
    };

    console.log('Dados base coletados:', dadosBase);
    console.log('Itens a serem inseridos:', itens);

    const registros = itens.length > 0
      ? itens.map(item => ({ ...dadosBase, item }))
      : [{ ...dadosBase, item: 'Nenhum item' }];

    console.log('Registros a serem enviados:', registros);

    try {
      const { data, error } = await supabase.from('requisicoes').insert(registros);

      if (error) {
        console.error('Erro ao enviar dados:', error);
        alert(`Erro ao enviar dados: ${error.message}`);
      } else {
        alert('Requisição enviada com sucesso!');
        console.log('Dados inseridos:', data);
        form.reset();
        itensAdicionados.innerHTML = '';
      }
    } catch (err) {
      console.error('Erro inesperado:', err.message);
      alert(`Erro inesperado: ${err.message}`);
    }
  });
});
