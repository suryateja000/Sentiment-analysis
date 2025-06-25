from fastapi import FastAPI
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import random
app = FastAPI()
analyzer = SentimentIntensityAnalyzer()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Data(BaseModel):
    text: str

positive=["This sentence gives a positive vibe", "This statement radiates a positive feeling", "This phrase leaves a positive impression.", "This message conveys a clearly positive sentiment." ,"This expression offers a positive outlook."] 
negative=["This sentence seems to carry some negative undertones","This message projects a somewhat negative atmosphere.","This expression has a distinctly negative feel to it.","This statement leaves one with a rather negative impression.","This communication hints at a negative perspective."]
neutral=["This sentence maintains a completely neutral perspective.","This statement is entirely neutral in tone.","This phrase carries a neutral sentiment.","This message does not lean towards any particular sentiment.","This statement conveys information in a neutral and objective way."]

@app.post("/analyze")
def analyze_sentiment(data:Data):
    scores = analyzer.polarity_scores(data.text)
    compound = scores['compound']
    if compound >= 0.05:
        sentiment = positive[random.randint(0, len(positive)-1)]
        emoji = "🙂"
    elif compound <= -0.05:
        sentiment = negative[random.randint(0, len(negative)-1)]
        emoji = "🙁"
    else:
        sentiment = neutral[random.randint(0, len(neutral)-1)]
        emoji = "😐"
    return {**scores, "sentiment": sentiment, "emoji": emoji}
