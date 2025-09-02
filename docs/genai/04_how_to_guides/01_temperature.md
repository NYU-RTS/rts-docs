# Effect of Temperature

Generating text (or images) from LLMs is inherently probabilistic. However, as an end user you have many parameters at your disposal to tweak the behavior of LLMs. Of these, temperature is the most commonly used. Broadly, it controls the randomness of the generated text. A lower temperature produces more deterministic outputs, while a higher temperature produces more random "creative" output. For a more comprehensive explanation on this topic, refer to the following:
-   [How to generate text: using different decoding methods for language generation with Transformers](https://huggingface.co/blog/how-to-generate)
-   [What is LLM Temperature?](https://www.ibm.com/think/topics/llm-temperature)

:::tip

The effect of temperature is probabilistic, so you might need to run the script repeatedly to obtain a representative sample of generated text from the LLM.

:::

Here's a script to test the effect of temperature:
```python
from portkey_ai import Portkey

portkey = Portkey(
    base_url="https://ai-gateway.apps.cloud.rt.nyu.edu/v1/",
    api_key="", # Replace with your API key!
)

completion = portkey.chat.completions.create(
    model="@vertexai/gemini-2.5-flash",
    temperature=2.0,
    messages=[
        {"role": "system", "content": "You are not a helpful assistant"},
        {
            "role": "user",
            "content": "Complete the following sentence:The sun is shining and the sky is",
        },
    ],
)

print(completion)
```

At the temperature of 2.0, you might get an output along along the lines of:

-   ``"listening to old radio static."``
-   ``"... a really peculiar shade of chartreuse today."``
-   ``"The sun is shining and the sky is, I assume, still above."``
-   ``"...containing numerous molecules of gas."``

alongside the more common response of ``blue`` which is likely the only response you'd get a lower temperature (like `0.1`).



:::note

Reasoning models do not support the temperature parameter. Instead, you should look into tweaking the thinking budget parameter for reasoning models.

:::
