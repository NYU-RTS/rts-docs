# Available storage systems

The NYU HPC clusters are served by the following storage systems:

## GPFS 
General Parallel File System (GPFS) storage cluster is a high-performance clustered file system developed by IBM that provides concurrent high-speed file access to applications executing on multiple nodes of clusters.

### Configuration
The NYU HPC cluster storage runs on Lenovo Distributed Storage Solution DSS-G hardware: 
-   2x DSS-G 202
    -   116 Solid State Drives (SSDs)
    -   464TB raw storage
-   2x DSS-G 240
    -   668 Hard Disk Drives (HDDs)
    -   9.1PB raw storage

### Performance
-   Read Speed: 78 GB per second read speeds
-   Write Speed: 42 GB per second write speeds
-   I/O Performance: up to 650k input/output operations per second (IOPS)

## Flash Tier Storage (VAST)
An all flash file system, using [VAST Flash storage](https://www.vastdata.com/), is now available on Torch. Flash storage is optimal for computational workloads with high I/O rates. For example, If you have jobs to run with huge amount of tiny files, VAST may be a good candidate.  If you and your lab members are interested, please reach out to [hpc@nyu.edu](mailto:hpc@nyu.edu) for more information.
-   NVMe interface
-   Total size: 778 TB
:::note
/vast is available for all users to read and available to approved users to write data.
:::

## Research Project Space (RPS)
[Research Project Space (RPS)](./05_research_project_space.mdx) volumes provide working spaces for sharing data and code amongst project or lab members.
-   RPS directories are available on the Torch HPC cluster.
-   There is no old-file purging policy on RPS.
-   RPS is backed up. 
-   There is a cost per TB per year and inodes per year for RPS volumes.

Please see [Research Project Space](./05_research_project_space.mdx) for more information.


