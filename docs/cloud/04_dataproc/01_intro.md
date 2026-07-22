# Dataproc

[gcs]: https://cloud.google.com/storage?hl=en
[bigquery]: https://cloud.google.com/bigquery?hl=en
[bigtable]: https://cloud.google.com/bigtable?hl=en
[data-locality]: https://en.wikipedia.org/wiki/Locality_of_reference
[yarn-ui]: https://dataproc.hpc.nyu.edu/yarn/


Dataproc is a cloud-based Hadoop distribution that is managed by Google.  Google administers updates to Dataproc so that it is kept current.  Google also packages and maintains additional software that can be run on top of Hadoop. Additionally Dataproc includes other cloud-specific features, such as the ability to automatically add/remove nodes depending upon how busy the cluster is (autoscaling).  It can also use object storage ([GCS][gcs]) or [BigQuery][bigquery] as an alternative to HDFS, and provides integration with [BigTable][bigtable] using HBase interfaces.

### What Is Hadoop?

Hadoop is an open-source software framework for storing and processing big data in a distributed/parallel fashion on large clusters of commodity hardware. At its core, Hadoop strives to increase processing speed by increasing [data locality][data-locality] (i.e., it moves computation to servers where the data is located).  There are three components to Hadoop: HDFS (the Hadoop Distributed File System), the Hadoop implementation of MapReduce, and YARN (Yet Another Resource Negotiator; a scheduler).

### Autoscaling

NYU Dataproc is configured to be as cloud-agnostic as possible, and still uses HDFS and non-proprietary HBase components.  It does, however, leverage autoscaling.  This means that if the cluster hasn't been used for a while, it might take a while for resources to become available (typically 3-5 minutes) as nodes are turned on and NodeManagers register with YARN.  During this time, the following warning message will appear and indicate that the cluster is at capacity and resources are not available:
```sh
WARN org.apache.spark.scheduler.cluster.YarnScheduler: Initial job has not accepted any resources; check your cluster UI to ensure that workers are registered and have sufficient resources
```
This warning will go away after new nodes have been added by autoscaling and more resources are available for YARN applications.  If it does not go away after more than 10 minutes, please contact the HPC team.  Autoscaling is actively monitored, but a duration of more than 10 minutes may indicate a failure of  Dataproc's monitoring infrastructure.

Currently, NYU Dataproc's autoscaling is configured so that the cluster will have between 3 and 43 nodes depending upon demand.  The number of nodes that are currently active can be seen in the YARN web UI.  Additionally, percentage of cluster capacity that is used can be seen on the Scheduler page in the lefthand menu in the [YARN web UI][yarn-ui].

## Accessing the NYU Dataproc Hadoop Cluster

Access to the NYU Dataproc cluster is granted via your NYU Google account.  If you are in a class that uses Dataproc, your instructor or TA will request Dataproc access for your NetID.  

Once this is granted you can log in by navigating to https://dataproc.hpc.nyu.edu/ssh in your web browser.  After you’ve reached this page you will have access to a browser-based terminal interface where you can run Hadoop commands.  

If you are having difficulty connecting to a terminal, please make sure that you are not logged in to a non-NYU Google account by clicking the icon displayed in the upper right corner in the Gmail web interface (see [here](https://support.google.com/accounts/answer/1721977)).  If you are using Google Chrome, you may also need to switch to your NYU account profile using the instructions [here](https://support.google.com/chrome/answer/2364824).

If you continue to have difficulties connecting via https://dataproc.hpc.nyu.edu/ssh, you can also log in by navigating to https://shell.cloud.google.com/ and running the following command in the terminal that appears:
```sh
gcloud compute ssh nyu-dataproc-m --project=hpc-dataproc-19b8 --zone=us-central1-f
```
You may need to authorize Google to log in to Dataproc after running the above command.

Once logged in, your username will be of the form NetID_nyu_edu rather than just your NetID.
