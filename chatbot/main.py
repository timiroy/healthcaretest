import streamlit as st
import boto3
import os
from langchain.chains import LLMChain
from langchain_community.chat_models import BedrockChat  
from langchain.prompts import PromptTemplate

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

def my_chatbot(language, freeform_text):
    # Define your variables
    client_name = "John Doe"
    client_age = "45"
    next_appointment = "July 20, 2024"

    message_template="""
            **Instructions**: You are a knowledgeable Medicare chatbot. Ensure that your responses are accurate, clear, and compliant with relevant health regulations. 

            **Context**: You have access to Medicare information and details about the client’s situation. Use this context to provide precise and relevant answers.

            If you don't know the answer to a question, respond with the following:


            Hi {client_name},

            I'm sorry, but I don't have the answer to that question right now. However, I can help you find the information you need or connect you with someone who can assist you further. Is there anything else I can assist you with?



            If the client responds "yes", provide the company email or phone number:


            Hi {client_name},

            You can reach out to our support team at [company_email@example.com] or call us at [company_phone_number]. They will be happy to assist you with your query.

            **Client Data**:
            - Name: {client_name}
            - Age: {client_age}
            - Next Appointment: {next_appointment}

            **User Input**: {freeform_text}

            **Output**:

            """
    formatted_message = message_template.format(
        client_name=client_name,
        client_age=client_age,
        next_appointment=next_appointment,
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
def generate_llama2_response(prompt_input):
    response = my_chatbot('en', prompt_input)
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
