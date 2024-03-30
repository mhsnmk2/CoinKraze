from flask import Flask, request, jsonify
import requests
import os
value = os.environ.get('Key')

app = Flask(__name__)


def requestss(symbol,time):
   headers = {
  'Accepts': 'application/json',
  'X-CMC_PRO_API_KEY': value}
  
   url= f"https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/historical?symbol={symbol}&time_end={time}"	
   k= requests.get(url, headers=headers)
   print(k.json())
   l= k.json()["data"][symbol][0]["quotes"][0]["quote"]["USD"]["price"]
   return int(l*1*10**18)
@app.route('/')
def home():
    return 'Hi!'

@app.route('/<symbol>/<time>/')
def return_token_info(symbol,time):
    print(symbol)
    print(time)
    token_info = {
        "price": requestss(symbol,time),
        "symbol": symbol,
        "time": time,
    }
    return jsonify(token_info)

if __name__ == '__main__':
    app.run(debug=True)
