# HPC Bursting

[gcp-cost-calculator]: https://cloudpricingcalculator.appspot.com/
[bursting-form]: https://sites.google.com/nyu.edu/nyu-hpc/hpc-systems/cloud-computing/hpc-bursting-to-cloud/hpc-bursting-request-form?authuser=0

HPC may provide bursting capabilities to researchers or classes, in some cases, in order to augment the available resources. Bursting is ideal for when you need a large amount of resources for a very short period of time. The way that bursting is made possible is by running a scalable SLURM cluster in the Google Cloud Platform (GCP), which is separate from the on-premise HPC clusters.

Bursting is not available to all users and requires advanced approval. In order to get access to these capabilities, please contact hpc@nyu.edu to check your eligibility. Please let us know the amount of storage, total CPUs, Memory, GPU, the number of days you require access, and the estimated total CPU/GPU hours you will use. For reference, please review the [GCP cost calculator][gcp-cost-calculator]. Please send a copy of your cost calculation to hpc@nyu.edu as well.

:::tip
To request access to the HPC Bursting capabilities, [please complete this form][bursting-form].
:::

## Running a Bursting Job
:::note
This is not public, only per request of eligible classes or researchers
:::
```sh
ssh <NetID>@torch.hpc.nyu.edu
```
ssh to the class on GCP (burst login node) - anyone can login but you can only submit jobs if you have approval
```sh
ssh burst 
```
Start an interactive job
```sh
srun --account=hpc --partition=interactive --pty /bin/bash
```
If you got an error "Invalid account or account/partition combination specified" it means your account is not approved to use cloud bursting.

Once your files are copied to the bursting instance you can run a batch job from the interactive session.

## Access to Slurm Partitions
In the example above the partition "interactive" is used. You can list current partitions by running command
```sh
sinfo
```

However, approval is required to submit jobs to the partitions. Partitions are set up by the resources available to a job, such as the number of CPU, amount of memory, and number of GPUs. Please email hpc@nyu.edu to request access to a specific partition or create a new partition (e.g. 10 CPUs and 64 GB Memory) for more optimal cost/performance of your job.

### Storage

Torch's `/home` and `/scratch` are mounted (available) at login node of bursting setup.

Compute node however, do have independent `/home` and `/scratch`.  These `/home` and `/scratch` mounts are persistent, are available from any compute node and independent from `/home` and `/scratch` at Torch.

User may need to copy data from Torch's `/home` or `/scratch` to GCP mounted `/home` or `/scratch`

When you run a bursting job the compute nodes will not see those file mounts. This means that you need to copy data to the burst instance.

The file systems are independent, so you must copy data to the GCP location.

To copy data, you must first start an interactive job. Once started, you can copy your data using scp from the HPC Data Transfer Nodes (torch-dtn). Below is the basic setup to copy files from Torch to your home directory while you are in an interactive bursting job:
```sh
scp <NetID>@torch-dtn.hpc.nyu.edu:/path/to/files /home/<NetID>/
```


### Current Limits

20,000 CPUs available at any given time for all active bursting users
