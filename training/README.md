# Nexify Training System

This folder sets up Nexify's model improvement pipeline without gambling the whole product on blind fine-tuning.

The correct order is:

1. **Instruction and identity layer** — give Nex the right mission, behavior, tone, tool rules, and SelfForge standards.
2. **Project knowledge/RAG** — index Nexify, AutoForge, SelfForge, deployment docs, repo notes, and architecture files so the model can retrieve facts instead of memorizing everything.
3. **Dataset capture** — save approved command/answer/fix examples into clean JSONL.
4. **LoRA fine-tuning** — train adapters only after the examples are high quality.
5. **Evaluation gate** — every trained adapter must pass coding, deployment, safety, and SelfForge workflow checks before it becomes default.

## Fast path: create a Nexify Ollama model now

This does not train weights yet. It creates a better-behaved Ollama model with Nexify's system identity and operating rules.

```powershell
cd C:\dev\Nexify
ollama create nexify-coder -f training\ollama\Modelfile.nexify-coder
ollama run nexify-coder "Say Nexify is online and explain your job in one sentence."
```

Then update:

```toml
# C:\Users\akjoh\.nexify\config.toml
[intelligence]
default_model = "nexify-coder"
```

## Build a training dataset

```powershell
cd C:\dev\Nexify
uv run python training\scripts\validate_dataset.py --input training\data\seed\nexify_seed.jsonl
uv run python training\scripts\collect_project_corpus.py --root . --output training\data\raw\project_corpus.jsonl
uv run python training\scripts\build_instruction_dataset.py --seed training\data\seed\nexify_seed.jsonl --corpus training\data\raw\project_corpus.jsonl --output training\data\processed\nexify_instructions.jsonl
uv run python training\scripts\validate_dataset.py --input training\data\processed\nexify_instructions.jsonl
```

## Fine-tune later

Local 8GB VRAM is great for inference, but fine-tuning a 7B coding model can be tight. This repo includes a LoRA training script, but the recommended first move is to collect/evaluate data and use the Ollama Modelfile model. Run actual LoRA training on a larger GPU or cloud machine when you have enough examples.

```powershell
pip install -r training\requirements-training.txt
python training\scripts\train_lora.py --config training\configs\qwen2_5_coder_7b_lora.yaml
python training\scripts\evaluate_adapter.py --dataset training\evals\nexify_eval_prompts.jsonl --model nexify-coder
```

## What Nexify should become

Nexify/Nex is not just a chatbot. It is SelfForge's AI software operator:

- understands SelfForge apps and architecture,
- writes complete production-grade code files,
- diagnoses Vercel/Render/GitHub/Ollama issues,
- protects secrets and asks before destructive actions,
- manages project memory,
- plans changes before editing,
- evaluates its own output before deployment.
