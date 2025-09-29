# Slurm: Submitting Jobs


## Batch vs Interactive Jobs

-   HPC workloads are usually better suited to *batch processing* than *interactive* workflows.
-   A batch job is sent to the system when submitted with an **sbatch** command. 
-   The working pattern we are all familiar with is *interactive* - where we type ( or click ) something interactively, and the computer performs the associated action. Then we type ( or click ) the next thing.
-   Comments at the start of the script, which match a special pattern ( `#SBATCH` ) are read as Slurm options.

### Challenges of Interactive Work

There is a reason why GUIs are less common in HPC environments: **point-and-click** is **necessarily interactive**. In HPC environments (*as we'll see in section 3*) work is scheduled in order to allow exclusive use of the shared resources. On a busy system there may be several hours wait between when you submit a job and when the resources become available, so a reliance on user interaction is not viable. In Unix, commands need not be run interactively at the prompt, you can write a sequence of commands into a file to be run as a script, either manually (for sequences you find yourself repeating frequently) or by another program such as the batch system.

:::tip
The job might not start immediately, and might take hours or days, so we prefer a *batch* approach:

-   Plan the sequence of commands which will perform the actions we need and write the commands into a script.

You can now run the script interactively, which is a great way to save effort if i frequently use the same workflow, or ...
-   Submit the script to a batch system, to run on dedicated resources when they become available.
:::

### Job Output

-   The batch system writes stdout and stderr from a job to a file named for example *"slurm-12345.out"*
    -   You can change either stdout or stderr using sbatch options.
-   While a job is running, it caches the stdout an stderr in the job working directory.
-   You can use redirection to send output of a specific command into a file.

### Writing and Submitting a Job

There are two aspects to a batch job script:
-   A set of *SBATCH* directives describing the resources required and other information about the job.
-   The script itself, comprised of commands to set up and perform the computations without additional user interaction.

### A Simple Job Example

A typical batch script on an NYU HPC cluster looks something like these two examples:

```bash
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
#SBATCH --error=slurm_%j.err

  
module purge
module load stata/17.0
RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir -p $RUNDIR
  
DATADIR=$SCRATCH/my_project/data
cd $RUNDIR
stata -b do $DATADIR/data_0706.do
```

```bash
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
#SBATCH --error=slurm_%j.err
 
module purge
  
SRCDIR=$HOME/my_project/code
RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir -p $RUNDIR
  
cd $SLURM_SUBMIT_DIR
cp my_input_params.inp $RUNDIR
  
cd $RUNDIR
module load fftw/intel/3.3.9
$SRCDIR/my_exec.exe < my_input_params.inp
```

We'll work through them more closely in a moment.
You submit the job with *sbatch*:

```sh
[NetID@log-1 ~]$ sbatch myscript.sh
```

And monitor it's progress with:

```sh
[NetID@log-1 ~]$ squeue -u $USER
```

**What just happened ?** Here's an annotated version of the first script:

```sh
#!/bin/bash
# This line tells the shell how to execute this script, and is unrelated
# to SLURM.
   
# at the beginning of the script, lines beginning with "#SBATCH" are read by
# SLURM and used to set queueing options. You can comment out a SBATCH
# directive with a second leading #, eg:
##SBATCH --nodes=1
   
# we need 1 node, will launch a maximum of one task and use one cpu for the task: 
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --cpus-per-task=1
   
# we expect the job to finish within 5 hours. If it takes longer than 5
# hours, SLURM can kill it:
#SBATCH --time=5:00:00
   
# we expect the job to use no more than 2GB of memory:
#SBATCH --mem=2GB
   
# we want the job to be named "myTest" rather than something generated
# from the script name. This will affect the name of the job as reported
# by squeue:
#SBATCH --job-name=myTest
 
# when the job ends, send me an email at this email address.
#SBATCH --mail-type=END
#SBATCH --mail-user=bob.smith@nyu.edu
   
# both standard output and standard error are directed to the same file.
# It will be placed in the directory I submitted the job from and will
# have a name like slurm_12345.out
#SBATCH --output=slurm_%j.out
 
# once the first non-comment, non-SBATCH-directive line is encountered, SLURM
# stops looking for SBATCH directives. The remainder of the script is  executed
# as a normal Unix shell script
  
# first we ensure a clean running environment:
module purge
# and load the module for the software we are using:
module load stata/17.0
  
# next we create a unique directory to run this job in. We will record its
# name in the shell variable "RUNDIR", for better readability.
# SLURM sets SLURM_JOB_ID to the job id, ${SLURM_JOB_ID/.*} expands to the job
# id up to the first '.' We make the run directory in our area under $SCRATCH, because at NYU HPC
# $SCRATCH is configured for the disk space and speed required by HPC jobs.
RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir $RUNDIR
  
# we will be reading data in from somewhere, so define that too:
DATADIR=$SCRATCH/my_project/data
  
# the script will have started running in $HOME, so we need to move into the
# unique directory we just created
cd $RUNDIR
  
# now start the Stata job:
stata -b do $DATADIR/data_0706.do
The second script has the same SBATCH directives, but this time we are using code we compiled ourselves. Starting after the SBATCH directives:
# first we ensure a clean running environment:
module purge
  
# and ensure we can find the executable:
SRCDIR=$HOME/my_project/code
  
# create a unique directory to run this job in, as per the script above
RUNDIR=$SCRATCH/my_project/run-${SLURM_JOB_ID/.*}
mkdir $RUNDIR
  
# By default the script will have started running in the directory we ran sbatch from.
# Let's assume our input file is in the same directory in this example. SLURM
# sets some environment variables with information about the job, including
# SLURM_SUBMIT_DIR which is the directory the job was submitted from. So lets
# go there and copy the input file to the run directory on /scratch:
cd $SLURM_SUBMIT_DIR
cp my_input_params.inp $RUNDIR
  
# go to the run directory to begin the run:
cd $RUNDIR
  
# load whatever environment modules the executable needs:
module load fftw/intel/3.3.9
  
# run the executable (sending the contents of my_input_params.inp to stdin)
$SRCDIR/my_exec.exe < my_input_params.inp
```

## Batch Jobs

Jobs are submitted with the sbatch command:

```sh
sbatch options job-script
```

The options tell SLURM information about the job, such as what resources will be needed. **These can be specified in the job-script as SBATCH directives, or on the command line as options, or both**
:::note
 When SBATCH options are provided in both the script and the command line, the command line options take precedence should the two contradict each other.
 :::
 For each option there is a corresponding SBATCH directive with the syntax: 

```bash
#SBATCH option 
```

For example, you can specify that a job needs 2 nodes and 4 cores on each node ( by default one CPU core per task ) on each node by adding to the script the directive:

```bash
#!/bin/bash
#SBATCH --nodes=2
#SBATCH --ntasks-per-node=4
```

or as a command-line option to sbatch when you submit the job:

```sh
[NetID@log-1 ~]$ sbatch --nodes=2 --ntasks-per-node=4 my_script.sh
```

### Job Output Options

-   `-J jobname`
    -   Give the job a name. The default is the filename of the job script. Within the job, `$SLURM_JOB_NAME` expands to the job name.

-   `-o path/for/stdout`
    -   Send `stdout` to `path/for/stdout`. The default filename is slurm-`${SLURM_JOB_ID}.out`, e.g. slurm-`12345.out`, in the directory from which the job was submitted.

-   `-e path/for/stderr`
    -   Send `stderr` to `path/for/stderr`.

-   `--mail-user=my_email_address@nyu.edu`
    -   Send mail to my_email_address@nyu.edu when certain events occur.

-   `--mail-type=type`
    -   Valid type values are NONE, BEGIN, END, FAIL, REQUIRE, ALL.

### Job Environment Options

-   `--export=VAR1,VAR2="some value",VAR3`
    -   Pass variables to the job, either with a specific value (the `VAR=` form) or from the submitting environment ( without "`=`" )

    -   `--get-user-env`\[=timeout]\[mode]
    -   Run something like "su `-` \<username\> -c /usr/bin/env" and parse the output. Default timeout is 8 seconds. The mode value can be "S", or "L" in which case "su" is executed with "`-`" option.

### Resource Request Options

-   `-t, --time=time`
    -   `Set a limit on the total run time. Acceptable formats include "minutes", "minutes:seconds", "hours:minutes:seconds", "days-hours", "days-hours:minutes" and "days-hours:minutes:seconds"`.

-   `--mem=MB`
    -   Maximum memory per node the job will need in MegaBytes

-   `--mem-per-cpu=MB`
    -   `Memory required per allocated CPU in MegaBytes`

-   `-N, --node=num`
    -   Number of nodes are required. Default is 1 node.
    -   `-n, --ntasks=num`
    -   Maximum number tasks will be launched. Default is one task per node.
    -   `--ntasks-per-node=ntasks`
    -   Request that ntasks be invoked on each node.
    -   `-c, --cpus-per-task=ncpus`
    -   Require ncpus number of CPU cores per task. Without this option, allocate one core per task.
        -   Requesting the resources you need, as accurately as possible, allows your job to be started at the earliest opportunity as well as helping the system to schedule work efficiently to everyone's benefit.

### srun & Interactive Job Options

-   `-nnum`
    -   `Specify the number of tasks to run, eg. -n4. Default is one CPU core per task.` Don't just submit the job, but also wait for it to start and connect `stdout`, `stderr`and `stdin` to the current terminal.

-   `-ttime`
    -   Request job running duration, eg. `-t1:30:00`

-   `--mem=MB`
    -   Specify the real memory required per node in MegaBytes, eg. `--mem=4000`
    -   `--pty`
    -   Execute the first task in pseudo terminal mode, eg. `--pty /bin/bash`, to start a bash command shell

-   `--x11`
    -   Enable X forwarding, so programs using a GUI can be used during the session (provided you have X forwarding to your workstation set up)
    -   To leave an interactive batch session, type `exit` at the command prompt

### Delaying Jobs

-   `--begin=time`
    -   Delay starting this job until after the specified date and time, eg. `--begin=9:42:00`, to start the job at 9:42:00 am

-   `-d, --dependency=dependency_list`
    -   (More info here [https://slurm.schedmd.com/sbatch.html](https://slurm.schedmd.com/sbatch.html))
    -   Example 1
        -   `--dependency=afterok:12345`, to delay starting this job until the job 12345 has completed successfully
    -   Example 2
        -   Let us say job 1 uses sbatch file job1.sh, and job 2 uses job2.sh
        -   Inside the batch file of the second job (job2.sh) add
        -   `#SBATCH --dependency=afterok:$job1`
        -   Start the first job and get id of the job
        -   `job1=$(echo $(sbatch job1.sh) | grep -Eo "[0-9]+")`
        -   Schedule second jobs to start when the first one ends
        -   `sbatch job2.sh`

### Submitting Similar Jobs

-   `-a, --array=indexes`
    -   Submit an array of jobs with array ids as specified. Array ids can be specified as a numerical range, a comma-separated list of numbers, or as some combination of the two. Each job instance will have an environment variable `SLURM_ARRAY_JOB_ID` and `SLURM_ARRAY_TASK_ID`. For example:
    -   `--array=1-11`, to start an array job with index from 1 to 11
    -   `--array=1-7:2`, to submit an array job with index step size 2
    -   `--array=1-9%4`, to submit an array job with simultaneously running job elements set to 4
    -   The srun command is similar to `pbsdsh`. It launches tasks on allocated resources

## R Job Example

Create a directory and an example R script

```bash
[NetID@log-1 ~]$ mkdir /scratch/$USER/examples
[NetID@log-1 ~]$ cd /scratch/$USER/examples
```

Create `example.R` inside the examples directory:

```R
df <- data.frame(x=c(1,2,3,1), y=c(7,19,2,2))
df
indices <- order(df$x)
order(df$x)
df[indices,]
df[rev(order(df$y)),]
```

Create the following SBATCH script named `run-R.sbatch` :

```bash
#!/bin/bash
#
#SBATCH --job-name=RTest
#SBATCH --nodes=1
#SBATCH --tasks-per-node=1
#SBATCH --mem=2GB
#SBATCH --time=01:00:00
 
module purge
module load r/intel/4.0.4
 
cd /scratch/$USER/examples
R --no-save -q -f example.R > example.out 2>&1
```

Run the job using `sbatch`.

```sh
[NetID@log-1 ~]$ sbatch run-R.sbatch
```

## Array Jobs

Using job array you may submit many similar jobs with almost identical job requirement. This reduces loads on both shoulders of users and the scheduler system. Job array can only be used in batch jobs. Usually the only requirement difference among jobs in a job array is the input file or files. 

Please follow the recipe below to try the example. There are 5 input files named `sample-1.txt`, `sample-2.txt` to `sample-5.txt` in sequential order. Running one command `sbatch --array=1-5 run-jobarray.s`, you submit 5 jobs to process each of these input files individually.

Prepare the data before submitting an array job:

```sh
[NetID@log-1 ~]$ mkdir -p /scratch/$USER/myjarraytest
[NetID@log-1 ~]$ cd /scratch/$USER/myjarraytest
[NetID@log-1 ~]$ cp /share/apps/Tutorials/slurm/example/jobarray/* .
[NetID@log-1 ~]$ ls
```

Submit the array job:

```sh
[NetID@log-1 ~]$ sbatch --array=1-5 run-jobarray.s
```

The content of the job script `run-jobarray.s` is copied below:

```bash
#!/bin/bash

#SBATCH --job-name=myJobarrayTest
#SBATCH --nodes=1 
#SBATCH --ntasks-per-node=1
#SBATCH --time=5:00
#SBATCH --mem=1GB
#SBATCH --output=wordcounts_%A_%a.out
#SBATCH --error=wordcounts_%A_%a.err

module purge
module load python/intel/3.8.6

cd /scratch/$USER/myjarraytest
python wordcount.py sample-$SLURM_ARRAY_TASK_ID.txt
```

Job array submission introduces an environment variable, `SLURM_ARRAY_TASK_ID`, which is unique for each job array job. It is usually embedded somewhere so that when a job runs, its unique value is incorporated into producing a proper file name.

Also as shown above: two additional options `%A` and `%a`, denoting the job ID and the task ID ( i.e. job array index ) respectively, are available for specifying a job's stdout, and stderr file names.

## Additional Examples

You can find more examples in the slurm jobarray examples directory:

```sh
/scratch/work/public/examples/slurm/jobarry/
```

## GPU Jobs

To request one GPU card, use SBATCH directive in job script:

```bash
#SBATCH --gres=gpu:1
```

To request a specific card type, use eg. `--gres=gpu:v100:1`. As an example, let's submit an Amber job. Amber is a molecular dynamics software package. The recipe is:

```sh
[NetID@log-1 ~]$ mkdir -p /scratch/$USER/myambertest
[NetID@log-1 ~]$ cd /scratch/$USER/myambertest
[NetID@log-1 ~]$ cp /share/apps/Tutorials/slurm/example/amberGPU/* .
[NetID@log-1 ~]$ sbatch run-amber.s
```

There are three NVIDIA GPU types and one AMD GPU type that can be used.

:::warning
AMD GPUs require code to be compatible with ROCM drivers, not CUDA
:::

**To request NVIDIA GPUs**

-   RTX8000
```bash
#SBATCH --gres=gpu:rtx8000:1
```

-   V100 
```bash
#SBATCH --gres=gpu:v100:1
```

-   A100
```bash
#SBATCH --gres=gpu:a100:1
```

-   H100
```bash
#SBATCH --gres=gpu:h100:1
```

**To request AMD GPUs**

-   MI100
```bash
#SBATCH --gres=gpu:mi100:1
```

-   MI250
```bash
#SBATCH --gres=gpu:mi250:1
```

From the tutorial example directory we copy over Amber input data files "inpcrd", "prmtop" and "mdin", and the job script file "run-amber.s". The content of the job script "run-amber.s" is:

```bash
#!/bin/bash
#
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

The demo Amber job should take ~2 minutes to finish once it starts running. When the job is done, several output files are generated. Check the one named "mdout", which has a section most relevant here:

```sh
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
|                CUDA Device Name: Tesla K80 
|     CUDA Device Global Mem Size:  11439 MB 
| CUDA Device Num Multiprocessors:     13 
|           CUDA Device Core Freq:   0.82 GHz 
| 
|--------------------------------------------------------
```

## Interactive Jobs

### Bash Sessions

The majority of the jobs on the NYU HPC cluster are submitted with the sbatch command, and executed in the background. These jobs' steps and workflows are predefined by users, and their executions are driven by the scheduler system.

There are cases when users need to run applications interactively ( *interactive jobs* ). Interactive jobs allow the users to enter commands and data on the command line (or in a graphical interface ), providing an experience similar to working on a desktop or laptop.

Examples of common interactive tasks are:

-   Editing files

-   Compiling and debugging code

-   Exploring data, to insights

-   A graphical window to run visualization

-   etc

To support interactive use in a batch environment, Slurm allows for interactive batch jobs.

:::warning
Please do not run interactive jobs on the HPC Login nodes.  Login nodes of the HPC cluster are shared between many users so running interactive jobs that require significant computing and IO resources on the login nodes will impact many users.  For this reason running compute and IO intensive interactive jobs on the HPC login nodes is not allowed.

**_Such jobs may be removed without notice!_**
:::

::::tip
Instead of running interactive jobs on Login nodes, users can run interactive jobs on the HPC Compute nodes using SLURM's `srun` utility. Running interactive jobs on compute nodes does not impact many users and in addition provides access to resources that are not available on the login nodes, such as interactive access to GPUs, high memory, exclusive access to all the resources of a compute node, etc.
:::note
There is no partition on the HPC cluster that has been reserved for Interactive jobs.
:::
::::

### Start an Interactive Job

When you start an interactive batch job the command prompt is not immediately returned. Instead, you wait until the resource is available when the prompt is returned and you are on a compute node and in a batch job - much like the process of logging in to a host with ssh. **To end the session, type 'exit'**, again just like the process of logging in and out with ssh.

```sh
[NetID@log-1 ~]$ srun --pty /bin/bash
srun: job 58699789 queued and waiting for resources
srun: job 58699789 has been allocated resources
[NetID@cm034 ~]$ hostname
cm034.hpc.nyu.edu
```

To use any GUI-based program within the interactive batch session you will need to extend X forwarding with the --x11 option. This of course still relies on you having X forwarding at your login session.  To test if you have X forwarding running, you can try running the gnuplot test as shown:
```sh
[NetID@log-1 ~]$ module load gnuplot/gcc/5.4.1
[NetID@log-1 ~]$ gnuplot
gnuplot> test
```
If a window opens on your display with a gnuplot test window, you know that Xforwarding is working.  Please see [SSH Tunneling and X11 Forwarding](../02_connecting_to_hpc/02_ssh_tunneling_and_x11_forwarding.md) for details.

### Request Resources

You can request resources for an interactive batch session just as you would for any other job, for example to request 4 processors with 4GB memory for 2 hours.

If you do not request resources you will get the default settings. If after some directory navigation in your interactive session, you can jump back to the directory you submitted from with:

```sh
[NetID@cm034 ~]$ cd $SLURM_SUBMIT_DIR
```

### Interactive Job Options

(Don't just submit the job, but also wait for it to start and connect `stdout`, `stderr` and `stdin` to the current terminal)

-   `-nnum`
    -   Specify the number of tasks to run, eg. -n4. Default is one CPU core per task

-   `-ttime`
    -   Request job running duration, eg. `-t1:30:00`

-   `--mem=MB`
    -   Specify the real memory required per node in MegaBytes, eg. `--mem=4000`
    -   `--pty`
    -   Execute the first task in pseudo terminal mode, eg. `--pty /bin/bash`, to start a bash command shell

-   `--gres=gpu:N`
    -   To request `N` number of GPUs

-   `--x11`
    -   Enable X forwarding, so programs using a GUI can be used during the session (provided you have X forwarding to your workstation set up)
    -   To leave an interactive batch session, type `exit` at the command prompt

Certain tasks need user interaction - such as debugging and some GUI-based applications. However the HPC clusters rely on batch job scheduling to efficiently allocate resources. Interactive batch jobs allow these apparently conflicting requirements to be met.

### Interactive Bash Job Examples

**Example (Without x11 forwarding)**

Through `srun` SLURM provides rich command line options for users to request resources from the cluster, to allow interactive jobs. Please see some examples and short accompanying explanations in the code block below, which should cover many of the use cases.

In the srun examples below, through `--pty /bin/bash` we request to start bash command shell session in pseudo terminal by default the resource allocated is single CPU core and 2GB memory for 1 hour: 

```sh
[NetID@log-1 ~]$ srun --pty /bin/bash
```

To request 4 CPU cores, 4 GB memory, and 2 hour running duration:

```sh
[NetID@log-1 ~]$ srun -c4 -t2:00:00 --mem=4000 --pty /bin/bash
```

To request one GPU card, 3 GB memory, and 1.5 hour running duration:

```sh
[NetID@log-1 ~]$ srun -t1:30:00 --mem=3000 --gres=gpu:1 --pty /bin/bash
```

**Example (x11 forwarding)**

In srun there is an option "–x11", which enables X forwarding, so programs using a GUI can be used during an interactive session (provided you have X forwarding to your workstation set up).

To request computing resources, and export x11 display on allocated node(s)

```sh
[NetID@log-1 ~]$ srun --x11 -c4 -t2:00:00 --mem=4000 --pty /bin/bash
[NetID@cm034 ~]$ module load gnuplot/gcc/5.4.1
[NetID@cm034 ~]$ gnuplot
gnuplot> test
```

To request GPU card etc, and export x11 display:

```sh
[NetID@log-1 ~]$ srun --x11 -t1:30:00 --mem=3000 --gres=gpu:1 --pty /bin/bash
```

### R interactive job

The following example shows how to work with Interactive R session on a compute node:

```sh
[NetID@log-1 ~]$ srun -c 1 --pty /bin/bash
[NetID@cm034 ~]$ module purge
[NetID@cm034 ~]$ module list

No modules loaded
[NetID@cm034 ~]$ module load r/gcc/4.4.0
[NetID@cm034 ~]$ module list

Currently Loaded Modules:
  1) r/intel/4.4.0

[NetID@cm034 ~]$ R
R version 4.4.0 (2024-04-24) -- "Puppy Cup"
Copyright (C) 2024 The R Foundation for Statistical Computing
Platform: x86_64-pc-linux-gnu

R is free software and comes with ABSOLUTELY NO WARRANTY.
You are welcome to redistribute it under certain conditions.
Type 'license()' or 'licence()' for distribution details.

R is a collaborative project with many contributors.
Type 'contributors()' for more information and
'citation()' on how to cite R or R packages in publications.

Type 'demo()' for some demos, 'help()' for on-line help, or
'help.start()' for an HTML browser interface to help.
Type 'q()' to quit R.
> 5 + 10
[1] 15
> 6 ** 2
[1] 36
> tan(45)
[1] 1.619775
>
> q()
Save workspace image? [y/n/c]: n
[NetID@cm034 ~]$ exit
exit
[NetID@log-1 ~]$
```
