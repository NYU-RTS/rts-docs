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

