# Datasets Available

## General
The HPC team makes available a number of public sets that are commonly used in analysis jobs. The data sets are available Read-Only under
-   `/projects/work/public/ml-datasets/`

:::note
For some of the datasets users must provide a signed usage agreement before accessing
:::

## Format
Many datasets are available in the form of '.sqf' file, which can be used with Singularity.
For example, in order to use coco dataset, one can run the following commands 
```sh
$ singularity exec \
  --overlay /<path>/pytorch1.8.0-cuda11.1.ext3:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2014.sqf:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2015.sqf:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2017.sqf:ro \
  /projects/work/public/singularity/cuda11.1-cudnn8-devel-ubuntu18.04.sif /bin/bash

$ singularity exec \
  --overlay /<path>/pytorch1.8.0-cuda11.1.ext3:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2014.sqf:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2015.sqf:ro \
  --overlay /projects/work/public/ml-datasets/coco/coco-2017.sqf:ro \
  /projects/work/public/singularity/cuda11.1-cudnn8-devel-ubuntu18.04.sif find /coco | wc -l

532896
```

## Data Sets
### COCO Dataset
*About data set*: [https://cocodataset.org/](https://cocodataset.org/#home)

Common Objects in Context (COCO) is a large-scale object detection, segmentation, and captioning dataset. 

*Dataset is available under*
-   `/projects/work/public/ml-datasets/coco/coco-2014.sqf`
-   `/projects/work/public/ml-datasets/coco/coco-2015.sqf`
-   `/projects/work/public/ml-datasets/coco/coco-2017.sqf`

### ImageNet and ILSVRC
About data set: [ImageNet (image-net.org)](https://image-net.org/)

ImageNet is an image dataset organized according to the [WordNet](https://wordnet.princeton.edu/) hierarchy (Miller, 1995). Each concept in WordNet, possibly described by multiple words or word phrases, is called a “synonym set” or “synset”. ImageNet populates 21,841 synsets of WordNet with an average of 650 manually verified and full resolution images. As a result, ImageNet contains 14,197,122 annotated images organized by the semantic hierarchy of WordNet (as of August 2014). ImageNet is larger in scale and diversity than the other image classification datasets ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)).

:::note 
WordNet® is a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept ([https://wordnet.princeton.edu/](https://wordnet.princeton.edu/))
:::

#### ILSVRC (Subset of ImageNet)

ILSVRC uses a subset of ImageNet images for training the algorithms and some of ImageNet’s image collection protocols for annotating additional images for testing the algorithms ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)). The name comes from 'ImageNet Large Scale Visual Recognition Challenge ([ILSVRC](https://image-net.org/challenges/LSVRC/2017/))'. Competition was moved to Kaggle ([http://image-net.org/challenges/LSVRC/2017/](http://image-net.org/challenges/LSVRC/2017/))

*What is included* ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)).
-   1000 object classes
-   approximately 1.2 million training images
-   50 thousand validation images
-   100 thousand test images
-   Size of data is about 150 GB (for train and validation)

*Dataset is available under*
-   `/projects/work/public/ml-datasets/imagenet`

##### Get Access to Data

New York University does not own this dataset.

Please open the ImageNet site, find the terms of use ([http://image-net.org/download](http://image-net.org/download)), copy them, replace the needed parts with your name, send us an email including the terms with your name - thereby confirming you agree to the these terms. Once you do this, we can grant you access to the copy of the dataset on the cluster.

### Millions Songs
*About data set*:  [https://labrosa.ee.columbia.edu/millionsong/](https://labrosa.ee.columbia.edu/millionsong/)

*Dataset is available under*

-   `/projects/work/public/ml-datasets/millionsongdataset/`

### ProQuest Congressional Record
*About data set*: [ProQuest Congressional Record](https://guides.nyu.edu/govdocs/congressional#s-lg-box-14137380)

The ProQuest Congressional Record text-as-data collection consists of machine-readable files capturing the full text and a small number of metadata fields for a full run of the Congressional Record between 1789 and 2005. Metadata fields include the date of publication, subjects (for issues for which such information exists in the ProQuest system), and URLs linking the full text to the canonical online record for that issue on the ProQuest Congressional platform. A total of 31,952 issues are available.

*Dataset is available under*: 
-   `/projects/work/public/proquest/`

### ProQuest Historical Newspapers
*About data set*: [ProQuest Historical Newspapers](https://persistent.library.nyu.edu/arch/148cd8d4)

The ProQuest Historical Newspapers text data collection consists of XML files from 26 historical newspaper collections. Each file represents an item, advertisement, article, or subsection of a newspaper edition and includes metadata and full text extracted from digitized print using optical character recognition. Coverage varies by publication and ranges from 1764 to 2008. 

*Dataset is available under*:
-   `/projects/work/public/proquest/proquest_hnp/`

### `eggNOG-mapper` Reference Data

*About data set*: [eggNOG-mapper](https://eggnog-mapper.cgmlab.org/)

The directory contains reference data for the legacy eggNOG-mapper database based on eggNOG 5.0.2. It includes annotation, taxonomy, protein-sequence, MMseqs2, and Pfam resources. 

*Dataset is available under*:

-   `/projects/work/public/genomics/eggnog-mapper-data/`

### Kraken 2 NCBI Reference Database

*About data set*: [Kraken 2](https://ccb.jhu.edu/software/kraken2/)

This pre-built Kraken 2 database contains NCBI reference sequence and taxonomy resources for taxonomic classification of genomic and metagenomic sequencing data. The database snapshot includes Kraken 2 indexes, NCBI taxonomy files, sequence-to-taxonomy mappings, k-mer distributions, and supporting database reports.

*Dataset is available under*:

-   `/projects/work/public/genomics/kraken2/`

### NCBI Data Resources

*About data set*: [Molecular Biology & Biochemistry Data Resources](https://www.ncbi.nlm.nih.gov/)

This directory provides locally hosted NCBI data resources for molecular biology and biochemistry research workflows.

*Dataset is available under*:

-   `/projects/work/public/genomics/ncbi/`

### Waymo Open Dataset
*About data set*: [Open Dataset – Waymo](https://waymo.com/open/)

The field of machine learning is changing rapidly. Waymo is in a unique position to contribute to the research community with 	some of the largest and most diverse autonomous driving datasets ever released.

*Dataset is available under*
-   `/projects/work/public/ml-datasets/waymo_open_dataset_scene_flow`
-   `/projects/work/public/ml-datasets/waymo_open_dataset_v_1_2_0_individual_files`
-   `/projects/work/public/ml-datasets/waymo_open_dataset_v_1_3_2_individual_files`
-   `/projects/work/public/ml-datasets/waymo_open_dataset_v_1_4_1_individual_files`

