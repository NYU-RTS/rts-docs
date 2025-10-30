# SQLite: Handling Large Structured Data

## Overview
Storing your data in the [SQLite](https://www.sqlite.org/index.html) format allows you to get benefits of a database, and at the same time the simplicity of storage of data in a file on a disk.

> SQLite is the [most used](https://www.sqlite.org/mostdeployed.html) database engine in the world. SQLite is built into all mobile phones and most computers and comes bundled inside countless other applications that people use every day. The SQLite [file format](https://www.sqlite.org/fileformat2.html) is stable, cross-platform, and backwards compatible and the developers pledge to keep it that way through at least the year 2050.
>
> -- [SQLite website](https://www.sqlite.org/index.html):

### Some use-cases

-   You think you need MySQL, PostreSQL, etc for your ML project. Usually you don't
-   You have to deal with hundreds of GB of table-structured data (or larger) and your script (for whatever reason) can't be made parallel.
-   You would request a lot of RAM and work with data slowly.
:::warning
This would be a waste of RAM.
:::
:::tip
It is better in this case to request smaller amount of RAM and read data (efficiently) from disk - for example using SQLite
:::

### Benefits:

-   You are not limited by RAM any longer
-   Compared to other file formats SQLite is very good in selecting certain lines (especially if you use indexing)
-   You can use familiar `dplyr` syntax or execute SQL queries directly
    -   [dplyr](https://dplyr.tidyverse.org/) is an interface for working with data in a database, not for modifying remote tables.
    -   [DBI package](https://dbi.r-dbi.org/) allows to both read and modify tables
-   SQLite is [actually faster for common data analysis tasks](https://www.sqlite.org/speed.html) than other popular databases.
-   You can have multiple threads accessing an SQLite database simultaneously (for read operations. Writing is more tricky)
-   Merging/Joining datasets on disk

### Major benefits of SQLite compared to MySQL (PostgreSQL, etc)

-   You control your own data (sqlite file). You don't depend on any service like MySQL
-   You can copy a file to your own laptop and work with it
-   Again, [SQLite is faster](https://www.sqlite.org/speed.html)!

### Limits

-   SQLite has some limitations in terms of concurrency, which usually don't apply for typical ML/AI jobs.
-   See [Four Different Ways To Handle SQLite Concurrency](https://medium.com/@gwendal.roue/four-different-ways-to-handle-sqlite-concurrency-db3bcc74d00e) for more information.

## Command line (CLI) example
Create environment
```sh
$ mkdir projects/sqlite-test
$ cd projects/sqlite-test
$ conda create -p ./cenv
$ source activate ./cenv
$ conda install -y sqlite
```
Then [follow this SQLite example](https://sqlite.org/cli.html).
```sh
$ sqlite3 db_file.sqlite
sqlite> create table tbl1(one varchar(10), two smallint);
sqlite> insert into tbl1 values('hello!', 10);
sqlite> insert into tbl1 values('goodbye', 20);
sqlite> select * from tbl1;
hello!|10
goodbye|20
```
Now Close session (Ctrl-D).

Reopen session to check if changes are saved
```sh
$ sqlite3 db_file.sqlite
sqlite> select * from tbl1;
hello!|10
goodbye|20
```

## R example
### Install
Here we use conda, as a great way to keep everything isolated and reproducible.

:::note
conda will install pre-compiled packages. Which is good (faster) and bad (not fully optimized for a specific hardware)
:::

:::tip
Alternative: install packages to a local directory or use renv as described in [R Packages with renv](./05_r_packages_with_renv.mdx)
```sh
mkdir /scratch/$USER/projects/myTempProject
cd  /scratch/$USER/projects/myTempProject

module load anaconda3/2024.02

conda create -p ./cenv -c conda-forge r=4.5
source activate ./cenv
conda install -c r r-rsqlite
conda install -c r r-tidyverse
conda install -c conda-forge r-remotes
conda install -c r r-feather
conda install -c r r-nycflights13
```
:::note

[window functions (row_number in particular) require newer version of rsqlite](https://github.com/r-dbi/RSQLite/issues/268)
```R
R
remotes::install_github("r-dbi/RSQLite")
## update ALL
```
:::
:::tip
Save list of installed packages for reproducibility
```sh
## conda list --export > requirements.txt
```
:::

### Use
Many examples can be found here:
-   [SQL syntax](https://solutions.posit.co/connections/db/databases/sqlite/)
-   [dplyr syntax](https://solutions.posit.co/connections/db/r-packages/dplyr/)

```R
library(tidyverse)
library(DBI)
# Create RSQLite database file with name "allData"
con <- dbConnect(RSQLite::SQLite(), "allData")
```

Copy data frame to database (dplyr)
```R
copy_to(con, nycflights13::flights, "fl", temporary=FALSE)
```

Or copy data to database using DBI
```R
dbCreateTable(con, "fl", nycflights13::flights, temporary = FALSE)
dbAppendTable(con, "fl", nycflights13::flights)
```

Connect to a specific table
```R
dbListTables(con)
df_con <- tbl(con, "fl")
## check number of rows
df_con %>% count()
```

Subset
```R
df_temp <- df_con %>% filter( row_number() %in%  c(1, 3) ) %>% collect
```

Save as feather
```R
feather::write_feather(df_temp, "my_data.feather")
```

### Alternative: read csv file to SQLite directly

If you already have a large csv file on disk, and you don't want to read it to RAM, you can read it to SQLite file directly
```R
conda install -c conda-forge r-sqldf 
R
library(sqldf)
## create data file
# sqldf("attach allData as new")

# make csv file for this example
write.csv(df_con, "df_con.csv", row.names = FALSE)

# read file directly from csv to sqlite
read.csv.sql(file = "df_con.csv", sql = "create table states_data as select * from file", dbname = "allData")

# verify data in data frame
dbListTables(con)
[1] "fl"           "sqlite_stat1" "sqlite_stat4" "states_data" 

df_con_sd <- tbl(con, "states_data")
df_con_sd
# Source:   table<`states_data`> [?? x 19]
# Database: sqlite 3.50.1 [/scratch/netID/myTempProject/allData]
    year month   day dep_time sched_dep_time dep_delay arr_time sched_arr_time
   <int> <int> <int>    <int>          <int>     <int>    <int>          <int>
 1  2013     1     1      517            515         2      830            819
 2  2013     1     1      533            529         4      850            830
 3  2013     1     1      542            540         2      923            850
 4  2013     1     1      544            545        -1     1004           1022
 5  2013     1     1      554            600        -6      812            837
 6  2013     1     1      554            558        -4      740            728
 7  2013     1     1      555            600        -5      913            854
 8  2013     1     1      557            600        -3      709            723
 9  2013     1     1      557            600        -3      838            846
10  2013     1     1      558            600        -2      753            745
# ℹ more rows
# ℹ 11 more variables: arr_delay <int>, carrier <chr>, flight <int>,
#   tailnum <chr>, origin <chr>, dest <chr>, air_time <int>, distance <int>,
#   hour <int>, minute <int>, time_hour <int>
# ℹ Use `print(n = ...)` to see more rows
```

## UI for SQLite - SQLiteStudio
Once you have SQLite file, you can easily transfer it to your own laptop and explore it using [SQLiteStudio](https://sqlitestudio.pl/), if you like to use UI instead of terminal
