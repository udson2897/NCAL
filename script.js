// Adiciona um ouvinte de evento ao formulário de login para capturar o envio
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault() // Evita o recarregamento da página ao enviar o formulário
    
    // Obtém os valores do e-mail e da senha inseridos no formulário
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    try {
        // Altera o botão de envio para um estado de carregamento
        const submitBtn = document.querySelector('.submit-btn')
        const originalBtnText = submitBtn.innerHTML // Armazena o texto original do botão
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Entrando...' // Ícone de carregamento
        submitBtn.disabled = true // Desativa o botão para evitar múltiplos cliques

        // Tenta autenticar o usuário utilizando Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) throw error // Se houver erro, ele é lançado e tratado no catch
        
        // Se o login for bem-sucedido, redireciona o usuário para a página inicial
        window.location.href = 'pagina_inicial.html'
    } catch (error) {
        // Exibe um alerta caso ocorra erro no login
        alert('Erro ao fazer login: ' + error.message)
        
        // Reseta o botão para seu estado original
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
    }
})

// Verifica se o usuário já está autenticado ao carregar a página
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (session) {
        // Se já estiver logado, redireciona para a página inicial
        window.location.href = 'pagina_inicial.html'
    }
})




