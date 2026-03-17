import secrets
import string
import uuid

# ── Word pools for username generation ───────────────────────────────────────

WORDS = [
    "nova", "echo", "flux", "apex", "swift", "lunar", "solar", "cyber",
    "pixel", "storm", "frost", "blaze", "ghost", "raven", "onyx", "jade",
    "cobalt", "neon", "void", "delta", "sigma", "alpha", "zeta", "prism",
    "wolf", "hawk", "fox", "bear", "lynx", "crow", "pike", "dart",
    "reef", "dusk", "dawn", "mist", "vale", "peak", "core", "node",
    "byte", "grid", "loop", "arc", "wave", "pulse", "spark", "shade",
]

EMAIL_CATEGORIES = [
    "shopping", "social", "gaming", "work", "travel", "news",
    "finance", "health", "food", "tech", "music", "sports",
]


# ── Individual generators ─────────────────────────────────────────────────────

def generate_alias_email() -> str:
    """
    Returns e.g. shopping_482@anonmitra.com
    Format: category_NNNN@anonmitra.com  (number 1000-9999)
    """
    category = secrets.choice(EMAIL_CATEGORIES)
    number   = secrets.randbelow(9000) + 1000
    return f"{category}_{number}@anonmitra.com"


def generate_username() -> str:
    """
    Returns e.g. nova_381
    Format: word_NNN  (number 100-999)
    """
    word   = secrets.choice(WORDS)
    number = secrets.randbelow(900) + 100
    return f"{word}_{number}"


def generate_password(length: int = 12) -> str:
    """
    Returns a strong password e.g. X8@kP!2z
    Guarantees at least one uppercase, lowercase, digit, and symbol.
    """
    if length < 8:
        length = 8

    upper     = string.ascii_uppercase
    lower     = string.ascii_lowercase
    digits    = string.digits
    symbols   = "!@#$%^&*"
    all_chars = upper + lower + digits + symbols

    # Guarantee one of each required type
    chars = [
        secrets.choice(upper),
        secrets.choice(lower),
        secrets.choice(digits),
        secrets.choice(symbols),
    ]
    chars += [secrets.choice(all_chars) for _ in range(length - 4)]

    # Shuffle so required chars are not always at the front
    secrets.SystemRandom().shuffle(chars)
    return "".join(chars)


# ── Main function ─────────────────────────────────────────────────────────────

def generate_identity() -> dict:
    """
    Generate a complete random identity.
    Returns a dict ready to be encrypted and saved to the database.

    Example output:
    {
        "id":          "3f7a1c2d-...",
        "alias_email": "shopping_482@anonmitra.com",
        "username":    "nova_381",
        "password":    "X8@kP!2z9#Aq",
    }
    """
    return {
        "id":          str(uuid.uuid4()),
        "alias_email": generate_alias_email(),
        "username":    generate_username(),
        "password":    generate_password(),
    }
