# Slurm: Command reference

Slurm offers many utility commands to work with, some of the most popularly used commands are:

| Command | Description | 
| ------- | ----------- |
| [srun](#srun)    | Run parallel jobs |
| [sbatch](#sbatch)  | Submit a batch script to Slurm |
| [salloc](#salloc)  | Obtain a Slurm job allocation ( for interactive workflows ) |
| [sinfo](#sinfo)  | View information about Slurm nodes and partitions |
| [squeue](#squeue) | View information about the jobs located in the slurm scheduling queue |
| [sacct](#sacct) | Displays accounting data for all jobs in and job steps in the slurm job accounting log or slurm database |
| [scancel](#scancel) | Used to signal jobs or job steps that are under the control of slurm |

## srun 

Run a parallel job on cluster managed by Slurm, can be used:

1.  Individual job submission where resources are allocated.
2.  In `sbatch` batch scripts as `job steps` making use of the allocated resource pool.
3.  within `salloc` instance making use of the resource pool.

```sh
man srun # for more information
```

| Option | Description |
| ------ | ----------- |
| `--help` | Display help information and exit |
| `--account` | Charge resource used by this job to a specified account |
| `--ntasks` or `--nodes` | Request the number of tasks for the job Or Request the number of nodes to be allocated for this job |
| `--ntasks-per-node` | Request that `ntasks` be invoked on each node. Meant to be used with `--nodes` |
| `--cpus-per-task` | Request  that  ncpus be allocated per process. This may be useful if the job is multithreaded  and requires  more than one CPU per task for optimal performance. |
| `--mem` or `--mem-per-cpu` | Specify the real memory required **_per node_**.  Default units are megabytes.  Different units can be specified using the suffix **\[ K \| M \| G \| T ]** Or Minimum memory required per allocated CPU | 
| `--output` | Redirect **_stdout_** to a file |
| `--error` | Redirect **_stderr_** to a file |
| `--label` | Prepend task numbers to lines of stdout/err |
| `--partition` | Request a specific partition for the resource allocation. If not specified, the default behavior is to allow the slurm controller to select the default partition as designated by the  system  administrator. |
| `--pty` | Execute  task zero with pseudo terminal mode or using pseudo terminal specified by `<File Descriptor>`. |
| `--gres` | Specifies a comma-delimited list of generic consumable resources, examples: `--gres=gpu:1`, `--gres=gpu:v100:2`, `--gres=help` or `--gres=none` | 
| `--chdir` | Set the working directory of `srun` before it is executed | 


## sbatch

```sh
man sbatch # for more information
```

Some of the popularly used directives are:

| Option | Description |
| ------ | ----------- |
| `#SBATCH --account` | Charge resource used by this jab to a specified account |
| `#SBATCH --nodes` or `#SBATCH --ntasks` | Request allocation of minimum or maximum nodes for this job |
| `#SBATCH --ntasks-per-node` | Request that ntasks be invoked on each node, used with `--nodes` |
| `#SBATCH --cpus-per-task` | Advise the Slurm controller that ensuing job  steps will  require  ncpus number of processors per task. Without this option, the controller will just try to allocate one processor per task |
| `#SBATCH --mem` | Specify the real memory required per node. Default units are megabytes.  Different units can be specified  using the suffix **\[ K \| M \| G \| T ]** |
| `#SBATCH --gres` | Specifies a comma-delimited list of generic consumable resources. |
| `#SBATCH --output` | Instruct  Slurm to connect the batch script's standard output directly to a specified filename |
| `#SBATCH --error` | Instruct  Slurm to connect the batch script's standard error directly to a specified filename |
| `#SBATCH --mail-user` | User to receive email notifications of state changes as defined by `--mail-type` |
| `#SBATCH --mail-type` | Notify user by email when certain event types occur. Valid type values are `NONE`, `BEGIN`, `END`, `FAIL`, `REQUEUE`, `ALL` etc. Multiple type values may be specified in a comma separated list.  The user to be notified is indicated  with  --mail-user. |
| `#SBATCH --job-name` | Specify a name for the job allocation, the default is the name of the batch script or just sbatch |
| `#SBATCH --constraint` | Enable constraints such as `--constraint="nvidia"` to select any kind of nvidia GPUs or `--constraint="amd"` to select any kind of amd GPUs or `--constraint="a100\|h100"` to select either any one of two GPUs |
| `#SBATCH --chdir` | Set the working directory of `sbatch script` before it is executed |

## salloc

The options for `salloc` are similar to the ones used by `srun` or `sbatch`, consult the salloc manual pages for more information on additional options and their environment variables:

```sh
man salloc # for detailed information
```

## sinfo

View information about slurm nodes and partitions.

```sh
man sinfo # for more information
```

```sh
sinfo --Format=Partition,GRES,CPUs,Features:26,NodeList
```

| Format | Description |
| ------ | ----------- |
| `Available` | State/availability of a partition |
| `CPUs` | Number of CPUs per node |
| `CPUsState` | Number of CPUs by state in the format "allocated/idle/other/total" |
| `Features`:26 | Features available on the node, use `:` followed by a number which specifies the max number of characters printed for this column. `sinfo` prints **_max 20 characters_** by default per column |
| `Gres` | Generic resource associated with the nodes |
| `GresUsed` | Generic resource currently in use on the nodes |
| `MaxCPUsPerNode` | The Max number of CPUs per node available to jobs in this partition |
| `Memory` | Size of memory per node in Megabytes |
| `NodeAI` | Number of nodes by state in the format "allocated/idle" |
| `Nodes` | Number of nodes | 
| `NodeList` | List of node names |
| `Partition` or `PartitionName` | Partition name |

## squeue

View information about jobs located on slurm scheduling queue.

```sh
man squeue # for more information
```

| Options | Description |
| ------- | ----------- |
| `--me` | Prints queued jobs for the current user |
| `--user` | Prints queued jobs under a specific user, or a comma list of users |
| `--job` | Specify a comma separated list of job IDs to display |
| `--help` | Print a help message describing all options squeue |

## sacct

Displays accounting data for all jobs and job steps in the Slurm job accounting log or Slurm database.

```sh
man sacct # for more information
```

Most popularly used format options are:

| Options | Description |
| ------- | ----------- |
| `--format` | Comma  separated list of fields. (use "--helpformat" for a list of available fields). **_NOTE:_** When using the format option for listing various fields you can put a **_%NUMBER_** afterwards to specify how many characters should be printed. e.g. `format=name%30` will  print  30  characters of field  name  right  justified. A `%-30` will print 30 characters left justified. |
| `--helpformat` | Print a list of fields that can be specified with `--format` option |

Some popular options for `--format` are:

| Format | Description |
| ------ | ----------- |
| `JobID` | The identification number of the `job` or `job step`|
| `JobName` | The name of the job or job step |
| `State` | Displays the job status or state, such as `COMPLETED`, `TIMEOUT`, `FAILED` etc |
| `AllocCPUS` | Number of CPUs allocated to the job |
| `Elapsed` | Elapsed time for the job |
| `Start` | Initiation time for the job |
| `End` | Termination time for the job |

## scancel

Used to signal jobs or job steps that are under the control of slurm. A signal in the sense, send a **_termination signal_** to cancel a job.

| Options | Description |
| ------- | ----------- |
| `--interactive` | Interactive mode. Confirm  each  `job_id.step_id`  before performing the cancel operation |
| `--jobname` | Restrict the scancel operations to a provided job name |
| `--me` | Cancel all your jobs |
| `scancel <a_job_id>` | Cancel a job and all it's steps |
| `scancel <a_job_id>.<step_id_a> <a_job_id>.<step_id_b>` | Only cancel steps `a` and `b` for a given job, but not the rest of the steps |
| `scancel <JobID_ArrayID>` | Only cancel a array id of an job array |

