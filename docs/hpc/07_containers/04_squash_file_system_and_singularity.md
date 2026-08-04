# Squash File System and Singularity

:::note
View available datasets on the [Datasets page](../04_datasets/01_intro.md).
:::

## Working with Datasets
Writable ext3 overlay images have conda environments installed inside, Singularity can work with squashFS for fixed datasets, such as the coco datasets.  Here's an example using the `my_pytorch.ext3` we created in the last tutorial [Singularity with Conda](03_singularity_with_conda.md):

```sh
[NetID@log-1 ~]$ singularity exec \
--overlay /scratch/<NetID>/pytorch-example/pytorch1.8.0-cuda11.1.ext3:ro \
--overlay /scratch/work/public/ml-datasets/coco/coco-2014.sqf:ro \
--overlay /scratch/work/public/ml-datasets/coco/coco-2015.sqf:ro \
--overlay /scratch/work/public/ml-datasets/coco/coco-2017.sqf:ro \
/scratch/work/public/singularity/cuda11.1-cudnn8-devel-ubuntu18.04.sif /bin/bash
```

If you have many tiny files as fixed datasets, please make squashFS files to work with Singularity. Here is an example:

1.  Make a temporary folder in /state/partition1, it is a folder in local hard drive on each computer node
```sh
[NetID@log-3 NetID]$ srun --pty /bin/bash
srun: job 62890341 queued and waiting for resources
srun: job 62890341 has been allocated resources
[NetID@cm002 NetID]$ mkdir -p /state/partition1/<NetID>
[NetID@cm002 NetID]$ cd /state/partition1/<NetID>
```

2.  Unzip files there, for example
```sh
[NetID@cm002 NetID]$ tar -vxzf /projects/work/public/examples/squashfs/imagenet-example.tar.gz
```

3.  Change access permissions in case we'll share files with others
```sh
[NetID@cm002 NetID]$ find imagenet-example -type d -exec chmod 755 {} \;
[NetID@cm002 NetID]$ find imagenet-example -type f -exec chmod 644 {} \;
```

4.  Convert to a single squashFS file on host
```sh
[NetID@cm002 NetID]$ mksquashfs imagenet-example imagenet-example.sqf  -keep-as-directory
```
For more details on working with squashFS, please see [details from SquashFS documentation](http://www.iitk.ac.in/LDP/HOWTO/SquashFS-HOWTO/mksqoverview.html). 

5.  Copy this file to /scratch
```sh
[NetID@cm002 NetID]$ cp -rp /state/partition1/<NetID>/imagenet-example.sqf /scratch/<NetID>/.
```

6.  To test, files are in `/imagenet-example` inside Singularity container: 
```bash
[NetID@cm002 NetID]$ singularity exec --overlay /scratch/<NetID>/imagenet-example.sqf:ro /scratch/work/public/singularity/ubuntu-20.04.1.sif /bin/bash
Singularity> find /imagenet-example | wc -l
1303
Singularity> find /state/partition1/<NetID>/imagenet-example | wc -l
1303
```

7.  To delete the tempoary folder on host
```sh
[NetID@cm002 NetID]$ rm -rf /state/partition1/<NetID>
```
