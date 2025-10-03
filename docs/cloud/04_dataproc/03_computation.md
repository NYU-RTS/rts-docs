# Computation

## MapReduce

MapReduce is a programming model and an associated implementation for processing and generating large datasets with a parallel, distributed algorithm on a cluster.

A MapReduce job splits a large dataset into independent chunks and organizes them into key-value pairs for parallel processing. The mapping and reducing functions receive not just values, but (key, value) pairs. 

Every MapReduce job consists of at least two parts:
-   **Mapping Phase**: Takes input as (key,value) pairs, processes them, and produces another set of intermediate (key,value) pairs as output.
-   **Reducing Phase**: Reducing lets you aggregate values together. A reducer function receives an iterator of input values from an input list. It then combines these values together, returning a single output value.

### MapReduce Word Count Example

Ingest a text file into HDFS.  In the below example, the hdfs -put command is combined with another Unix command (curl) to send a copy of a Sherlock Holmes book (located at the URL https://www.gutenberg.org/files/1661/1661-0.txt) directly into HDFS:
```sh
curl -o input.txt https://www.gutenberg.org/files/1661/1661-0.txt
hdfs dfs -put input.txt
```
The following command will run an example Word Count job (described in more detail [here](https://cwiki.apache.org/confluence/display/HADOOP2/WordCount)) with the Sherlock Holmes book as its input.
```sh
hadoop jar /usr/lib/hadoop-mapreduce/hadoop-mapreduce-examples.jar wordcount -D mapreduce.job.maps=6 -D mapreduce.job.reduces=2 /user/<netid>_nyu_edu/input.txt /user/<netid>_nyu_edu/output
```

## Spark

Apache Spark is an open-source unified analytics engine for large-scale data processing. Spark provides an interface for programming entire clusters with implicit data parallelism and fault tolerance. Originally developed at the University of California, Berkeley's AMPLab, the Spark codebase was later donated to the Apache Software Foundation, which has maintained it since. (source: [Wikipedia](https://en.wikipedia.org/wiki/Apache_Spark))

### Launching an Interactive Spark Shell

Spark provides an interactive shell that you can use to learn the Spark API and analyze datasets interactively. To connect to Spark Shell from the command line, execute the following command:
```sh
spark-shell --deploy-mode client --num-executors=1 --driver-memory=1G --executor-memory=1G
```
:::tip
NYU Dataproc deploys Spark applications in cluster mode by default.  The following error indicates that you are trying to deploy an interactive shell, which must use client mode:
:::
```sh
Exception in thread "main" org.apache.spark.SparkException: Cluster deploy mode is not applicable to Spark shells.
```
To resolve this error, either use the command line flag indicated above (`--deploy-mode client`) or set the `spark.submit.deployMode` property in your Spark configuration to client. More details about the difference between cluster and client mode can be found [here](https://spark.apache.org/docs/latest/running-on-yarn.html#launching-spark-on-yarn).

## YARN Scheduler

YARN is the resource manager and job scheduler in the Hadoop cluster. YARN allows you to use various data processing engines for batch, interactive, and real-time stream processing of data stored in HDFS.

-   Application status and logs: Please find the list of current running apps using 'Yarn' script. Running the yarn script without any arguments prints the description for all commands
```sh
yarn application -list 
```
-   To kill a currently running app because the submitted app started malfunctioning or in worst case scenario, it's stuck in an infinite loop. Get the app ID and then kill it as given below
```sh
yarn application -kill <application_ID>
```
-   To download application logs for examination on the command line
```sh
yarn logs -applicationId <application_ID>
```

## Using Hive

Apache Hive is a data warehouse software package that facilitates querying and managing large datasets residing in distributed storage (i.e., HDFS). Hive provides a mechanism to project structure onto this data and query the data using a SQL-like language called Hive Query Language (HiveQL or HQL). 

You can access Hive with the following command:
```sh
beeline -u jdbc:hive2://localhost:10000
0: jdbc:hive2://localhost:10000> use <netid>_nyu_edu;
0: jdbc:hive2://localhost:10000> show tables;
0: jdbc:hive2://localhost:10000> !quit
Closing: 0: jdbc:hive2://localhost:10000
```
It is important to note that in order to exit properly from a beeline session, you type `!quit`. 

If you are planning on using SerDe to query/work with JSON files, you will need to run the following code at the Beeline prompt first in order to ensure that the JsonSerDe class is loaded:
```sql
ADD JAR /usr/lib/hive/lib/hive-hcatalog-core.jar
```
See [here](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL#LanguageManualDDL-RowFormats&SerDe) for more information.

Access to Hive databases on NYU Dataproc is derived from HDFS permissions because we use [Storage-Based Authorization](http://storagebasedauthorizationprovider/). To grant read-only access to a Hive database to someone other than yourself, you can run the following command:
```
hdfs dfs -setfacl -R -m user:<OTHER_PERSON_NETID>_nyu_edu:r-x /user/hive/warehouse/NetID_nyu_edu.db
```
:::warning
Outside of NYU, other Hadoop installations may use a different mechanism to share databases with other colleagues– it is common for Hadoop installations to use a SQL style grant/revoke mechanism for sharing databases ([SQL Standards Based Authorization](https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Authorization#LanguageManualAuthorization-2SQLStandardsBasedAuthorizationinHiveServer2)).  This mechanism is not used at NYU and it is important to bear in mind that external documentation referring to grant/revoke statements is not applicable to NYU Dataproc.
:::

## Using Trino

Trino is a distributed SQL query engine designed to query large data sets distributed over one or more heterogeneous data sources.  To access Trino, you can type the following command:
```sh
trino
```
Once you are inside, you can reference multiple data sources through catalogs (see here).  For instance, you may want to query Hive using Trino.  You can select a database to use through a fully-qualified database or table name as shown in the code below:
```sh
trino> show catalogs;
       Catalog        
----------------------
 bigquery             
 bigquery_public_data 
 hive                 
 mastersql            
 memory               
 system               
 tpcds                
 tpch                 
(8 rows)

Query 20240827_132732_00001_ygn47, FINISHED, 2 nodes
Splits: 20 total, 20 done (100.00%)
0.17 [0 rows, 0B] [0 rows/s, 0B/s]

trino> use hive.<netid>_nyu_edu;
USE
```
You can also specify a catalog / data source that you want to use on the command line when you start Trino:
```sh
trino --catalog=hive
```

## Using Conda

NYU Dataproc comes with `miniconda3` by default. This can be used to manage Python packages within your filesystem home directory. See [here](https://docs.conda.io/projects/conda/en/latest/user-guide/getting-started.html) or [here](../../hpc/06_tools_and_software/06_conda_environments.mdx) for more information on the conda command.

## Using Jupyter Notebooks

-   Log into the Dataproc cluster and run jupyter-notebook. Do not close the command line interface where jupyter-notebook is running until you're done using Jupyter.
-   From the output produced by jupyter-notebook, obtain the port number that the notebook is running on.  In the example below, for instance, the notebook is running on port `8888`:
```sh
    To access the notebook, open this file in a browser:
        file:///home/NetID_nyu_edu/.local/share/jupyter/runtime/nbserver-7866-open.html
    Or copy and paste one of these URLs:
        http://localhost:8888/?token=90d9c6297ba2c963cdb998ae374041384bac71c781b18ed1
     or http://127.0.0.1:8888/?token=90d9c6297ba2c963cdb998ae374041384bac71c781b18ed1
```
-   On an individual workstation that has the gcloud command installed (installation instructions for gcloud can be found here), run the following command (with PORT replaced with the port number from step 2):
```sh
gcloud compute ssh nyu-dataproc-m --project hpc-dataproc-19b8 --zone us-central1-f -- -N -L PORT:localhost:PORT
```
-   In our example, from the output in step 2 this command would be as follows:
```sh
gcloud compute ssh nyu-dataproc-m --project hpc-dataproc-19b8 --zone us-central1-f -- -N -L 8888:localhost:8888
```
-   You can then use the URLs from the jupyter-notebook output in step 2 (e.g., `http://localhost:8888/?token=90d9c6297ba2c963cdb998ae374041384bac71c781b18ed1`) to access your notebook from the workstation.
-   When you are done, you can exit the terminals where the jupyter-notebook and the gcloud commands are running.

## Using Zeppelin Notebooks

-   Log into the Dataproc cluster and run zeppelin start.  The terminal will output three pieces of information that you will need later: username, password, and port number.  The output should look something like this:
```sh
NetID_nyu_edu@nyu-dataproc-m:~$ zeppelin start

Zeppelin is starting with the following configuration:
-------------------------------------------------------

Username: jp6546_nyu_edu
Password: REDACTED
Port: 64739

Zeppelin start                                             [  OK  ]
```
-   On an individual workstation that has the gcloud command installed (installation instructions for gcloud can be found here), run the following command (with PORT replaced with the port number from step 1):
```sh
gcloud compute ssh nyu-dataproc-m --project hpc-dataproc-19b8 --zone us-central1-f -- -N -L PORT:localhost:PORT
```
In our example this command would be as follows using the output from step 1 :
```sh
gcloud compute ssh nyu-dataproc-m --project hpc-dataproc-19b8 --zone us-central1-f -- -N -L 64739:localhost:64739
```
-   In a web browser, navigate to `localhost:PORT`.
-   Log in by clicking the Login button in the upper right corner.  Use your credentials from step 1.
-   If you forget the password or the port number at any time, you can run the following commands to retrieve this information:
```sh
zeppelin get-port
zeppelin get-pass 
```
-   When you are finished, run `zeppelin stop` to turn off the Zeppelin server.
