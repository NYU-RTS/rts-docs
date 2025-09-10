# SSH Tunneling and X11 Forwarding

[xquartz]: https://www.xquartz.org/

## SSH Tunneling (Mac, Linux)

Setting up your workstation for SSH tunneling will make logging in and transferring files significantly easier, and installing and running an X server will allow you to use graphical software on the HPC clusters. X server is a software package that draws on your local screen windows created on a remote computer such as on the remote HPC.

Linux users have X set up already. Mac users can download and install [XQuartz][xquartz].

### Set up a reusable tunnel 

To avoid repeatedly setting up a tunnel, you can write the details of the tunnel into your SSH configuration file. Using your favorite editor, open the file `~/.ssh/config` and place the following lines in it: 

```sh
# first we create the tunnel, with instructions to pass incoming
# packets on ports 8027 and 8028 through it and to specific locations

Host hpcgwtunnel
  HostName gw.hpc.nyu.edu
  ForwardX11 no
  StrictHostKeyChecking no
  LocalForward 8027 greene.hpc.nyu.edu:22
  UserKnownHostsFile /dev/null 
  User <Your NetID>

# next we create an alias for incoming packets on the port
# The alias corresponds to where the tunnel forwards these packets

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

### Start the tunnel

To create the tunnel, ssh to it with the following command:
```sh
ssh hpcgwtunnel
```

:::tip

You must leave this window open for the tunnel to remain open. It is best to start a new terminal window for subsequent logins. 

:::

### Log in via the tunnel

Open a new terminal window and use ssh to log in to the cluster, as shown below.

```sh
ssh greene
```

Note that you must use the short name defined above in your .ssh/config file, not the fully qualified domain name:

**Creating a once-off tunnel.**

Alternatively, you can set up a once-off tunnel without editing .ssh/config by running the following command:

```sh
ssh -L 8027:greene:22 NetID@gw.hpc.nyu.edu # to set up a tunnel
ssh -Y -p 8027 NetID@localhost
```

This is the equivalent to running "ssh hpcgwtunnel" in the reusable tunnel instructions, but the port forwarding is specified on the command line.


## Tunneling (Windows)

### Creating the tunnel

1.  First open Putty and prepare to log in to gw.hpc.nyu.edu. If you saved your session during that process, you can load it by selecting from the "Saved Sessions" box and hitting "Load". Don't hit "Open" yet!

2.  Under "Connection" -> "SSH", just below "X11", select "Tunnels

3.  Write "8026" (the port number) in the "Source port" box, and "greene.hpc.nyu.edu:22" (the machine you wish to tunnel to - 22 is the port that ssh listens on) in the 	"Destination" box

4.  Click "Add". You can repeat step 3 with a different port number and a different destination. If you do this you will create multiple tunnels, one to each destination

5.  Before hitting "Open", go back to the "Sessions" page, give the session a name ("hpcgw_tunnel") and hit "Save". Then next time you need not do all this again, just load the saved session

6.  Hit "Open" to login in to gw.hpc.nyu.edu and create the tunnel. A terminal window will appear, asking for your login name (NYU NetID) and password (NYU password). 	Windows may also ask you to allow certain connections through its firewall - this is so you can ssh to port 8026 on your workstation - the entrance to the tunnel


:::note
You can add other NYU hosts to the tunnel by adding a new source port and destination and clicking "Add". For example, you could add "Source port = 8025" and "Destination = EXAMPLE.hpc.nyu.edu:22", then press "Add". You would then perform Step 2 (below) twice - once for greene on port 8026 and once for an example server on port 8025.
:::

Using your SSH tunnel: To log in via the tunnel, first the tunnel must be open. If you've just completed Step 1, it will be open and you can jump down to "Step 2: Logging in via your SSH tunnel". If you completed Step 1 yesterday, and now want to re-use the tunnel you created, first start the tunnel:

Starting the tunnel: During a session, you need only do this once - as long as the tunnel is open, new connections will go over it.

1.  Start Putty.exe (again, if necessary), and load the session you saved in settings during procedure above

2.  Hit "Open", and log in to the bastion host with your NYU NetID and password. This will create the tunnel. 

### Logging in via your SSH tunnel

1.  Start the second Putty.exe. In the "Host Name" box, write "localhost" and in the "Port" box, write "8026" (or whichever port number you specified when you set up the tunnel in the procedure above). We use "localhost" because the entrance of the tunnel is actually on this workstation, at port 8026

2.  Go to "Connections" -> "SSH" -> "X11" and check "Enable X11 forwarding"

3.  Optionally, give this session a name (in "Saved Sessions") and hit "Save" to save it. Then next time instead of steps 1 and 2 you can simply load this saved session

4.  Hit "Open". You will again get a terminal window asking for your login (NYU NetID) and password (NYU password). You are now logged in to the HPC cluster!

## X11 Forwarding

In rare cases when you need to interact with GUI applications on HPC clusters, you need to enable X11 forwarding for your SSH connection. Mac and Linux users will need to run the ssh commands described above with an additional flag:

```sh
ssh -Y <NYU_NetID>@greene.hpc.nyu.edu
```

However, Mac users need to install [XQuartz][xquartz], since X-server is no longer shipped with the macOS.

Windows users will also need to install X server software. We recommend two options out there. We recommend installing Xming. Start Xming application and configure PuTTY to support X11 forwarding:



