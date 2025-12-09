# Data management

HDFS stands for Hadoop Distributed File System. HDFS is a highly fault-tolerant file system and is designed to be deployed on low-cost hardware. HDFS provides high throughput access to application data and is suitable for analyses that use large datasets.

### File Permissions and Access Control Lists

You can share files with others using [access control lists (ACLs)](../../hpc/03_storage/08_sharing_data_on_hpc.md). An ACL gives you per-file, per-directory and per-user control over who has permission to access files. You can see the ACL for a file or directory with the getfacl command:
```sh
hdfs dfs -getfacl  /user/<net_id>_nyu_edu/testdir
```
To modify permissions for files or directories, use setfacl
```sh
hdfs dfs -setfacl -R -m user:<net_id>_nyu_edu:rwx /user/<net_id>_nyu_edu/testdir
hdfs dfs -setfacl -R -m default:user:<net_id>_nyu_edu:rwx /user/<net_id>_nyu_edu/testdir
```
To open the subdirectory permission to others, you need to open each higher level directory's navigation permission too:
```sh
hdfs dfs -setfacl -m user:<net_id>_nyu_edu:--x /user/<net_id>_nyu_edu
```

## Uploading Data to HDFS from Your Computer

### Small Transfers

You can add smaller files to HDFS by copying them to your local filesystem / non-HDFS  home directory and then copying them from there to HDFS.  Note that there is a limit on the size of your local filesystem home directory, so you should only perform these steps for smaller amounts of data- for larger datasets you should use the method described in the Large Transfers section.

-   Navigate to the command line interface by going to `http://dataproc.hpc.nyu.edu/ssh`.
-   In the upper right portion of the header banner, select Upload File.  Use the web browser dialog to select your file.
-   Once the file is uploaded to your Unix directory, run the following command to copy it into HDFS:
```sh
hdfs dfs -put /home/<your_netid>_nyu_edu/<path_to_file> <hdfs_path>
```
To retrieve data from HDFS and copy it to your local filesystem home directory, you can use one of the following commands:
```sh
hdfs dfs -get <hdfs_path> /home/<your_netid>_nyu_edu/<path_to_file>
hdfs dfs -copyToLocal <hdfs_path> /home/<your_netid>_nyu_edu/<path_to_file>
```
You can then download data by going to the upper right corner of the window in the command line interface and selecting the Download File option and entering a file path (i.e., `/home/<your_netid>_nyu_edu/<path_to_file>`).

To list files in HDFS, use the following command:
```sh
hdfs dfs -ls
```

### Large Transfers

To upload large datasets to HDFS, first navigate to the data ingest website at https://dataproc.hpc.nyu.edu/ingest. The data ingest website provides a web interface for temporary cloud-based bucket storage.  Any datasets that are uploaded to the data ingest website will remain there for 2 days.  Before these 2 days have elapsed, you will need to upload your datasets to your HDFS home directory.  To do that you can use the following command after logging in:
```sh
hadoop distcp gs://nyu-dataproc-hdfs-ingest/<file_or_folder_name> /user/<your_net_id>_nyu_edu
```
You can find the full path to your file/folder in the ingest storage by clicking on it in the web interface and then scrolling down to the gsutil URI field in the Live Object tab.

:::warning
Data uploaded into the ingest website will be visible to all members of the cluster temporarily.  If you are uploading files that cannot be shared with all cluster users (e.g., code) please use the alternate method described below.
:::

## Uploading Data to HDFS from Torch
First download gcloud on a desktop computer with a browser by following the instructions [here](https://cloud.google.com/sdk/docs/install). Ensure that you run the install command described as optional in step 4. Log into Torch and activate the Google Cloud command line interface module:
```sh
ml load google-cloud-sdk/379.0.0
```
Then log into Google Cloud by typing the following:
```sh
gcloud auth login
```
Copy and paste the command that you are given into a terminal application on your desktop and run it.  When prompted, type y to proceed.  If you are signed into multiple Google accounts, you will then be presented with a browser window where you can choose your account.  Select your NYU account.  Google will then present a message saying that “Google Cloud SDK wants to access your Google Account”.  Click Allow.

Copy the URL that you are given in the terminal window, and paste it into your Torch session on the line where gcloud asks for it.

Type `gcloud auth list` to verify that you are logged in:
```sh
[NetID@hlog-1 ~]$ gcloud auth list
           Credentialed Accounts
ACTIVE             ACCOUNT
*                  NetID@nyu.edu

To set the active account, run:
    $ gcloud config set account `ACCOUNT`
```
Now that you are logged in, use the instructions under the Small Transfers or Large Transfers sections below to upload your data.

### Small Transfers

Run the following commands on Torch to ensure that gcloud knows that you are using it with Dataproc (rather than a different Google Cloud application):
```sh
gcloud config set project hpc-dataproc-19b8
gcloud config set compute/zone us-central1-f
```
Run the following command on Torch to upload your file to your filesystem home directory on Dataproc:
```sh
gcloud compute scp MYFILE nyu-dataproc-m:~
```
If you are prompted to give a passphrase while generating an SSH key, hit enter twice.  The above commands are the command line equivalent to the upload dialogue at `i```[http://dataproc.hpc.nyu.edu/ssh](http://dataproc.hpc.nyu.edu/ssh)` that is mentioned earlier.

Your file should now be available within your filesystem home directory on Dataproc.  You can then run the following command to get it into HDFS:
```sh
hdfs dfs -put /home/<your_netid>_nyu_edu/<path_to_file> <hdfs_path>
```

### Large Transfers

On Torch, run the following to upload a single file to the staging bucket:

```sh
gsutil cp FILE  gs://nyu-dataproc-hdfs-ingest
```
Or run the following to copy a directory:
```sh
gsutil rsync -r DIRECTORY gs://nyu-dataproc-hdfs-ingest
```
The above commands are the command line equivalents to the data ingest website described earlier.

As with the earlier example, run the following from within Dataproc to ingest the dataset into your HDFS home directory:
```sh
hadoop distcp gs://nyu-dataproc-hdfs-ingest/<file_or_folder_name> /user/<your_net_id>_nyu_edu
```
