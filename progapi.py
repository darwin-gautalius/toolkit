import requests
import json

url = "https://llm.datasaur.ai/api/programmatic/chat/completions"

headers = {
    "Content-Type": "application/json",
    # Replace with your actual API key
    "Authorization": "Bearer dc382725-77cb-4981-ae17-40a586aca4e5"
}

data = {
    "model": "667",
    "messages": [
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are a helpful assistant.",
                },
            ]
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Hello!",
                },
            ]
        }
    ]
}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(response.json())
