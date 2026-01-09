"""
Groq API Integration for JONA
Fast LLM inference using Groq's API
⚠️ API Key must be in .env file, NEVER hardcoded
"""

import os
from typing import Optional
import asyncio
from functools import lru_cache
import logging

logger = logging.getLogger(__name__)


class GroqClient:
    """
    Groq API Client - Secure Implementation
    Reads API key from environment variables only
    """

    def __init__(self):
        """Initialize Groq client from .env"""
        # Load from environment - NEVER hardcode
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
        self.enabled = self.api_key is not None

        if not self.enabled:
            logger.warning("⚠️ GROQ_API_KEY not set in .env - Groq integration disabled")
        else:
            logger.info(f"✅ Groq API initialized (Model: {self.model})")

    async def generate_completion(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.7,
        top_p: float = 0.95
    ) -> Optional[str]:
        """
        Generate completion using Groq API

        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (0-2)
            top_p: Nucleus sampling parameter

        Returns:
            Generated text or None if error
        """
        if not self.enabled:
            logger.error("Groq API not enabled - check GROQ_API_KEY in .env")
            return None

        try:
            # Import here to avoid hard dependency
            from groq import Groq

            client = Groq(api_key=self.api_key)

            message = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=top_p,
            )

            return message.choices[0].message.content

        except Exception as e:
            logger.error(f"❌ Groq API error: {str(e)}")
            return None

    async def stream_completion(
        self,
        prompt: str,
        max_tokens: int = 512,
        temperature: float = 0.7,
    ):
        """
        Stream completion from Groq API

        Args:
            prompt: Input prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature

        Yields:
            Streamed text chunks
        """
        if not self.enabled:
            logger.error("Groq API not enabled")
            return

        try:
            from groq import Groq

            client = Groq(api_key=self.api_key)

            stream = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.model,
                max_tokens=max_tokens,
                temperature=temperature,
                stream=True,
            )

            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content

        except Exception as e:
            logger.error(f"❌ Groq streaming error: {str(e)}")


@lru_cache()
def get_groq_client() -> GroqClient:
    """Get Groq client singleton"""
    return GroqClient()


# Example usage:
async def example_usage():
    """Example of how to use Groq API"""
    client = get_groq_client()

    if client.enabled:
        # Simple completion
        response = await client.generate_completion("What is AI?")
        print(f"Response: {response}")

        # Streaming
        print("\nStreaming response:")
        async for chunk in client.stream_completion("Explain quantum computing in 100 words"):
            print(chunk, end="", flush=True)
    else:
        print("⚠️ Groq API not configured. Set GROQ_API_KEY in .env")


if __name__ == "__main__":
    asyncio.run(example_usage())
