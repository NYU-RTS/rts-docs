# Submitting Jobs on Torch

:::tip Beginner tutorial available
If you are new to using HPC resources and would like to learn about the principles of using the `SLURM` scheduler for submitting batch jobs, please refer to [this section](../13_tutorial_intro_hpc/04_scheduler_fundamentals.mdx). It focuses on the specifics of the Torch cluster and assumes familiarity with the tutorial.
:::

:::warning Active allocation in the HPC projects portal
An active allocation in the HPC projects portal is needed to submit any jobs on Torch. For more information on how to get one, please refer to [this section](../../hpc/01_getting_started/03_Slurm_Accounts/02_hpc_project_management_portal.mdx). All job submissions must include the `--account` parameter. On Torch, you can list the SLURM accounts you have access to by running the command [`my_slurm_accounts`](http://localhost:3000/docs/hpc/tools_and_software/utils/#my_slurm_accounts).
::: 

## GPUs

To request GPUs on Torch you'll need to use the `--gres=gpu:number` flag in either your sbatch file or the command line, where you'll replace `number` with the number of GPUs you're requesting.

For example, in an sbatch file you'd do something like:
```bash
#!/bin/bash
#SBATCH --job-name=gpu_test
#SBATCH --output=gpu_test.out
#SBATCH --gres=gpu:1
#SBATCH --nodes=1
#SBATCH --ntasks=1
#SBATCH --cpus-per-task=1
#SBATCH --mem=1M
#SBATCH --time=00:10:00
#SBATCH --account=torch_pr_XXX_XXXXX

python gpu_test.py
```

and to start an interactive job with a GPU you would do something like:
```bash
srun --account=torch_pr_XXXX_XXXXX --gres=gpu:1 --cpus-per-task=1 --mem=8GB --time=1:00:00 --pty /bin/bash
```

If you'd like a specific type of GPU you can specify that with the `--constraint='type'` flag.  You'll need to replace `type` with the type of GPU or a `|` separated list of acceptable GPUs.
Here are a couple of examples using `srun`, but you can also use the same syntax in an sbatch file:
```bash
 srun --account=torch_pr_XXXX_XXXXX --gres=gpu:1 --constraint='h200' --cpus-per-task=1 --mem=8GB --time=1:00:00 --pty /bin/bash
 ```
 or
 ```bash
 srun --account=torch_pr_XXXX_XXXXX --gres=gpu:1 --constraint='h200|l40s' --cpus-per-task=1 --mem=8GB --time=1:00:00 --pty /bin/bash
 ```

You can find the available types of GPUs at [Torch Spec Sheet](../10_spec_sheet.md)

## Partitions

`SLURM` partitions on Torch control stakeholder resource access. No physical nodes are tied to partitions — instead, equivalent compute resources are allocated via partition `QoS`([QualityOfService](https://slurm.schedmd.com/qos.html)).

:::tip Partitions
Do not specify partitions manually, except for preemption which is described later.
:::

## Resource limits and restrictions
Jobs within the same partition cannot exceed their assigned resources (`QOSGrpGRES`). User GPU Quotas: Each user has a total GPU quota of 24 GPUs for jobs with wall time < 48 hours (`QOSMaxGRESPerUser`).

Non-stakeholders to temporarily use stakeholder resources (a stakeholder group to temporarily use another group’s resources). Stakeholders retain normal access to their own resources. If non-stakeholders (or other stakeholders) are using them, their jobs may be preempted (canceled) once stakeholders submit new jobs. Public users are allowed to use stakeholder resources only with preemption partitions. Refer to the section below for details on preemptible jobs.

:::tip

`QOSGrpGRES` indicates that there are currently no GPUs available in the partition; it does not reflect an issue with your individual account. In contrast, messages such as `QOSMaxMemoryPerUser` and `QOSMaxCpuPerUserLimit` indicate limits imposed on a user’s account.

:::

## Job Submission on Torch
As stated in the tutorial, be sure to only request the compute resources (e.g., GPUs, CPUs, memory) needed for the job. Requesting too many resources can prevent your job from being scheduled within an adequate time. The `SLURM` scheduler will automatically dispatch jobs to all accessible GPU partitions that match resource requests.

:::danger Low GPU Utilization Policy
Jobs with low GPU utilization will be automatically canceled:
| Node Pattern | Cancellation Criteria | Warning Criteria |
| :----------- | :-------------------: | :--------------: |
| gl*          | 50%                   | 70%              |
| gh*          | 60%                   | 75%              |
| ga*          | 50%                   | 70%              |
| gr*          | 50%                   | 70%              |
| * (default)  | 10%                   | 50%              |


Enforcement will be very aggressive.
:::

## Preemptible jobs on Torch
On Torch, users may run "preemptible" jobs on stakeholder resources that their group does not own. This allows the stakeholder resources to be utilized by non-stakeholders which may otherwise be idle. To make the best use of these resources, you are encouraged to adopt checkpoint/restart to allow for resumption of the workload in subsequent jobs.

:::warning Preemption Policy
Jobs become eligible for preemption after 30 minutes of runtime. Jobs will not be canceled within the first 30 minutes.
:::

The preemption order is:
-   Stakeholder jobs (highest priority), these can preempt GPU jobs from public users or other stakeholders
-   GPU jobs can preempt CPU-only jobs running on GPU nodes
-   Partition Assignment Order
-   PI stakeholder partitions
-   School stakeholder partitions
-   IT public partitions
-   Preemption partitions
Applies separately to both GPU types: L40S first, then H200


To allow jobs in both normal and preemption partitions:
```
#SBATCH --comment="preemption=yes;requeue=true"
```
Jobs in stakeholder partitions will not be canceled, but those in preemption partitions may be. Canceled jobs will be re-queued automatically with `requeue=true`.  To use only preemption partitions:
```
#SBATCH --comment="preemption=yes;preemption_partitions_only=yes;requeue=true"
```
Jobs with preemption partitions only might be allowed to use more resources

## Advanced options

### GPU MPS
Use GPU Multi-Process Service (MPS) to improve overall GPU utilization, as this allows multiple GPU jobs to share a single GPU concurrently by:
```
#SBATCH --comment="gpu_mps=yes"
```
### RAM disk
A portion of the RAM available can be mounted as a disk for fast `I/O` operations:
```
#SBATCH --comment="ram_disk=1GB"
```
### GPU MPS & RAM Disk in a preemptible job
Both of these can be combined with preemption as shown:
```
#SBATCH --comment="preemption=yes;preemption_partitions_only=yes;requeue=true;gpu_mps=yes;ram_disk=1GB"
```
