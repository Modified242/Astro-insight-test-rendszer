document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const emailInput = document.getElementById('subscriberEmail');
        const termsCheck = document.getElementById('termsCheck');
        const btn = document.getElementById('subBtn');
        const msg = document.getElementById('subResponse');
        
        const email = emailInput.value.trim();

        if (!termsCheck.checked) {
            msg.style.display = "block";
            msg.style.color = "#ef4444";
            msg.textContent = "You must accept our Terms & Privacy policy to align with our circle.";
            return;
        }

        if (!email) return;

        btn.innerText = "Subscribing...";
        btn.disabled = true;
        msg.style.display = "none";

        try {
            const WORKER_URL = 'https://late-fog-5ad6astro-newsletter-api.astroinsight.workers.dev/';

            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            const data = await response.json();
            msg.style.display = "block";
            
            if (response.ok) {
                msg.style.color = "var(--glow-color)";
                msg.textContent = "Your path is aligned. Check your inbox for your 15% discount.";
                form.reset();
            } else {
                msg.style.color = "#ef4444";
                msg.textContent = data.error || "The cosmic link was interrupted. Please try again.";
            }
        } catch (err) {
            msg.style.display = "block";
            msg.style.color = "#ef4444";
            msg.textContent = "Connection disrupted. Please try again.";
        } finally {
            btn.innerText = "Subscribe";
            btn.disabled = false;
        }
    });
});