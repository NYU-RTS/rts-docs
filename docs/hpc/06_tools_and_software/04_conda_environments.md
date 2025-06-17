# Conda Environments (Python, R)

## What is Conda?
Package, dependency and environment management for any language—Python, R, Ruby, Lua, Scala, Java, JavaScript, C/ C++, FORTRAN, and more.

Please find more information at [the official documentation page](https://docs.conda.io/en/latest/)

Conda provides a great way to install packages that are already compiled, so you don't need to go over the long compilation process. If a package you need is not available, you can install it (and compile it when needed) using pip (Python) or install.packages (R).

:::note
**Reproducibility**:
One of the ways to ensure the reproducibility of your results is to have an independent conda environment in the directory of each project (one of the options shown below). This will also keep conda environment files away from your `/home/$USER` directory.
:::

## Advantages/disadvantages of using Conda
### Advantages

-   A lot of pre-compiled packages (fast and easy to install)
:::note
**For Python**: pip also offers pre-compiled packages (wheels). List can be found on [Python Wheels](https://pythonwheels.com). 
However, Conda has a significantly larger number of pre-compiled packages.
:::
-   Compiled packages use highly efficient Intel Math Kernel Library (MKL) library

### Disadvantages

-   Conda does not take advantage of packages already installed in the system (while [virtualenv and venv](./02_python_packages_with_virtual_environments.md) do)
-   As you will see below, you may need to do additional steps to keep track of all installed packages (including those installed by pip and/or install.packages)

::::warning[Automatic deletion of your files]
This page describes the installation of packages on `/scratch`. One has to remember, though, that files stored in the HPC scratch file system are subject to the HPC Scratch old file purging policy: <br />
Files on the `/scratch` file system that have not been accessed for 60 or more days will be purged. <br />
You can read more this in [Data Management](../03_storage/01_intro_and_data_management.mdx).

:::tip
Thus you can consider the following options:

-   Reinstall your packages if some of the files get deleted
    -   You can do this manually 
    -   You can do this automatically. For example, within a workflow of a pipeline software like [Nextflow](https://www.nextflow.io/)
-   Pay for "Research Project Space" - for details see [Research Project Space](../03_storage/05_research_project_space.mdx)
-   Use Singularity and install packages within a corresponding overlay file - for details see [Singularity with Conda](../07_containers/03_singularity_with_conda.md)  
:::
::::

## Initializing Conda
Load anaconda module
```sh
module purge
module load anaconda3/2024.02
```

Conda init can create problems with package installation, so we suggest using `source activate` instead of `conda activate`, even though conda activate is considered a best practice by the Anaconda developers.

There are two main ways to create conda environments.  You can either define them with a name by using the `-n` or `--name` parameter or you can define them by full path (or prefix) using the `-p` or `--prefix` parameter.

:::tip
NYU HPC recommends using prefix environments as a best practice because it makes reproducibility easier as we will see below.  However, we do show how to use named environments with your `/scratch` space, so you don't fill up your `/home` space, if that's preferred.
:::

## Prefix Conda Environments
You can store your program/project in `/scratch` and keep the conda environment with it by using the `-p` parameter. This will keep all the files inside the project's directory, instead of putting in in your `/home/$USER`. <br />
Here are details about how to do this for Python and R projects:

### Python
#### 1. Load anaconda module and create local prefix environment
```sh
module purge
module load anaconda3/2024.02
conda create -p ./penv python  ## environment will be created in project directory
source activate ./penv 
```
#### 2. Create a symbolic link so conda will download files for packages to be installed into scratch, not your home directory.
```sh
mkdir /home/<NetID>/.conda
mkdir /scratch/<NetID>/conda_pkgs
ln -s /scratch/<NetID>/conda_pkgs /home/<NetID>/.conda/pkgs
```
[Install pre-compiled packages available in conda](https://anaconda.org/anaconda/repo)
```sh
conda install -c anaconda pandas
```

#### 3. Other packages may be installed (and compiled when needed) using pip
```sh
pip install <package_name>
```
:::note
Conda and packages install by default to `~/.local/lib/python<version>`, so if you did use `'pip install --user'` to install some packages (without conda or other virtual environment), they will be available in `~/.local/lib/python<version>`
:::

::::warning
:::info[The primary takeaway:]

Let say you have tornado v.6 installed in `~/.local/lib/python<version>`, and tornado v.5 installed by `conda install`.

When you will do `source activate` you will have tornado v.6 available!! Not v.5!!

(this behaviour is the same for packages installed by to `~/.local/lib/python<version>` before or after you create your conda environment)

`pip freeze` will give v.6

`conda list` will give v.5
:::
:::tip[Solution]

To overcome this, do `export PYTHONNOUSERSITE=True` after source activate
:::
::::

### R
#### 1. Load anaconda module and create local prefix environment
```sh
module load anaconda3/2024.02
conda create -p ./renv r=3.5 ## environment will be created in project directory
## OR
conda create -c conda-forge -p ./renv r-base=3.6.3 ## environment will be created in project directory
source activate ./renv
```

#### 2. Install pre-compiled packages available in conda:

[https://docs.anaconda.com/anaconda/packages/r-language-pkg-docs/](https://docs.anaconda.com/anaconda/packages/r-language-pkg-docs/)

```sh
conda install -c r r-dplyr
```

#### 3. Other packages may be installed (and compiled) using install.packages()
```sh
install.packages("<package_name>")
```

## Named Conda Environments

You can create a named conda environment with a command like:
```bash
conda create --name <my-env>
```
You'll need to replace `<my-env>` with the name of your environment.

We defined where the prefix environment is created in the creation command, so where is the named environment created for named conda environments?

We can find this out by using the `info` command with conda:
```bash
$ conda info
```
This should output something like:
```bash
     active environment : None
       user config file : /home/NetID/.condarc
 populated config files : 
          conda version : 24.1.2
    conda-build version : 24.1.2
         python version : 3.11.7.final.0
                 solver : libmamba (default)
       virtual packages : __archspec=1=cascadelake
                          __conda=24.1.2=0
                          __glibc=2.34=0
                          __linux=5.14.0=0
                          __unix=0=0
       base environment : /share/apps/anaconda3/2024.02  (read only)
      conda av data dir : /share/apps/anaconda3/2024.02/etc/conda
  conda av metadata url : None
           channel URLs : https://repo.anaconda.com/pkgs/main/linux-64
                          https://repo.anaconda.com/pkgs/main/noarch
                          https://repo.anaconda.com/pkgs/r/linux-64
                          https://repo.anaconda.com/pkgs/r/noarch
          package cache : /share/apps/anaconda3/2024.02/pkgs
                          /home/NetID/.conda/pkgs
       envs directories : /home/NetID/.conda/envs
                          /share/apps/anaconda3/2024.02/envs
               platform : linux-64
             user-agent : conda/24.1.2 requests/2.31.0 CPython/3.11.7 Linux/5.14.0-284.86.1.el9_2.x86_64 rhel/9.2 glibc/2.34 solver/libmamba conda-libmamba-solver/24.1.0 libmambapy/1.5.6 aau/0.4.3 c/U4Vmh2Rw4idTcwqzLhNX1g s/2MYchdSIR4EFcYeOthelfQ
                UID:GID : 402570:402570
             netrc file : None
           offline mode : False
```

You can see in this output the default location for your `package cache` and your `envs directories`.  They're currently set to subdirectories of our home directory.  If we create named environments with these setting we will very quickly fill up our limited home directory space.  The solution to this is to create or modify our personal conda config file to change these settings.  You can see the setting above for `user config file` tells us the location of the file where we can make changes to these defaults.  If the file doesn't exist you'll need to create it.  You may also need to change the config file location if your output from `conda info` differs from the above.
```bash
$ nano /home/NetID/.condarc
```
Now add the following lines to your config file:
```bash
envs_dirs:
  - /scratch/NetID/conda_envs
pkgs_dirs:
  - /scratch/NetID/conda_pkgs
always_copy: true
```
You'll need to create those directories if they don't exist:
```bash
$ mkdir /scratch/NetID/conda_envs
$ mkdir /scratch/NetID/conda_pkgs
```
Don't forget to change `NetID` above to your `NetID`.

You should now see that the `package cache` and `envs directories` entries have changed to your `/scratch` space when you run `conda info` and packages and environments will be saved on your `/scratch` space for all named conda environments.

## Reproducibility
### Packages installed only using conda

Save a list of packages (so you are able to report the environment in a publication, and to restore/reproduce the environment on another machine at any time)

```bash
# save
conda list --export > requirements.txt
# restore
conda create -p ./penv --file requirements.txt
```
:::note
This will not list packages installed by `pip` or `install.packages()`
:::


### Packages installed using conda and `pip` (Python)

In this case you can use:
```bash
export PYTHONNOUSERSITE=True  ## to ignore packages in ~/.local/lib/python<version>
# save
conda list --export > conda_requirements.txt
pip freeze > pip_requirements.txt
# restore
conda create -p ./penv --file conda_requirements.txt
pip install -r pip_requirements.txt
```


::::tip
Alternatively, you can use `conda env export > all_requirements.txt`, which will save both: packages installed by conda and `pip`.
:::warning
However, this may fail if your conda environment is created as a sub-directory of your project's directory (which we recommend)
:::
::::

### Packages installed using `install.packages` (R)

The command `conda list --export` will not include packages installed by `install.packages`. So, only use `conda install` to install R and use `renv` to maintain information about packages installed by `install.packages`.

#### `renv`

Please see details of using `renv` with conda for reproducibilty on [R packages with `renv`](./03_r_packages_with_renv.md).

## Use conda env in a batch script
The part of the batch script that will call the command should look like:
### Python

#### Single node
```bash
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=1
#SBATCH --cpus-per-task=1
#SBATCH --ntasks-per-node=4
#SBATCH --mem=8GB
#SBATCH --time=1:00:00
module purge;
module load anaconda3/2024.02;
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK;
source /share/apps/anaconda3/2020.07/etc/profile.d/conda.sh;
export PATH_TO_ENV=<full path to penv>
source activate $PATH_TO_ENV;
export PATH=$PATH_TO_ENV/bin:$PATH;
python test.py

```
You'll need to replace `<full path to penv>` with the full path to your penv directory.  It's probably something like `/scratch/NetID/conda_tests/penv`

#### Multiple nodes, using MPI
```sh
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=1
#SBATCH --cpus-per-task=1
#SBATCH --ntasks-per-node=4
#SBATCH --mem=8GB
#SBATCH --time=1:00:00
export PATH_TO_ENV="<full path to penv>"
module purge;
module load openmpi/gcc/4.1.6;
mpiexec bash -c "module purge;
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK;
module load anaconda3/2024.02;
source /share/apps/anaconda3/2024.02/etc/profile.d/conda.sh;
source activate "$PATH_TO_ENV";
export PATH="$PATH_TO_ENV/bin:$PATH";
python test.py"
```
Again, you'll need to replace `<full path to penv>` above with the full path to your penv directory.

### R (conda packages only)
```bash
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=1
#SBATCH --cpus-per-task=1
#SBATCH --ntasks-per-node=4
#SBATCH --mem=8GB
#SBATCH --time=1:00:00
module purge;
module load anaconda3/2024.02;
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK;
source /share/apps/anaconda3/2024.02/etc/profile.d/conda.sh;
export PATH_TO_ENV=<full path to renv>;
source activate $PATH_TO_ENV;
export PATH=$PATH_TO_ENV/bin:$PATH;
Rscript r_script.R
```
You'll again need to replace `<full path to renv>` above with the full path to your renv directory.

#### Multiple nodes, using MPI
```sh
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=2
#SBATCH --cpus-per-task=2
#SBATCH --ntasks-per-node=4
#SBATCH --mem=8GB
#SBATCH --time=1:00:00
module purge;
module load anaconda3/2024.02;
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK;
source /share/apps/anaconda3/2024.02/etc/profile.d/conda.sh;
export PATH_TO_ENV="<full path to renv>";
source activate $PATH_TO_ENV;
export PATH=$PATH_TO_ENV/bin:$PATH;
Rscript test.R
```
You'll again need to replace `<full path to renv>` above with the full path to your renv directory.

### R (conda with renv combination)

In this case, when you use sbatch you would activate conda in sbatch script, and R script will pickup packages installed in renv
```sh
#!/bin/bash
#SBATCH --job-name=test
#SBATCH --nodes=2
#SBATCH --cpus-per-task=2
#SBATCH --ntasks-per-node=4
#SBATCH --mem=8GB
#SBATCH --time=1:00:00module purge
module load anaconda3/2024.02
source /share/apps/anaconda3/2024.02/etc/profile.d/conda.sh
source activate <full path to renv>
Rscript test.R
```
You'll again need to replace `<full path to renv>` above with the full path to your renv directory.
