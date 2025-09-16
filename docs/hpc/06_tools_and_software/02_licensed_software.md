# Licensed Software

## SCHRODINGER
Schrödinger provides a complete suite of software solutions with the latest advances in pharmaceutical research and computational chemistry. The NYU New York campus has a limited number of licenses for the Biologics Suite (ConfGen, Epik, Jaguar, Jaguar pKa, MacroModel, Prime, QSite, SiteMap), BioLuminate and the Basic Docking Suite.

:::note
Schrödinger can be used for non-commercial, academic purposes ONLY.
:::

### Using SCHRODINGER on HPC Cluster

To load Schrodinger module execute
```sh
$ module load schrodinger/2024.4
```
### Using SCHRODINGER on NYU Lab Computers

1.  Request your account at: [https://www.schrodinger.com/request-account](https://www.schrodinger.com/request-account)
2.  Download the software at: [https://www.schrodinger.com/downloads/releases](https://www.schrodinger.com/downloads/releases)
3.  [Contact NYU-HPC team](mailto:hpc@nyu.edu)  to request your license file.

These license servers are accessible from NYU subnet.

Please see the following links for installation of the license file:
-   [https://www.schrodinger.com/kb/377238](https://www.schrodinger.com/kb/377238)
-   [https://www.schrodinger.com/license-installation-instructions](https://www.schrodinger.com/license-installation-instructions)

To check licenses status
```sh
# module load schrodinger/2021-1 # load schrodinger if not already loaded
# licadmin STAT 
# licutil -jobs

## For example:

[wang@cs001 ~]$ licutil -jobs
######## Server /share/apps/schrodinger/schrodinger.lic
Product & job type                            Jobs
BIOLUMINATE                                     10
BIOLUMINATE, Docking                             1
BIOLUMINATE, Shared                             10
CANVAS                                          50
COMBIGLIDE, Grid Generation                     11
COMBIGLIDE, Library Generation                  50
COMBIGLIDE, Protein Prep                        11
COMBIGLIDE, Reagent Prep                         1
EPIK                                            11
GLIDE, Grid Generation                          11
GLIDE, Protein Prep                             11
GLIDE, SP Docking                                1
GLIDE, XP Descriptors                            1
GLIDE, XP Docking                                1
IMPACT                                          11
JAGUAR                                           5
JAGUAR, PKA                                      5
KNIME                                           50
LIGPREP, Desalter                                1
LIGPREP, Ionizer                              3511
LIGPREP, Ligparse                                1
LIGPREP, Neutralizer                             1
LIGPREP, Premin Bmin                             1
LIGPREP, Ring Conf                               1
LIGPREP, Stereoizer                              1
LIGPREP, Tautomerizer                            1
MACROMODEL                                       5
MACROMODEL, Autoref                              5
MACROMODEL, Confgen                              5
MACROMODEL, Csearch Mbae                         5
MAESTRO, Unix                                 1000
MMLIBS                                        3511
PHASE, CL Phasedb Confsites                      1
PHASE, CL Phasedb Convert                        1
PHASE, CL Phasedb Manage                         1
PHASE, DPM Ligprep Clean Structures              1
PHASE, DPM Ligprep Generate Conformers           5
PHASE, MD Create sites                           1
PRIME, CM Build Membrane                         2
PRIME, CM Build Structure                        2
PRIME, CM Edit Alignment                         2
PRIME, CM Struct Align                          18
PRIME, Threading Search                          2
QSITE                                            5
SITEMAP                                         10
```

### Schrodinger Example Files
Example SBATCH jobs and outputs are available to review here: 
```sh
/scratch/work/public/examples/schrodinger/
```

## COMSOL
COMSOL is a problem-solving simulation environment, enforcing compatibility guarantees consistent multiphysics models. COMSOL Multiphysics is a general-purpose software platform, based on advanced numerical methods, for modeling and simulating physics-based problems. The package is cross-platform (Windows, Mac, Linux). The COMSOL Desktop helps you organize your simulation by presenting a clear overview of your model at any point. It uses functional form, structure, and aesthetics as the means to achieve simplicity for modeling complex realities.

:::note
This license is for academic use only with Floating Network Licensing in nature i.e., authorized users are allowed to use the software on desktops. Please contact [hpc@nyu.edu](mailto:hpc.nyu.edu) for the license. However, COMSOL is also available on NYU HPC cluster Greene.
:::

In order to check what Comsol licenses are available on Greene use `comsol_licenses` command in your terminal session.

Several versions of COMSOL are available on the HPC cluster. To use COMSOL on the Greene HPC cluster, please 
load the relevant module in your batch job submission script:
```sh
module load comsol/6.3
```
To submit a COMSOL job in a parallel fashion, running on multiple processing cores, follow the steps below:
1.  Create a directory on "scratch" as given below.
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example
```
2.  Copy example files to your newly created directory
```sh
cp /scratch/work/public/examples/comsol/run-comsol.sbatch /scratch/<net_id>/example/
cp /scratch/work/public/examples/comsol/test-input.mph /scratch/<net_id>/example/
```
3.  Edit the slurm batch script file (run-comsol.sbatch) to match your case (for example chance location of the run directory).
4.  Once the slurm batch script file is ready, it can be submitted to the job scheduler using sbatch. After successful completion of job, verify output log file for detail output information.
```sh
sbatch run-comsol.sbatch
```

## MATHEMATICA
Mathematica is a general computing environment with organizing algorithmic, visualization, and user interface capabilities. The many mathematical algorithms included in Mathematica make computation easy and fast.

To run Mathematica on the Greene HPC cluster, please load the relevant module in your batch job submission script:
```sh
module load mathematica/14.1.0
```
:::note
In the example below the module is loaded already in the sbatch script.
:::

To submit a batch Mathematica job for running in a parallel mode on multiple processing cores, follow below steps:
1.  Create a directory on "scratch" as given below.
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example
```
2.  Copy example files to your newly created directory.
```sh
cp /scratch/work/public/examples/mathematica/basic/example.m /scratch/<net_id>/example/
cp /scratch/work/public/examples/mathematica/basic/run-mathematica.sbatch /scratch/<net_id>/example
```
3.  Edit the slurm batch script file (run-mathematica.sbatch) to match your case (for example chance location of the run directory).
4.  Once the sbatch script file is ready, it can be submitted to the job scheduler using sbatch. After successful completion of job, verify output log file generated.
```sh
sbatch run-mathematica.sbatch
```

## SAS
SAS is a software package which enables programmers to perform many tasks, including:
-   Information retrieval
-   Data management
-   Report writing & graphics
-   Statistical analysis and data mining
-   Business planning
-   Forecasting and decision support
-   Operations research and project management
-   Quality improvement
-   Applications development
-   Data warehousing (extract, transform, load)
-   Platform independent and remote computing.

There are licenses for 2 CPUs on the HPC Cluster.

### Running a parallel SAS job on HPC cluster (Greene):

To submit a SAS job for running on multiple processing elements, follow below steps:

1.  Create a directory on "scratch":
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example
```
2.  Copy example files to your newly created directory.
```sh
cp /scratch/work/public/examples/sas/test.sas  /scratch/<net_id>/example/
cp /scratch/work/public/examples/sas/test2.sas  /scratch/<net_id>/example/
cp /scratch/work/public/examples/sas/run-sas.sbatch  /scratch/<net_id>/example/
```
3.  Submit as shown below. After successful completion of job, verify output log file generated.
```sh
sbatch run-sas.sbatch
```

## MATLAB
[MATLAB](https://www.mathworks.com/products/matlab.html) is a technical computing environment for high performance numeric computation and visualization. MATLAB integrates numerical analysis, matrix computation, signal processing, and graphics in an easy to use environment without using traditional programming.

### MATLAB on personal computers and laptops

NYU has a Total Academic Headcount (TAH) license which provides campus-wide access to MATLAB, Simulink, and a variety of add-on products. All faculty, researchers, and students (on any NYU campus) can use MATLAB on their personal computers and laptops and may go to the following site to download the NYU site license software free of charge.

[https://www.mathworks.com/academia/tah-portal/new-york-university-618777.html](https://www.mathworks.com/academia/tah-portal/new-york-university-618777.html)

MATLAB can be used for non-commercial, academic purposes.

There are several versions of Matlab available on the cluster and the relevant version can be loaded.
```sh
module load matlab/2024b
```
In order to run MATLAB interactively on the cluster, [start an interactive slurm job](../05_submitting_jobs/01_slurm_submitting_jobs.md), load the matlab module and launch an interactive matlab session in the terminal. 

Mathworks has provided a [Greene Matlab User Guide](https://drive.google.com/file/d/1lNNzf4lsFuH9a4bbsO18roCGhT3DwUq2/view) that presents useful tips and practices for using Matlab on the cluster.

## STATA
Stata is a command and menu-driven software package for statistical analysis. It is available for Windows, Mac, and Linux operating systems. Most of its users work in research. Stata's capabilities include data management, statistical analysis, graphics, simulations, regression and custom programming. 

### Running a parallel STATA job on HPC cluster (Greene):

To submit a STATA job for running on multiple processing elements, follow below steps.

1.  Create a directory on "scratch":
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example
```
2.  Copy example files to your newly created directory.
```sh
cp /scratch/work/public/examples/stata/run-stata.sbatch  /scratch/<net_id>/example/
cp /scratch/work/public/examples/stata/stata-test.do  /scratch/<net_id>/example/
```
3.  Submit using sbatch. After successful completion of job, verify output log file generated.
```sh
sbatch run-stata.sbatch
```

## GAUSSIAN
Gaussian uses basic quantum mechanic electronic structure programs. This software is capable of handling proteins and large molecules using semi-empirical, ab initio molecular orbital (MO), density functional, and molecular mechanics calculations.

The NYU Gaussian license only covers PIs at the Washington Square Park campus. We will grant access to you after verifying your WSP affiliation. For access, please email [hpc@nyu.edu](mailto:hpc.nyu.edu).

### Running a parallel Gaussian job on HPC cluster (Greene):

To submit a Gaussian job for running on multiple processing elements, follow below steps.

1.  Create a directory on "scratch":
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example   #Copy example files to your newly created directory.
cp /scratch/work/public/examples/gaussian/basic/test435.com  /scratch/<net_id>/example/
cp /scratch/work/public/examples/gaussian/basic/run-gaussian.sbatch  /scratch/<net_id>/example/
```
2.  Once the sbatch script file is ready, it can be submitted to the job scheduler using sbatch. After successful completion of job, verify output log file generated.
```sh
sbatch run-gaussian.sbatch
```

## Knitro
Knitro is a commercial software package for solving large scale mathematical optimization problems. Knitro is specialized for nonlinear optimization, but also solves linear programming problems, quadratic programming problems, systems of nonlinear equations, and problems with equilibrium constraints. The unknowns in these problems must be continuous variables in continuous functions; however, functions can be convex or nonconvex. Knitro computes a numerical solution to the problem—it does not find a symbolic mathematical solution. Knitro versions 9.0.1 and 10.1.1 are available.

### Running a parallel Knitro job on HPC cluster (Greene):

To submit a Knitro job for running on multiple processing elements, follow below steps.

1.  Create a directory on "scratch":
```sh
mkdir /scratch/<net_id>/example
cd /scratch/<net_id>/example
```
2.  Copy example files to your newly created directory.
```sh
cp /scratch/work/public/examples/knitro/knitro.py /scratch/<net_id>/example/
```
3.  There is no sample sbatch script available for knitro.
4.  After creating your own sbatch script you can execute it as follows:
```sh
sbatch <script>.sbatch
```
