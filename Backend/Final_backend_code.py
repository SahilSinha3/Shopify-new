import asyncio
import base64
import datetime
import json
import openai
import psycopg2
import websockets
import dspy
from dspy import Predict, InputField, OutputField, OpenAI, Signature, settings
import threading
import time
import redis

WS_SERVER_PORT = 5000
REDIS_HOST = 'redis-18945.c10.us-east-1-3.ec2.cloud.redislabs.com'
REDIS_PORT = 18945
REDIS_PASSWORD = 'NLeCsKiV7X8acHJE0OwhyYwqTNFGxacu'

openai.api_key = "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"
turbo = dspy.OpenAI(model='gpt-3.5-turbo')
dspy.settings.configure(lm=turbo)

# Connect to Supabase database
conn = psycopg2.connect(
    dbname='postgres',
    user='postgres.bkcqubibxwqeqkzyjdhr',
    password='cgfWhiN41mzluNbm',
    host='aws-0-ap-south-1.pooler.supabase.com',
    port='5432'
)
cursor = conn.cursor()

# Connect to Redis
#r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD)
r = redis.Redis(
  host='localhost',
  port=6379)
print("Redis is connected")

class ques_to_sql(dspy.Signature):
    """Convert natural language to SQL queries. The database contains a Shopify store's products. The table on the database is called products. This is the database schema for products table:
        id TEXT PRIMARY KEY,
        title TEXT,
        price NUMERIC,
        sku TEXT,
        position INT4,
        inventory_policy TEXT,
        compare_at_price TEXT,
        fulfillment_service TEXT,
        inventory_management TEXT,
        option1 TEXT,
        option2 TEXT,
        option3 TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        taxable BOOLEAN,
        barcode TEXT,
        grams INT4,
        weight NUMERIC,
        weight_unit TEXT,
        inventory_item_id INT8,
        inventory_quantity INT4,
        old_inventory_quantity INT4,
        requires_shipping BOOLEAN,
        admin_graphql_api_id TEXT
        This is the database schema for the orders and customers table:
        customer_id TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        phone TEXT,
        address1 TEXT,
        address2 TEXT,
        city TEXT,
        province TEXT,
        country TEXT,
        zip TEXT,
        order_id TEXT,
        order_processedAt TIMESTAMP,
        totalPriceSet NUMERIC,
        created_at TIMESTAMP,
        updated_at TIMESTAMP

       This is the schema for orders and customers table:
        customer_id TEXT PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        email TEXT,
        phone TEXT,
        address1 TEXT,
        address2 TEXT,
        city TEXT,
        province TEXT,
        country TEXT,
        zip TEXT,
        order_id TEXT,
        order_processedAt TIMESTAMP,
        totalPriceSet NUMERIC,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    """
    user_message = dspy.InputField(desc="Natural language question to be converted to SQL")
    sql_query = dspy.OutputField(desc="SQL query generated from natural language question")

pred_class = Predict(ques_to_sql)

def execute_query_and_get_response(sql_query):
    try:
        # Check if the connection is closed and try to reconnect
        if conn.closed:
            print("Reconnecting to the database...")
            conn.reset()

        # Execute the query
        cursor.execute(sql_query)
        return cursor.fetchall()
    except psycopg2.Error as e:
        print(f"Database error: {e}")
        conn.rollback()  # Rollback the transaction in case of an error
        return None
def keep_connection_alive(conn):
    while True:
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT 1;")
                conn.commit()
            print("Connection keep-alive query executed.")
        except psycopg2.Error as e:
            print(f"Error during keep-alive query: {e}")
        time.sleep(300)  # Wait for 5 minutes before the next query

# Start the keep-alive task in a separate thread
keep_alive_thread = threading.Thread(target=keep_connection_alive, args=(conn,))
keep_alive_thread.daemon = True
keep_alive_thread.start()

async def generate_tts_base64(gpt_response):
    tts_response = openai.audio.speech.create(
        model="tts-1",
        voice="alloy",
        input=gpt_response
    )
    tts_response.stream_to_file("output.mp3")
    with open("output.mp3", "rb") as audio_file:
        audio_data = audio_file.read()
    return base64.b64encode(audio_data).decode('utf-8')

# Check if the user message is related to products, orders, or customers
async def is_related_to_shopify(user_message):
    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "Identify if the following message is related to products, orders, or customers."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    )
    if any(keyword in response.choices[0].message.content.lower() for keyword in ["product", "order", "customer"]):
        return True
    return False

async def echo(websocket, path=""):
    conversation_history = []
    user_messages = []
    async for user_message in websocket:
        user_messages.append(user_message)
        message = ", ".join(user_messages).lower()
        db_res = r.hgetall(message)
        if len(db_res):
            gpt_response = db_res[b'text_response'].decode('utf-8')
            audio_data_base64 = db_res[b'audio_data'].decode('utf-8')
            conversation_history.append({"timestamp": datetime.datetime.now().isoformat(), "role": "assistant", "message": gpt_response})
        else:
             try:
                if await is_related_to_shopify(user_message):
                    sql_response = pred_class(user_message=user_message)
                    if sql_response.sql_query.lower().startswith("select"):
                        query_result = execute_query_and_get_response(sql_response.sql_query)
                        if query_result is not None:
                            query_result_str = str([list(map(str, row)) for row in query_result])
                            user_message = f"Question: {user_message}\nDatabase query result: {query_result_str}"
                gpt_response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                     {"role": "system", "content": "You are a knowledgeable assistant with access to a Shopify store's database. Your name is shopsy. Your role is to provide accurate and concise answers to inquiries about products, orders, and customers. When asked about your role, specify who you are and what all you can do. When greeted, respond with a friendly greeting in return. Focus on delivering relevant information in a clear and helpful manner. DO NOT greet on every query. Greet only when greeted."},                       
                     {"role": "user", "content": user_message}
                    ],
                    max_tokens=500,
                    temperature=0.8,
                ).choices[0].message.content
                audio_data_base64 = await generate_tts_base64(gpt_response)
                r.hset(message, mapping={
                    'text_response': gpt_response,
                    'audio_data': audio_data_base64
                })
             except Exception as e:
                print(f"Error: {e}")
                gpt_response = "Sorry, I encountered an error. Please try again."
                audio_data_base64 = await generate_tts_base64(gpt_response)
                r.hset(message, mapping={
                    'text_response': gpt_response,
                    'audio_data': audio_data_base64
                })

        # Send the base64 encoded audio data to the frontend
        await websocket.send(json.dumps({"text_response": gpt_response, "audio_data": audio_data_base64}))

        print("Conversation history:", json.dumps(conversation_history, indent=4))


async def main():
    async with websockets.serve(echo, "0.0.0.0", WS_SERVER_PORT):
        print(f"Server running on ws://0.0.0.0:{WS_SERVER_PORT}")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())

conn.close()
cursor.__exit__()
