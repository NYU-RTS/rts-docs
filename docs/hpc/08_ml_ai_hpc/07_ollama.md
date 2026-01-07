# Ollama - A Command Line LLM Tool
## What is Ollama?
[Ollama](https://github.com/ollama/ollama) is a developing command line tool designed to run large language models.

## Ollama Installation Instructions
Create an Ollama directory in your /scratch directory, then download the ollama files:
```
curl -L https://ollama.com/download/ollama-linux-amd64.tgz -o ollama-linux-amd64.tgz
tar -vxzf ollama-linux-amd64.tgz
```
### Use High-Performance SCRATCH Storage
There are several environment variables that can be changed:
```
ollama serve --help
#Environment Variables:
#OLLAMA_HOST The host:port to bind to (default "127.0.0.1:11434")
#OLLAMA_ORIGINS A comma separated list of allowed origins.
#OLLAMA_MODELS The path to the models directory (default is "~/.ollama/models")
#OLLAMA_KEEP_ALIVE The duration that models stay loaded in memory (default is "5m")
```
LLMs require very fast storage. On Torch, the SCRATCH filesystem is an all-flash system designed for AI workloads, providing excellent performance. You should change your model download directory to your scratch space:
```
export OLLAMA_MODELS=/scratch/$USER/ollama_models
```
You should run this to configure ollama to always use your SCRATCH storage for consistent use:
```
echo "export OLLAMA_MODELS=/scratch/$USER/ollama_models" >> ~/.bashrc
```

## Run Ollama
### Batch Style Jobs
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
### Interactive Ollama Sessions
If you want to run Ollama and chat with it, open a Desktop session on a GPU node via Open Ondemand (https://ood.hpc.nyu.edu/) and launch two terminals, one to start the ollama server and the other to chat with LLMs.

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
Note that you may have to redefine OLPORT in the second terminal, if you do, make sure you manually set it to the same port as the other terminal window.
