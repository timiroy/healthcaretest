import streamlit as st
import boto3
import os
import mysql.connector 
from langchain.chains import LLMChain
from langchain_community.chat_models import BedrockChat
from langchain.prompts import PromptTemplate


# Set environment variables for database credentials
os.environ["DB_HOST"] = "your_db_host"
os.environ["DB_USER"] = "your_db_user"
os.environ["DB_PASSWORD"] = "your_db_password"
os.environ["DB_NAME"] = "your_db_name"

# Set AWS profile
os.environ["AWS_PROFILE"] = "default"

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


def get_client_data(client_id):
    # Retrieve database credentials from environment variables
    db_host = os.getenv("DB_HOST")
    db_user = os.getenv("DB_USER")
    db_password = os.getenv("DB_PASSWORD")
    db_name = os.getenv("DB_NAME")

    # Securely connect to the database
    connection = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_name,
        ssl_ca="path_to_ca_cert.pem",
        ssl_cert="path_to_client_cert.pem",
        ssl_key="path_to_client_key.pem"
    )

    cursor = connection.cursor(dictionary=True)
    
    # Use parameterized query to prevent SQL injection
    cursor.execute("SELECT * FROM clients WHERE client_id = %s", (client_id,))
    client_data = cursor.fetchone()

    cursor.close()
    connection.close()

    return client_data


def my_chatbot(language, freeform_text, client_data):
    client_info = "\n".join([f"- {key.replace('_', ' ').capitalize()}: {value}" for key, value in client_data.items()])

    message_template = """
    **Instructions**: You are a knowledgeable Medicare chatbot. Ensure that your responses are accurate, clear, and compliant with relevant health regulations. 

    **Context**: You have access to Medicare information and details about the client’s situation. Use this context to provide precise and relevant answers.

    **Client Data**:
    {client_info}

    **User Input**: {freeform_text}

    **Output**:
    """

    prompt_text = message_template.format(
        client_info=client_info,
        freeform_text=freeform_text
    )

    prompt = PromptTemplate(
        input_variables=["client_info", "freeform_text"],
        template=message_template
    )

    bedrock_chain = LLMChain(llm=llm, prompt=prompt)

    response = bedrock_chain({
        'client_info': client_info,
        'freeform_text': freeform_text
    })
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
def generate_llama2_response(prompt_input):
    client_data = get_client_data('your_client_id')  # Replace 'your_client_id' with the actual client_id
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
            response = generate_llama2_response(prompt)
            placeholder = st.empty()
            full_response = ''
            for item in response:
                full_response += item
                placeholder.markdown(full_response)
            placeholder.markdown(full_response)
    message = {"role": "assistant", "content": full_response}
    st.session_state.messages.append(message)
