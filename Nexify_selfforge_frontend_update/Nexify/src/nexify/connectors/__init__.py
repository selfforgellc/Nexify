"""Data source connectors for Deep Research."""

from nexify.connectors._stubs import (
    Attachment,
    BaseConnector,
    Document,
    SyncStatus,
)
from nexify.connectors.store import KnowledgeStore

__all__ = ["Attachment", "BaseConnector", "Document", "KnowledgeStore", "SyncStatus"]

# Auto-register built-in connectors
import nexify.connectors.obsidian  # noqa: F401

try:
    import nexify.connectors.gmail  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.gmail_imap  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.gdrive  # noqa: F401
except ImportError:
    pass  # httpx may not be installed

try:
    import nexify.connectors.notion  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.granola  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.gcontacts  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.imessage  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.apple_notes  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.apple_music  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.apple_contacts  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.slack_connector  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.outlook  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.gcalendar  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.dropbox  # noqa: F401
except ImportError:
    pass  # httpx may not be installed

try:
    import nexify.connectors.whatsapp  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.oura  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.apple_health  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.strava  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.spotify  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.google_tasks  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.weather  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.github_notifications  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.hackernews  # noqa: F401
except ImportError:
    pass

try:
    import nexify.connectors.news_rss  # noqa: F401
except ImportError:
    pass

