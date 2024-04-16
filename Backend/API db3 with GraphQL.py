from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
import os
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Get the MongoDB connection string from the environment variable
mongo_connection_string = os.getenv('MONGO_CONNECTION_STRING')

# Create the MongoDB client using the connection string
mongo_client = MongoClient(mongo_connection_string)
mongo_db = mongo_client['ShopifyStore']
mongo_collection = mongo_db['productData']

@app.route('/')
def index():
    return render_template('front.html')             # Replace your 'front.html' with the actual html file name to be used for this in the frontend

@app.route('/fetch_data', methods=['POST'])
def fetch_data():
    # Get data from the form
    url = request.form.get('url')
    version = request.form.get('version')
    api_key = request.form.get('api_key')
    store_id = request.form.get('store_id')

    # Connect to Shopify and retrieve data using GraphQL
    #shopify_endpoint = f'https://{url}/admin/api/{version}/graphql.json'
    shopify_endpoint = f'https://{url}/api/{version}/graphql.json'
    headers = {
        'X-Shopify-Storefront-Access-Token': api_key,
        'Content-Type': 'application/json'
    }
    # graphql_query = """
    # {
    #   products(first: 3) {
    #     edges {
    #       node {
    #         createdAt
    #         handle
    #         id
    #         variants(first: 3) {
    #           edges {
    #             node {
    #               id
    #               title
    #               inventoryQuantity
    #               weight
    #               weightUnit
    #             }
    #           }
    #         }
    #         vendor
    #         productType
    #         publishedAt
    #         publishedScope
    #         status
    #         tags
    #         title
    #         updatedAt
    #       }
    #     }
    #   }
    # }
    # """
    graphql_query = '''
     {
     products(first: 250) {
    edges {
      node {
        id
        title
        description
        handle
        productType
        vendor
        tags
        publishedAt
        updatedAt
        totalInventory
        variants(first: 250) {
          edges {
            node {
              id
              sku
              price { amount }
              weight
            }
          }
        }
      }
    }
  }
      }
      '''
    response = requests.post(
        shopify_endpoint,
        headers=headers,
        json={'query': graphql_query}
    )
    if response.status_code == 200:
        data = response.json()
        products = data.get('data', {}).get('products', {}).get('edges', [])
        if products:
            for edge in products:
                product = edge.get('node', {})
                product['store_id'] = store_id  # Add store_id to each product
                mongo_collection.insert_one(product)
            status = 'Data successfully retrieved and stored in MongoDB'
        else:
            status = 'No products found in the store'
    else:
        status = f'Failed to retrieve data from Shopify. Status code: {response.status_code}'

    # Return a JSON response
    response_data = {
        'url': url,
        'version': version,
        'api_key': api_key,
        'store_id': store_id,
        'status': status
    }
    
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)