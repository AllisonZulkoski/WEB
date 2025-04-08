const newQuoteButton = document.querySelector('#js-new-quote');

const apiEndpoint = 'https://trivia.cyberwisp.com/getrandomchristmasquestion';

newQuoteButton.addEventListener('click', getQuote);

function getQuote() {
    console.log('Button clicked!'); 
    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.question); 
            displayQuote(data.question);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('Failed to fetch a new quote. Please try again later.');
        });
}

function displayQuote(quote) {
    const quoteTextElement = document.querySelector('#js-quote-text');
    quoteTextElement.textContent = quote;
}

getQuote();
