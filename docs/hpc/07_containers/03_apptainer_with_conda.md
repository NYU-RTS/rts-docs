# Apptainer with Conda
:::info
Overlay Files:
```
/share/apps/overlay-fs-ext3
```
Apptainer Files:
```
/share/apps/images/
```
:::

## Using Apptainer Overlays for Miniforge (Python & Julia)
### Preinstallation Warning
:::warning
If you have initialized Conda in your base environment, your prompt on Torch may show something like: 
```sh
(base) [NetID@log-1 ~]$
```
then you must first comment out or remove this portion of your `~/.bashrc` file:

```bash
# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$('/share/apps/anaconda3/2020.07/bin/conda' 'shell.bash' 'hook' 2> /dev/null)"
if [ $? -eq 0 ]; then
    eval "$__conda_setup"
else
    if [ -f "/share/apps/anaconda3/2020.07/etc/profile.d/conda.sh" ]; then
        . "/share/apps/anaconda3/2020.07/etc/profile.d/conda.sh"
    else
        export PATH="/share/apps/anaconda3/2020.07/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda initialize <<<
```

The above code automatically makes your environment look for the default shared installation of Conda on the cluster and will sabotage  any attempts to install packages to an Apptainer environment. Once removed or commented out, log out and back into the cluster for a fresh environment.
:::

