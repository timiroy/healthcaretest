import boto3
import json
import requests
import urllib.parse
import streamlit as st
from langchain.chains import LLMChain
from langchain_community.chat_models import BedrockChat
from langchain.prompts import PromptTemplate

# Function to get the bearer token from URL parameters
def get_access_token_from_url():
    # Retrieve query parameters
    query_params = st.query_params
    
    # Get the token parameter from the query string
    token_string = query_params.get('token', [None])[0]
    
    if token_string:
        # Decode the URL-encoded token string
        decoded_token_string = urllib.parse.unquote(token_string)
        
        # Parse the JSON string to a Python dictionary
        try:
            token_data = json.loads(decoded_token_string)
            
            # Extract the access_token
            access_token = token_data.get('access_token', None)
        except json.JSONDecodeError:
            access_token = None
    else:
        access_token = None
    
    return access_token

# Get the token
bearer_token = get_access_token_from_url()

# Check if token is available
if bearer_token:
    url = "http://13.48.48.198/v1/auth/me"

    # Define the headers with the bearer token
    headers = {
        "Authorization": f"Bearer {bearer_token}"
    }

    # Make the GET request
    response = requests.get(url, headers=headers)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        client_data = json.dumps(data, indent=4)
        client_data = client_data.replace("{", "").replace("}", "")
    else:
        print(f"Request failed with status code: {response.status_code}")
        client_data = ""
        print(response.text)
else:
    st.write("No token found.")
    client_data = ""

# Bedrock client
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"
)

modelID = "anthropic.claude-3-sonnet-20240229-v1:0"

# Configure the BedrockChat LLM
llm = BedrockChat(
    model_id=modelID,
    client=bedrock_client,
    model_kwargs={"temperature": 0.9, "max_tokens": 500}
)

def my_chatbot(language, freeform_text, client_data):
    message_template = """
            Instructions: You are an expert Medicare chatbot. Your responses must be accurate, clear, and adhere to all relevant health regulations.

            Context: You have access to Medicare information and the client’s specific details. Use this context to provide precise and relevant answers, referring to “your data” instead of “client data,” without explicitly mentioning your access to the database. If you do not know the answer to a question, simply state that you do not know it instead of forcing a response.

            **Client Data**:
            {client_data}

            **User Input**: {freeform_text}

            **Output**:

            """
    formatted_message = message_template.format(
        client_data=client_data,
        freeform_text=freeform_text
    )
    prompt = PromptTemplate(
        input_variables=["language", "freeform_text"],
        template=formatted_message
    )

    bedrock_chain = LLMChain(llm=llm, prompt=prompt)

    response = bedrock_chain({'language': language, 'freeform_text': freeform_text})
    return response

# Streamlit app
st.set_page_config(page_title="🦙💬 Llama 2 Chatbot")

# Store LLM generated responses
if "messages" not in st.session_state.keys():
    st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today?"}]

# Display or clear chat messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])

def clear_chat_history():
    st.session_state.messages = [{"role": "assistant", "content": "How may I assist you today?"}]
st.sidebar.button('Clear Chat History', on_click=clear_chat_history)

# Function for generating LLaMA2 response using Amazon Bedrock
def generate_llama2_response(prompt_input, client_data):
    response = my_chatbot('en', prompt_input, client_data)
    return response['text']

# User-provided prompt
if prompt := st.chat_input():
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.write(prompt)

# Generate a new response if last message is not from assistant
if st.session_state.messages[-1]["role"] != "assistant":
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = generate_llama2_response(prompt, client_data)
            placeholder = st.empty()
            full_response = ''
            for item in response:
                full_response += item
                placeholder.markdown(full_response)
            placeholder.markdown(full_response)
    message = {"role": "assistant", "content": full_response}
    st.session_state.messages.append(message)
