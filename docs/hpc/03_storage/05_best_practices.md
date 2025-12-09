# Best Practices on HPC Storage
## User Quota Limits and the myquota command
All users have quote limits set on HPC fie systems. There are several types of quota limits, such as limits on the amount of disk space (disk quota), number of files (inode quota) etc. The default user quota limits on HPC file systems are listed [on our Data Management page](./01_intro_and_data_management.mdx#hpc-storage-mounts-comparison-table).

:::warning
_One of the common issues users report is running out of inodes in their home directory._ This usually occurs during software installation, for example installing conda environment under their home directory.  Running out of quota causes a variety of issues such as running user jobs being interrupted or users being unable to finish the installation of packages under their home directory.
:::

Users can check their current utilization of quota using the myquota command. The myquota command provides a report of the current quota limits on mounted file systems, the user's quota utilization, as well as the percentage of quota utilization.

In the following example the user who executes the `myquota` command is out of inodes in their home directory. The user inode quota limit on the `/home` file system **30.0K inodes** and the user has **33000 inodes**, thus **110%** of the inode quota limit.
```sh
$ myquota
Hostname: log-1 at Sun Mar 21 21:59:08 EDT 2021
Filesystem   Environment   Backed up?   Allocation       Current Usage
Space        Variable      /Flushed?    Space / Files    Space(%) / Files(%)
/home        $HOME         Yes/No       50.0GB/30.0K       8.96GB(17.91%)/33000(110.00%)
/scratch     $SCRATCH      No/Yes        5.0TB/1.0M     811.09GB(15.84%)/2437(0.24%)
/archive     $ARCHIVE      Yes/No        2.0TB/20.0K       0.00GB(0.00%)/1(0.00%)
```
Users can find out the number of inodes (files) used per subdirectory under their home directory (`$HOME`), by running the following commands:
```sh
$cd $HOME
$ for d in $(find $(pwd) -maxdepth 1 -mindepth 1 -type d | sort -u); do n_files=$(find $d | wc -l); echo $d $n_files; done
/home/netid/.cache 1507
/home/netid/.conda 2
/home/netid/.config 2
/home/netid/.ipython 11
/home/netid/.jupyter 2
/home/netid/.keras 2
/home/netid/.local 24185
/home/netid/.nv 2
/home/netid/.sacrebleu 46
/home/netid/.singularity 1
/home/netid/.ssh 5
/home/netid/.vscode-server 7216
```

## Large number of small files
In case your dataset or workflow requires to use large number of small files, this can create a bottleneck due to read/write rates. 

Please refer to [our page on working with a large number of files](./06_large_number_of_small_files.md) to learn about some of the options we recommend to consider.

## Installing Python packages
:::warning
Your home directory has a relatively small number of inodes.
If you create a conda or python environment in you home directory, this can eat up all the inodes. 
:::

Please review the [Package Management section](../06_tools_and_software/01_intro.md#package-management-for-r-python--julia-and-conda-in-general) of the [Torch Software Page](../06_tools_and_software/01_intro.md).
