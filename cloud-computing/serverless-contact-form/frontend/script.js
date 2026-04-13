document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Elements
    const form = e.target;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const loader = submitBtn.querySelector('.loader');
    const statusMessage = document.getElementById('statusMessage');
    
    // Data extraction
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Update UI state
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;
    statusMessage.className = 'status-message hidden';
    
    try {
        // Assume API Gateway runs locally on port 3000
        const API_ENDPOINT = 'http://localhost:3000/contact'; 
        
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            statusMessage.textContent = 'Message sent successfully!';
            statusMessage.className = 'status-message success';
            form.reset();
        } else {
            throw new Error(result.message || 'Failed to send message');
        }
    } catch (error) {
        statusMessage.textContent = error.message || 'An error occurred. Please try again.';
        statusMessage.className = 'status-message error';
    } finally {
        // Reset UI state
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});
