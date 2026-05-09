from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class EmailRequest(BaseModel):
    sender_name: str
    company_name: str
    product_description: str
    recipient_name: str
    recipient_role: str
    tone: str = "professional"

@app.post("/generate")
async def generate_email(request: EmailRequest):
    try:
        prompt = f"""
        You are an expert cold email copywriter. Generate a high-converting cold email based on the following details:
        
        SENDER INFO:
        Name: {request.sender_name}
        Company: {request.company_name}
        
        PRODUCT/SERVICE:
        {request.product_description}
        
        RECIPIENT INFO:
        Name: {request.recipient_name}
        Role: {request.recipient_role}
        
        TONE: {request.tone}
        
        INSTRUCTIONS:
        - Write a compelling subject line.
        - The email should be short, punchy, and focused on the value for the recipient.
        - Include a clear call to action (CTA).
        - Use the specified tone.
        - Do not use placeholders like [Your Name], use the provided sender info.
        """
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )
        
        return {"email": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
