# Fine tune LLMs on HPC

## Model and Dataset Selection Rationale

|Component|Configuration|
|---|---|
|Base Model|`google/gemma-3-4b-pt` (pretrained)|
|Comparison Model|`google/gemma-3-4b-it` (instruction-tuned)|
|Dataset|`timdettmers/openassistant-guanaco`|
|Justification|Using Gemma-3 allows direct comparison between base pretrained, our LoRA fine-tuned, and official instruction-tuned variants. The OpenAssistant Guanaco dataset provides high-quality instruction-following examples.|

### Dataset Overview

The `timdettmers/openassistant-guanaco` dataset is a high-quality instruction-following dataset containing conversational exchanges between humans and AI assistants. It includes diverse question-answer pairs covering topics like creative writing, problem-solving, factual queries, and technical explanations. The dataset is specifically designed to train models to follow instructions and provide helpful, harmless, and honest responses.

### Fine-tuning Benefits

Fine-tuning Gemma-3-4B-PT on this dataset significantly improves the model's ability to:

-   **Follow complex instructions**: Better understanding of multi-step requests and nuanced prompts
-   **Maintain conversational context**: Improved coherence in longer dialogues  
-   **Provide structured responses**: Enhanced ability to format answers appropriately
-   **Reduce harmful outputs**: Training on carefully curated data reduces problematic responses

By using Gemma-3, we can compare three variants:

1.  **Base pretrained** (`google/gemma-3-4b-pt`) - Raw language modeling capabilities
2.  **Our LoRA fine-tuned** - Custom instruction following on Guanaco dataset
3.  **Official instruction-tuned** (`google/gemma-3-4b-it`) - Google's instruction tuning baseline

This provides a comprehensive evaluation of fine-tuning effectiveness.

---

## Three-Way Model Comparison

### Example Prompt: "Explain quantum computing in simple terms for a beginner"

#### Base Pretrained Model (`google/gemma-3-4b-pt`):

```
Quantum computing uses quantum bits or qubits instead of classical bits. Qubits can be in superposition states and can be entangled. This allows quantum computers to perform certain calculations exponentially faster than classical computers for specific problems like factoring large numbers and simulating quantum systems.
```

#### Our LoRA Fine-tuned Model (Gemma-3-4B-PT + LoRA on Guanaco):

```
Great question! Let me break down quantum computing in simple terms:

**Think of it like this**: Regular computers use bits that are either 0 or 1 (like light switches that are either ON or OFF). Quantum computers use "quantum bits" or "qubits" that can be 0, 1, or both at the same time - imagine a coin that's spinning in the air, being both heads and tails until it lands.

**Why this matters**: This allows quantum computers to:
- Try many solutions to a problem simultaneously
- Solve certain types of problems much faster than regular computers
- Handle complex calculations that would take classical computers thousands of years

**Real applications**: Password breaking, drug discovery, weather prediction, and financial modeling.
```
The fine-tuned model provides clearer explanations with better structure, analogies, and practical context!


#### Official Instruction-tuned Model (`google/gemma-3-4b-it`):

```
Quantum computing is a revolutionary approach to computation that leverages quantum mechanics principles. Here's a beginner-friendly explanation:

**Basic Concept**: While classical computers use bits (0 or 1), quantum computers use quantum bits (qubits) that can exist in multiple states simultaneously through "superposition."

**Key Advantages**:
- Parallel processing of multiple possibilities
- Exponential speedup for specific problem types
- Superior performance in cryptography, optimization, and simulation

**Current Applications**: Drug discovery, financial modeling, cryptography, and artificial intelligence research.

```
This comparison demonstrates how our custom fine-tuning can achieve similar or better instruction-following capabilities compared to the official instruction-tuned variant.

---


:::tip
Complete scripts used are available here: https://github.com/NYU-RTS/rts-docs-examples/tree/main/hpc/llm_fine_tuning

:::

## System Environment Setup

### Singularity Container & Overlay Configuration

|Component|Configuration|
|---|---|
|Singularity Image|`/scratch/work/public/singularity/cuda11.2.2-cudnn8-devel-ubuntu20.04.sif`|
|Overlay|Created using `singularity overlay create --size 25000 overlay-25GB-conda.ext3`|
|Conda Path|`/ext3/miniconda3` within overlay|
|Singularity Shell Command|See below|

