import yfinance as yf
import pandas as pd

def test_nifty():
    ticker = "^NSEI"
    period = "5y"
    try:
        ticker_obj = yf.Ticker(ticker)
        df = ticker_obj.history(period=period)
        print(f"Ticker: {ticker}")
        print(f"Data shape: {df.shape}")
        if not df.empty:
            print(f"Last date: {df.index[-1]}")
            print(f"Last close: {df['Close'].iloc[-1]}")
        else:
            print("DataFrame is empty!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_nifty()
