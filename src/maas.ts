import fetch from "node-fetch";

(async () => {
  async function maas(path: string) {
    const url = `https://Phi-3-mini-4k-instruct-elbcr.eastus2.models.ai.azure.com${path}`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.MAAS_TOKEN}`,
      },
    });

    if (response.headers.get("content-type")?.includes("application/json")) {
      console.log(await response.json());
    } else {
      console.log(await response.text());
    }
  }

  await maas("/");
})();
