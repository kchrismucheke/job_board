document.addEventListener('turbolink:load', function(){
    const public_key = document.querySelector('meta[name="stripe-public-key"]').content;
    const stripe = Stripe(public_key);
    const elements = stripe.elements();

    const style = {
        base: {
            color: '#32325d',
            lineHeight: '32px',
            fontFamily: '"Heveltica Neue", Heveltica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '18px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    };

    const card = elements.create('card', {style: style});

    card.mount("#card-element");
    card.addEventListener('change', ({errors}) => {
        const displayError = document.getElementById('card-errors');
        if (error) {
            displayError.textContent = error.message;
        } else {
            displayError.textContent = "";
        }
    });

    const form = document.getElementById('new_job');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const {token, error} = await stripe.createToken(card);

        if (error) {
            //Inform customer there was an error
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = error.message;
        } else {
            stripeTokenHandler(token);
        }
    });

    const stripeTokenHandler = (token) =>  {
        const form = document.getElementById('new_job');
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'stripeToken');
        hiddenInput.setAttribute('value', token.id);
        form.appendChild(hiddenInput);

        ["brand", "exp_month", "exp_year", "last4"].forEach(function(field) {
            addFieldToForm(form,toke, field);
        });
    
        form.submit();
    }

    function addFieldToForm(form, token, field){
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute("name", "user[card_" + field + "]");
        hiddenInput.setAttribute('value', token.card[field]);
        form.appendChild(hiddenInput); 
    }

}); 