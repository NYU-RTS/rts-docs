# Batch Inference

When immediate results are not needed, for instance in transforming large datasets of unstructured data with LLMs, batch inference adds convenience while offering lower costs. Typical completion window are 24/48h as LLM inference providers run your workload when the load on the inference server is low. If you are interested in harnessing this feature, reach out to us at [`genai-research-support@nyu.edu`](mailto:genai-research-support@nyu.edu) and we will set up a cloud storage bucket for you.

:::info
Batch processing is only supported for LLMs that can be accessed via the `@vertexai` provider.
:::

## Collect the prompts
You'll collect the prompts you want to send to the LLM as a newline delimited JSON ([JSONLines](https://jsonlines.org/)) where each line contains a single prompt in the OpenAI format. Here's an example we will be using in this example:
```json
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gemini-3-flash-preview", "messages": [{"role": "user", "content": "Where is NYU located?"}], "max_tokens": 2048}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gemini-3-flash-preview", "messages": [{"role": "user", "content": "What resources are available for genAI research at nyu?"}], "max_tokens": 8196}}
```

## Upload them to the GCS bucket
We will upload this via the Portkey client to the GCS ([Google Cloud Storage](https://cloud.google.com/storage)) bucket via the following script:
```python
from portkey_ai import Portkey

# Initialize the Portkey client
portkey = Portkey(
    api_key="",  # Replace with your Portkey API key
    provider="@vertexai",
    base_url="https://ai-gateway.apps.cloud.rt.nyu.edu/v1/",
    vertex_storage_bucket_name="",  # Specify the GCS bucket name
    provider_file_name="test_dataset.jsonl",  # Specify the file name in GCS
    provider_model="gemini-3-flash-preview",  # Specify the model to use
)

# Upload a file for batch inference
file = portkey.files.create(file=open("test_dataset.jsonl", mode="rb"), purpose="batch")

print(file)
```
This script will print to standard output the location of the uploaded file, like:

```sh
{
    "id": "...",
    "bytes": 739,
    "created_at": null,
    "filename": "test_dataset.jsonl",
    "object": "file",
    "purpose": "batch",
    "status": "processed",
    "status_details": null,
    "create_at": 1771429900875
}

```

## Submit a batch inference job

We are now ready to submit the batch inference job. Here's a script to do so:
```python
from portkey_ai import Portkey

# Initialize the Portkey client
portkey = Portkey(
    api_key="",  # Replace with your Portkey API key
    provider="@vertexai",
    base_url="https://ai-gateway.apps.cloud.rt.nyu.edu/v1/",
    vertex_storage_bucket_name="",  # Specify the GCS bucket name
    provider_model="gemini-3-flash-preview",  # Specify the model to use
)

# Create a batch inference job
batch_job = portkey.batches.create(
    input_file_id="", # Copy this from the output of the last script
    endpoint="/v1/chat/completions",  # API endpoint to use
    completion_window="24h",  # Time window for completion
    model="gemini-3-flash-preview",
)

print(batch_job)
```

Upon successful submission, you'll see an `id` field that refers to the job id.

## Query job status

Using the id of the batch inference job, you can query the status by:

```sh
curl -H "x-portkey-api-key: "  -H "x-portkey-provider: @vertexai"  https://ai-gateway.apps.cloud.rt.nyu.edu/v1/batches/your-batch-inference-job-id
```

The output for a pending job looks like:
```json
{
  "id": "7284652661620604928",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "input_file_id": "...",
  "completion_window": null,
  "status": "in_progress",
  "output_file_id": "...",
  "error_file_id": "...",
  "created_at": 1771430154933,
  "in_progress_at": 1771430241905,
  "request_counts": {
    "total": 0,
    "completed": null,
    "failed": null
  },
  "model": "publishers/google/models/gemini-3-flash-preview"
}
```

Once the job completes, the `status` field will change from `in_progress` to `completed`.


## Retrieving the output

The output of the batch inference job can be obtained by:
```sh
 curl -H "x-portkey-api-key: "  -H "x-portkey-provider: @vertexai"  https://ai-gateway.apps.cloud.rt.nyu.edu/v1/batches/7284652661620604928/output
```
The output is also a newline delimited json (JSONLines) file that looks like:
```json
  {
  "id": "batch-7284652661620604928-aOKVaZmJGItT7OsPu-WByQc",
  "custom_id": "request-1",
  "response": {
    "status_code": 200,
    "request_id": "batch-7284652661620604928-aOKVaZmJGItT7OsPu-WByQc",
    "body": {
      "id": "chatcmpl-66109dHQ7PrBtM5Bzi37wXu97lr8m",
      "object": "chat.completion",
      "created": 1771430797,
      "model": "gemini-3-flash-preview",
      "provider": "vertex-ai",
      "choices": [
        {
          "message": {
            "role": "assistant",
            "content": "New York University (NYU) is primarily located in **New York City**
            ...
```
