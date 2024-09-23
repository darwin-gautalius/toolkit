async function query(url: string, data: any) {
  const response = await fetch(url, {
    headers: {
      Authorization: "Bearer " + process.env.LLM_LABS_TOKEN,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

function sandbox1(data: any) {
  return query(
    process.env.LLM_LABS_API_BASE_URL! + "/api/sandbox/1/1/sandbox-1",
    data
  );
}

(async () => {
  const response = await sandbox1({ prompt: "what is 1 + 1?" });
  console.log(response);
})();
