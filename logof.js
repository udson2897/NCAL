// Aguarda o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o Supabase está inicializado
    if (typeof supabase === 'undefined') {
        console.error("Supabase não está inicializado. Verifique se o config.js está carregado corretamente.");
        return;
    } else {
        console.log("Supabase inicializado.");
    }

    // Adiciona o evento ao botão de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            console.log("Tentando sair...");
            try {
                // Faz logoff usando Supabase
                const { error } = await supabase.auth.signOut();
                if (error) throw error;

                // Redireciona para a página de login
                console.log("Logoff bem-sucedido. Redirecionando...");
                window.location.href = 'index.html';
            } catch (error) {
                console.error("Erro ao sair:", error);
                alert('Erro ao fazer logoff: ' + error.message);
            }
        });
    } else {
        console.error("Botão de logout não encontrado no DOM.");
    }

    // Verifica se o usuário está autenticado
    checkAuthentication();
});

async function checkAuthentication() {
    try {
        if (typeof supabase === 'undefined') {
            console.log('Supabase não carregado');
            return;
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
            console.error('Erro ao verificar sessão:', error);
            return;
        }
        
        // Se não estiver logado e não estiver na página de login, redireciona
        if (!session && !window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
}