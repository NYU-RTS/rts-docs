# Slurm: Tutorial

## Introduction to High Performance Computing Clusters

In a High Performance Computing Cluster, such as the NYU-IT HPC Greene cluster, there are hundreds of computing nodes interconnected by high-speed networks.

Linux operating system ( in our case Red Hat Enterprise Linux) runs on each of the nodes individually. The resources are shared among many users for their technical or scientific computing purposes.

Slurm is a cluster software layer built on top of the interconnected nodes, aiming at orchestrating the nodes' computing activities, so that the cluster could be viewed as a unified, enhanced and scalable computing system by its users.

In NYU HPC clusters the users coming from many departments with various disciplines and subjects, with their own computing projects, impose on us very diverse requirements regarding hardware, software resources, and processing parallelism. Users submit jobs, which compete for computing resources.

The Slurm software system is a resource manager and a job scheduler, which is designed to allocate resources and schedule jobs. Slurm is an open-source software, with a large user community, and has been installed on many top 500 supercomputers.

-   This tutorial assumes you have a NYU HPC account. If not, you may find the steps to apply for an account on the [Getting and renewing an account page](../01_getting_started/02_getting_and_renewing_an_account.mdx).

-   It also assumes you are comfortable with Linux command-line environment. To learn about linux please read our [Linux Tutorial](../12_tutorial_intro_shell_hpc/01_intro.mdx).

-   Please review the [Hardware Specs page](../10_spec_sheet.md) for more information on Greene's hardware specifications.

## Slurm Commands

For an overview of useful Slurm commands, please read [Slurm Main Commands](./02_slurm_main_commands.md) page before continuing the tutorial.

## Software and Environment Modules

Lmod, an Environment Module system, is a tool for managing multiple versions and configurations of software packages and is used by many HPC centers around the world. With Environment Modules, software packages are installed away from the base system directories, and for each package, an associated modulefile describes what must be altered in a user's shell environment - such as the $PATH environment variable - in order to use the software package. The modulefile also describes dependencies and conflicts between this software package and other packages and versions.

To use a given software package, you load the corresponding module. Unloading the module afterwards cleanly undoes the changes that loading the modules made to your environment, thus freeing you to use other software packages that might have conflicted with the first one.

Below is a list of modules and their associated functions:

-   `module load <module-name>` : loads a module
    -   For example : `module load python`

-   `module unload <module-name>` : unloads a module
    -   For example : `module unload python`

-   `module show <module-name>` : see exactly what effect loading a module will have 

-   `module purge` : remove all loaded modules from your environment

-   `module whatis <module-name>` : Find out more about a software package

-   `module list` : check which modules are currently loaded in your environment

-   `module avail` : check what software packages are available

-   `module help <module-name>` : A module file may include more detailed help for software package

## Batch Job Example

Batch jobs require a script file for the SLURM scheduler to interpret and execute. The SBATCH file contains both commands specific for SLURM to interpret as well as programs for it to execute. Below is a simple example of a batch job to run a Stata do file, the file is named myscript.sbatch :

```sh
#!/bin/bash

#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
#SBATCH --time=5:00:00
#SBATCH --mem=2GB
#SBATCH --job-name=myTest
#SBATCH --mail-type=END
#SBATCH --mail-user=bob.smith@nyu.edu
#SBATCH --output=slurm_%j.out

module purge
module load stata/14.2

RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir -p $RUNDIR
DATADIR=$SCRATCH/my_project/data
cd $RUNDIR

stata -b do $DATADIR/data_0706.do
```

