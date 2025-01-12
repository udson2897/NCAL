document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    
    // Get form values
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    
    try {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn')
        const originalBtnText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Entrando...'
        submitBtn.disabled = true
        // Attempt to sign in
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })
        if (error) throw error
        // Success - redirect to dashboard or home page
        window.location.href = 'pagina_inicial.html'
    } catch (error) {
        // Handle errors
        alert('Erro ao fazer login: ' + error.message)
        
        // Reset button state
        const submitBtn = document.querySelector('.submit-btn')
        submitBtn.innerHTML = originalBtnText
        submitBtn.disabled = false
    }
})
// Check if user is already logged in
window.addEventListener('DOMContentLoaded', async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (session) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'pagina_inicial.html'
    }
})




