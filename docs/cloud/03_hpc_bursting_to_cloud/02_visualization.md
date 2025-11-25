# Visualization Workstations

[vnc-clients]: https://help.ubuntu.com/community/VNC/Clients

The burst cluster includes a partition (`nvgrid`) that can be used to run graphical applications on NVIDIA GPUs for visualization purposes.  You can use this partition by following the instructions below.


Add the following to your SSH config file (~/.ssh/config) on your local workstation so that you can log into the burst login node directly:
```sh
Host burst
  HostName burst.hpc.nyu.edu
  User <NetID>
  ProxyJump <NetID>@torch.hpc.nyu.edu
  ProxyJump <NetID>@burst.hpc.nyu.edu
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  LogLevel ERROR
```

Log into the burst login node by running `ssh <NetID>@burst` while on-campus or connected to the VPN.  Run the following command on the login node to request an interactive command line session:
```sh
srun --account=hpc --partition=nvgrid --gres=gpu:p100:1 --pty /bin/bash
```

When your interaction session is active, run the following command to start the VNC (remote desktop) server.  If this is the first time you’ve used a visualization node, you will be prompted to set a password to use when you access your remote session:
```sh
/opt/TurboVNC/bin/vncserver
```

Note the hostname of the node that you are running on.  This hostname is displayed in the NODELIST column of the output from the squeue command:
```
[NetID@b-23-1 ~]$ squeue
             JOBID PARTITION     NAME     USER ST       TIME  NODES NODELIST(REASON)
…
             92727    nvgrid     bash  jp6546  R       2:55      1 b-23-1
```

In another terminal on your local machine, run the following command:
```
ssh -N -L 5901:<Hostname>:5901 <NetID>@burst
```
This command will ensure that you can connect to the remote desktop service from your local computer.


If you do not already have a VNC remote desktop client installed on your computer, you will need to install one.  A list of VNC clients available for various platforms can be found [here][vnc-clients].  Note that Mac OS X comes with a built-in VNC client, which is accessible from the Finder by navigating to Go → Connect to Server and then typing vnc:// at the beginning of the server field.

Within your VNC client, connect to `localhost:5901` (`vnc://localhost:5901` on Mac OS).

You should now be presented with a desktop environment. If you are using any OpenGL-based applications that are started from a terminal, be sure to type vglrun before the command name in order to ensure that the application uses the GPU.

After your first time using the `nvgrid` partition, you can start the remote desktop server non-interactively using the following batch script (although you will need to remember the password that you set in step 3).  Note that the sleep command should have the length of time that you want the server to run (in seconds) after it (3600 seconds for 1 hour in the example below).
```sh
#!/bin/bash

#SBATCH --gres=gpu:p100:1
#SBATCH --partition=nvgridk
#SBATCH --account=hpc
#SBATCH --job-name=vnc
#SBATCH --time=1:00
#SBATCH --output=slurm_%j.out

/opt/TurboVNC/bin/vncserver

sleep 3600
```
