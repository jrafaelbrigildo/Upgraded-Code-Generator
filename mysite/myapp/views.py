from django.shortcuts import render
import requests
from dotenv import load_dotenv
import google.generativeai as genai
import os
from django.http import JsonResponse
from django.views.decorators.http import require_POST
import json

# Create your views here.
def home(request):
    return render(request, 'index.html')

@require_POST
def generate_solution_view(request):
    try:
        data = json.loads(request.body)
        text_input = data.get('textInput', '')

        # Call generate_solution() function passing the text_input
        generated_response = generate_solution(text_input)

        # Return the generated response as JSON
        return JsonResponse({'generatedResponse': generated_response})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
load_dotenv()
APIKEY = os.environ.get('AI_APIKEY')
genai.configure(api_key = APIKEY)

def generate_solution(text_input):
        try:
            # Set up the model
            generation_config = {
            "temperature": 0.9,
            "top_p": 1,
            "top_k": 1,
            "max_output_tokens": 2048,
            }

            safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            ]

            model = genai.GenerativeModel(model_name="gemini-1.0-pro",
                                        generation_config=generation_config,
                                        safety_settings=safety_settings)

            prompt_parts = ['Please rewrite this code to adhere to standard practices in Data Structures, Algorithms, and Object-Oriented Programming principles.\n' + text_input]

            response = model.generate_content(prompt_parts)

            # Check if the response is successful
            if response is not None and hasattr(response, 'text'):
                return response.text
            else:
                return "Failed to generate response"
        
        except requests.exceptions.RequestException as req_err:
            return f"Request error: {str(req_err)}"   
        except Exception as e:
            return f"Error generating response: {str(e)}"