```bash
singularity shell --nv \
  --overlay /scratch/<NetID>/fine-tune/overlay-25GB-conda.ext3:rw \
  /scratch/work/public/singularity/cuda11.2.2-cudnn8-devel-ubuntu20.04.sif
```

### Python Environment and Dependency Installation

```bash
bash Miniconda3-latest-Linux-x86_64.sh -b -p /ext3/miniconda3
source /ext3/miniconda3/bin/activate
pip install torch transformers datasets accelerate peft trl
```

### Model Cache Configuration for Hugging Face

To avoid exceeding home directory quotas during large model downloads:

```bash
export HF_HOME=/scratch/<NetID>/.cache/huggingface
```

Ensure this is set both interactively and within sbatch scripts.

---

## Operational Troubleshooting: Common Errors and Recommended Fixes

This section provides a comprehensive overview of all environment-related issues encountered during the fine-tuning of `google/gemma-3-4b-pt` on the NYU Torch HPC cluster. Each entry includes the error symptom, root cause, and resolution strategy, categorized for clarity.

### 1. Filesystem and Path Setup Issues

|Problem|Symptom|Cause|Resolution|
|---|---|---|---|
|Incorrect overlay filename|No such file: `overlay-50GB-500K.ext3.gz`|The filename was incorrectly assumed|Use `ls /scratch/work/public/overlay-fs-ext3/` to verify the correct file: `overlay-50G-10M.ext3.gz`|
|Compressed overlay used directly|`FATAL: while loading overlay images...`|Attempted to use `.gz` file directly with Singularity|Run `gunzip overlay-50G-10M.ext3.gz` before using the file|
|Overlay missing in working directory|sbatch cannot find the overlay file|Overlay not copied to the training directory|Ensure the overlay file is placed in `/scratch/<NetID>/fine-tune/` where sbatch accesses it|
|Invalid overlay structure|`FATAL: could not create upper dir`|Overlay created via `fallocate` + `mkfs.ext3`, missing necessary internal structure|Always use `singularity overlay create --size 25000` to create overlays|

### 2. Container Runtime and Overlay Mounting Errors

|Problem|Symptom|Cause|Resolution|
|---|---|---|---|
|GPU warning on login node|`WARNING: Could not find any nv files`|`--nv` flag used outside GPU-enabled session|Ignore the warning, or only use `--nv` within a `srun --gres=gpu:1` session|
|Overlay locked by another process|`overlay in use by another process`|An interactive container shell using the overlay was still active|Run `lsof` or `ps aux` and terminate blocking process|

### 3. Python Package Installation and Environment Setup Errors

|Problem|Symptom|Cause|Resolution|
|---|---|---|---|
|`which pip` returns `Illegal option --`|Unexpected error when checking pip|Uses `/usr/bin/which` instead of Bash built-in|Use `command -v pip` or simply run `pip --version`|
|`xformers` install fails due to missing torch|`No module named torch` during install|PyTorch not installed before building `xformers`|Install torch first: `pip install torch`, then `pip install xformers`|
|Missing `transformers` in sbatch|`ImportError: No module named transformers`|Conda not activated in job script|Add `source /ext3/miniconda3/bin/activate` before executing the training script|
|Installed pip packages not found|Training job fails to locate modules|pip used outside overlay context|Only install packages while the overlay is mounted with `:rw` in an active container session|

### 4. Disk Quota and Cache Management Issues

|Problem|Symptom|Cause|Resolution|
|---|---|---|---|
|Quota exceeded on home|`OSError: [Errno 122] Disk quota exceeded: ~/.cache/huggingface`|Default HuggingFace cache path inside `/home`|Set `HF_HOME=/scratch/$USER/.cache/huggingface`|
|Cache redownloading on each sbatch|Hugging Face cache not shared|`HF_HOME` not consistently defined|Persist and reuse the same `HF_HOME` path across runs|

### 5. Slurm Job Submission and Runtime Failures

