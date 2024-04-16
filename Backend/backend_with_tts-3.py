import asyncio
import websockets
from openai import OpenAI
from vanna.remote import VannaDefault
from vanna.exceptions import ValidationError
import datetime
import json
import base64
from concurrent.futures import ThreadPoolExecutor
import multiprocessing
from functools import lru_cache
# import time
# import dotenv
import os
import redis

r = redis.Redis(
  host='redis-18945.c10.us-east-1-3.ec2.cloud.redislabs.com',
  port=18945,
  password='NLeCsKiV7X8acHJE0OwhyYwqTNFGxacu')

k = (r.hgetall('Hello'))
WS_SERVER_PORT = 5000
GPT_MODEL_NAME = "gpt-3.5-turbo"
GPT_API_KEY = "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"
VANNA_API_KEY = "62b71a4321584f249c47eb253cde5613"
VANNA_MODEL_NAME = "shopify_model"
TTS_MODEL_NAME = "tts-1"
REDIS_HOST = 'redis-18945.c10.us-east-1-3.ec2.cloud.redislabs.com'
REDIS_PASSWORD = 'NLeCsKiV7X8acHJE0OwhyYwqTNFGxacu'
gpt_client = OpenAI(api_key=GPT_API_KEY)
vanna_client = VannaDefault(model=VANNA_MODEL_NAME, api_key=VANNA_API_KEY)
# print(vanna_client)
vanna_client.connect_to_postgres(host='aws-0-ap-south-1.pooler.supabase.com', dbname='postgres', user='postgres.bkcqubibxwqeqkzyjdhr', password='cgfWhiN41mzluNbm', port='5432')
r = redis.Redis(
  host= REDIS_HOST,
  port=18945,
  password= REDIS_PASSWORD)

# k = (r.hgetall('Hello'))
cpu_cores = multiprocessing.cpu_count()
executor = ThreadPoolExecutor(max_workers=cpu_cores)

# @lru_cache(maxsize=100)
def generate_tts_base64(gpt_response):
    tts_response = gpt_client.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=gpt_response
    )
    tts_response.stream_to_file("output.mp3")
    with open("output.mp3", "rb") as audio_file:
        audio_data = audio_file.read()
    return base64.b64encode(audio_data).decode('utf-8')

async def async_tts_response(gpt_response):
    loop = asyncio.get_running_loop()
    audio_data_base64 = await loop.run_in_executor(
        executor,
        lambda: generate_tts_base64(gpt_response)
    )
    return audio_data_base64

async def echo(websocket, path=""):
    conversation_history = []

    async for user_message in websocket:
        print(user_message)
        db_res = r.hgetall(user_message)
        print(db_res)
        if len(db_res):
            gpt_response = db_res[b'text_response'].decode('utf-8') 
            audio_data_base64 = db_res[b'audio_data'].decode('utf-8')
            print(gpt_response,audio_data_base64)
            timestamp = datetime.datetime.now().isoformat()
            conversation_history.append({"timestamp": timestamp, "role": "assistant", "message": gpt_response})
        else:
            try:
                # start_time = time.time()  # Start the timer

                timestamp = datetime.datetime.now().isoformat()
                conversation_history.append({"timestamp": timestamp, "role": "user", "message": user_message})

                vanna_response = vanna_client.ask(user_message, visualize=False)
                vanna_response_str = str(vanna_response)

                if "No SELECT statement could be found in the SQL code" in vanna_response_str:
                    gpt_input = user_message
                else:
                    gpt_input = f"User: {user_message}\nVanna: {vanna_response_str}\n"

                # vanna_end_time = time.time()  # End timer for Vanna response
                # print(f"Vanna response time: {vanna_end_time - start_time} seconds")

            except ValidationError as e:
                timestamp = datetime.datetime.now().isoformat()
                conversation_history.append({"timestamp": timestamp, "role": "error", "message": f"Vanna Validation Error: {e}"})
                gpt_input = user_message
            except Exception as e:
                timestamp = datetime.datetime.now().isoformat()
                conversation_history.append({"timestamp": timestamp, "role": "error", "message": f"An error occurred: {e}"})
                gpt_input = user_message

            gpt_response = gpt_client.chat.completions.create(
                model=GPT_MODEL_NAME,
                messages=[{"role": "system", "content": "You are a helpful assistant. Try to keep your responses short but meaningful and complete. If the list is in the database, you need to read it and provide a good response as the query and database information is not being provided to the user. If the information is too long you can just include in your response some of it and mention there are more. DO NOT send too long responses. If greeted reply directly, don't read vanna response."},
                        {"role": "user", "content": gpt_input}],
                max_tokens=500, 
                temperature=0.8,
            ).choices[0].message.content

            # gpt_end_time = time.time()  # End timer for GPT response
            # print(f"GPT response time: {gpt_end_time - vanna_end_time} seconds")

            timestamp = datetime.datetime.now().isoformat()
            conversation_history.append({"timestamp": timestamp, "role": "assistant", "message": gpt_response})

        # Generate speech from GPT response using tts-1 model
            audio_data_base64 = await async_tts_response(gpt_response)
            r.hset(user_message,mapping={
                'text_response' : gpt_response,
                'audio_data' : audio_data_base64
            })
    # tts_end_time = time.time()  # End timer for TTS response
    # print(f"TTS response time: {tts_end_time - gpt_end_time} seconds")

        # Send the base64 encoded audio data to the frontend
        await websocket.send(json.dumps({"text_response": gpt_response, "audio_data": audio_data_base64}))

        print("Conversation history:", json.dumps(conversation_history, indent=4))

start_server = websockets.serve(echo, "localhost", WS_SERVER_PORT)
print(f"Server running on ws://localhost:{WS_SERVER_PORT}")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
