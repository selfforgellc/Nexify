"""Learning primitive -- router policies, reward functions, learning."""

from __future__ import annotations

from nexify.learning._stubs import (
    QueryAnalyzer,
    RewardFunction,
    RouterPolicy,
    RoutingContext,
)
from nexify.learning.agents.agent_evolver import AgentConfigEvolver
from nexify.learning.learning_orchestrator import LearningOrchestrator
from nexify.learning.optimize.llm_optimizer import LLMOptimizer
from nexify.learning.optimize.optimizer import OptimizationEngine
from nexify.learning.optimize.store import OptimizationStore
from nexify.learning.routing.complexity import (
    ComplexityQueryAnalyzer,
    score_complexity,
)
from nexify.learning.routing.heuristic_reward import HeuristicRewardFunction
from nexify.learning.routing.router import (
    HeuristicRouter,
    build_routing_context,
)
from nexify.learning.training.data import TrainingDataMiner
from nexify.learning.training.lora import HAS_TORCH, LoRATrainer, LoRATrainingConfig


def ensure_registered() -> None:
    """Ensure all learning policies are registered in RouterPolicyRegistry."""
    from nexify.learning.routing.heuristic_policy import (
        ensure_registered as _reg_heuristic,
    )

    _reg_heuristic()

    from nexify.learning.routing.learned_router import (
        ensure_registered as _reg_learned,
    )

    _reg_learned()

    # Intelligence training (optional deps)
    try:
        import nexify.learning.intelligence  # noqa: F401
    except ImportError:
        pass

    # Orchestrator-specific training (optional deps)
    try:
        import nexify.learning.intelligence.orchestrator  # noqa: F401
    except ImportError:
        pass

    # Agent optimizers (optional deps)
    try:
        import nexify.learning.agents.dspy_optimizer  # noqa: F401
    except ImportError:
        pass
    try:
        import nexify.learning.agents.gepa_optimizer  # noqa: F401
    except ImportError:
        pass


__all__ = [
    "AgentConfigEvolver",
    "ComplexityQueryAnalyzer",
    "HAS_TORCH",
    "HeuristicRewardFunction",
    "HeuristicRouter",
    "LLMOptimizer",
    "LearningOrchestrator",
    "LoRATrainer",
    "LoRATrainingConfig",
    "OptimizationEngine",
    "OptimizationStore",
    "QueryAnalyzer",
    "RewardFunction",
    "RouterPolicy",
    "RoutingContext",
    "TrainingDataMiner",
    "build_routing_context",
    "ensure_registered",
    "score_complexity",
]

