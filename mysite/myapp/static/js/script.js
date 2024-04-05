document.getElementById('generateButton').addEventListener('click', function() {
    const textInput = document.getElementById('textInput').value;
    
    fetch('view-response/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
        body: JSON.stringify({
            'textInput': textInput
        })
    })
    .then(response => response.json())
    .then(data => {
       // Display the generated response in the text area
       document.getElementById('textArea').value = data.generatedResponse;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
