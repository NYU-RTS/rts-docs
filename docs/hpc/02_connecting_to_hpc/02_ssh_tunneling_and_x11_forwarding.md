# SSH Tunneling and X11 Forwarding

[xquartz]: https://www.xquartz.org/

## SSH Tunneling (Mac, Linux)

Setting up your workstation for SSH tunneling will make logging in and transferring files significantly easier, and installing and running an X server will allow you to use graphical software on the HPC clusters. X server is a software package that draws on your local screen windows created on a remote computer such as on the remote HPC.

Linux users have X set up already. Mac users can download and install [XQuartz][xquartz].

### Set up a reusable tunnel 

To avoid repeatedly setting up a tunnel, you can write the details of the tunnel into your SSH configuration file. Using your favorite editor, open the file `~/.ssh/config` and place the following lines in it: 

```sh
Host greene
  HostName localhost
  Port 8027
  ForwardX11 yes
  StrictHostKeyChecking no
  UserKnownHostsFile /dev/null
  LogLevel ERROR
  User <Your NetID>
```

Create this  file/directory  In case you don't have it. Make sure that ".ssh" directory has correct permissions (it should be "700" or "drwx------"). If needed, set permissions with:

```sh
chmod 700 ~/.ssh
```

You may also need to setup permissions on your local computer:

```sh
chmod 700 $HOME
chmod 700 $HOME/.ssh
## to be safe, all files inside ~/.ssh should be set 600
chmod 600 ~/.ssh/*
```

## X11 Forwarding

In rare cases when you need to interact with GUI applications on HPC clusters, you need to enable X11 forwarding for your SSH connection. Mac and Linux users will need to run the ssh commands described above with an additional flag:

```sh
ssh -Y <NYU_NetID>@greene.hpc.nyu.edu
```

However, Mac users need to install [XQuartz][xquartz], since X-server is no longer shipped with the macOS.

Windows users will also need to install X server software. We recommend two options out there. We recommend installing Xming. Start Xming application and configure PuTTY to support X11 forwarding:



