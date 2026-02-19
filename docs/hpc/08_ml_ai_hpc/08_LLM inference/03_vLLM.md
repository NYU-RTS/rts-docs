# High-performance LLM inference with `vLLM`

## What is vLLM?
[`vLLM`](https://docs.vllm.ai/en/latest/) is an easy-to-use library for LLM inference and serving which support a wide variety of models with optimized kernels ensuring optimal utilization of GPUs.

## Why `vLLM`?
We tested `vLLM` and `llama-cpp` (the inference framework behind `ollama`) on Torch, and found `vLLM` performs better on Torch with the following model and token configuration:

Model: `Qwen2.5-7B-Instruct`

Prompt Tokens: `512`

Output Tokens: `256`

|Inference Server|Peak Throughput|Median Latency(ms)|Recommendation
|-----|-----|-----|-----|
|`vLLM`|~4689.6|~48.0|Best for Batch/Research|
|`llama-cpp`|~115.0|~280.0|Best for Single User|

## vLLM Installation Instructions
Create a `vLLM` directory in your /scratch directory, then install the vLLM image:
```
apptainer pull docker://vllm/vllm-openai:latest
```
### Avoid filling up your `$HOME` directory
To avoid exceeding your `$HOME` quota (50GB) and inode limits (30,000 files), you should redirect `vLLM`'s cache and Hugging Face's model downloads to your scratch space:
```sh
export HF_HOME=/scratch/$USER/hf_cache
export VLLM_CACHE_ROOT=/scratch/$USER/vllm_cache
```
You should run this to configure `vLLM` to always use your `$SCRATCH` storage for consistent use:
```sh
echo "export HF_HOME=/scratch/\$USER/hf_cache" >> ~/.bashrc
echo "export VLLM_CACHE_ROOT=/scratch/\$USER/vllm_cache" >> ~/.bashrc
```

:::note
Files on `$SCRATCH` are not backed up and will be deleted after 60 days of inactivity. Always keep your source code and .slurm scripts in `$HOME`!
:::

## Run vLLM
### Online Serving (OpenAI-Compatible API)
`vLLM` implements the OpenAI API protocol, allowing it to be a drop-in replacement for applications using OpenAI's services. By default, it starts the server at `http://localhost:8000`. You can specify the address with `--host` and `--port` arguments. 
**In Terminal 1:**
Start  vLLM server (In this example we use Qwen model):
```sh
apptainer exec --nv vllm-openai_latest.sif vllm serve "Qwen/Qwen2.5-0.5B-Instruct"
```
When you see:
```
Application startup complete.
```
Open another terminal and log in to the same computing node as in terminal 1.

**In Terminal 2**
```sh
curl http://localhost:8000/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
        "model": "Qwen/Qwen2.5-0.5B-Instruct",
        "messages": [
            {"role": "user", "content": "Your prompt..."}
        ]
    }'
```

### Offline Inference
If you need to process a large dataset at once without setting up a server, you can use `vLLM`'s LLM class.
For example, the following code downloads the `facebook/opt-125m` model from HuggingFace and runs it in `vLLM` using the default configuration.
```python
from vllm import LLM

# Initialize the vLLM engine.
llm = LLM(model="facebook/opt-125m")
```
After initializing the LLM instance, use the available APIs to perform model inference.

### SGLang: A Simple Option for Offline Batch Inference
For cases where users only want to run batch inference and do not need an HTTP endpoint, SGLang provides a much simpler offline engine API compared to running a full vLLM server. It is particularly suitable for dataset processing, evaluation pipelines, and one-off large-scale inference jobs.
For more details and examples, see the official SGLang offline engine documentation here: https://docs.sglang.io/basic_usage/offline_engine_api.html


## `vLLM` CLI
The `vllm` command-line tool is used to run and manage `vLLM` models. You can start by viewing the help message with:
```sh
vllm --help
```
Serve - Starts the vLLM OpenAI Compatible API server.
```sh
vllm serve meta-llama/Llama-2-7b-hf
```
Chat - Generate chat completions via the running API server.
```sh
# Directly connect to localhost API without arguments
vllm chat

# Specify API url
vllm chat --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick chat with a single prompt
vllm chat --quick "hi"
```
Complete - Generate text completions based on the given prompt via the running API server.
```sh
# Directly connect to localhost API without arguments
vllm complete

# Specify API url
vllm complete --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick complete with a single prompt
vllm complete --quick "The future of AI is"
```

For more CLI command references: visit https://docs.vllm.ai/en/stable/cli/.