### Miniforge Environment PyTorch Example
[Conda environments](https://conda.io/projects/conda/en/latest/user-guide/tasks/manage-environments.html) allow users to create customizable, portable work environments and dependencies to support specific packages or versions of software for research. Common conda distributions include Anaconda, Miniconda and Miniforge. Packages are available via "channels". Popular channels include "conda-forge" and "bioconda".  In this tutorial we shall use [Miniforge](https://github.com/conda-forge/miniforge) which sets "conda-forge" as the package channel. Traditional conda environments, however, also create a large number of files that can cut into quotas. To help reduce this issue, we suggest using [Apptainer](https://docs.sylabs.io/guides/4.1/user-guide/), a container technology that is popular on HPC systems. Below is an example of how to create a pytorch environment using Apptainer and Miniforge.

Create a directory for the environment:
```bash
mkdir /scratch/<NetID>/pytorch-example
cd /scratch/<NetID>/pytorch-example
```
Copy an appropriate gzipped overlay images from the overlay directory. You can browse available images to see available options:
```bash
ls /share/apps/overlay-fs-ext3
```
In this example we use `overlay-15GB-500K.ext3.gz` as it has enough available storage for most conda environments. It has 15GB free space inside and is able to hold 500K files
You can use another size as needed.
```bash
cp -rp /share/apps/overlay-fs-ext3/overlay-15GB-500K.ext3.gz .
gunzip overlay-15GB-500K.ext3.gz
```

Choose a corresponding Apptainer image. For this example we will use the following image:
```bash
/share/apps/images/cuda-13.3.1-ubuntu-26.04.sif
```

For Apptainer image available on nyu HPC Torch, please check the apptainer images folder:
```sh
ls /share/apps/images/
```

For the most recent supported versions of PyTorch, please check the [PyTorch website](https://pytorch.org/get-started/locally/). 

From the pytorch-example directory created above, launch the appropriate Apptainer container in read/write mode (with the :rw flag):
```sh
apptainer exec --fakeroot --overlay overlay-15GB-500K.ext3:rw /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash
```

The above starts a bash shell inside the referenced Apptainer Container overlaid with the 15GB 500K you set up earlier. This creates the functional illusion of having a writable filesystem inside the typically read-only Apptainer container. 

:::note
Please note that Torch now uses Apptainer instead of Singularity by default. For the writable ext3 overlay used in this tutorial, use `--fakeroot` when mounting it in read/write mode.
:::

Now, inside the container, download and install miniforge to `/ext3/miniforge3`.

:::note
Please note your prompt should indicate you're in apptainer with the `Apptainer>` prompt
:::

```bash
wget --no-check-certificate https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh -b -p /ext3/miniforge3
# rm Miniforge3-Linux-x86_64.sh # if you don't need this file any longer
```

Next, create a wrapper script /ext3/env.sh using a text editor, like nano:
```sh
touch /ext3/env.sh
nano /ext3/env.sh
```

The wrapper script will activate your conda environment, to which you will be installing your packages and dependencies. The script should contain the following:
```bash
#!/bin/bash

unset -f which

source /ext3/miniforge3/etc/profile.d/conda.sh
export PATH=/ext3/miniforge3/bin:$PATH
export PYTHONPATH=/ext3/miniforge3/bin:$PATH
```

Activate your conda environment with the following:
```bash
source /ext3/env.sh
```

If you have the "defaults" channel enabled, please disable it with:
```bash
conda config --remove channels defaults
```

Now that your environment is activated, you can update and install packages:
```bash
conda update -n base conda -y
conda clean --all --yes
conda install pip -y
conda install ipykernel -y # Note: ipykernel is required to run as a kernel in the Open OnDemand Jupyter Notebooks
```

To confirm that your environment is appropriately referencing your Miniforge installation, try out the following:
```bash
unset -f which
which conda
# output: /ext3/miniforge3/bin/conda

which python
# output: /ext3/miniforge3/bin/python

python --version
# output: Python 3.12.10

which pip
# output: /ext3/miniforge3/bin/pip

exit
# exit Apptainer
```

#### Install Packages

You may now install packages into the environment with either the `pip install` or `conda install` commands. 

:::warning
The login nodes restrict memory to 2GB per user, which may cause some large packages to crash.  In addition, on Torch, the login nodes and compute nodes run different operating system versions.  This means that code built on the login nodes probably won't run on the compute nodes.  For these reasons, please start an interactive job with adequate compute and memory resources to install packages:

```sh
srun --cpus-per-task=2 --mem=10GB --time=04:00:00 --pty /bin/bash

# wait to be assigned a node
```

After it is running, you’ll be redirected to a compute node. From there, run apptainer to setup on conda environment, same as you were doing on login node. Your prompt should look similar to this:
```sh
# Your prompt should now look something like this once your jobs starts: [NetID@cm001 pytorch-example]$

apptainer exec --fakeroot --overlay overlay-15GB-500K.ext3:rw /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash

source /ext3/env.sh
[NetID@cm001 pytorch-example]$ 
```
Then you can activate your environment:
```sh
apptainer exec --fakeroot --overlay overlay-15GB-500K.ext3:rw /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash
# Apptainer>
# activate the environment
source /ext3/env.sh
```
:::

We will install PyTorch as an example:
```sh
pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu116

pip3 install jupyter jupyterhub pandas matplotlib scipy scikit-learn scikit-image Pillow
```

For the latest versions of PyTorch please check the [PyTorch website](https://pytorch.org/).

You can see the available space left on your image with the following commands:
```sh
find /ext3 | wc -l
# output: should be something like: 77674

du -sh  /ext3        
# output should be something like: 6.5G    /ext3
```

Now, exit the Apptainer container and then rename the overlay image. Typing `exit` and hitting `enter` will exit the Apptainer container if you are currently inside it. You can tell if you're in a Apptainer container because your prompt will be different, such as showing the prompt `Apptainer>`:
```sh
#Apptainer>
exit
mv overlay-15GB-500K.ext3 my_pytorch.ext3
```
#### Test Your PyTorch Apptainer Image
```sh
apptainer exec --overlay /scratch/<NetID>/pytorch-example/my_pytorch.ext3:ro /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash -c 'source /ext3/env.sh; python -c "import torch; print(torch.__file__); print(torch.__version__)"'

#output: /ext3/miniforge3/lib/python3.8/site-packages/torch/__init__.py
#output: 2.7.1+cu126
```
:::note
 the end `:ro` addition at the end of the pytorch ext3 image starts the image in read-only mode. To add packages you will need to use `:rw` to launch it in read-write mode.
:::

### Using Your Apptainer Container in a SLURM Batch Job
Below is an example script of how to call a python script, in this case `torch-test.py`, from a SLURM batch job using your new Apptainer image

torch-test.py:
```sh
#!/bin/env python

import torch

print(torch.__file__)
print(torch.__version__)

# How many GPUs are there?
print(torch.cuda.device_count())

# Get the name of the current GPU
print(torch.cuda.get_device_name(torch.cuda.current_device()))

# Is PyTorch using a GPU?
print(torch.cuda.is_available())
```

Now we will write the SLURM job script, `run-test.SBATCH`, that will start our Apptainer Image and call the `torch-test.py` script.

run-test.SBATCH:
```bash
#!/bin/bash

#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
#SBATCH --time=1:00:00
#SBATCH --mem=2GB
#SBATCH --gres=gpu
#SBATCH --job-name=torch

module purge

apptainer exec --nv \
	    --overlay /scratch/<NetID>/pytorch-example/my_pytorch.ext3:ro \
	    /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif\
	    /bin/bash -c "source /ext3/env.sh; python torch-test.py"
```

You will notice that the apptainer exec command features the `--nv` flag - this flag is required to pass the CUDA drivers from a GPU to the Apptainer container.

Run the run-test.SBATCH script:
```sh
sbatch run-test.SBATCH
```

Check your SLURM output for results, an example is shown below:
```sh
cat slurm-3752662.out

# example output:
# /ext3/miniforge3/lib/python3.8/site-packages/torch/__init__.py
# 1.8.0+cu111
# 1
# Quadro RTX 8000
# True
```

### Optional: Convert `ext3` to a Compressed, Read-only `squashfs` Filesystem
Apptainer images can be compressed into read-only squashfs filesystems to conserve space in your environment. Use the following steps to convert your ext3 Apptainer image into a smaller squashfs filesystem.
```sh
srun -N1 -c4 apptainer exec --overlay my_pytorch.ext3:ro /share/apps/images/centos-8.2.2004.sif mksquashfs /ext3 /scratch/<NetID>/pytorch-example/my_pytorch.sqf -keep-as-directory -processors 4 -noappend
```

Here is an example of the amount of compression that can be realized by converting:
```sh
ls -ltrsh my_pytorch.*
5.5G -rw-r--r-- 1 wang wang 5.5G Mar 14 20:45 my_pytorch.ext3
2.2G -rw-r--r-- 1 wang wang 2.2G Mar 14 20:54 my_pytorch.sqf
```

Notice that it saves over 3GB of storage in this case, though your results may vary.

#### Use a `squashFS` Image for Running Jobs

You can use squashFS images similarly to the ext3 images:
```sh
apptainer exec --overlay /scratch/<NetID>/pytorch-example/my_pytorch.sqf:ro /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash -c 'source /ext3/env.sh; python -c "import torch; print(torch.__file__); print(torch.__version__)"'

#example output: /ext3/miniforge3/lib/python3.12/site-packages/torch/__init__.py
#example output: 2.6.0+cu124
```

#### Adding Packages to a Full `ext3` or `squashFS` Image 

If the first ext3 overlay image runs out of space or you are using a squashFS conda environment, but need to install a new package inside, please copy another writable ext3 overlay image to work together.

Open the first image in read only mode:
```sh
cp -rp /share/apps/overlay-fs-ext3/overlay-2GB-100K.ext3.gz .
gunzip overlay-2GB-100K.ext3.gz

apptainer exec --overlay overlay-2GB-100K.ext3 --overlay /scratch/<NetID>/pytorch-example/my_pytorch.ext3:ro /share/apps/images/cuda-13.3.1-ubuntu-26.04.sif /bin/bash
source /ext3/env.sh
pip install tensorboard
```

:::note
Please see [Conda Environments](../06_tools_and_software/06_conda_environments.mdx) for information on how to configure your conda environment.
:::
:::tip
Please also keep in mind that once the overlay image is opened in default read-write mode, the file will be locked. You will not be able to open it from a new process. Once the overlay is opened either in read-write or read-only mode, it cannot be opened in RW mode from other processes either. For production jobs to run, the overlay image should be open in read-only mode. You can run many jobs at the same time as long as they are run in read-only mode. In this ways, it will protect the computation software environment, software packages are not allowed to change when there are jobs running. 
:::

### Julia Apptainer Image
Apptainer can be used to set up a Julia environment.

Create a directory for your Julia work, such as `/scratch/<NetID>/julia`, and then change to your working directory to it. An example is shown below:
```sh
mkdir /scratch/<NetID>/julia
cd /scratch/<NetID>/julia
```

Run the setup script from your Julia working directory on a compute node:
```sh
/share/apps/utils/julia/setup-julia.bash
```
The script downloads Julia, creates a writable overlay, and installs Julia inside it. It also creates two launchers in your working directory: julia for running Julia with the overlay in read-only mode, and julia-rw for installing or updating packages with the overlay in read-write mode.

Now launch Julia with the overlay in read-write mode to install packages. Run the following commands from your Julia working directory on a compute node:
```sh
module purge
module load knitro/16.0.0
./julia-rw
```

At the `julia>` prompt, install the packages:
```
# Your prompt will look like this:
# julia>
using Pkg
Pkg.add("KNITRO")
Pkg.add("JuMP")
```

Now exit from the container to launch a read only version to test (example below):
```sh
./julia
```
At the `julia>` prompt:
```julia
using Pkg

using JuMP, KNITRO

m = Model(KNITRO.Optimizer)
A JuMP Model
Feasibility problem with:
Variables: 0
Model mode: AUTOMATIC
CachingOptimizer state: EMPTY_OPTIMIZER
Solver name: Knitro

@variable(m, x1 >= 0)
x1

@variable(m, x2 >= 0)
x2

@NLconstraint(m, x1*x2 == 0)
x1 * x2 - 0.0 = 0

@NLobjective(m, Min, x1*(1-x2^2))

optimize!(m)
```

You can make the above code into a Julia script to test batch jobs. Save the following as `test-knitro.jl`:
```julia
using Pkg
using JuMP, KNITRO
m = Model(KNITRO.Optimizer)
@variable(m, x1 >= 0)
@variable(m, x2 >= 0)
@NLconstraint(m, x1*x2 == 0)
@NLobjective(m, Min, x1*(1-x2^2))
optimize!(m)
```

You can add additional packages with commands like the one below:
:::warning
Please do not install new packages when you have Julia jobs running, this may create issues with your Julia installation
:::
```julia
./julia-rw -e 'using Pkg; Pkg.add("Calculus")'
```

Run a SLURM job to test with the following sbatch command (e.g. julia-test.SBATCH):
```bash
#!/bin/bash 

#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
#SBATCH --time=1:00:00
#SBATCH --mem=2GB
#SBATCH --job-name=julia-test

module purge
module load knitro/16.0.0

./julia test-knitro.jl
```

Then run the command with the following:
```sh
sbatch julia-test.SBATCH
```

Once the job completes, check the SLURM output (example below):
```sh
cat slurm-1022969.out

=======================================
           Academic License
       (NOT FOR COMMERCIAL USE)
         Artelys Knitro 16.0.0
=======================================

Knitro using 1 thread.
No start point provided -- Knitro computing one.

Knitro presolve eliminated 0 variables (0%) and 0 constraints (0%) in 0.09s.

datacheck                0
feastol                  1e-06
feastol_abs              0.001
hessian_no_f             1
mip_numthreads           1
ms_numthreads            1
numthreads               1
opttol                   1e-06
opttol_abs               0.001

Problem Characteristics                     |           Presolved
-----------------------
Problem type: NLP
Objective: minimize / general  
Number of variables:                      2 |                             2
  bounds:         lower     upper     range |     lower     upper     range
                      2         0         0 |         2         0         0
                             free     fixed |                free     fixed
                                0         0 |                   0         0
Number of constraints:                    1 |                             1
                    eq.     ineq.     range |       eq.     ineq.     range
  linear:             0         0         0 |         0         0         0
  quadratic:          0         0         0 |         0         0         0
  nonlinear:          1         0         0 |         1         0         0
Number of nonzeros:
              objective  Jacobian   Hessian | objective  Jacobian   Hessian
  linear:             0         0           |         0         0          
  quadratic:          0         0         0 |         0         0         0
  nonlinear:          2         2         3 |         2         2         3
  total:              2         2         3 |         2         2         3
Coefficient range:
  linear objective:          [0e+00, 0e+00] |                [0e+00, 0e+00]
  linear constraints:        [0e+00, 0e+00] |                [0e+00, 0e+00]
  quadratic objective:       [0e+00, 0e+00] |                [0e+00, 0e+00]
  quadratic constraints:     [0e+00, 0e+00] |                [0e+00, 0e+00]
  variable bounds:           [0e+00, 0e+00] |                [0e+00, 0e+00]
  constraint bounds:         [0e+00, 0e+00] |                [0e+00, 0e+00]

Knitro using the Interior-Point/Barrier Direct algorithm.

    Iter       Objective  FeasError   OptError   ||Step||      Time 
--------  --------------  ---------  ---------  ---------  --------
       0   -3.684125e+00   3.37e+00
       4   -1.519686e-07   1.06e-06   9.87e-07   9.58e-04      6.72

EXIT: Locally optimal solution found.

Final Statistics
----------------
Final objective value               =  -1.51968578354339e-07
Final feasibility error (abs / rel) =   1.06e-06 / 3.15e-07
Final optimality error  (abs / rel) =   9.87e-07 / 9.87e-07
# of iterations                     =          4 
# of CG iterations                  =          1 
# of function evaluations           =          8
# of gradient evaluations           =          7
# of Hessian evaluations            =          4
Total program time (secs)           =       6.72203 (     6.393 CPU time)
Time spent in evaluations (secs)    =       4.88511

================================================================================
```
Install Julia to `/ext3`, setup PATH properly. It will be easy to move to other servers in future.
