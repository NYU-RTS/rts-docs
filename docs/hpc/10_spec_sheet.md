
# Torch Spec Sheet

The Torch cluster has 518 [Intel "Xeon Platinum 8592+ 64C"](https://www.intel.com/content/www/us/en/products/sku/237261/intel-xeon-platinum-8592-processor-320m-cache-1-90-ghz/specifications.html) CPUs, 29 NVIDIA [H200](https://nvdam.widen.net/s/nb5zzzsjdf/hpc-datasheet-sc23-h200-datasheet-3002446) GPUs & 68 NVIDIA [L40S](https://resources.nvidia.com/en-us-l40s/l40s-datasheet-28413) GPUs connected together via Infiniband NDR400 interconnect. Further details on each kind of node is provided in the table below.

| Type | Nodes  | CPU Cores  | GPUs  | Memory (GB) | CPUs per Node | GPUs per Node | Memory per Node (GB) |
|---|---|---|---|---|---|---|---|
| Standard Memory | 186 | 23,808 | N/A | 95,232 | 128 | N/A | 512 |
| Large memory | 7 | 896 | N/A | 21,504 | 128 | N/A | 3,072 |
| H200 GPU | 29 | 3,712 | 232 | 59,392 | 128 | 8 | 2,048 |
| L40S GPU | 68 | 8,704 | 272 | 34,816 | 128 | 4 | 512 |
| Login | 4 | 512 | N/A | 1024 | 128 | N/A | 256 |
| Data Transfer | 2 | 64 | N/A | 512 | 32 | N/A | 256 |
| Provisioning | 4 | 320 | N/A | 1024 | 80 | N/A | 256 |
| Scheduler | 2 | 64 | N/A | 1024 | 32 | N/A | 512 |
| Total | N/A | 38,080 | 504 | 209.5(TB) | NA | NA | NA |


Torch was tested in June 2025 using the [LINPACK benchmark system](https://top500.org/project/linpack/), which is the basis for all HPC systems ranked on the Top500 list. It had a theoretical maximum performance of 12.25 PF/s thanks to its powerful GPU resources, of which LINPACK was able to use 10.79 PF/s, thus placing it at [#133 on the listed](https://top500.org/system/180363/).

 Torch was recently ranked [#40 on the Green 500 list](https://top500.org/lists/green500/list/2025/06/), a global list of the most energy efficient supercomputers in the world thanks to its advanced liquid cooling system.
