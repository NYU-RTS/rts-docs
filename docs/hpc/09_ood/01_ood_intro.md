# Introduction to Open OnDemand (OOD)

## A Web-based Graphical User Interface

OOD is designed to create easier access for users to interface with HPC systems. It comes with a variety of convenient tools to manage files, access the command line, manage and monitor jobs, and launch interactive applications, such as Jupyter Notebooks, RStudio sessions, and even full Linux Desktops. Features Include:

-   Easy file management - upload and download files, view HTML and pictures without downloading
-   Command-line shell access without any SSH client locally installed
-   Job management and monitoring
-   Full Linux desktop experience without X11
-   Interactive Apps such as JupyterHub and RStudio without the need for port forwarding

It is accessible to all users with a valid NYU HPC account while on-campus network or through NYU VPN via https://ood.hpc.nyu.edu.

## Access the Shell

Under the **clusters** menu you can select the **Greene Shell Access** option to access the Linux shell. No local SSH client is required.

![img](./static/open_ondemand_gif.gif)

Please see our documentation on [Submitting Jobs](../05_submitting_jobs/01_slurm_submitting_jobs.md) if you'd like detailed instructions.

**Interactive Applications**

GUI based applications are accessible without the need for port or X11 forwarding. Select the Interactive Apps menu, select the desired application, and submit the job based on required resources and options.

![interactive-applications](./static/interactive-applications.png)

## Troubleshooting

### Connections to Open OnDemand

A common issue that can occur is receiving an error that the Open OnDemand page cannot be reached. Sometimes this can indicate that the service is down, but often this is an issue with the the local browser cache. You can test this by opening a private browser window and seeing if https://ood.hpc.nyu.edu will load. If it does, try deleting the cache for https://ood.hpc.nyu.edu in your browser history to resolve this issue.

In Chrome, this can be done by navigating to this page in your settings:


```bash
chrome://settings/content/all?searchSubpage=ood.hpc.nyu.edu&search
```

The link above will automatically search for the Open OnDemand site data and cookies. You can then simply click on the trashcan icon to delete the site cache.

![Remove browser cache image](./static/ood_remove_cache.png)

Once done, try navigating again to https://ood.hpc.nyu.edu and the site should load. For other issues please email hpc@nyu.edu.

### Viewing Logs

When problems arise one of the best ways to figure out what went wrong is to look in the logs.  You can do this in two ways for OOD: from within OOD itself or via the terminal.

#### From within OOD

You can view session logs for interactive apps from within OOD if they are still visible within `Home / My Interactive Sessions`.  

![OOD Matlab in queue](./static/ood_matlab_in_queue.png)

Just click on the `Session ID` link and a tab will open with the contents of the directory that contains your session logs.

![OOD session ID directory](./static/ood_session_dir.png)

`output.log` is probably the most informative for debugging.  Simply click on `output.log` and the contents will be displayed.

#### From terminal

If your session is no longer visible from within OOD you may still be able to find your logs via the terminal.  Simply [log into Greene](../02_connecting_to_hpc/01_connecting_to_hpc.md) and `cd` to `/home/$USER/ondemand/data/sys/dashboard/batch_connect/sys/` and then `cd` into the directory for the app that you're interested in.  You should find the file `output.log` there.
