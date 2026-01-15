import random
import string
from typing import Optional
from telegram import Bot
from telegram.error import TelegramError
from app.config import get_settings

settings = get_settings()


class TelegramService:
    """Service for handling Telegram 2FA operations"""
    
    def __init__(self):
        if settings.telegram_bot_token:
            self.bot = Bot(token=settings.telegram_bot_token)
        else:
            self.bot = None
    
    @staticmethod
    def generate_code(length: int = 6) -> str:
        """Generate a random numeric code"""
        return ''.join(random.choices(string.digits, k=length))
    
    async def send_code(self, chat_id: str, code: str) -> bool:
        """
        Send verification code to user's Telegram
        
        Args:
            chat_id: Telegram chat ID
            code: Verification code to send
            
        Returns:
            bool: True if message was sent successfully
        """
        if not self.bot:
            raise ValueError("Telegram bot token not configured")
        
        try:
            message = (
                f"🔐 *Vibe Coding 2FA*\n\n"
                f"Your verification code is: `{code}`\n\n"
                f"This code will expire in 5 minutes.\n"
                f"Do not share this code with anyone."
            )
            
            await self.bot.send_message(
                chat_id=chat_id,
                text=message,
                parse_mode='Markdown'
            )
            return True
            
        except TelegramError as e:
            print(f"Failed to send Telegram message: {e}")
            return False
    
    async def verify_chat_id(self, chat_id: str) -> bool:
        """
        Verify if a Telegram chat ID is valid
        """
        # Simply check if chat_id is a valid number
        try:
            int(chat_id)
            return True
        except ValueError:
            return False


# Singleton instance
telegram_service = TelegramService()
