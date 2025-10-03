# Transferring Cloud Storage Data with rclone

## Transferring files to and from Google Drive with RCLONE
Having access to Google Drive from the HPC environment provides an option to archive data and even share data with collaborators who have no access to the NYU HPC environment. Other options to archiving data include the HPC Archive file system and using [Globus](./04_globus.md) to share data with collaborators.

Access to Google Drive is provided by [rclone](https://rclone.org/drive/) - rsync for cloud storage - a command line program to sync files and directories to and from cloud storage systems such as Google Drive, Amazon Drive, S3, B2 etc. [rclone](https://rclone.org/drive/) is available on Greene cluster as a module, the module versions currently available (March 2025) are:
-   **rclone/1.68.2**
-   **rclone/1.66.0**
-   **rclone/1.60.1**

For more details on how to use rclone to sync files to Google Drive, please see: [RClone documentation for Google Drive](https://rclone.org/drive/)

rclone can be invoked in one of the three modes:
-   [Copy](https://rclone.org/commands/rclone_copy/) mode to just copy new/changed files
-   [Sync](https://rclone.org/commands/rclone_sync/) (one way) mode to make a directory identical
-   [Check](https://rclone.org/commands/rclone_check/) mode to check for file hash equality

Please try with these options: 
```sh
rclone --transfers=32 --checkers=16 --drive-chunk-size=16384k --drive-upload-cutoff=16384k copy source:sourcepath dest:destpath
```

This option works great for file sizes 1Gb+ to 250GB. Keep in mind that there is a rate limiting of 2 files/sec for upload into Google Drive.  Small file transfers don’t work that well. If you have many small jobs, please tar the parent directory of such folders and split the tar file into 100GB chunks and then uploads then into Google Drive.

## rclone Configuration
You need to configure rclone before you will be able to move files between the HPC Environment and Google Drive

There are specific instruction on the [rclone web site](https://rclone.org/drive/) and here is an example of the process for configuring rclone for use on Greene:

### Step 1: Login to Greene:

Follow [instructions](../02_connecting_to_hpc/01_connecting_to_hpc.mdx) to log into the Greene HPC cluster.

### Step 2: Load the rclone module
```sh
$ module load rclone/1.68.2
```

### Step 3: Configure rclone

Configuring rclone and setting up remote access to your Google Drive, using the command:
```sh
$ rclone config
```

This will try to open the config files and you will see the below content:

You can select one of the options (here we show how to set up a new remote)
```sh
2025/03/14 16:39:23 NOTICE: Config file "/Users/$USER/.config/rclone/rclone.conf" not found - using defaults
No remotes found, make a new one?
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n
```

Please enter `n` to create a new remote

```sh
Enter name for new remote.
name> nyu_google_drive
```
Please enter `nyu_google_drive` or something similar to name the new remote 

```sh
Option Storage.
Type of storage to configure.
Choose a number from below, or type in your own value.
 1 / 1Fichier
   \ (fichier)
 2 / Akamai NetStorage
   \ (netstorage)
 3 / Alias for an existing remote
   \ (alias)
 4 / Amazon S3 Compliant Storage Providers including AWS, Alibaba, ArvanCloud, Ceph, ChinaMobile, Cloudflare, DigitalOcean, Dreamhost, GCS, HuaweiOBS, IBMCOS, IDrive, IONOS, LyveCloud, Leviia, Liara, Linode, Magalu, Minio, Netease, Petabox, RackCorp, Rclone, Scaleway, SeaweedFS, StackPath, Storj, Synology, TencentCOS, Wasabi, Qiniu and others
   \ (s3)
 5 / Backblaze B2
   \ (b2)
 6 / Better checksums for other remotes
   \ (hasher)
 7 / Box
   \ (box)
 8 / Cache a remote
   \ (cache)
 9 / Citrix Sharefile
   \ (sharefile)
10 / Combine several remotes into one
   \ (combine)
11 / Compress a remote
   \ (compress)
12 / Dropbox
   \ (dropbox)
13 / Encrypt/Decrypt a remote
   \ (crypt)
14 / Enterprise File Fabric
   \ (filefabric)
15 / FTP
   \ (ftp)
16 / Files.com
   \ (filescom)
17 / Gofile
   \ (gofile)
18 / Google Cloud Storage (this is not Google Drive)
   \ (google cloud storage)
19 / Google Drive
   \ (drive)
20 / Google Photos
   \ (google photos)
21 / HTTP
   \ (http)
22 / Hadoop distributed file system
   \ (hdfs)
23 / HiDrive
   \ (hidrive)
24 / ImageKit.io
   \ (imagekit)
25 / In memory object storage system.
   \ (memory)
26 / Internet Archive
   \ (internetarchive)
27 / Jottacloud
   \ (jottacloud)
28 / Koofr, Digi Storage and other Koofr-compatible storage providers
   \ (koofr)
29 / Linkbox
   \ (linkbox)
30 / Local Disk
   \ (local)
31 / Mail.ru Cloud
   \ (mailru)
32 / Mega
   \ (mega)
33 / Microsoft Azure Blob Storage
   \ (azureblob)
34 / Microsoft Azure Files
   \ (azurefiles)
35 / Microsoft OneDrive
   \ (onedrive)
36 / OpenDrive
   \ (opendrive)
37 / OpenStack Swift (Rackspace Cloud Files, Blomp Cloud Storage, Memset Memstore, OVH)
   \ (swift)
38 / Oracle Cloud Infrastructure Object Storage
   \ (oracleobjectstorage)
39 / Pcloud
   \ (pcloud)
40 / PikPak
   \ (pikpak)
41 / Pixeldrain Filesystem
   \ (pixeldrain)
42 / Proton Drive
   \ (protondrive)
43 / Put.io
   \ (putio)
44 / QingCloud Object Storage
   \ (qingstor)
45 / Quatrix by Maytech
   \ (quatrix)
46 / SMB / CIFS
   \ (smb)
47 / SSH/SFTP
   \ (sftp)
48 / Sia Decentralized Cloud
   \ (sia)
49 / Storj Decentralized Cloud Storage
   \ (storj)
50 / Sugarsync
   \ (sugarsync)
51 / Transparently chunk/split large files
   \ (chunker)
52 / Uloz.to
   \ (ulozto)
53 / Union merges the contents of several upstream fs
   \ (union)
54 / Uptobox
   \ (uptobox)
55 / WebDAV
   \ (webdav)
56 / Yandex Disk
   \ (yandex)
57 / Zoho
   \ (zoho)
58 / premiumize.me
   \ (premiumizeme)
59 / seafile
   \ (seafile)
Storage> 19
```

Please enter the number that corresponds to `Google Drive`. In the example above it is `19`.

```sh
Option client_id.
Google Application Client Id
Setting your own is recommended.
See https://rclone.org/drive/#making-your-own-client-id for how to create your own.
If you leave this blank, it will use an internal key which is low performance.
Enter a value. Press Enter to leave empty.
client_id> 
```

Please leave this field blank and hit enter/return.

```sh
Option client_secret.
OAuth Client Secret.
Leave blank normally.
Enter a value. Press Enter to leave empty.
client_secret> 
```

Please leave this field blank and hit enter/return.

```sh
Scope that rclone should use when requesting access from drive.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
 1 / Full access all files, excluding Application Data Folder.
   \ "drive"
 2 / Read-only access to file metadata and file contents.
   \ "drive.readonly"
   / Access to files created by rclone only.
 3 | These are visible in the drive website.
   | File authorization is revoked when the user deauthorizes the app.
   \ "drive.file"
   / Allows read and write access to the Application Data folder.
 4 | This is not visible in the drive website.
   \ "drive.appfolder"
   / Allows read-only access to file metadata but
 5 | does not allow any access to read or download file content.
   \ "drive.metadata.readonly"
scope> 1
```

Please enter 1 or the number corresponding to the option for 'full access' if the options above have changed.

```sh
Service Account Credentials JSON file path
Leave blank normally.
Needed only if you want use SA instead of interactive login.
Leading `~` will be expanded in the file name as will environment variables such as `${RCLONE_CONFIG_DIR}`.
Enter a string value. Press Enter for the default ("").
service_account_file>
```

Please leave blank and hit enter/return.

```sh
Edit advanced config? (y/n)
y) Yes
n) No (default)
y/n> n
```

Please enter 'n'.

```sh
Use web browser to automatically authenticate rclone with remote?
 * Say Y if the machine running rclone has a web browser you can use
 * Say N if running rclone on a (remote) machine without web browser access
If not sure try Y. If Y failed, try N.

y) Yes (default)
n) No
y/n> 
```

Please enter 'n'

```sh
Option config_token.
For this to work, you will need rclone available on a machine that has
a web browser available.
For more help and alternate methods see: https://rclone.org/remote_setup/
Execute the following on the machine with the web browser (same rclone
version recommended):
	rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlIn0"
Then paste the result.
Enter a value.
config_token> 
```

As instructed, please copy the line in the output you get that is similar to:
`rclone authorize "drive" "eyJzY29wZSI6ImRyaXZlIn0"`
and paste that into a terminal on your local system and press enter/return.

That should open a web browser that will have you select your NYU account and will verify that you would like to give rclone access to your Google Drive.  It will then provide you with a long code:

```sh
user@ITS tmp % rclone authorize "drive" "eysi39xv82pmJzY29XZlIn0"
2025/03/21 11:12:29 NOTICE: Make sure your Redirect URL is set to "http://127.0.0.1:53682/" in your custom config.
2025/03/21 11:12:29 NOTICE: If your browser doesn't open automatically go to the following link: http://127.0.0.1:53682/auth?state=4c5yNwx6EsFWeise83svie
2025/03/21 11:12:29 NOTICE: Log in and authorize rclone for access
2025/03/21 11:12:29 NOTICE: Waiting for code...
2025/03/21 11:12:39 NOTICE: Got code
Paste the following into your remote machine --->
code removed
<---End paste
```

Please copy this code and paste it in as a response to the `config_token>` prompt.

```sh
Configure this as a team drive?
y) Yes
n) No (default)
y/n> n
```

Please enter 'n'.

```sh
--------------------
[remote1]
type = drive
scope = drive
token = {"access_token":", removed "}
--------------------
y) Yes this is OK (default)
e) Edit this remote
d) Delete this remote
y/e/d> y
```

Please enter 'y'.

```sh
Current remotes:
Name                 Type
====                 ====
remote1              drive
e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```

Please enter 'q' and we're done with configuration.

### Step 4: Transfer
:::warning
Please be sure to perform data transfers on a data transfer node (DTN).  It can degrade performance for other users to perform transfers on other types of nodes.  For more information please see [Data Transfers](./03_data_transfers.md)
:::

Sample commands:
```sh
$ rclone lsd nyu_google_drive:
```

Transfer files to Google Drive, using the command below:
```sh
$ rclone copy <source_folder or file> <remote_name>:<name_of_folder_on_gdrive>
```

It looks something like below:
```sh
$ rclone copy /home/user1 nyu_google_drive:backup_home_user1
```

### Step 5: Confirmation

The files are transferred and you can find the files on your Google Drive.

:::note
Rclone only copies new files or files different from the already existing files on Google Drive.
:::
