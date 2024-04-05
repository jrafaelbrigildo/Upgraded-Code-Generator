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
                // Check if the line starts with '```' and we're inside a code block
                else if (line.startsWith('```') && inCodeBlock) {
                    // Close the current code block
                    htmlContent += `${line.substring(0, line.length - 3)}</code></pre>`;
                    // Set inCodeBlock to false
                    inCodeBlock = false;
                }
                // Check if the line starts with '```' and we're not inside a code block
                else if (line.startsWith('```') && !inCodeBlock) {
                    // Open a new code block
                    htmlContent += `<pre><div class='style-code'><code class='class-code'>${line.substring(3)}</code></div></pre><pre><div class='style-code'><code class='class-code'>`;
                    // Set inCodeBlock to true
                    inCodeBlock = true;
                }
                // Check if we're inside a code block
                else if (inCodeBlock) {
                    // Add the line to the current code block preserving indentation
                    htmlContent += `${line + '\n'}`;
                }
                // Check if we're inside a code block
                else if (!inCodeBlock) {
                    // Add the line to the current code block preserving indentation
                    htmlContent += `</code></div></pre>`;
                }
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
