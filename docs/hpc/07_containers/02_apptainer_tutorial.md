# Getting Started with Apptainer on Torch

This tutorial walks you through running your first container on the Torch HPC cluster using Apptainer. By the end of this guide, you will be able to pull a container image, run it, and execute commands inside a containerized environment.

## Step 1: Pull a Container Image

Make sure you are on a compute node before proceeding, as running containers on login nodes is not recommended.

Pull a container image from Docker Hub:

```sh
apptainer pull docker://python:3.10
```

This command downloads a Docker image and converts it into an Apptainer image (`.sif`) that can be run on the cluster.

## Step 2: Run the Container

You can run the container using:

```sh
apptainer run python_3.10.sif
```

This executes the default command defined by the container image.

## Step 3: Execute Commands Inside the Container

To run specific commands inside the container, use:

```sh
apptainer exec python_3.10.sif python -c "print('Hello from container')"
```

This runs a Python command inside the containerized environment.

## Step 4: Run a Simple Scientific Example

Containers are commonly used in research workflows. For example, you can run a simple NumPy computation:

```sh
apptainer exec python_3.10.sif python -c "import numpy as np; print(np.arange(5))"
```

This demonstrates how containerized environments can be used to run scientific Python code without installing dependencies locally.

## Step 5: Explore the Container Environment

Start an interactive shell inside the container:

```sh
apptainer shell python_3.10.sif
```

Once inside, you can run commands as if you were in a separate environment:

```sh
python
```

To exit the container:

```sh
exit
```
