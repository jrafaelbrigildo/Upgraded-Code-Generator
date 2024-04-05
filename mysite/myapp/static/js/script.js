document.getElementById('generateButton').addEventListener('click', function() {
    const textInput = document.getElementById('textInput').value;
    const aiResponseElement = document.querySelector('.aiResponse');
    aiResponseElement.innerHTML = ''

    if (!textInput.trim()){
        alert('Please enter some code.')
        return;
    }
    else{
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
            const aiResponseText = data.generatedResponse;
            // Split the response into lines
            const lines = aiResponseText.split('\n');

            // Container to hold the generated HTML content
            let htmlContent = '';
            // Flag to track if we are inside a code block
    
            // Flag to track if we are inside a code block
            let inCodeBlock = false;

            // Iterate through each line and create HTML elements based on patterns
            lines.forEach(line => {
                // Check if the line starts and ends with '**'
                if (line.startsWith('**') && line.endsWith('**')) {
                    // Create an h3 element
                    htmlContent += `<h3>${line.substring(2, line.length - 2)}</h3>`;
                }
                // Check if the line starts and ends with '```' and it's not inside a code block
                else if (line.startsWith('```') && line.endsWith('```') && !inCodeBlock) {
                    // Create a code element
                    htmlContent += `<pre><code>${line.substring(3, line.length - 3)}</code></pre>`;
                }
                // Check if the line starts and ends with '```' and it's inside a code block
                else if (line.startsWith('```') && line.endsWith('```') && inCodeBlock) {
                    // Close the code block
                    htmlContent += `</code></pre>`;
                    inCodeBlock = false;
                }
                // Check if the line starts with '```' and it's not inside a code block
                else if (line.startsWith('```') && !inCodeBlock) {
                    // Open a code block
                    htmlContent += `<pre><code>`;
                    inCodeBlock = true;
                }
                // For other lines, create a p element
                else {
                    htmlContent += `<p>${line}</p>`;
                }
            });

            // Add the generated HTML content to the element with class 'aiResponse'
            document.querySelector('.aiResponse').innerHTML = htmlContent;
        })
    
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

function formatAiResponse(aiResponseText) {
    const response = document.querySelector('.aiResponse');
    const lines = aiResponseText.split('\n');

    response.innerHTML = ''; // Clear the content

    lines.forEach(line => {
        if (line.startsWith('**') && line.endsWith('**')) {
            const text = line.slice(2, -2);
            response.innerHTML += `<h2>${text}</h2>`;
        } else if (line.startsWith('```') && line.endsWith('```')) {
            const text = line.slice(3, -3);
            response.innerHTML += `<code>${text}</code>`;
        } else if (line.startsWith('*')) {
            const text = line.slice(1);
            response.innerHTML += `<h3>${text}</h3>`;
        } else {
            response.innerHTML += `<p>${line}</p>`;
        }
    });
}

