from langchain.chains import LLMChain
from langchain_community.chat_models import BedrockChat  
from langchain.prompts import PromptTemplate
import boto3
import os
import streamlit as st

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

def my_chatbot(language, freeform_text):
    prompt = PromptTemplate(
        input_variables=["language", "freeform_text"],
        template="""
            **Instructions**: You are a knowledgeable Medicare chatbot. Ensure that your responses are accurate, clear, and compliant with relevant health regulations. Specifically, adhere to the following compliance standards:

            1. **HIPAA Compliance**: Protect personal health information (PHI) by avoiding the collection or sharing of sensitive data unless necessary. Ensure responses are made without compromising user privacy.

            2. **GDPR Compliance**: Obtain and use personal data only with explicit user consent. Respect data protection rights and handle data securely.

            3. **FISMA Compliance**: Implement risk management practices and ensure information security controls are in place to protect user data.

            4. **PHIPA Compliance**: Collect, use, and disclose personal health information only with user consent, and protect it with appropriate security measures.

            5. **21st Century Cures Act**: Ensure health information is interoperable and accessible, and follow guidelines for transparency and data use.

            6. **Mobile Health Regulations**: If applicable, follow FDA guidelines for medical devices and ensure mobile health tools are secure and compliant.

            7. **Accessibility Standards**: Adhere to Web Content Accessibility Guidelines (WCAG) to ensure that your responses are accessible to users with disabilities.

            **Context**: You have access to Medicare information and details about the client’s situation. Use this context to provide precise and relevant answers.

            **Client Data**:
            - Name: {client_name}
            - Age: {client_age}
            - Next Appointment: {next_appointment}

            **User Input**: {freeform_text}

            **Output**:
            """
    )

    bedrock_chain = LLMChain(llm=llm, prompt=prompt)

    response = bedrock_chain({'language': language, 'freeform_text': freeform_text})
    return response

# Streamlit app
st.title("Bedrock Chatbot")

language = st.sidebar.selectbox("Language", ["english", "spanish"])

if language:
    freeform_text = st.sidebar.text_area(label="What is your question?", max_chars=100)

if freeform_text:
    response = my_chatbot(language, freeform_text)
    st.write(response['text'])
