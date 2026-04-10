import yfinance as yf

def test_no_hat():
    ticker = "NSEI"
    try:
        df = yf.Ticker(ticker).history(period="1mo")
        print(f"Ticker: {ticker}")
        print(f"Data shape: {df.shape}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_no_hat()
