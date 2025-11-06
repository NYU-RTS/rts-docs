# Submitting Jobs on Torch

:::tip Beginner tutorial available
If you are new to using HPC resources and would like to learn about the principles of using the `SLURM` scheduler for submitting batch jobs, please refer to [this section](../13_tutorial_intro_hpc/04_scheduler_fundamentals.mdx). This section focuses on the specifics of the Torch cluster and assumes familiarity with the tutorial.
:::

## Partitions

`SLURM` partitions on Torch control stakeholder resource access. No physical nodes are tied to partitions — instead, equivalent compute resources are allocated via partition `QoS`([QualityOfService](https://slurm.schedmd.com/qos.html)).

:::tip Partitions
Do not specify partitions manually, except for preemption which is described later.
:::

## Resource limits and restrictions
Jobs within the same partition cannot exceed their assigned resources (`QOSGrpGRES`). User GPU Quotas: Each user has a total GPU quota of 24 GPUs for jobs with wall time < 48 hours (`QOSMaxGRESPerUser`).

Non-stakeholders to temporarily use stakeholder resources (a stakeholder group to temporarily use another group’s resources). Stakeholders retain normal access to their own resources. If non-stakeholders (or other stakeholders) are using them, their jobs may be preempted (canceled) once stakeholders submit new jobs. Public users are allowed to use stakeholder resources only with preemption partitions. Refer to the section below for details on preemptible jobs.

## Job Submission on Torch
As stated in the tuturial, always only request the compute resources (e.g., GPUs, CPUs, memory) needed for the job. Requesting too many resources can prevent your job from being scheduled within an adequate time. The `SLURM` scheduler will automatically dispatch jobs to all accessible GPU partitions that match resource requests.

:::danger Low GPU Utilization Policy
Jobs with low GPU utilization will be automatically canceled. The exact threshold is TBD, but enforcement will be very aggressive.
:::

## Preemptible jobs on Torch
On Torch, users may run "preemptible" jobs on stakeholder resources that their group does not own. This allows the stakeholder resources to be utilized by non-stakeholders which may otherwise be idle. To make the best use of these resources, you are encouraged to adopt checkpoint/restart to allow for resumption of the workload in subsequent jobs.

:::warning Preemption Policy
Jobs become eligible for preemption after 1 hour of runtime. Jobs will not be canceled within the first hour.
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