Below we will break down each line of the SBATCH script. More options can be found on the [SchedMD website](https://slurm.schedmd.com/documentation.html).

```sh
## This tells the shell how to execute the script
#!/bin/bash

## The #SBATCH lines are read by SLURM for options.
## In the lines below we ask for a single node, 
## one task for that node, and one cpu for each task.
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1

## Time is the estimated time to complete, in this case 5 hours.
#SBATCH --time=5:00:00

## We expect no more than 2GB of memory to be needed
#SBATCH --mem=2GB

## To make them easier to track, 
## it's best to name jobs something recognizable.
## You can then use the name to look up reports with tools like squeue.
#SBATCH --job-name=myTest

## These lines manage mail alerts for when the job ends,
## and who the email should be sent to.
#SBATCH --mail-type=END
#SBATCH --mail-user=bob.smith@nyu.edu

## This places the standard output and standard error into the same file,
## in this case slurm_<job_id>.out
#SBATCH --output=slurm_%j.out

## First we ensure a clean environment by purging the current one
module purge

## Load the desired software, in this case stata 14.2
module load stata/14.2

## Create a unique directory to run the job in.
RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir -p $RUNDIR

## Set an environment variable for where the data is stored.
DATADIR=$SCRATCH/my_project/data

## Change directories to the unique run directory
cd $RUNDIR

## Execute the desired Stata do file script
stata -b do $DATADIR/data_0706.do
```

You can submit the job with the following command:

```sh
sbatch myscript.sbatch
```

The command will result in the job queuing as it awaits resources to become available (which varies on the number of other jobs being run on the cluster and the resources requested). You can see the status of your jobs with the following command:

```sh
squeue --me
```

> **_NOTE:_** Calling just squeue without passing the `--me` option will display all users' job queue status by default

Lastly, you can read the output of your job in the ` slurm-<job_ID> `.out file produced by running your job. This is where logs regarding the execution of your job can be found, including errors or system messages. You can print the contents to the screen from the directory containing the output file with the following command:

```sh
cat slurm-<job_ID>.out
```

## Interactive Job Example

While the majority of the jobs on the cluster are submitted with the `sbatch` command, and executed in the background, there are also methods to run applications interactively through the `srun` command. Interactive jobs allow the users to enter commands and data on the command line (or in a graphical interface), providing an experience similar to working on a desktop or laptop. Examples of common interactive tasks are:

-   Editing files

-   Compiling and debugging code

-   Exploring data, to obtain a rough idea of characteristics on the topic

-   Getting graphical windows to run visualization

-   Running software tools in interactive sessions

Interactive jobs also help avoid issues with the login nodes. If you are working on a login node and your job is too IO intensive, it may be removed without notice. Running interactive jobs on compute nodes does not impact many users and in addition provides access to resources that are not available on the login nodes, such as interactive access to GPUs, high memory, exclusive access to all the resources of a compute node, etc.

In the `srun` example below, through `--pty /bin/bash` we request allocation of a `pseudo terminal` (pty) and start a `bash shell session`. By default the resource allocated is a single CPU core and 2GB memory for 1 hour time limit. 

```sh
srun --pty /bin/bash
```

To request resources such as 4 CPU cores, 4 GB memory for 2 hours of maximum duration, you can add the following arguments:

```sh
srun --cpus-per-task=4 --time=2:00:00 --mem=4GB --pty /bin/bash
```

Similarly, to request one GPU card, 3 GB memory for a duration of 1.5 hours you can pass the following arguments to srun:

```sh
srun --time=1:30:00 --mem=3GB --gres=gpu:1 --pty /bin/bash
```

Once the job begins you will notice your prompt change, for example:

```shell-session
[mdw303@log-3 ~]$ srun --pty /bin/bash
srun: job 7864254 queued and waiting for resources
srun: job 7864254 has been allocated resources
[mdw303@cs080 ~]$
```

You can see above that the prompt changed from log-3 ( one of the login nodes ) to cs080 ( one of the compute nodes ), meaning we have created a pseudo terminal and logged in with a bash shell on a compute node from our login node. 

You can now load modules, software and run them interactively on the compute node having the resources ( CPUs, memory, GPUs etc ) that we asked for.

Below outlines the steps to start an interactive session and launch R:

```sh
[sk6404@log-1 ~]$ srun --cpus-per-task=1 --pty /bin/bash
[sk6404@cs022 ~]$ module purge
[sk6404@cs022 ~]$ module load r/intel/4.0.3
[sk6404@cs022 ~]$ module list
Currently Loaded Modules:
  1) intel/19.1.2   2) r/intel/4.0.3
[sk6404@cs022 ~]$ R
R version 4.0.3 (2020-10-10) -- "Bunny-Wunnies Freak Out"
Copyright (C) 2020 The R Foundation for Statistical Computing
Platform: x86_64-centos-linux-gnu (64-bit)
R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.
Type 'license()' or 'licence()' for distribution details.
  Natural language support but running in an English locale
R is a collaborative project with many contributors.
Type 'contributors()' for more information and
'citation()' on how to cite R or R packages in publications.
Type 'demo()' for some demos, 'help()' for on-line help, or
'help.start()' for an HTML browser interface to help.
Type 'q()' to quit R.
> 5 + 10
[1] 15
> q()
Save workspace image? [y/n/c]: n
[sk6404@cs022 ~]$ exit
exit
[sk6404@log-1 ~]$
```

## MPI Job Example

MPI stands for "Message Passing Interface" and is managed by a program, such as OpenMPI, to coordinate code and resources across the HPC cluster for your job to run workloads in parallel. You may have heard of HPC sometimes referred to as "parallel computing" because the ability to run many processes simultaneously - aka in parallel - is how the best efficiencies can be realized on the cluster. Users interested in MPI generally must compile the program they want to run using an MPI compiler. 

Greene supports many MPI compilers. We'll be using the OpenMPI GCC compiler in this tutorial.  It can be loaded as a module:

```sh
module load openmpi/gcc/4.1.6
```

Below we will illustrate an example of how to compile a C script for MPI. Copy this into your working directory as ` hellompi.c ` :

```C
#include <stdio.h>
#include <stdlib.h>
#include <mpi.h>

int main(int argc, char *argv[], char *envp[]) {
  int numprocs, rank, namelen;
  char processor_name[MPI_MAX_PROCESSOR_NAME];

  MPI_Init(&argc, &argv);
  MPI_Comm_size(MPI_COMM_WORLD, &numprocs);
  MPI_Comm_rank(MPI_COMM_WORLD, &rank);
  MPI_Get_processor_name(processor_name, &namelen);

  printf("Process %d on %s out of %d\n", rank, processor_name, numprocs);

  MPI_Finalize();
}
```

Once copied into your directory, load OpenMPI and compile it with the following:

```sh
module load openmpi/gcc/4.1.6
mpicc hellompi.c -o hellompi
```

Next, create a ` hellompi.sbatch ` script:

```sh
#!/bin/bash

#SBATCH --nodes=4
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
#SBATCH --time=1:00:00
#SBATCH --mem=2GB
#SBATCH --job-name=hellompi
#SBATCH --output=hellompi.out

# Load the default OpenMPI module.
module purge
module load openmpi/intel/4.1.1

# Run the hellompi program with mpirun. The -n flag is not required;
# mpirun will automatically figure out the best configuration from the
# Slurm environment variables.
mpirun ./hellompi
```

Run the job with the following command:

```sh
sbatch hellompi.sbatch
```

After the job runs, cat the ` hellompi.out ` output file to see that your processes ran on multiple nodes. There may be some errors, but your output should contain something like the following, indicating the process was run in parallel on multiple nodes:

```
Process 0 on cs265.nyu.cluster out of 4
Process 1 on cs266.nyu.cluster out of 4
Process 2 on cs267.nyu.cluster out of 4
Process 3 on cs268.nyu.cluster out of 4
```

## GPU Job Example

To request one GPU card, use SBATCH directives in job script:

```sh
#SBATCH --gres=gpu:1
```

To request a specific card type, use e.g. ` --gres=gpu:v100:1 `. The card types currently available are:
-   NVIDIA
      -   RTX 8000
      -   V100
      -   A100 NVIDIA 8358
      -   A100 NVIDIA 8380
      -   H100 NVIDIA
-   AMD
      -   MI100
      -   MI250
 
 As an example, let's submit an Amber job. Amber is a molecular dynamics software package. The recipe is:

```sh
mkdir -p /scratch/$USER/myambertest
cd /scratch/$USER/myambertest
cp /share/apps/Tutorials/slurm/example/amberGPU/* .
sbatch run-amber.s
```

From the tutorial example directory we copy over Amber input data files "inpcrd", "prmtop" and "mdin", and the job script file "run-amber.s".

> **_NOTE:_** At the time of writing this you may need to update the run-amber.s script to load amber version 20.06, rather than the default 16.06.

The content of the job script "run-amber.s" should be as follows:

```sh
#!/bin/bash

#SBATCH --job-name=myAmberJobGPU
#SBATCH --nodes=1
#SBATCH --cpus-per-task=1
#SBATCH --time=00:30:00
#SBATCH --mem=3GB
#SBATCH --gres=gpu:1

module purge
module load amber/openmpi/intel/20.06

cd /scratch/$USER/myambertest
pmemd.cuda -O
```

The demo Amber job should take ~2 minutes to finish once it starts running. When the job is done, several output files are generated. Check the one named `mdout`, which has a section most relevant here:

```
|--------------------- INFORMATION ----------------------
| GPU (CUDA) Version of PMEMD in use: NVIDIA GPU IN USE.
|                    Version 16.0.0
|
|                      02/25/2016
[......] 

|------------------- GPU DEVICE INFO --------------------
|
|            CUDA_VISIBLE_DEVICES: 0
|   CUDA Capable Devices Detected:      1
|           CUDA Device ID in use:      0
|                CUDA Device Name: Tesla V100
|     CUDA Device Global Mem Size:  11439 MB
| CUDA Device Num Multiprocessors:     13
|           CUDA Device Core Freq:   0.82 GHz
|
|--------------------------------------------------------
```

## Array Job Example

Using job array you may submit many similar jobs with almost identical job requirement. This reduces loads on both users and the scheduler system. Job arrays can only be used in batch jobs. Usually the only requirement difference among jobs in a job array is the input file or files. Please follow the recipe below to try the example. There are 5 input files named `sample-1.txt`, `sample-2.txt` to `sample-5.txt` in sequential order. Running one command ` sbatch run-jobarray.s `, you submit 5 jobs to process each of these input files individually. Run the following commands to create the directory and submit the array job:

```sh
mkdir -p /scratch/$USER/myjarraytest
cd /scratch/$USER/myjarraytest
cp /share/apps/Tutorials/slurm/example/jobarray/* .
ls
```

> **_OUTPUT:_** run-jobarray.s  sample-1.txt  sample-2.txt  sample-3.txt  sample-4.txt  sample-5.txt  wordcount.py

```sh
sbatch --array=1-5 run-jobarray.s
```

The content of the job script ` run-jobarray.s ` is copied below:

```sh
#!/bin/bash

#SBATCH --job-name=myJobarrayTest
#SBATCH --nodes=1
#SBATCH --tasks-per-node=1
#SBATCH --array=1-5 # this creates an array!
#SBATCH --time=5:00
#SBATCH --mem=1GB
#SBATCH --output=wordcounts_%A_%a.out
#SBATCH --error=wordcounts_%A_%a.err

module purge
module load python/intel/3.8.6

cd /scratch/$USER/myjarraytest
python2 wordcount.py sample-$SLURM_ARRAY_TASK_ID.txt
```

Job array submissions create an environment variable called ` SLURM_ARRAY_TASK_ID `, which is unique for each job in the array job. It is usually embedded somewhere so that at a job running time it's unique value is incorporated into producing a proper file name. Also as shown above: two additional options %A and %a, denoting the job ID and the task ID (i.e. job array index) respectively, are available for specifying a job's stdout, and stderr file names.
