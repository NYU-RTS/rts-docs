# vLLM - A Command Line LLM Tool
## What is vLLM?
[vLLM](https://docs.vllm.ai/en/latest/) is a fast and easy-to-use library for LLM inference and serving.
## vLLM Installation Instructions
Create a vLLM directory in your /scratch directory, then install the vLLM image:
```
apptainer pull docker://vllm/vllm-openai:latest
```
### Use High-Performance SCRATCH Storage
LLMs require very fast storage. On Torch, the SCRATCH filesystem is an all-flash system designed for AI workloads, providing excellent performance.To avoid exceeding your $HOME quota (50GB) and inode limits (30,000 files), you should redirect vLLM's cache and Hugging Face's model downloads to your scratch space:
```
export HF_HOME=/scratch/$USER/hf_cache
export VLLM_CACHE_ROOT=/scratch/$USER/vllm_cache
```
You should run this to configure vLLM to always use your SCRATCH storage for consistent use:
```
echo "export HF_HOME=/scratch/\$USER/hf_cache" >> ~/.bashrc
echo "export VLLM_CACHE_ROOT=/scratch/\$USER/vllm_cache" >> ~/.bashrc
```

Note: Files on $SCRATCH are not backed up and will be deleted after 60 days of inactivity. Always keep your source code and .slurm scripts in $HOME!

## Run vLLM
### Online Serving
You can run ollama on a random port:
```
export OLPORT=$(python3 -c "import socket; sock=socket.socket(); sock.bind(('',0)); print(sock.getsockname()[1])")
OLLAMA_HOST=127.0.0.1:$OLPORT ./bin/ollama serve
```
You can use the above as part of a Slurm batch job like the example below:
```
#!/bin/bash
#SBATCH --job-name=ollama
#SBATCH --output=ollama_%j.log
#SBATCH --ntasks=1
#SBATCH --mem=8gb
#SBATCH --gres=gpu:a100:1
#SBATCH --time=01:00:00

export OLPORT=$(python3 -c "import socket; sock=socket.socket(); sock.bind(('',0)); print(sock.getsockname()[1])")
export OLLAMA_HOST=127.0.0.1:$OLPORT 

./bin/ollama serve > ollama-server.log 2>&1 &&
wait 10
./bin/ollama pull mistral
python my_ollama_python_script.py >> my_ollama_output.txt
```
In the above example, your python script will be able to talk to the ollama server.

### Offline Inference
If you need to process a large dataset at once without setting up a server, you can use vLLM's LLM class.

**In Terminal 1:**

Start ollama
```
export OLPORT=$(python3 -c "import socket; sock=socket.socket(); sock.bind(('',0)); print(sock.getsockname()[1])")
echo $OLPORT #so you know what port Ollama is running on
OLLAMA_HOST=127.0.0.1:$OLPORT ./bin/ollama serve
```
**In Terminal 2:**

Pull a model and begin chatting
```
export OLLAMA_HOST=127.0.0.1:$OLPORT 
./bin/ollama pull llama3.2
./bin/ollama run llama3.2
```


## vLLM CLI
The vllm command-line tool is used to run and manage vLLM models. You can start by viewing the help message with:
```
vllm --help
```
Serve - Starts the vLLM OpenAI Compatible API server.
```
vllm serve meta-llama/Llama-2-7b-hf
```
Chat - Generate chat completions via the running API server.
```
# Directly connect to localhost API without arguments
vllm chat

# Specify API url
vllm chat --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick chat with a single prompt
vllm chat --quick "hi"
```
Complete - Generate text completions based on the given prompt via the running API server.
```
# Directly connect to localhost API without arguments
vllm complete

# Specify API url
vllm complete --url http://{vllm-serve-host}:{vllm-serve-port}/v1

# Quick complete with a single prompt
vllm complete --quick "The future of AI is"
```

For more CLI command references: visit https://docs.vllm.ai/en/stable/cli/.
