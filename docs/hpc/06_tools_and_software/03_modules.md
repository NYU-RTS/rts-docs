# Modules

Lmod, an Environment Module system, is a tool for managing multiple versions and configurations of software packages and is used by many HPC centers around the world. With Environment Modules, software packages are installed away from the base system directories, and for each package, an associated modulefile describes what must be altered in a user's shell environment - such as the $PATH environment variable - in order to use the software package. The modulefile also describes dependencies and conflicts between this software package and other packages and versions.

To use a given software package, you load the corresponding module. Unloading the module afterwards cleanly undoes the changes that loading the module made to your environment, thus freeing you to use other software packages that might have conflicted with the first one.

Below is a list of modules and their associated functions:

| Command                           | Function                                                              |
|-----------------------------------|-----------------------------------------------------------------------|
| module unload `<module-name>`     | unload a module                                                       |
| module show `<module-name>`       | see exactly what effect loading the module will have                  |
| module purge                      | remove all loaded modules from your environment                       |
| module load `<module-name>`       | load a module                                                         |
| module whatis `<module-name>`     | find out more about a software package                                |
| module list                       | check which modules are currently loaded in your environment          |
| module avail                      | check what software packages are available                            |
| module help `<module-name>`         | A module file may include more detailed help for the software package |


## Bioinformatics modules
Common bioinformatics packages are made available via wrapper scripts that can be loaded as modules. Users can then invoke individual programs through that wrapper.
```bash
/share/apps/bioinformatics/20260224/run-bioinformatics.bash which samtools
/ext3/mamba/envs/bioinformatics/bin/samtools

/share/apps/bioinformatics/20260224/run-bioinformatics.bash which vcftools
/ext3/mamba/envs/bioinformatics/bin/vcftools
```

Alternatively, load the module to get these tools on your `$PATH`. This approach keeps the user experience consistent while allowing us to manage the underlying environments through containers.

You can list the packages available within each bioinformatics stack by running:
```bash
/share/apps/bioinformatics/20260224/bin/run-bioinformatics micromamba list
```
It will print a list of packages within that `micromamba` environment.
