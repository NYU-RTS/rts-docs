# Sharing Data on HPC

## Introduction
To share files on the cluster with other users, we recommend using file access control lists (FACL) for a user to share access to their data with others.  FACL mechanism allows a fine-grained control access to any files by any users or groups of users. We discourage users from setting `777` permissions with `chmod`, because this can lead to data loss (by a malicious user or unintentionally, by accident). Linux commands `getfacl` and `setfacl` are used to view and set access. 

ACL mechanism, just like regular Linux POSIX, allows three different levels of access control:

-   Read (r) - the permission to see the contents of a file
-   Write (w) - the permission to edit a file
-   eXecute (X) - the permission to call a file or run it (in this case we use X instead of x because the X permission uses inherited executable permissions and not all files need execution)

This level of access can be granted to 

-   user (owner of the file)
-   group (owner group)
-   other (everyone else)

ACL allows to grant the same type access without modifying file ownership and without changing POSIX permissions. 

## Viewing ACL
Use `getfacl` to retrieve access permissions for a file. 
```sh
$ getfacl myfile.txt
# file: myfile.txt
# owner: ab123
# group: users
user::rw-
group::---
other::---
```
The example above illustrates that in most cases ACL looks just like the chmod-based permissions: owner of the file has read and write permission, members of the group and everyone else have no permissions at all.


## Setting ACL
Modify access permissions
Use setfacl:

```sh
# general syntax:
$ setfacl [option] [action/specification] file

# most important options are
# -m to modify ACL
# -x to remove ACL
# -R to apply the action recursively (apply to everything inside the directory)

# To set permissions for a user (user is either the user name or ID):
$ setfacl -m "u:user:permissions" <file/dir>

## To set permissions for a group (group is either the group name or ID):
$ setfacl -m "g:group:permissions" <file/dir>

# To set permissions for others:
$ setfacl -m "other:permissions" <file/dir>

# To allow all newly created files or directories to inherit entries from the parent directory (this will not affect files which will be copied into the directory afterwards):
$ setfacl -dm "entry" <dir>

# To remove a specific entry:
$ setfacl -x "entry" <file/dir>

# To remove the default entries:
$ setfacl -k <file/dir>

# To remove all entries (entries of the owner, group and others are retained):
$ setfacl -b <file/dir>
```

:::tip
Give Access to Parent Directories in the Path
When you would like to set ACL to say `/a/b/c/example.out`,  you also need to set appropriate ACLs to all the parent directories in the path. If you want to give read/write/execute permissions for the file `/a/b/c/example.out`, you would also need to give at least r-x permissions to the directories: `/a`,  `/a/b`, and `/a/b/c`.
:::

### Remove All ACL Entries
```sh
$ setfacl -b abc
```

### Check ACLs
```sh
$ getfacl abc
# file: abc
# owner: someone
# group: someone
user::rw-
group::r--
other::r--
```

You can see with `ls -l` if a file has extended permissions set with setfacl: the `+` in the last column of the permissions field indicates that this file has detailed access permissions via ACLs:
```sh
$ ls -la
total 304
drwxr-x---+   18 ab123 users  4096 Apr  3 14:32 .
drwxr-xr-x  1361 root  root      0 Apr  3 09:35 ..
-rw-------     1 ab123 users  4502 Mar 28 22:27 my_private_file
-rw-r-xr--+    1 ab123 users    29 Feb 11 23:18 dummy.txt
```

### Flags
Please read `man setfacl` for possible flags. For example:

-   '-m' - modify
-   '-x' - remove
-   '-R' - recursive (apply ACL to all content inside a directory)
-   '-d' - default (set given settings as default - useful for a directory - all the new content inside in the future will have given ACL)

## Examples
### File ACL Example
Set read, write, and execute (rwX) permissions for user johnny to file named abc:
```sh
$ setfacl -m "u:johnny:rwX" abc
```

:::note
We recommend for the permissions using a capital 'X' as using a lowercase 'x' will make all files executable, so we reommcned this:

Check permissions:
```sh
$ getfacl abc
# file: abc
# owner: someone
# group: someone
user::rw-
user:johnny:rwX
group::r--
mask::rwX
other::r--
```

Change permissions for user johnny:
```sh
$ setfacl -m "u:johnny:r-X" abc
```

Check permissions:
```sh
$ getfacl abc
# file: abc
# owner: someone
# group: someone
user::rw-
user:johnny:r-X
group::r--
mask::r-X
other::r--
```
:::

### Directory ACL Example
Let's say alice123 wants to share directory `/scratch/alice123/shared/researchGroup/group1` with user `bob123`
```sh
## Read/execute access to /scratch/alice123
setfacl -m u:bob123:r-X /scratch/alice123
## Read/execute access to /scratch/alice123/shared
setfacl -m u:bob123:r-X /scratch/alice123/shared
## Read/execute access to /scratch/alice123/shared/researchGroup
setfacl -m u:bob123:r-X /scratch/alice123/shared/researchGroup
## Now I can finally can give access to directory /scratch/alice123/shared/researchGroup/group1
setfacl -Rm u:bob123:rwX /scratch/alice123/shared/researchGroup/group1
```
:::note
user bob123 will be able to see content of the following directories

-   `/scratch/alise123/`
-   `/scratch/alise123/shared`
-   `/scratch/alise123/shared/researchGroup/`
-   `/scratch/alise123/shared/researchGroup/group1`
