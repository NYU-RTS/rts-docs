# Datasets Available

## General
The HPC team makes available a number of public sets that are commonly used in analysis jobs. The data sets are available Read-Only under
-   `/scratch/work/public/ml-datasets/`
-   `/vast/work/public/ml-datasets/`

We recommend to use version stored at `/vast` (when available) to have better read performance

:::note
For some of the datasets users must provide a signed usage agreement before accessing
:::

## Format
Many datasets are available in the form of '.sqf' file, which can be used with Singularity.
For example, in order to use coco dataset, one can run the following commands 
```sh
$ singularity exec \
  --overlay /<path>/pytorch1.8.0-cuda11.1.ext3:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2014.sqf:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2015.sqf:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2017.sqf:ro \
  /scratch/work/public/singularity/cuda11.1-cudnn8-devel-ubuntu18.04.sif /bin/bash

$ singularity exec \
  --overlay /<path>/pytorch1.8.0-cuda11.1.ext3:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2014.sqf:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2015.sqf:ro \
  --overlay /vast/work/public/ml-datasets/coco/coco-2017.sqf:ro \
  /scratch/work/public/singularity/cuda11.1-cudnn8-devel-ubuntu18.04.sif find /coco | wc -l

532896
```

## Data Sets
### COCO Dataset
*About data set*: [https://cocodataset.org/](https://cocodataset.org/#home)

Common Objects in Context (COCO) is a large-scale object detection, segmentation, and captioning dataset. 

*Dataset is available under*
`/scratch`
-   `/scratch/work/public/ml-datasets/coco/coco-2014.sqf`
-   `/scratch/work/public/ml-datasets/coco/coco-2015.sqf`
-   `/scratch/work/public/ml-datasets/coco/coco-2017.sqf`

`/vast`
-   `/vast/work/public/ml-datasets/coco/coco-2014.sqf`
-   `/vast/work/public/ml-datasets/coco/coco-2015.sqf`
-   `/vast/work/public/ml-datasets/coco/coco-2017.sqf`

### ImageNet and ILSVRC
About data set: [ImageNet (image-net.org)](https://image-net.org/)

ImageNet is an image dataset organized according to the [WordNet](https://wordnet.princeton.edu/) hierarchy (Miller, 1995). Each concept in WordNet, possibly described by multiple words or word phrases, is called a “synonym set” or “synset”. ImageNet populates 21,841 synsets of WordNet with an average of 650 manually verified and full resolution images. As a result, ImageNet contains 14,197,122 annotated images organized by the semantic hierarchy of WordNet (as of August 2014). ImageNet is larger in scale and diversity than the other image classification datasets ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)).

:::note 
WordNet® is a large lexical database of English. Nouns, verbs, adjectives and adverbs are grouped into sets of cognitive synonyms (synsets), each expressing a distinct concept ([https://wordnet.princeton.edu/](https://wordnet.princeton.edu/))
:::

#### ILSVRC (subset of ImageNet)

ILSVRC uses a subset of ImageNet images for training the algorithms and some of ImageNet’s image collection protocols for annotating additional images for testing the algorithms ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)). The name comes from 'ImageNet Large Scale Visual Recognition Challenge ([ILSVRC](https://image-net.org/challenges/LSVRC/2017/))'. Competition was moved to Kaggle ([http://image-net.org/challenges/LSVRC/2017/](http://image-net.org/challenges/LSVRC/2017/))

*What is included* ([https://arxiv.org/abs/1409.0575](https://arxiv.org/abs/1409.0575)).
-   1000 object classes
-   approximately 1.2 million training images
-   50 thousand validation images
-   100 thousand test images
-   Size of data is about 150 GB (for train and validation)

*Dataset is available under*
-   `/scratch/work/public/ml-datasets/imagenet`
-   `/vast/work/public/ml-datasets/imagenet`

##### Get access to Data

New York University does not own this dataset.

Please open the ImageNet site, find the terms of use ([http://image-net.org/download](http://image-net.org/download)), copy them, replace the needed parts with your name, send us an email including the terms with your name - thereby confirming you agree to the these terms. Once you do this, we can grant you access to the copy of the dataset on the cluster.

### Millions Songs
*About data set*:  [https://labrosa.ee.columbia.edu/millionsong/](https://labrosa.ee.columbia.edu/millionsong/)

*Dataset is available under*

-   `/scratch/work/public/MillionSongDataset`
-   `/vast/work/public/ml-datasets/millionsongdataset/`

### ProQuest Congressional Record
About data set: [ProQuest Congressional Record](https://guides.nyu.edu/govdocs/congressional#s-lg-box-14137380)

The ProQuest Congressional Record text-as-data collection consists of machine-readable files capturing the full text and a small number of metadata fields for a full run of the Congressional Record between 1789 and 2005. Metadata fields include the date of publication, subjects (for issues for which such information exists in the ProQuest system), and URLs linking the full text to the canonical online record for that issue on the ProQuest Congressional platform. A total of 31,952 issues are available.

*Dataset is available under*: 
-   `/scratch/work/public/proquest/`

### C4
*About data set*: [c4  |  TensorFlow Datasets](https://www.tensorflow.org/datasets/catalog/c4)

A colossal, cleaned version of Common Crawl's web crawl corpus.  Based on Common Crawl dataset: [https://commoncrawl.org](https://commoncrawl.org)

*Dataset is available under*
-   `/scratch/work/public/ml-datasets/c4`
-   `/vast/work/public/ml-datasets/c4`

### GQA
*About data set*: [GQA: Visual Reasoning in the Real World (stanford.edu)](https://cs.stanford.edu/people/dorarad/gqa/index.html)

Question Answering on Image Scene Graphs

*Dataset is available under*
-   `/scratch/work/public/ml-datasets/gqa`
-   `/vast/work/public/ml-datasets/gqa`

### MJSynth
*About data set*: [Visual Geometry Group - University of Oxford](https://www.robots.ox.ac.uk/~vgg/data/text/)

This is synthetically generated dataset which found to be sufficient for training text recognition on real-world images

This dataset consists of 9 million images covering 90k English words, and includes the training, validation and test splits used in the author's work (archived dataset is about 10 GB)

*Dataset is available under*
-   `/vast/work/public/ml-datasets/mjsynth`

### open-images-dataset
*About data set*: [Open Images Dataset – opensource.google](https://storage.googleapis.com/openimages/web/index.html)

A dataset of ~9 million varied images with rich annotations

The images are very diverse and often contain complex scenes with several objects (8.4 per image on average). It contains 	image-level labels annotations, object bounding boxes, object segmentations, visual relationships, localized narratives, and 	more

*Dataset is available under*
-   `/scratch/work/public/ml-datasets/open-images-dataset`
-   `/vast/work/public/ml-datasets/open-images-dataset`

### Pile
*About data set*: [The Pile (eleuther.ai)](https://pile.eleuther.ai/)

The Pile is a 825 GiB diverse, open source language modeling data set that consists of 22 smaller, high-quality datasets combined together.

*Dataset is available under*
-   `/scratch/work/public/ml-datasets/pile`
-   `/vast/work/public/ml-datasets/pile`

### Waymo open dataset
*About data set*: [Open Dataset – Waymo](https://waymo.com/open/)

The field of machine learning is changing rapidly. Waymo is in a unique position to contribute to the research community with 	some of the largest and most diverse autonomous driving datasets ever released.

*Dataset is available under*
-   `/vast/work/public/ml-datasets/waymo_open_dataset_scene_flow`
-   `/vast/work/public/ml-datasets/waymo_open_dataset_v_1_2_0_individual_files`
-   `/vast/work/public/ml-datasets/waymo_open_dataset_v_1_3_2_individual_files`
-   `/vast/work/public/ml-datasets/waymo_open_dataset_v_1_4_1_individual_files`

