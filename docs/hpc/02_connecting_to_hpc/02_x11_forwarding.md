# X11 Forwarding

[xquartz]: https://www.xquartz.org/

In rare cases when you need to interact with GUI applications on HPC clusters, you need to enable X11 forwarding for your SSH connection. Mac and Linux users will need to run the ssh commands described above with an additional flag:

```sh
ssh -Y <NYU_NetID>@greene.hpc.nyu.edu
```

However, Mac users need to install [XQuartz][xquartz], since X-server is no longer shipped with the macOS.

Windows users will also need to install X server software. We recommend using MobaXTerm. Further instructions are provided in the [introductory HPC tutorial](../12_tutorial_intro_shell_hpc/02_connecting_to_hpc.mdx).

