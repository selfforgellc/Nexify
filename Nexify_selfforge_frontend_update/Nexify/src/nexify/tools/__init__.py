"""Tools primitive — tool system with ABC interface and built-in tools."""

from __future__ import annotations

from nexify.tools._stubs import BaseTool, ToolExecutor, ToolSpec

# Import built-in tools to trigger @ToolRegistry.register() decorators.
# Each is wrapped in try/except so the package loads even before the
# individual tool modules are created.
try:
    import nexify.tools.calculator  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.think  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.retrieval  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.llm_tool  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.file_read  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.web_search  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.code_interpreter  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.code_interpreter_docker  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.repl  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.storage_tools  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.mcp_adapter  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.channel_tools  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.http_request  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.shell_exec  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.memory_manage  # noqa: F401
except ImportError:
    pass
try:
    import nexify.tools.user_profile_manage  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.skill_manage  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.file_write  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.apply_patch  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.git_tool  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.db_query  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.pdf_tool  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.image_tool  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.audio_tool  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.knowledge_tools  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.text_to_speech  # noqa: F401
except ImportError:
    pass

try:
    import nexify.tools.digest_collect  # noqa: F401
except ImportError:
    pass

__all__ = ["BaseTool", "ToolExecutor", "ToolSpec"]

