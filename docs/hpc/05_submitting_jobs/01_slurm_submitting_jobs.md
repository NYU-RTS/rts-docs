# Submitting Jobs on Torch

:::tip Beginner tutorial available
If you are new to using HPC resources and would like to learn about the principles of using the `SLURM` scheduler for submitting batch jobs, please refer to [this section](../13_tutorial_intro_hpc/04_scheduler_fundamentals.mdx). This section focuses on the specifics of the Torch cluster and assumes familiarity with the tutorial.
:::

## Partitions on Torch
`SLURM` partitions on Torch control stakeholder resource access. No physical nodes are tied to partitions — instead, equivalent compute resources are allocated via partition `QoS`. Jobs within the same partition cannot exceed their assigned resources (`QOSGrpGRES`). User GPU Quotas: Each user has a total GPU quota of 24 GPUs for jobs with wall time < 48 hours (`QOSMaxGRESPerUser`).

:::tip Partitions
Do not specify partitions manually, except for preemption which is described later.
:::

Non-stakeholders to temporarily use stakeholder resources (a stakeholder group to temporarily use another group’s resources). Stakeholders retain normal access to their own resources. If non-stakeholders (or other stakeholders) are using them, their jobs may be preempted (canceled) once stakeholders submit new jobs. Public users are allowed to use stakeholder resources only with preemption partitions.

## Job Submission on Torch
As stated in the tuturial, always only request the compute resources (e.g., GPUs, CPUs, memory). The `SLURM` scheduler will automatically dispatch jobs to all accessible GPU partitions that match resource requests.

:::warning Low GPU Utilization Policy
Jobs with low GPU utilization will be automatically canceled. The exact threshold is TBD, but enforcement will be very aggressive.
:::

## Preemptible jobs on Torch
On Torch, users may run "preemptible" jobs on stakeholder resources that their group does not own. This allows the stakeholder resources to be utilized by non-stakeholders which may otherwise be idle. To make the best use of these resources, you are encouraged to adopt checkpoint/restart to allow for resumption of the workload in subsequent jobs.

:::info Preemption Policy
Jobs become eligible for preemption after 1 hour of runtime. Jobs will not be canceled within the first hour.
:::

The preemption order is:
-   Stakeholder jobs have highest priority, can preempt GPU jobs from public users or other stakeholders
-   GPU jobs can preempt CPU-only jobs running on GPU nodes
-   Partition Assignment Order
-   PI stakeholder partitions
-   School stakeholder partitions
-   IT public partitions
-   Preemption partitions
Applies separately to both GPU types: L40S first, then H200


To allow jobs in both normal and preemption partitions:
```sh
#SBATCH --comment="preemption=yes;requeue=true"
```
Jobs in stakeholder partitions will not be canceled, but those in preemption partitions may be. Canceled jobs will be re-queued automatically with `requeue=true`.  To use only preemption partitions:
```sh
#SBATCH --comment="preemption=yes;preemption_partitions_only=yes;requeue=true"
```
Jobs with preemption partitions only might be allowed to use more resources

## Enable GPU MPS
Use GPU Multi-Process Service (MPS) to improve overall GPU utilization, allows multiple GPU jobs to share a single GPU concurrently
```sh
#SBATCH --comment="gpu_mps=yes"
```
Mount Memory as Disk
Create a small RAM disk for fast I/O operations
```sh
#SBATCH --comment="ram_disk=1GB"
```
Example with preemption, GPU MPS, and RAM disk enabled:
```sh
#SBATCH --comment="preemption=yes;preemption_partitions_only=yes;requeue=true;gpu_mps=yes;ram_disk=1GB"
```
