# Machine Learning (ML) and Artificial Intelligence (AI) on HPC

Many people are interested in running ML and/or AI workflows on the HPC resources.  To help facilitate this we have created this section that will provide examples of how one might use our resources for ML and AI tasks.

For ML we'll cover two prominent open-source deep learning frameworks, PyTorch and TensorFlow.  We'll show how to start with a single GPU example and then show more sophisticated examples. 

For AI we'll cover how to run a Hugging Face Large Language Model (LLM) and how to fine tune an LLM. Specifically, we provide guides on:

**LLM Inference**: Use the standard Hugging Face transformers library for basic tasks, and also introduce vLLM, a high-throughput serving engine that offers faster inference and an OpenAI-compatible API.

**vLLM CLI**: We provide examples of using the vllm command-line tool to quickly serve models and engage in interactive chat sessions.

**Fine-tuning LLMs**: We provide a practical example of fine-tuning the Gemma model to follow specific instructions. This section compares the original model with our improved version, showing how to achieve better response quality on Torch.
