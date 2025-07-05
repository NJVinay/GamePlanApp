import requests

# Replace with your actual DeepSeek API Key
API_KEY = "sk-afc0675695f64964b4fbeb15d5befb8f"
API_URL = "https://api.deepseek.com/v1/chat"

def get_npc_response(npc_name, player_input):
    """Fetches an NPC response from DeepSeek AI"""
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "deepseek-chat",  # Specify the DeepSeek model
        "messages": [
            {"role": "system", "content": f"You are {npc_name}, an NPC in a medieval fantasy game."},
            {"role": "user", "content": player_input}
        ]
    }

    response = requests.post(API_URL, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]
    else:
        return f"Error: {response.status_code} - {response.text}"

# Example Usage
npc_response = get_npc_response("Blacksmith", "Can you craft me a sword?")
print("NPC:", npc_response)
