# Run a Hugging Face model

Here we provide an example of how one can run a Large-language model (LLM) on NYU Greene cluster

## Prepare environment
### Create project directory

After [logging on to a Greene login node](../02_connecting_to_hpc/01_connecting_to_hpc.mdx), make a directory for this project:
```bash
[NetID@log-1 ~]$ mkdir -p /scratch/NetID/llm_example
[NetID@log-1 ~]$ cd /scratch/NetID/llm_example
```
:::note
You'll need to replace NetID above with your NetID
:::

### Move to a compute node
Some of the following steps can require significant resources, so we'll move to a compute node.  This way we won't overload the login node we're on.
```bash
[NetID@log-1 llm_example]$ srun --cpus-per-task=2 --mem=10GB --time=04:00:00 --pty /bin/bash
```

### Copy appropriate overlay file to the project directory
```bash
[NetID@cm001 llm_example]$ cp -rp /scratch/work/public/overlay-fs-ext3/overlay-50G-10M.ext3.gz .
[NetID@cm001 llm_example]$ gunzip overlay-50G-10M.ext3.gz
```

### Launch Singularity container in read/write mode
```bash
[NetID@cm001 llm_example]$ singularity exec --overlay overlay-50G-10M.ext3:rw /scratch/work/public/singularity/cuda12.1.1-cudnn8.9.0-devel-ubuntu22.04.2.sif /bin/bash
```

### Install miniconda in the container
```bash
Singularity> wget --no-check-certificate https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
Singularity> bash Miniforge3-Linux-x86_64.sh -b -p /ext3/miniforge3
```

### Create environment script
Use an editor like nano or vim to create the file `/ext3/env.sh`.  The contents should be:
```bash
#!/bin/bash

unset -f which

source /ext3/miniforge3/etc/profile.d/conda.sh
export PATH=/ext3/miniforge3/bin:$PATH
export PYTHONPATH=/ext3/miniforge3/bin:$PATH
```

### Activate the environment
```bash
Singularity> source /ext3/env.sh
```

### Install packages in environment
```bash
Singularity> conda config --remove channels defaults
Singularity> conda update -n base conda -y
Singularity> conda clean --all --yes
Singularity> conda install pip -y
Singularity> pip install torch numpy transformers
```

### Exit from Singularity and the compute node
```bash
Singularity> exit
[NetID@cm001 llm_example]$ exit
```

:::tip
You can find more information about using Singularity and Conda on our HPC systems in our documentation [Singularity with Conda](https://sites.google.com/nyu.edu/nyu-hpc/hpc-systems/greene/software/singularity-with-miniconda).
:::

## Prepare script
Create a python script using the following code from sections 1-9 and save it in a file called `huggingface.py`:

1.  Import necessary modules:
        ```python
        import torch
        import numpy as np
        from transformers import AutoTokenizer, AutoModel
        ```

1.  Create a list of reviews:
        ```python
        texts = ["How do I get a replacement Medicare card?",
                	"What is the monthly premium for Medicare Part B?",
                	"How do I terminate my Medicare Part B (medical insurance)?",
        		    "How do I sign up for Medicare?",
        		    "Can I sign up for Medicare Part B if I am working and have health insurance through an employer?",
               		"How do I sign up for Medicare Part B if I already have Part A?"]
        ```

1.  Choose the model name from huggingface’s model hub and instantiate the model and tokenizer object for the given model. We are setting `output_hidden_states` as `True` as we want the output of the model to not only have loss, but also the embeddings for the sentences.
        ```python
        model_name = 'cardiffnlp/twitter-roberta-base-sentiment'
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name, output_hidden_states=True)
        ```

1.  Create the ids to be used in the model using the tokenizer object. We set the return_tensors as “pt” as we want to return the pytorch tensor of the ids:
        ```python
        ids = tokenizer(texts, padding=True, return_tensors="pt")
        ```

1.  Set the device to cuda, and move the model and the tokenizer to cuda as well. Since, we will be extracting embeddings, we will only be performing a forward pass of the model and hence we will set the model to validation mode using `eval()`:
        ```python
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        model.to(device)
        ids = ids.to(device)	
        model.eval()
        ```

1.  Performing the forward pass and storing the output tuple in out:
        ```python
        with torch.no_grad():
            out = model(**ids)
        ```

1.  Extracting the embeddings of each review from the last layer:
        ```python
        last_hidden_states = out.last_hidden_state	
        ```

1.  For the purpose of classification, we are extracting the CLS token which is the first embedding in the embedding list for each review: 
        ```python
        sentence_embedding = last_hidden_states[:, 0, :]
        ```

1.  We can check the shape of the final sentence embeddings for all the reviews. The output should look like `torch.Size([6, 768])`, where 6 is the batch size as we input 6 reviews as shown in step `2b`, and 768 is the embedding size of the RoBERTa model used.
        ```python
        print("Shape of the batch embedding: {}".format(sentence_embedding.shape))
        ```

## Prepare Sbatch file
After saving the above code in a script called `huggingface.py`, create a file called `run.SBATCH` with the the following code:

```batch
#!/bin/bash
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
#SBATCH --time=00:10:00
#SBATCH --mem=64GB
#SBATCH --gres=gpu
#SBATCH --job-name=huggingface
#SBATCH --output=huggingface.out

module purge

if [ -e /dev/nvidia0 ]; then nv="--nv"; fi

singularity exec $nv \
  --overlay /scratch/NetID/llm_example/overlay-50G-10M.ext3:rw \
  /scratch/work/public/singularity/cuda11.2.2-cudnn8-devel-ubuntu20.04.sif \
  /bin/bash -c "source /ext3/env.sh; python /scratch/NetID/llm_example/huggingface.py"
```
:::note
You'll need to change `NetID` in the script above to your NetID.
If you're using a different directory name and/or path you'll also need to update that in the script above.
:::

## Run the run.SBATCH file
```batch
[NetID@log-1 llm_example]$ sbatch run.SBATCH
```
The output can be found in `huggingface.out`
It should be something like:
```
Some weights of RobertaModel were not initialized from the model checkpoint at cardiffnlp/twitter-roberta-base-sentiment and are
 newly initialized: ['pooler.dense.bias', 'pooler.dense.weight']
You should probably TRAIN this model on a down-stream task to be able to use it for predictions and inference.
Shape of the batch embedding: torch.Size([6, 768])
```

## Acknowledgements
Instructions are developed and provided by [Laiba Mehnaz](https://www.linkedin.com/in/laiba-mehnaz-a81455158/), a member of [AIfSR](https://www.linkedin.com/company/ai-for-scientific-research)
