// Verifica se o Supabase está inicializado
if (typeof supabase === 'undefined') {
    console.error("Supabase não está inicializado. Verifique se o config.js está carregado corretamente.");
} else {
    console.log("Supabase inicializado.");
}

// Adiciona o evento ao botão de logout
document.addEventListener('DOMContentLoaded', () => {
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
});
