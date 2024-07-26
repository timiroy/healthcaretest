# Medicare Chatbot using Streamlit and Amazon Bedrock

This README provides instructions on how to run a Medicare chatbot application built with Streamlit and Amazon Bedrock. The chatbot uses the Bedrock model from Amazon Web Services (AWS) to generate responses based on user input.

## Prerequisites

- **Python**: Ensure that Python 3.7 or higher is installed on your system.
- **AWS Account**: You need an AWS account with access to Bedrock services. Ensure that you have configured your AWS credentials properly.
- **Dependencies**: This application requires several Python packages. These can be installed using pip.

## Installation

### Install the dependencies:

```bash
pip install -r requirements.txt
```
## Configure AWS Credentials:

Ensure that your AWS credentials are set up correctly. You can set the `AWS_PROFILE` environment variable in your system or use the default profile.

```bash
export AWS_PROFILE=default  # On Windows use `set AWS_PROFILE=default`
```
## Running the Application

### Start the Streamlit App:

Run the Streamlit application using the following command:

```bash
python -m streamlit run .\chatbot\main.py
```
Here, `main.py` is the filename of the script containing your chatbot code.

### Access the Chatbot:

Once the Streamlit server starts, open your web browser and go to http://localhost:8501 to interact with the chatbot.

## Troubleshooting

If you encounter any issues while running the application, consider the following steps:

1. **Check Dependencies**: Ensure all required packages are installed correctly.
2. **AWS Credentials**: Verify that your AWS credentials are configured properly.
3. **Network Issues**: Ensure your internet connection is stable.
4. **Logs**: Check the Streamlit logs for any error messages that might indicate the problem.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.


Happy coding! 😊