# Shopify-voice

## Please make sure you are using python version 3.12.1 or above. Then please clone the repository.

## Create and activate your virtual environment
After you have downloaded and configured the required python version, follow these steps tocreate a virtual environment and install necessary packages:

1. **Create a Virtual Environment:**
   - Open a terminal or command prompt.
   - Use the following command to create a virtual environment named `venv`:
     ```
     python -m venv venv
     ```
   - This will create a directory named `venv` containing the virtual environment files.

2. **Activate the Virtual Environment:**
   - Activate the virtual environment using the appropriate command for your operating system:
     - **Windows:**
       ```
       venv\Scripts\activate
       ```
     - **Mac/Linux:**
       ```
       source venv/bin/activate
       ```
   - Your terminal prompt should change to indicate that the virtual environment is active (e.g., `(venv) user@hostname:~$`).

3. **Install Packages from `Requirements.txt`:**
   - Ensure the virtual environment is activated.
   - Use `pip` to install the packages listed in the `Requirements.txt` file:
     ```
     pip install -r Requirements.txt
     ```
   - Replace `Requirements.txt` with the path to your actual requirements file if it's located elsewhere.

4. **Verify Installation:**
   - After installation completes, you can verify that the packages were installed correctly:
     ```
     pip list
     ```
   - This will display a list of installed packages in the virtual environment.

5. **Deactivate the Virtual Environment:**
   - To deactivate the virtual environment and return to the global Python environment, use the following command:
     ```
     deactivate
     ```
   - Your terminal prompt should return to its original state.
  
## Add your Vanna and OpenAI API keys on the ".env" file or replace them in the files itself. Also add the Mongo connection string which is required to connect to MongoDB
### You can skip the MongoDB connection string as of now as we will not be running the Trying Supabase file

## How to check GPT responses
1. Add the Chrome extension "Simple WebSocket Client" to your Chrome browser
2. Run the "backend_with_tts-3.py" file.
3. Copy the URL from the output and past it on the extension then click open. Type your message in the box and review the response generated

## Order of the files to be run in backend:
1. Start with Vanna working.ipynb
2. Then run the backend_with_tts-1.py
3. Running the Trying supabase.py file is not necessary as of now

## To get the .ipynb file working, please select the kernel as your virtual environment


# Please check the frontend directory for frontend configurations
