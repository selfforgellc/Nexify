"""Storage primitive — persistent searchable storage."""

from __future__ import annotations

# Always-available backend
import nexify.tools.storage.sqlite  # noqa: F401

# Optional backends — import to trigger registration
try:
    import nexify.tools.storage.bm25  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.storage.faiss_backend  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.storage.colbert_backend  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.storage.hybrid  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.storage.dense  # noqa: F401
except ImportError:
    pass

from nexify.tools.storage._stubs import MemoryBackend, RetrievalResult
from nexify.tools.storage.chunking import Chunk, ChunkConfig, chunk_text
from nexify.tools.storage.context import ContextConfig, inject_context
from nexify.tools.storage.ingest import ingest_path, read_document

__all__ = [
    "Chunk",
    "ChunkConfig",
    "ContextConfig",
    "MemoryBackend",
    "RetrievalResult",
    "chunk_text",
    "inject_context",
    "ingest_path",
    "read_document",
]

