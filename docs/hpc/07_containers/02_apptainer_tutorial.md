# Getting Started with Apptainer on Torch

This tutorial walks you through running your first container on the Torch HPC cluster using Apptainer. By the end of this guide, you will be able to pull a container image, run it, and execute commands inside a containerized environment.

For background on what Apptainer is and why we use it on Torch, see [Custom Applications with Containers](../containers/).

## Step 1: Pull a Container Image

Make sure you are on a compute node before proceeding, as running containers on login nodes is not recommended.

Pulling an image downloads it from Docker Hub and converts it into an Apptainer `.sif` file that can be run on the cluster.

```sh
apptainer pull docker://python:3.10
```

This may take a few minutes. You should see progress output like:

```
INFO:    Converting OCI blobs to SIF format
INFO:    Creating SIF file...
[=====================================================================] 100 % 0s
```

Once complete, you will find a file called `python_3.10.sif` in your current directory:

```sh
ls *.sif
```

```
python_3.10.sif
```

## Step 2: Run the Container
:::info
Apptainer images are immutable by default. You can mount an writable overlay file and edit files within the overlay.
:::

Every container image has a default command defined by its creator. You can run it with:

```sh
apptainer run python_3.10.sif
```

For the Python image, this drops you into a Python interactive shell:

```
Python 3.10.x (main, ...) [GCC ...] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Type `exit()` to leave the Python shell.

## Step 3: Execute Commands Inside the Container

Instead of entering the container interactively, you can run a one-off command using `exec`. This is useful for scripting and batch jobs.

```sh
apptainer exec python_3.10.sif python -c "print('Hello from container')"
```

You should see:

```
Hello from container
```

The command ran inside the containerized environment, then returned control to your shell.

### Using `fakeroot`

In some cases, you may need elevated permissions inside the container to install software or modify system files. Apptainer provides a `--fakeroot` option that allows you to run commands inside the container with root-like privileges, without requiring actual root access on the system.

```sh
$ apptainer exec --fakeroot <image name>.sif <commands>
```

## Step 4: Run a Simple Scientific Example

Containers are commonly used in research workflows to run code in a reproducible environment. For example, you can run a NumPy computation without installing NumPy locally:

```sh
apptainer exec python_3.10.sif python -c "print(list(range(5)))"
```

Expected output:

```
[0, 1, 2, 3, 4]
```

This confirms that the container's Python environment is working correctly.

## Step 5: Explore the Container Environment

To explore the container interactively, open a shell inside it:

```sh
apptainer shell python_3.10.sif
```

Your prompt will change to indicate you are now inside the container:

```
Apptainer>
```

From here you can run commands as you normally would. For example:

```sh
python --version
```

```sh
which python
```

When you are done, exit the container shell:

```sh
exit
```

Your prompt will return to the normal Torch shell.

## Understanding `exec` vs `shell`
 
**`exec`** runs a single command you specify inside the container, then exits immediately. You never "enter" the container — control returns to your shell as soon as the command finishes. This makes it ideal for scripts and batch jobs.
 
**`shell`** gives you an interactive bash shell inside the container, so you can explore the environment, run multiple commands, and inspect files. Think of it as "stepping inside" the container.
 
