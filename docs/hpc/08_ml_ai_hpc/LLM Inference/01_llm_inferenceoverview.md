# Overview
This directory provides two primary pathways for deploying and running Large Language Models (LLMs) on the NYU Torch cluster: Hugging Face Transformers (for research/experimentation) and vLLM (for high-performance serving).

## 1. Basic Inference (Hugging Face)
This method is ideal for feature extraction, embeddings, or small-scale batch processing. Persistence is achieved by setting up the environment within an `ext3` overlay that can be mounted to an Apptainer container.

**Workflow:**
Environment: Launch an Apptainer container with a read/write overlay.
Persistence: Install `conda` and libraries directly into `/ext3`.
Execution: Use AutoModel to load weights and perform a forward pass.
Key File: `huggingface.py`
Ideal for: Extracting `last_hidden_state` (embeddings) or sentiment classification.

## 2. High-Performance Serving (vLLM)
vLLM is the recommended tool for production-level throughput and low-latency inference. It utilizes `PagedAttention` to manage memory efficiently. Please find our guide on [deploying LLMs with vLLM on Torch here](./03_vLLM.md).

**Why vLLM?**
Speed: higher throughput than standard backends on Torch.
Compatibility: Drop-in replacement for OpenAI API.

**Deployment Options:**
Online: Use `vllm serve` to start an HTTP server accessible via curl or OpenAI clients.
Offline: Use the LLM class within Python for processing large datasets without a server.
