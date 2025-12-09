# Large Number of Small Files

## Motivation
Many datasets contain a large number of files (for example [ImageNet](https://en.wikipedia.org/wiki/ImageNet) contains 14 million images, with ~150 GB size). How to deal with this data? How to store it? How to use for computations? Long-term storage of data is not an issue - an archive like tar.gz can handle this pretty well. However, when you want to use data in computations, the performance may depend on how you handle the data on disk. 

Here are some ideas you can try and evaluate performance for your own project

## Squash file system with Singularity
Please see [Squash File System and Singularity](../07_containers/04_squash_file_system_and_singularity.md)

## Use jpg/png files on disk
One option is to store image files (like png or jpg) on the disk and read from disk directly.

:::warning
An issue with this approach, is that many linux file system can hold only a limited number of files.
:::

```sh
# One can open torch cluster and run the following command
$ df -ih /scratch/
Filesystem                               Inodes IUsed IFree IUse% Mounted on
10.0.0.40@o2ib:10.0.0.41@o2ib:/scratch1   1.6G  209M  1.4G   14% /scratch
```
This shows us that the total number of files '/scratch' can hold  (currently) is about 1.6 G. This looks like a large number. But let us translate this into number of datasets like ImageNet (14 mil images) -> 100 datasets like that would almost fully occupy Total possible slots for files! This is a problem!

And even if you can ignore this on your own PC, on HPC, there is a limit of files each user can put on /scratch to prevent such problems.

This is the reason why you can't just extract all those files in `/scratch`

## SLURM_TMPDIR
Another option would be to start a SLURM job and extract everything into `$SLURM_TMPDIR`. This can work, but would require you to un-tar every time you run a SLURM command.

## SLURM_RAM_TMPDIR
You can also use the custom-made RAM mapped disk using `#SLURM_RAM_TMPDIR` while submitting the job. In this case when you start a job you first un-tar your files to `$SLURM_RAM_TMPDIR` and then read from there.
:::warning
This basically requires you to use 2*(size of the data) size of RAM just to hold the data.
:::

## Binary files (pickle, etc)
Store data in some binary file (say pickle in Python) which you load fully when you start a SLURM job.

This option may require a lot of RAM - thus you may have to wait a long time for the scheduler to find resources for your job. Also this approach would not work on a regular PC without so much RAM, and thus your scripts are not transferable.

## Container files, one-file databases
Special containers, which allow to either load data fast fully or access chosen elements without loading the whole dataset into RAM.

### SQLite
If you have structured data, a good option would be to use SQLite.  Please see [SQLite: Handling Large Structured Data](../06_tools_and_software/07_sqlite_handling_large_structured_data.md) for more information.

### HDF5
One can think about HDF5 file as a "container file" (database of a sort), which holds a lot of objects inside.

HDF5 files do not have a file size limitation, and can hold huge number of objects inside, providing fast read/write access to those objects.

It is easy to learn how to subset data and load to RAM only to those data objects that you need.

More info:
-   [Developers website](https://www.hdfgroup.org/)
-   [hdf5 in Python](https://www.h5py.org/)
    -   [book](https://www.oreilly.com/library/view/python-and-hdf5/9781491944981/)
-   [hdf5 in R](https://www.bioconductor.org/packages/release/bioc/vignettes/rhdf5/inst/doc/rhdf5.html)

:::tip
You can get the Python book for free with your NYU email address.  Go to 'log in' at the top right of the page and select to log in using your Google credentials.  Use your NYU email address.
:::

hdf5 supports reading and writing in parallel, so you can use several nodes reading from the same file.

More info: [Documentation](https://support.hdfgroup.org/documentation/index.html), [Tutorial](https://github.com/HDFGroup/hdf5-tutorial), [Help Desk](https://hdfgroup.atlassian.net/servicedesk/customer/portal/6/user/login?destination=portal%2F6)

### LMDB
LMDB (Lightning Memory-Mapped Database) is a light-weight, high-speed embedded database for key-value data.

Essentially, this is a large file sitting on the disk that contains a lot of smaller objects inside.

This is a memory-mapped database meaning, file can be larger than RAM. OS is responsible for managing the pages (like caching frequently uses pages).

For practical use it means: say you have 10 GB of RAM, and LMDB file of 100 GB. When you connect to this file, OS may decide to load 5GB to RAM, and the rest 95GB will be attached as virtual memory. Torch does not have a limit for virtual memory. Of course, if your RAM is larger than LMDB file, this database will perform the best, as OS will have enough resources to keep what is needed directly in RAM.

:::tip
when you write key-value pairs to LMDB they have to be byte-encoded. For example, if you use Python you can use: for string `st.encode()`, for np.array use `ar.tobytes()`, or in general `pickle.dumps()`
:::

:::warning
LMDB uses [B Tree](https://en.wikipedia.org/wiki/B-tree), which has O(log n) complexity for search.
Thus, when number of elements in LMDB becomes really big, search of specific element slows down considerably
:::

More info:
-   [Developer website](https://www.symas.com/mdb)
-   [Python package for lmd](https://lmdb.readthedocs.io/en/release/)
-   [R package for lmdb](https://github.com/richfitz/thor)
-   Deep Learning
    -   [Tensorflow with LMDB example](https://stackoverflow.com/questions/37337523/how-do-you-load-an-lmdb-file-into-tensorflow)
    -   [Pytorch with LMDB example](https://discuss.pytorch.org/t/whats-the-best-way-to-load-large-data/2977/2)

LMDB supports reading by many readers and many parallel thread from the same file

#### Formats inside HDF5/LMDB: binary, numpy, other..
One can store data in different way inside LMDB or HDF5. For example we can store binary representation of jpeg, or we can store python numpy array. In the first case file can be read from any language, in the second - only from Python. We can also store objects from other languages - for example tibble in R

#### Other formats
There are other formats like [Bcolz](http://bcolz.blosc.org/), [Zarr](https://github.com/alimanfoo/zarr-python), and others. Some examples can be found [here](https://alimanfoo.github.io/2016/04/14/to-hdf5-and-beyond.html).

## Benchmarking Code
-   A benchmarking of various ways of reading data was performed on now retired Prince HPC cluster. You can find the code used to perform that benchmarking and the results [at this repository](https://github.com/nyuhpc/public_ml/tree/master/Data_read_benchmarking).
-   For those of you interested in using multiple cores for data reading, [this code example below may be useful](https://github.com/nyuhpc/public_ml/blob/master/Data_read_benchmarking/TextImages/read_benchmarks/read_parallel.py).
    -   Multiple cores on the same node are used. Parallelization is based on `joblib` Python module
