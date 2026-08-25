async function testModelList(apiKey) {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await res.json();
    console.log("Available models:", data.models ? data.models.map(m => m.name) : data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
console.log("Ready to check model list");