|Problem|Symptom|Cause|Resolution|
|---|---|---|---|
|Invalid Slurm account|`sbatch: Invalid account`|`--account` flag not set or invalid|Use `--account=pr_100_tandon_priority`|
|Conda environment not recognized|`No module named transformers`|Activation missing in sbatch|Add `source /ext3/miniconda3/bin/activate` in sbatch|
|Overlay not found during job|sbatch fails to locate file|Overlay not placed in expected directory|Ensure all relevant files are in `/scratch/<NetID>/fine-tune/` or update paths accordingly|

---

## Recommended Best Practices for Stable Execution

| Recommendation                                        | Rationale                                                    |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Use `singularity overlay create` for overlay creation | Ensures `upper/` and `work/` directories are properly set up |
| Install pip packages only after mounting overlay      | Ensures packages persist and are isolated inside the overlay |
| Activate Conda explicitly in sbatch                   | Slurm jobs do not inherit interactive shell environments     |
| Set `HF_HOME` to `/scratch`                           | Prevents hitting disk quota limits in home directories       |
| Avoid `return_tensors="pt"` in tokenizer mapping      | Leads to shape mismatch errors in batched training           |
| Use subset sampling (e.g., `train[:1%]`) for testing  | Minimizes resource consumption and enables fast debugging    |

---

## LoRA Configuration Parameters

LoRA (Low-Rank Adaptation) is a technique for efficiently fine-tuning large models with reduced computational cost. It adapts the model's layers by adding low-rank matrices while maintaining the original model's parameters. This enables efficient training with fewer resources.

Learn more about LoRA [here](https://huggingface.co/learn/llm-course/en/chapter11/4).

Here are the configuration parameters used for LoRA in this fine-tuning setup:

```python
peft_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)
```

---

## sbatch Job Script for Model Training

### **Training Script: `train_gemma3.py`**

The complete training script is available [here](https://github.com/NYU-RTS/rts-docs-examples/tree/main/hpc/llm_fine_tuning). Below are the key configuration snippets:

**Model and Dataset Configuration:**

```python
# Model and dataset configuration
model_name = "google/gemma-3-4b-pt"  # Base pretrained model
dataset_name = "timdettmers/openassistant-guanaco"
output_dir = "./gemma3_output"
```

**LoRA Configuration:**

```python
# LoRA configuration
peft_config = LoraConfig(
    r=8,
    lora_alpha=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)
```

**Training Arguments:**

```python
# Training arguments
training_args = TrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    num_train_epochs=1,
    learning_rate=2e-4,
    fp16=True,
    logging_steps=10,
    save_steps=50,
    save_total_limit=2,
    remove_unused_columns=False,
    dataloader_pin_memory=False,
)
```


### **sbatch Script**

```bash
#!/bin/bash
#SBATCH --job-name=gemma3-finetune
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=4
#SBATCH --mem=40GB
#SBATCH --gres=gpu:1
#SBATCH --time=12:00:00
#SBATCH --output=/scratch/<NetID>/fine-tune/gemma3_train_%j.out
#SBATCH --error=/scratch/<NetID>/fine-tune/gemma3_train_%j.err
#SBATCH --mail-type=END,FAIL
#SBATCH --mail-user=<NetID>@nyu.edu

export HF_HOME=/scratch/<NetID>/.cache/huggingface

singularity exec --nv \
  --overlay /scratch/<NetID>/fine-tune/overlay-25GB-conda.ext3:rw \
  /scratch/work/public/singularity/cuda11.2.2-cudnn8-devel-ubuntu20.04.sif \
  /bin/bash -c "
    source /ext3/miniconda3/bin/activate
    cd /scratch/<NetID>/fine-tune
    python train_gemma3.py
"
```

---

## Generated Output Artifacts

|File|Description|
|---|---|
|`adapter_model.safetensors`|LoRA adapter weights|
|`adapter_config.json`|Adapter architecture definition|
|`trainer_state.json`|Training metadata|
|`training_args.bin`|Saved training configuration|
|`tokenizer_config.json`, `tokenizer.json`|Tokenizer data|

Location: `/scratch/<NetID>/fine-tune/gemma3_output/checkpoint-13/`

---

## Training Completion Summary

|Epochs|Steps|Status|
|---|---|---|
|1|13|Completed successfully|
