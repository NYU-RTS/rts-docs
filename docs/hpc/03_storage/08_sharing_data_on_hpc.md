# Sharing Data on HPC

## Introduction
To share files on the cluster with other users, we recommend using NFSv4 access control lists (ACL) for a user to share access to their data with others. NFSv4 ACL mechanism allows for fine-grained control access to any files by any users or groups of users. We discourage users from setting `777` permissions with `chmod`, because this can lead to data loss (by a malicious user or unintentionally, by accident). The following commands are available:
-   `nfs4_setfacl` to set ACEs
-   `nfs4_editfacl` to edit ACEs
-   `nfs4_getfacl` to view ACLs
