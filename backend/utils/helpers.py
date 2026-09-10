import uuid


class IdGenerator:
    """Utility class to generate simple IDs."""

    @staticmethod
    def next_id() -> str:
        return uuid.uuid4().hex
