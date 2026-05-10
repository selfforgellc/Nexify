#!/usr/bin/env python3
"""Train a Nexify LoRA adapter from chat JSONL."""
from __future__ import annotations

import argparse
import yaml

def load_config(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    args = parser.parse_args()
    cfg = load_config(args.config)
    try:
        from datasets import load_dataset
        from peft import LoraConfig
        from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
        from trl import SFTTrainer
    except Exception as exc:
        raise SystemExit("Missing training dependencies. Run: pip install -r training/requirements-training.txt\n" + f"Original error: {exc}")

    base_model = cfg["base_model"]
    tokenizer = AutoTokenizer.from_pretrained(base_model, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model_kwargs = {"trust_remote_code": True, "device_map": "auto"}
    if cfg.get("load_in_4bit", False):
        model_kwargs["load_in_4bit"] = True
    model = AutoModelForCausalLM.from_pretrained(base_model, **model_kwargs)

    def format_example(example: dict) -> dict:
        messages = example["messages"]
        if hasattr(tokenizer, "apply_chat_template"):
            text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=False)
        else:
            text = "\n".join(f"{m['role']}: {m['content']}" for m in messages)
        return {"text": text}

    dataset = load_dataset("json", data_files=cfg["train_file"], split="train").map(format_example)
    lora_cfg = cfg["lora"]
    peft_config = LoraConfig(
        r=int(lora_cfg["r"]),
        lora_alpha=int(lora_cfg["alpha"]),
        lora_dropout=float(lora_cfg["dropout"]),
        target_modules=list(lora_cfg["target_modules"]),
        bias="none",
        task_type="CAUSAL_LM",
    )
    training_args = TrainingArguments(
        output_dir=cfg["output_dir"],
        num_train_epochs=float(cfg.get("num_train_epochs", 1)),
        per_device_train_batch_size=int(cfg.get("per_device_train_batch_size", 1)),
        gradient_accumulation_steps=int(cfg.get("gradient_accumulation_steps", 8)),
        learning_rate=float(cfg.get("learning_rate", 2e-4)),
        warmup_ratio=float(cfg.get("warmup_ratio", 0.03)),
        logging_steps=int(cfg.get("logging_steps", 10)),
        save_steps=int(cfg.get("save_steps", 100)),
        fp16=bool(cfg.get("fp16", True)),
        bf16=bool(cfg.get("bf16", False)),
        report_to=[],
    )
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=int(cfg.get("max_seq_length", 2048)),
        packing=bool(cfg.get("packing", False)),
        peft_config=peft_config,
        args=training_args,
    )
    trainer.train()
    trainer.save_model(cfg["output_dir"])
    tokenizer.save_pretrained(cfg["output_dir"])
    print(f"Saved Nexify LoRA adapter to {cfg['output_dir']}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
